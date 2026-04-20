type ProjectionInput = {
  currentRevenue: number
  currentExpenses: number
  start: string
  end: string
}

export function calculateProjection({
  currentRevenue,
  currentExpenses,
  start,
  end,
}: ProjectionInput) {
  const now = new Date()
  const startDate = new Date(start)
  const endDate = new Date(end)

  const totalDays =
    Math.floor(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1

  const elapsedDays =
    Math.floor(
      (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1

  const safeElapsedDays = Math.max(1, Math.min(elapsedDays, totalDays))

  const projectedRevenue = (currentRevenue / safeElapsedDays) * totalDays
  const projectedExpenses = (currentExpenses / safeElapsedDays) * totalDays

  return {
    totalDays,
    elapsedDays: safeElapsedDays,
    projectedRevenue,
    projectedExpenses,
  }
}