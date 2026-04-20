export function getPeriodRange(frequency: "monthly" | "quarterly") {
  const now = new Date()

  if (frequency === "monthly") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    return {
      start: formatDate(start),
      end: formatDate(end),
      label: start.toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
      }),
    }
  }

  const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3
  const start = new Date(now.getFullYear(), quarterStartMonth, 1)
  const end = new Date(now.getFullYear(), quarterStartMonth + 3, 0)

  return {
    start: formatDate(start),
    end: formatDate(end),
    label: `T${Math.floor(now.getMonth() / 3) + 1} ${now.getFullYear()}`,
  }
}

function formatDate(date: Date) {
  return date.toISOString().split("T")[0]
}