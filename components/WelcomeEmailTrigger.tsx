"use client"

import { useEffect } from "react"

// Déclenche l'email de bienvenue une seule fois au 1er chargement du dashboard
export default function WelcomeEmailTrigger() {
  useEffect(() => {
    fetch("/api/email/welcome", { method: "POST" }).catch(() => {})
  }, [])

  return null
}
