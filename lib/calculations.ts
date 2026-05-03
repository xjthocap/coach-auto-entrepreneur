export type ActivityType = "vente" | "service" | "liberal"

// ── Barème IR 2025 (revenus 2024) · 1 part fiscale ────────────────────────
const BAREME_IR = [
  { min: 0,       max: 11_497,  rate: 0    },
  { min: 11_497,  max: 29_315,  rate: 0.11 },
  { min: 29_315,  max: 83_823,  rate: 0.30 },
  { min: 83_823,  max: 180_294, rate: 0.41 },
  { min: 180_294, max: Infinity, rate: 0.45 },
]

// Abattement forfaitaire micro selon type d'activité
function abattementMicro(activityType: ActivityType): number {
  if (activityType === "vente")    return 0.71
  if (activityType === "service")  return 0.50
  return 0.34 // liberal
}

function computeBaremeIR(taxableIncome: number): number {
  let tax = 0
  for (const { min, max, rate } of BAREME_IR) {
    if (taxableIncome <= min) break
    tax += (Math.min(taxableIncome, max) - min) * rate
  }
  return tax
}

/**
 * Estime la provision IR à mettre de côté sur une période.
 * Hypothèse : foyer monoparental 1 part, aucun autre revenu.
 * @param periodRevenue  CA encaissé sur la période
 * @param activityType   type d'activité (abattement forfaitaire)
 * @param periodsPerYear 12 (mensuel) ou 4 (trimestriel)
 */
export function estimateIRProvision(
  periodRevenue: number,
  activityType: ActivityType,
  periodsPerYear: number,
): number {
  const annualRevenue   = periodRevenue * periodsPerYear
  const taxableIncome   = Math.max(0, annualRevenue * (1 - abattementMicro(activityType)))
  const annualIR        = computeBaremeIR(taxableIncome)
  return annualIR / periodsPerYear
}

type CalculationInput = {
  revenue: number
  activityType: ActivityType
  acre: boolean
  versementLiberatoire: boolean
}

export function calculateMicro({
  revenue,
  activityType,
  acre,
  versementLiberatoire,
}: CalculationInput) {
  let socialRate = 0
  let taxRate = 0

  // 🔹 TAUX RÉELS
  if (activityType === "vente") {
    socialRate = 0.123
    taxRate = 0.01
  }

  if (activityType === "service") {
    socialRate = 0.212
    taxRate = 0.017
  }

  if (activityType === "liberal") {
    socialRate = 0.256
    taxRate = 0.022
  }

  // 🔹 ACRE (version simplifiée)
  if (acre) {
    socialRate = socialRate * 0.5
  }

  // 🔹 Si pas de versement libératoire
  if (!versementLiberatoire) {
    taxRate = 0
  }

  const charges = revenue * socialRate
  const tax = revenue * taxRate
  const net = revenue - charges - tax

  return {
    socialRate,
    taxRate,
    charges,
    tax,
    net,
  }
}