export function getPeriodRange(
  frequency: "monthly" | "quarterly",
  baseDate: Date = new Date()
) {
  const year = baseDate.getFullYear()
  const month = baseDate.getMonth()

  if (frequency === "monthly") {
    const start = new Date(year, month, 1)
    const end = new Date(year, month + 1, 0)

    return {
      start: formatDate(start),
      end: formatDate(end),
      label: start.toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
      }),
    }
  }

  const quarter = Math.floor(month / 3)
  const start = new Date(year, quarter * 3, 1)
  const end = new Date(year, quarter * 3 + 3, 0)

  return {
    start: formatDate(start),
    end: formatDate(end),
    label: `T${quarter + 1} ${year}`,
  }
}

function formatDate(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}