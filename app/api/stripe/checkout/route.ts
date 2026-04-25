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

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single()

    if (profileError) {
      console.error("Erreur profil:", profileError.message)
      return NextResponse.json(
        { error: "Profil introuvable" },
        { status: 404 }
      )
    }

    let customerId = profile?.stripe_customer_id || null

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        metadata: {
          supabase_user_id: user.id,
        },
      })

      customerId = customer.id

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id)

      if (updateError) {
        console.error("Erreur update stripe_customer_id:", updateError.message)
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_PREMIUM_MONTHLY!,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=cancel`,

      // metadata sur la session Checkout
      metadata: {
        supabase_user_id: user.id,
      },

      // metadata aussi sur l’abonnement Stripe
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
        },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Stripe checkout error:", error)

    return NextResponse.json(
      { error: "Impossible de créer la session Stripe" },
      { status: 500 }
    )
  }
}