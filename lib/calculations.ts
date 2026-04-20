export type ActivityType = "vente" | "service" | "liberal"

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