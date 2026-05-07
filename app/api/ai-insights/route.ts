import { NextResponse } from "next/server"
import { OpenAI } from "openai"
import { createClient } from "@/lib/supabase/server"

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function computeFinancialHealth({
  totalRevenue,
  charges,
  tax,
  expenses,
  realNet,
  thresholdRatio,
}: {
  totalRevenue: number
  charges: number
  tax: number
  expenses: number
  realNet: number
  thresholdRatio: number
}) {
  const revenue = Number(totalRevenue || 0)
  const urssaf = Number(charges || 0)
  const incomeTax = Number(tax || 0)
  const businessExpenses = Number(expenses || 0)
  const net = Number(realNet || 0)
  const yearlyThresholdRatio = Number(thresholdRatio || 0)

  const totalCosts = urssaf + incomeTax + businessExpenses
  const costRatio = revenue > 0 ? totalCosts / revenue : 1

  let score = 100

  if (revenue <= 0) score -= 55
  if (costRatio > 0.9) score -= 45
  else if (costRatio > 0.7) score -= 35
  else if (costRatio > 0.5) score -= 20
  else if (costRatio > 0.35) score -= 10

  if (net < 0) score -= 30
  else if (net < revenue * 0.15) score -= 15

  if (yearlyThresholdRatio > 0.95) score -= 20
  else if (yearlyThresholdRatio > 0.8) score -= 10

  score = clamp(Math.round(score), 0, 100)

  let status: "safe" | "warning" | "danger" = "safe"

  if (revenue <= 0 || net < 0 || costRatio > 0.7) {
    status = "danger"
  } else if (costRatio > 0.5 || yearlyThresholdRatio > 0.8 || net < revenue * 0.15) {
    status = "warning"
  }

  let message = "Ta situation financière est saine sur cette période."

  if (status === "danger") {
    if (revenue <= 0) {
      message = "Tu n’as pas encore de chiffre d’affaires sur cette période."
    } else if (net < 0) {
      message =
        "Tes sorties et obligations dépassent ce que ton activité génère réellement."
    } else {
      message =
        "Tes charges, impôts et dépenses prennent une part trop importante de ton chiffre d’affaires."
    }
  } else if (status === "warning") {
    message =
      "Ta situation reste gérable, mais ta marge de sécurité est trop faible pour être confortable."
  }

  return {
    score,
    status,
    message,
    totalCosts,
    costRatio,
  }
}

export async function POST(req: Request) {
  try {
    // ── Auth check ──────────────────────────────────────────────────────────
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // Vérifier plan premium
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, founder_number")
      .eq("id", user.id)
      .single()
    const isPremium = profile?.plan === "premium"
    if (!isPremium) return NextResponse.json({ error: "Premium requis" }, { status: 403 })

    const body = await req.json()

    const {
      totalRevenue,
      charges,
      tax,
      expenses,
      realNet,
      reserveAmount,
      thresholdRatio,
      periodLabel,
      activityType,
      daysRemaining,
      prevRevenue,
      prevPeriodLabel,
    } = body

    const revenue = Number(totalRevenue || 0)
    const urssaf = Number(charges || 0)
    const incomeTax = Number(tax || 0)
    const businessExpenses = Number(expenses || 0)
    const net = Number(realNet || 0)
    const reserve = Number(reserveAmount || 0)
    const yearlyThresholdRatio = Number(thresholdRatio || 0)
    const remainingDays = Number(daysRemaining || 0)
    const prevRev = Number(prevRevenue || 0)
    const prevLabel = prevPeriodLabel || ""
    const revDelta = prevRev > 0 ? ((revenue - prevRev) / prevRev) * 100 : null

    const health = computeFinancialHealth({
      totalRevenue: revenue,
      charges: urssaf,
      tax: incomeTax,
      expenses: businessExpenses,
      realNet: net,
      thresholdRatio: yearlyThresholdRatio,
    })

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        score: health.score,
        status: health.status,
        message: health.message,
        insights: [
          `Tu dois mettre de côté environ ${Math.round(reserve)}€ pour couvrir charges et impôt.`,
          `Tes sorties totales représentent ${Math.round(health.costRatio * 100)}% de ton chiffre d’affaires.`,
          `Ton seuil annuel est utilisé à ${Math.round(yearlyThresholdRatio * 100)}%.`,
        ],
      })
    }

    let deltaStr: string | null = null
    if (revDelta !== null) {
      const sign = revDelta >= 0 ? "+" : ""
      deltaStr = sign + revDelta.toFixed(1) + "%"
    }
    const comparisonContext = deltaStr && prevLabel
      ? "- Comparatif periode precedente (" + prevLabel + ") : CA etait " + prevRev + " EUR, evolution " + deltaStr
      : ""

    // Angle aléatoire pour varier les insights à chaque appel
    const angles = [
      "trésorerie et timing des encaissements",
      "optimisation des dépenses professionnelles déductibles",
      "pilotage du seuil annuel et croissance",
      "stratégie de facturation et rythme d'activité",
      "anticipation fiscale et mise de côté",
      "comparaison avec la période précédente et tendances",
      "équilibre vie pro / rentabilité",
      "actions concrètes pour les prochains jours",
    ]
    const randomAngle = angles[Math.floor(Math.random() * angles.length)]

    const prompt = `
Tu es un coach financier direct et utile, spécialisé micro-entreprise française. Tu parles comme un ami qui s'y connaît — pas comme un comptable.

DONNÉES DE L'UTILISATEUR :
- Période : ${periodLabel}
- Type d'activité : ${activityType}
- Chiffre d'affaires : ${revenue}€
- Cotisations URSSAF : ${urssaf}€ (incompressibles, liées au CA — ne pas les critiquer)
- Impôt estimé : ${incomeTax}€
- Dépenses pro : ${businessExpenses}€
- Disponible réel net : ${net}€
- À mettre de côté pour charges + impôt : ${reserve}€
- Jours restants dans la période : ${remainingDays}
- Utilisation du seuil annuel : ${Math.round(yearlyThresholdRatio * 100)}%
- Ratio coûts totaux / CA : ${Math.round(health.costRatio * 100)}%
${comparisonContext ? `- Période précédente (${prevLabel}) : CA ${prevRev}€, évolution ${deltaStr}` : ""}

STATUT SANTÉ : ${health.status} (score ${health.score}/100)

ANGLE PRIORITAIRE pour cette analyse : **${randomAngle}**

INSTRUCTIONS :
- Génère 3 insights DIFFÉRENTS et ACTIONNABLES, centrés sur l'angle prioritaire ci-dessus
- Chaque insight doit apporter une information nouvelle ou une action concrète — pas juste décrire les chiffres
- Varie le style : une question rhétorique, un conseil pratique, une alerte ou une opportunité
- Utilise **gras** (double astérisque) uniquement sur les chiffres clés ou mots d'action
- Max 2 phrases par insight, ton direct et humain, zéro jargon comptable inutile
- Ne commence JAMAIS deux insights par la même structure de phrase
- Si aucune dépense : suggère des investissements pro pertinents pour le type d'activité
- Si période presque terminée (< 7 jours) : focus sur les actions urgentes
- Si comparatif dispo : intègre-le naturellement dans au moins un insight
- Jamais de conseil juridique, jamais de "consulte un expert" sauf danger réel

RÉPONDS EN JSON VALIDE uniquement, sans markdown autour :
{
  "insights": ["insight 1", "insight 2", "insight 3"]
}
`

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "Tu es un coach financier pour auto-entrepreneurs français. Tu es direct, humain, précis. Tu varies tes conseils à chaque analyse et tu proposes toujours des actions concrètes.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    })

    const raw = completion.choices?.[0]?.message?.content || ""

    let parsed: { insights?: string[] } = {}

    try {
      parsed = JSON.parse(raw)
    } catch {
      console.error("Erreur parsing IA:", raw)
    }

    const fallbackInsights =
      health.status === "danger"
        ? [
            `Tes sorties totales absorbent environ ${Math.round(
              health.costRatio * 100
            )}% de ton chiffre d’affaires : il faut sécuriser ta trésorerie rapidement.`,
            `Mets de côté en priorité ${Math.round(
              reserve
            )}€ pour les charges URSSAF et l’impôt avant toute autre dépense.`,
            remainingDays > 0
              ? `Sur les ${remainingDays} jours restants, évite d’ajouter de nouvelles dépenses non essentielles.`
              : "Réduis immédiatement les dépenses non essentielles pour restaurer de la marge.",
          ]
        : health.status === "warning"
        ? [
            `Tu dois réserver environ ${Math.round(
              reserve
            )}€ pour tes obligations fiscales et sociales.`,
            `Tes coûts totaux représentent ${Math.round(
              health.costRatio * 100
            )}% de ton chiffre d’affaires : ta marge est encore correcte mais fragile.`,
            remainingDays > 0
              ? `Sur les ${remainingDays} jours restants, concentre-toi sur les encaissements et limite les sorties évitables.`
              : "Concentre-toi sur l’augmentation du chiffre d’affaires avant d’augmenter tes dépenses.",
          ]
        : [
            `Ta situation est saine : conserve le réflexe de mettre de côté environ ${Math.round(
              reserve
            )}€ pour les charges et l’impôt.`,
            `Tes coûts totaux restent contenus à environ ${Math.round(
              health.costRatio * 100
            )}% du chiffre d’affaires.`,
            yearlyThresholdRatio > 0.7
              ? `Ton seuil annuel monte à ${Math.round(
                  yearlyThresholdRatio * 100
                )}% : continue à le surveiller.`
              : "Ta marge de manœuvre reste confortable sur cette période.",
          ]

    const insights =
      Array.isArray(parsed.insights) && parsed.insights.length > 0
        ? parsed.insights.slice(0, 3)
        : fallbackInsights

    return NextResponse.json({
      score: health.score,
      status: health.status,
      message: health.message,
      insights,
    })
  } catch (error) {
    console.error("Erreur serveur IA:", error)

    return NextResponse.json({
      score: 50,
      status: "warning",
      message: "Analyse temporairement indisponible.",
      insights: [
        "Mets de côté une partie de ton chiffre d’affaires pour anticiper charges et impôt.",
        "Surveille les dépenses qui sortent réellement de ta trésorerie.",
        "Garde un œil sur ton seuil annuel pour éviter les mauvaises surprises.",
      ],
    })
  }
}