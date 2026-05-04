import { headers } from "next/headers"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { supabaseAdmin } from "@/lib/supabase/admin"

const MAX_FOUNDERS = 50

async function assignFounder(userId: string, stripeCustomerId: string | null): Promise<void> {
  // Attribution atomique via fonction PostgreSQL (évite la race condition)
  const { data, error } = await supabaseAdmin
    .rpc("assign_founder_number", { p_user_id: userId, p_max: MAX_FOUNDERS })

  if (error) {
    console.error("Erreur RPC assign_founder_number :", error.message)
    return
  }

  const founderNumber = data as number

  if (founderNumber === -1) {
    console.warn(`Max founders (${MAX_FOUNDERS}) reached, cannot assign to ${userId}`)
    return
  }

  // Compléter le profil avec les infos founder
  const { error: updateError } = await supabaseAdmin
    .from("profiles")
    .update({
      plan: "premium",
      subscription_type: "founder",
      founder_started_at: new Date().toISOString(),
      stripe_customer_id: stripeCustomerId,
    })
    .eq("id", userId)
    .is("founder_number", null) // sécurité : ne pas écraser si déjà attribué

  if (updateError) {
    console.error("Erreur mise à jour profil founder :", updateError.message)
  }
}

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get("stripe-signature")

  if (!signature) {
    return new Response("Missing signature", { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error("[webhook] Signature invalide — vérifie STRIPE_WEBHOOK_SECRET dans Vercel env vars:", err)
    return new Response("Invalid signature", { status: 400 })
  }

  console.log(`[webhook] Event reçu: ${event.type}`)

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.supabase_user_id
      const planType = session.metadata?.plan_type

      console.log(`[webhook] checkout.session.completed — userId=${userId} planType=${planType}`)

      if (typeof userId === "string" && userId) {
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

          if (error) {
            console.error("[webhook] Erreur passage premium :", error.message)
          } else {
            console.log(`[webhook] ✅ Profil ${userId} passé en premium`)
          }
        }
      } else {
        console.error("[webhook] ⚠️ userId manquant dans session.metadata — vérifie que la metadata est bien passée au checkout")
      }
    }

    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated"
    ) {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = typeof subscription.customer === "string" ? subscription.customer : null
      const planType = subscription.metadata?.plan_type

      if (customerId) {
        const isActive = ["active", "trialing"].includes(subscription.status)

        if (planType === "founder") {
          // Founders : sync plan selon statut abonnement
          const { error } = await supabaseAdmin
            .from("profiles")
            .update({ plan: isActive ? "premium" : "free" })
            .eq("stripe_customer_id", customerId)

          if (error) console.error("Erreur sync founder :", error.message)
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
      const subscription = event.data.object as Stripe.Subscription
      const customerId = typeof subscription.customer === "string" ? subscription.customer : null

      if (customerId) {
        const { error } = await supabaseAdmin
          .from("profiles")
          .update({ plan: "free" })
          .eq("stripe_customer_id", customerId)

        if (error) console.error("Erreur downgrade abonnement supprimé :", error.message)
      }
    }

    // payment_failed : downgrade seulement après 3+ tentatives (évite rétrogradation sur erreur temporaire)
    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice
      const customerId = typeof invoice.customer === "string" ? invoice.customer : null
      const attemptCount = invoice.attempt_count ?? 0

      if (customerId && attemptCount >= 3) {
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
