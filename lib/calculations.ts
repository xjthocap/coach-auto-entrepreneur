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
 * Hypothèse : foyer 1 part, aucun autre revenu.
 *
 * @param periodRevenue        CA de la période courante
 * @param activityType         type d'activité (abattement forfaitaire)
 * @param periodsPerYear       12 (mensuel) ou 4 (trimestriel)
 * @param annualRevenueOverride si fourni, utilise ce CA annuel au lieu d'extrapoler la période
 */
export function estimateIRProvision(
  periodRevenue: number,
  activityType: ActivityType,
  periodsPerYear: number,
  annualRevenueOverride?: number,
): number {
  const annualRevenue = annualRevenueOverride ?? periodRevenue * periodsPerYear
  const taxableIncome = Math.max(0, annualRevenue * (1 - abattementMicro(activityType)))
  const annualIR      = computeBaremeIR(taxableIncome)
  return annualIR / periodsPerYear
}

/**
 * Calcule le CA annuel projeté à partir des données réelles YTD.
 * Retourne aussi le nombre de périodes utilisées et si c'est une simulation.
 */
export function buildAnnualProjection(
  yearRevenue: number,
  periodsElapsed: number,
  periodsPerYear: number,
  fallbackPeriodRevenue: number,
): { annualRevenue: number; isSimulation: boolean; periodsUsed: number } {
  if (yearRevenue > 0 && periodsElapsed > 0) {
    return {
      annualRevenue: (yearRevenue / periodsElapsed) * periodsPerYear,
      isSimulation: false,
      periodsUsed: periodsElapsed,
    }
  }
  return {
    annualRevenue: fallbackPeriodRevenue * periodsPerYear,
    isSimulation: true,
    periodsUsed: 0,
  }
}

// ── Taux CFP (Contribution à la Formation Professionnelle) ───────────────────
// Source : URSSAF 2026 — calculée sur le CA, arrondie à l'euro supérieur
const CFP_RATE: Record<ActivityType, number> = {
  vente:   0.001, // 0,1 % — BIC vente de marchandises
  service: 0.003, // 0,3 % — BIC prestations de services
  liberal: 0.002, // 0,2 % — BNC professions libérales
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

  // 🔹 ACRE — exonération dégressive (simplifiée : on applique 50% sans gestion de la durée)
  // Réalité : 50% les 4 premiers trimestres, 25% les suivants, 10% encore après.
  // TODO: implémenter acre_start_date dans le profil pour calculer le bon taux.
  if (acre) {
    socialRate = socialRate * 0.5
  }

  // 🔹 Si pas de versement libératoire
  if (!versementLiberatoire) {
    taxRate = 0
  }

  // URSSAF arrondit à l'euro supérieur
  const charges = Math.ceil(revenue * socialRate)
  const tax     = taxRate > 0 ? Math.ceil(revenue * taxRate) : 0

  // CFP — arrondie à l'euro supérieur (idem URSSAF)
  const cfpRate = CFP_RATE[activityType]
  const cfp     = Math.ceil(revenue * cfpRate)

  const net = revenue - charges - cfp - tax

  return {
    socialRate,
    taxRate,
    cfpRate,
    charges,
    cfp,
    tax,
    net,
  }
}