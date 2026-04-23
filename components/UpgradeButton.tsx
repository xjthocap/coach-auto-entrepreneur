"use client"

type UpgradeButtonProps = {
  onClick: () => void
}

export default function UpgradeButton({ onClick }: UpgradeButtonProps) {
  return (
    <button
      onClick={onClick}
      className="rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 font-semibold text-white shadow-[0_12px_24px_rgba(139,92,246,0.22)] transition hover:scale-[1.01] hover:opacity-95"
    >
      Passer en Premium
    </button>
  )
}