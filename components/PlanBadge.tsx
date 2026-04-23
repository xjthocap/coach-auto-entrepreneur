type PlanBadgeProps = {
  plan: string | null
}

export default function PlanBadge({ plan }: PlanBadgeProps) {
  const isPremium = plan === "premium"

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        isPremium
          ? "bg-violet-100 text-violet-700"
          : "bg-slate-100 text-slate-600"
      }`}
    >
      {isPremium ? "Premium" : "Free"}
    </span>
  )
}