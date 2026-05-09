import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"

export async function POST() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single()

    if (!profile?.stripe_customer_id) {
      return NextResponse.json(
        { error: "Aucun client Stripe trouvé" },
        { status: 400 }
      )
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error("Portal error:", msg)

    // Erreur fréquente : portail Stripe non configuré dans le dashboard
    if (msg.includes("No configuration was provided") || msg.includes("customer portal")) {
      return NextResponse.json(
        { error: "Le portail client Stripe n’est pas encore configuré. Va dans Stripe Dashboard → Settings → Billing → Customer portal." },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: msg || "Impossible d’ouvrir le portail client" },
      { status: 500 }
    )
  }
}