type ActivityType = "vente" | "service" | "liberal"

export function getThreshold(activityType: ActivityType) {
  if (activityType === "vente") return 188700
  return 77700
}

export function getThresholdStatus(
  totalRevenue: number,
  threshold: number
) {
  const ratio = totalRevenue / threshold

  if (ratio >= 1) {
    return {
      status: "exceeded",
      message: "Seuil dépassé",
    }
  }

  if (ratio >= 0.8) {
    return {
      status: "warning",
      message: "Tu approches du seuil",
    }
  }

  return {
    status: "safe",
    message: "Situation normale",
  }
}