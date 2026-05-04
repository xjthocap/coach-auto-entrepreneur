import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { supabaseAdmin } from "@/lib/supabase/admin"

const MAX_FOUNDERS = 50

async function assignFounder(userId: string, stripeCustomerId: string | null): Promise<void> {
  // Vérifier si déjà founder
  const { data: existing } = await supabaseAdmin
    .from("profiles")
    .select("founder_number")
    .eq("id", userId)
    .single()

  if (existing?.founder_number) return // déjà attribué

  // Compter les founders actuels
  const { count } = await supabaseAdmin
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .not("founder_number", "is", null)

  const currentCount = count ?? 0

  if (currentCount >= MAX_FOUNDERS) {
    console.warn(`Max founders (${MAX_FOUNDERS}) reached, cannot assign to ${userId}`)
    return
  }

  const founderNumber = currentCount + 1

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({
      plan: "premium",
      subscription_type: "founder",
      founder_number: founderNumber,
      founder_started_at: new Date().toISOString(),
      // Sauvegarder le customer_id pour pouvoir réagir aux échecs de paiement
      stripe_customer_id: stripeCustomerId,
    })
    .eq("id", userId)

  if (error) {
    console.error("Erreur assignation founder :", error.message)
  }
}

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get("stripe-signature")

  if (!signature) {
    return new Response("Missing signature", { status: 400 })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error("Webhook signature error:", err)
    return new Response("Invalid signature", { status: 400 })
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any
      const userId = session.metadata?.supabase_user_id
      const planType = session.metadata?.plan_type

      if (userId) {
        if (planType === "founder") {
          const customerId = typeof session.customer === "string" ? session.customer : null
          await assignFounder(userId, customerId)
        } else {
          const { error } = await supabaseAdmin
            .from("profiles")
            .update({
              plan: "premium",
              subscription_type: "premium",
              stripe_customer_id:
                typeof session.customer === "string" ? session.customer : null,
            })
            .eq("id", userId)

          if (error) console.error("Erreur passage premium :", error.message)
        }
      }
    }

    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated"
    ) {
      const subscription = event.data.object as any
      const customerId =
        typeof subscription.customer === "string" ? subscription.customer : null
      const planType = subscription.metadata?.plan_type

      if (customerId) {
        const isActive = ["active", "trialing"].includes(subscription.status)

        if (planType === "founder") {
          // Pour les founders, on ne rétrograde pas via subscription updated —
          // on laisse le statut de founder intact tant que l'abonnement est actif
          if (!isActive) {
            const { error } = await supabaseAdmin
              .from("profiles")
              .update({ plan: "free" })
              .eq("stripe_customer_id", customerId)

            if (error) console.error("Erreur downgrade founder :", error.message)
          }
        } else {
          const { error } = await supabaseAdmin
            .from("profiles")
            .update({ plan: isActive ? "premium" : "free" })
            .eq("stripe_customer_id", customerId)

          if (error) console.error("Erreur update abonnement :", error.message)
        }
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as any
      const customerId =
        typeof subscription.customer === "string" ? subscription.customer : null

      if (customerId) {
        const { error } = await supabaseAdmin
          .from("profiles")
          .update({ plan: "free" })
          .eq("stripe_customer_id", customerId)

        if (error) console.error("Erreur downgrade abonnement supprimé :", error.message)
      }
    }

    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as any
      const customerId =
        typeof invoice.customer === "string" ? invoice.customer : null

      if (customerId) {
        const { error } = await supabaseAdmin
          .from("profiles")
          .update({ plan: "free" })
          .eq("stripe_customer_id", customerId)

        if (error) console.error("Erreur downgrade paiement échoué :", error.message)
      }
    }

    return new Response("ok", { status: 200 })
  } catch (err) {
    console.error("Webhook handler error:", err)
    return new Response("Webhook handler failed", { status: 500 })
  }
}
