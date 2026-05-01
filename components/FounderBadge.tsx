type FounderBadgeProps = {
  founderNumber: number
  size?: "sm" | "md"
}

export default function FounderBadge({ founderNumber, size = "md" }: FounderBadgeProps) {
  if (size === "sm") {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
        style={{ background: "rgba(196, 181, 253, 0.2)", color: "var(--lime-700)", border: "1px solid rgba(196, 181, 253, 0.4)" }}
      >
        ⭐ Founder #{founderNumber}
      </span>
    )
  }

  return (
    <div
      className="flex items-center gap-2 rounded-lg px-3 py-2"
      style={{ background: "rgba(196, 181, 253, 0.12)", border: "1px solid rgba(196, 181, 253, 0.3)" }}
    >
      <span className="text-lg">⭐</span>
      <div>
        <p className="text-xs font-semibold" style={{ color: "var(--lime-700)" }}>
          Founder #{founderNumber}
        </p>
        <p className="text-[10px]" style={{ color: "var(--ink-400)" }}>
          Accès à vie · 99€/an
        </p>
      </div>
    </div>
  )
}
