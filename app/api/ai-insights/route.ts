import { NextResponse } from "next/server"
import { OpenAI } from "openai"

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

    const prompt = `
Tu es un expert en gestion financière spécialisé en micro-entreprise française.

CONTEXTE MÉTIER IMPORTANT :
- L'utilisateur est en micro-entreprise
- Les charges correspondent aux cotisations URSSAF, elles sont liées au chiffre d'affaires et sont incompressibles
- Il n'existe pas de déduction classique des charges en micro-entreprise
- Les dépenses représentent de vrais décaissements de trésorerie
- Ne critique pas l'existence des charges URSSAF : elles sont normales
- Ne confonds jamais charges URSSAF, impôt et dépenses

DONNÉES :
- Période : ${periodLabel}
- Activité : ${activityType}
- Chiffre d'affaires : ${revenue}€
- Charges URSSAF : ${urssaf}€
- Impôt : ${incomeTax}€
- Dépenses : ${businessExpenses}€
- Revenu réel : ${net}€
- À mettre de côté : ${reserve}€
- Jours restants dans la période : ${remainingDays}
- Ratio du seuil annuel : ${Math.round(yearlyThresholdRatio * 100)}%
${comparisonContext}

SCORE ET STATUT DÉJÀ CALCULÉS :
- Score : ${health.score}/100
- Statut : ${health.status}
- Message global : ${health.message}
- Ratio coûts totaux / chiffre d'affaires : ${Math.round(health.costRatio * 100)}%

RÈGLES :
- Tu ne dois PAS changer le score, le statut ni le message global
- Tu dois seulement expliquer la situation et proposer 3 insights/actions utiles
- Si une comparaison avec la période précédente est disponible, mentionne-la dans un insight pertinent
- Utilise **texte en gras** (double astérisque markdown) pour mettre en valeur les chiffres clés dans tes insights
- Si les dépenses sont faibles, ne sois pas alarmiste
- Si les coûts sont élevés, sois direct mais concret
- Réponses courtes (max 2 phrases par insight), utiles, sans jargon, sans ton dramatique inutile
- Pas de conseils juridiques
- Pas de "vois un expert" sauf situation vraiment critique

RÉPONDS UNIQUEMENT EN JSON VALIDE, sans markdown autour, avec ce format exact :
{
  "insights": [
    "conseil 1",
    "conseil 2",
    "conseil 3"
  ]
}
`

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "Tu es un coach financier spécialisé micro-entreprise, précis, utile et non alarmiste.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
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