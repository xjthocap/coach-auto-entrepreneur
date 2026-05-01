import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"
import { supabaseAdmin } from "@/lib/supabase/admin"

const MAX_FOUNDERS = 50

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const planType = searchParams.get("type") // "founder" | null (= premium monthly)

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("stripe_customer_id, plan, founder_number")
      .eq("id", user.id)
      .single()

    if (profileError) {
      return NextResponse.json({ error: "Profil introuvable" }, { status: 404 })
    }

    // Vérification Founder
    if (planType === "founder") {
      // Vérifier si l'utilisateur est déjà founder
      if (profile?.founder_number) {
        return NextResponse.json({ error: "Tu es déjà Founder !" }, { status: 400 })
      }

      // Compter les founders existants
      const { count } = await supabaseAdmin
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .not("founder_number", "is", null)

      if ((count ?? 0) >= MAX_FOUNDERS) {
        return NextResponse.json({ error: "Les 50 places Founder sont prises." }, { status: 400 })
      }

      if (!process.env.STRIPE_PRICE_FOUNDER_YEARLY) {
        return NextResponse.json({ error: "Offre Founder non configurée." }, { status: 500 })
      }
    }

    let customerId = profile?.stripe_customer_id || null

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        metadata: { supabase_user_id: user.id },
      })
      customerId = customer.id

      await supabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id)
    }

    const isFounder = planType === "founder"
    const priceId = isFounder
      ? process.env.STRIPE_PRICE_FOUNDER_YEARLY!
      : process.env.STRIPE_PRICE_PREMIUM_MONTHLY!

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=cancel`,
      metadata: {
        supabase_user_id: user.id,
        plan_type: isFounder ? "founder" : "premium",
      },
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
          plan_type: isFounder ? "founder" : "premium",
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
