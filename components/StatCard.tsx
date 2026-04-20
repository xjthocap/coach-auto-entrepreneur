type StatCardProps = {
  title: string
  value: string
  subtitle?: string
  accent?: "blue" | "green" | "red" | "default"
}

export default function StatCard({
  title,
  value,
  subtitle,
  accent = "default",
}: StatCardProps) {
  const styles = {
    default:
      "border-white/80 bg-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.06)]",
    blue:
      "border-blue-200 bg-gradient-to-br from-[#e8f0ff] to-white shadow-[0_12px_30px_rgba(79,125,243,0.15)]",
    green:
      "border-green-200 bg-gradient-to-br from-green-50 to-white shadow-[0_12px_30px_rgba(34,197,94,0.10)]",
    red:
      "border-red-200 bg-gradient-to-br from-red-50 to-white shadow-[0_12px_30px_rgba(239,68,68,0.10)]",
  }

  return (
    <div
      className={`rounded-[26px] border p-6 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(15,23,42,0.09)] ${styles[accent]}`}
    >
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
        {value}
      </p>

      {subtitle && (
        <p className="mt-3 text-sm font-medium text-slate-500">{subtitle}</p>
      )}
    </div>
  )
}