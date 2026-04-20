type Props = {
  totalRevenue: number
  threshold: number
  ratio: number
  status: "safe" | "warning" | "exceeded"
  message: string
}

export default function ThresholdAlert({
  totalRevenue,
  threshold,
  ratio,
  status,
  message,
}: Props) {
  const percentage = Math.min(ratio * 100, 100).toFixed(0)

  const bg =
    status === "exceeded"
      ? "bg-red-50 border-red-200"
      : status === "warning"
      ? "bg-orange-50 border-orange-200"
      : "bg-green-50 border-green-200"

  const text =
    status === "exceeded"
      ? "text-red-700"
      : status === "warning"
      ? "text-orange-700"
      : "text-green-700"

  return (
    <div className={`rounded-[28px] border p-6 ${bg}`}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className={`text-2xl font-semibold ${text}`}>
          {message}
        </h2>

        <span className="text-sm font-medium text-slate-500">
          {percentage}%
        </span>
      </div>

      <div className="mb-3 h-3 w-full overflow-hidden rounded-full bg-white">
        <div
          className={`h-full ${
            status === "exceeded"
              ? "bg-red-500"
              : status === "warning"
              ? "bg-orange-500"
              : "bg-green-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="text-sm text-slate-600">
        Cumul annuel : {totalRevenue.toFixed(0)} € sur {threshold.toFixed(0)} €
      </p>
    </div>
  )
}