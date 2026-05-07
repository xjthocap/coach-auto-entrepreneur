import { NextResponse } from "next/server"
import { OpenAI } from "openai"
import { createClient } from "@/lib/supabase/server"
import { getPeriodRange } from "@/lib/period"
import { calculateMicro, estimateIRProvision, buildAnnualProjection } from "@/lib/calculations"
import { getTVAStatus } from "@/lib/threshold"

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profile?.plan !== "premium") {
      return NextResponse.json({ error: "Premium requis" }, { status: 403 })
    }

    const { messages } = await req.json() as {
      messages: Array<{ role: "user" | "assistant"; content: string }>
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages requis" }, { status: 400 })
    }

    // Limite : 10 derniers messages, 2000 chars max par message
    const sanitizedMessages = messages.slice(-10).map((m) => ({
      role: m.role,
      content: typeof m.content === "string" ? m.content.slice(0, 2000) : "",
    }))

    // ── Récupérer les données financières réelles ──────────────────────────
    const frequency = profile.declaration_frequency === "quarterly" ? "quarterly" : "monthly"
    const periodsPerYear = frequency === "quarterly" ? 4 : 12
    const period = getPeriodRange(frequency, new Date())

    const activityType: "vente" | "service" | "liberal" =
      profile.activity_type === "vente" ? "vente"
      : profile.activity_type === "liberal" ? "liberal"
      : "service"

    // Revenus de la période
    const { data: revenues } = await supabase
      .from("revenues")
      .select("amount, date, client_name, label")
      .eq("user_id", user.id)
      .gte("date", period.start)
      .lte("date", period.end)
      .order("date", { ascending: false })

    // Revenus YTD (pour le seuil annuel)
    const yearStart = `${new Date().getFullYear()}-01-01`
    const { data: yearRevenues } = await supabase
      .from("revenues")
      .select("amount")
      .eq("user_id", user.id)
      .gte("date", yearStart)

    // Dépenses de la période
    const { data: oneTimeExpenses } = await supabase
      .from("expenses")
      .select("amount, label, supplier_name")
      .eq("user_id", user.id)
      .eq("type", "one_time")
      .gte("date", period.start)
      .lte("date", period.end)

    const { data: recurringExpenses } = await supabase
      .from("expenses")
      .select("amount, label")
      .eq("user_id", user.id)
      .eq("type", "recurring")
      .eq("active", true)

    // ── Calculs ────────────────────────────────────────────────────────────
    const totalRevenue = (revenues || []).reduce((s, r) => s + Number(r.amount), 0)
    const totalExpenses =
      (oneTimeExpenses || []).reduce((s, e) => s + Number(e.amount), 0) +
      (recurringExpenses || []).reduce((s, e) => s + Number(e.amount), 0)
    const yearRevenue = (yearRevenues || []).reduce((s, r) => s + Number(r.amount), 0)

    const micro = calculateMicro({
      revenue: totalRevenue,
      activityType,
      acre: profile.acre ?? false,
      versementLiberatoire: profile.versement_liberatoire ?? false,
    })
    const urssaf = micro.charges
    const irProvision = estimateIRProvision(totalRevenue, activityType, periodsPerYear, yearRevenue)
    const totalSet = urssaf + irProvision
    const realNet = totalRevenue - totalSet - totalExpenses

    // Calcul du seuil
    const thresholdLimit = activityType === "vente" ? 188_700 : 77_700
    const periodsElapsed = (() => {
      const now = new Date()
      return frequency === "quarterly" ? Math.ceil((now.getMonth() + 1) / 3) : now.getMonth() + 1
    })()
    const { annualRevenue } = buildAnnualProjection(yearRevenue, periodsElapsed, periodsPerYear, totalRevenue)
    const thresholdRatio = annualRevenue / thresholdLimit
    const tvaStatus = getTVAStatus(yearRevenue, activityType)

    // Jours restants dans la période
    const periodEnd = new Date(period.end)
    const today = new Date()
    const daysRemaining = Math.max(0, Math.ceil((periodEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))

    // Résumé des derniers mouvements
    const recentRevenuesStr = (revenues || []).slice(0, 5)
      .map(r => `${r.date}: +${Number(r.amount).toFixed(0)}€ (${r.client_name || r.label || "Client"})`)
      .join(", ") || "Aucun"

    const recurringStr = (recurringExpenses || [])
      .map(e => `${e.label}: ${Number(e.amount).toFixed(0)}€/mois`)
      .join(", ") || "Aucune"

    // ── Contexte utilisateur ────────────────────────────────────────────────
    const userName = profile.first_name || profile.company_name || "toi"
    const urssafRatePct = Math.round(micro.socialRate * 100 * 10) / 10

    const systemPrompt = `Tu es le Coach IA de keskireste, un assistant financier personnel pour ${userName}, auto-entrepreneur français.

Tu réponds comme un ami comptable : direct, concret, sans jargon inutile, en tutoyant l'utilisateur.
Tes réponses sont courtes (3-6 phrases max) sauf si l'utilisateur demande des détails.
Tu utilises des chiffres précis. Tu ne donnes JAMAIS de conseils d'investissement.

══ SITUATION FINANCIÈRE RÉELLE (${period.label}) ══

Activité : ${activityType} (abattement micro ${activityType === "vente" ? "71%" : activityType === "liberal" ? "34%" : "50%"})
Chiffre d'affaires : ${totalRevenue.toFixed(2)}€
Charges URSSAF (${urssafRatePct}%) : ${urssaf.toFixed(2)}€
Provision IR estimée : ${irProvision.toFixed(2)}€
Dépenses pro : ${totalExpenses.toFixed(2)}€
═══════════════════════════════
💰 DISPONIBLE RÉEL : ${realNet.toFixed(2)}€
À mettre de côté (URSSAF + IR) : ${totalSet.toFixed(2)}€

Derniers encaissements : ${recentRevenuesStr}
Charges récurrentes : ${recurringStr}
Jours restants dans la période : ${daysRemaining}

CA annuel projeté : ${annualRevenue.toFixed(0)}€ (${Math.round(thresholdRatio * 100)}% du seuil ${activityType === "vente" ? "188 700" : "77 700"}€)
Statut TVA franchise : ${tvaStatus.status} (${yearRevenue.toFixed(0)}€ / ${tvaStatus.franchise.toFixed(0)}€)

══ RÈGLES DE CALCUL ══
- "Disponible réel" = CA - URSSAF - provision IR - dépenses pro
- L'URSSAF est prélevée sur le CA brut, pas sur le net
- En micro-entreprise il n'y a PAS de déduction de charges (sauf abattement forfaitaire)
- Ne suggère JAMAIS de contourner les obligations fiscales
- Si quelqu'un demande "je peux acheter X ?", réponds avec le disponible réel et donne une réponse claire oui/non avec les chiffres

══ STYLE ══
- Tutoiement, ton chaleureux mais efficace
- Gras pour les chiffres importants
- Emoji sparingly (1-2 max par message, pas sur chaque phrase)
- Si la question est hors sujet finance, rappelle gentiment ton rôle`

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        content: `Ton disponible réel sur cette période est de **${realNet.toFixed(2)}€**. L'IA n'est pas configurée pour répondre à ta question précise, mais je peux te dire que tu as mis de côté ${totalSet.toFixed(2)}€ pour l'URSSAF et les impôts.`
      })
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    // Streaming
    const stream = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...sanitizedMessages, // 10 derniers messages, 2000 chars max chacun
      ],
      temperature: 0.4,
      max_tokens: 400,
      stream: true,
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || ""
            if (text) controller.enqueue(encoder.encode(text))
          }
        } finally {
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
      },
    })
  } catch (error) {
    console.error("[chat] Erreur:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
