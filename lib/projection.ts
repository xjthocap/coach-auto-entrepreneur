type ProjectionInput = {
  currentRevenue: number
  currentExpenses: number
  start: string
  end: string
  prevRevenue?: number      // période précédente
  prevPrevRevenue?: number  // 2 périodes avant
}

export function calculateProjection({
  currentRevenue,
  currentExpenses,
  start,
  end,
  prevRevenue,
  prevPrevRevenue,
}: ProjectionInput) {
  const now = new Date()

  const [sy, sm, sd] = start.split("-").map(Number)
  const [ey, em, ed] = end.split("-").map(Number)
  const startDate = new Date(sy, sm - 1, sd)
  const endDate = new Date(ey, em - 1, ed)

  const totalDays =
    Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

  const elapsedDays =
    Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

  const safeElapsedDays = Math.max(1, Math.min(elapsedDays, totalDays))
  const elapsedPct = safeElapsedDays / totalDays  // 0 → 1

  // Projection linéaire brute (la méthode naïve)
  const linearProjection = (currentRevenue / safeElapsedDays) * totalDays

  // Calcul de la moyenne historique
  const historicalValues = [prevRevenue, prevPrevRevenue]
    .filter((v): v is number => typeof v === "number" && v > 0)
  const historicalAvg = historicalValues.length > 0
    ? historicalValues.reduce((a, b) => a + b, 0) / historicalValues.length
    : null

  let projectedRevenue: number
  let projectionMethod: "linear" | "historical_blend" | "historical"

  if (historicalAvg !== null) {
    // Pondération dynamique selon avancement dans la période :
    // - Début (< 25%) : on fait confiance à l'historique à 85%
    // - Milieu (25-70%) : on blend progressivement
    // - Fin (> 70%) : on fait confiance au rythme actuel à 90%
    const historicalWeight = Math.max(0, Math.min(1, 1 - (elapsedPct - 0.1) / 0.6))
    const currentWeight = 1 - historicalWeight

    const blended = historicalWeight * historicalAvg + currentWeight * linearProjection

    // Plafonnement raisonnable : jamais plus de 2.5x l'historique
    const cap = historicalAvg * 2.5
    projectedRevenue = Math.min(blended, cap)

    projectionMethod = historicalWeight > 0.7
      ? "historical"
      : historicalWeight > 0.1
      ? "historical_blend"
      : "linear"
  } else {
    // Pas d'historique : projection linéaire avec avertissement si trop tôt
    projectedRevenue = linearProjection
    projectionMethod = "linear"
  }

  const projectedExpenses = (currentExpenses / safeElapsedDays) * totalDays

  return {
    totalDays,
    elapsedDays: safeElapsedDays,
    projectedRevenue,
    projectedExpenses,
    projectionMethod,
    historicalAvg,
  }
}
