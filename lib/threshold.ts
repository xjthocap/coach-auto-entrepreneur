export type ActivityType = "vente" | "service" | "liberal"

// ── Seuils micro-entreprise (CA max pour rester en micro) ─────────────────
export function getThreshold(activityType: ActivityType): number {
  if (activityType === "vente") return 188_700
  return 77_700
}

// ── Seuils franchise en base de TVA 2025 ─────────────────────────────────
// Au-delà du seuil de franchise → doit facturer la TVA
// Au-delà du seuil de tolérance → perte immédiate de la franchise (même 1ère année)
export function getTVAThreshold(activityType: ActivityType): { franchise: number; tolerance: number } {
  if (activityType === "vente") {
    return { franchise: 85_000, tolerance: 93_500 }
  }
  // service & liberal
  return { franchise: 37_500, tolerance: 41_250 }
}

export type TVAStatus = "safe" | "watch" | "warning" | "exceeded" | "critical"

export function getTVAStatus(
  yearRevenue: number,
  activityType: ActivityType,
): {
  status: TVAStatus
  franchise: number
  tolerance: number
  ratio: number        // vs seuil franchise
  remaining: number    // € avant le seuil franchise
} {
  const { franchise, tolerance } = getTVAThreshold(activityType)
  const ratio = yearRevenue / franchise
  const remaining = Math.max(0, franchise - yearRevenue)

  let status: TVAStatus
  if (yearRevenue >= tolerance)        status = "critical"   // Perte immédiate garantie
  else if (yearRevenue >= franchise)   status = "exceeded"   // Dépassé, tolérance possible
  else if (ratio >= 0.90)              status = "warning"    // -10% du seuil
  else if (ratio >= 0.75)              status = "watch"      // -25% du seuil
  else                                 status = "safe"

  return { status, franchise, tolerance, ratio, remaining }
}

// ── Seuil micro legacy ────────────────────────────────────────────────────
export function getThresholdStatus(totalRevenue: number, threshold: number) {
  const ratio = totalRevenue / threshold
  if (ratio >= 1)   return { status: "exceeded" as const, message: "Seuil dépassé" }
  if (ratio >= 0.8) return { status: "warning"  as const, message: "Tu approches du seuil" }
  return             { status: "safe"     as const, message: "Situation normale" }
}
