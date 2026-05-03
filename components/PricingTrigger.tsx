"use client"

import { useState } from "react"
import PricingModal from "@/components/PricingModal"

export default function PricingTrigger({
  children,
  className,
  style,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)} className={className} style={style}>
        {children}
      </button>
      <PricingModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
