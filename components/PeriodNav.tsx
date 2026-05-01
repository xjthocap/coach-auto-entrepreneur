"use client"

import Link from "next/link"

type PeriodNavProps = {
  periodLabel: string
  prevHref: string
  nextHref: string
  basePath: string
}

export default function PeriodNav({ periodLabel, prevHref, nextHref, basePath }: PeriodNavProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="hidden items-center gap-2 rounded-full px-4 py-2 text-sm md:flex"
        style={{ background: "var(--cream-50)", border: "1px solid var(--cream-200)", color: "var(--ink-500)" }}
      >
        <span
          className="pulsing-dot inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: "var(--lime-500)" }}
        />
        {periodLabel}
      </div>
      <Link
        href={prevHref}
        className="hidden rounded-lg border px-3 py-2 text-sm font-medium transition hover:opacity-70 md:block"
        style={{ borderColor: "var(--cream-200)", background: "var(--cream-50)", color: "var(--ink-500)" }}
        title="Période précédente"
      >
        ←
      </Link>
      <Link
        href={nextHref}
        className="hidden rounded-lg border px-3 py-2 text-sm font-medium transition hover:opacity-70 md:block"
        style={{ borderColor: "var(--cream-200)", background: "var(--cream-50)", color: "var(--ink-500)" }}
        title="Période suivante"
      >
        →
      </Link>
    </div>
  )
}
