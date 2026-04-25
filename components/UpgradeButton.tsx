"use client"

import { useState } from "react"

export default function UpgradeButton() {
  const [loading, setLoading] = useState(false)

  async function handleUpgrade() {
    setLoading(true)

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
    })

    const data = await res.json()

    console.log("Stripe checkout response:", data)

    if (data.url) {
      window.location.href = data.url
    } else {
      alert("Pas d'URL Stripe reçue")
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className="rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 font-semibold text-white"
    >
      {loading ? "Redirection..." : "Passer en Premium"}
    </button>
  )
}