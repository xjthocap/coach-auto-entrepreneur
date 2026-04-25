import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { supabaseAdmin } from "@/lib/supabase/admin"

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

      if (userId) {
        const { error } = await supabaseAdmin
          .from("profiles")
          .update({
            plan: "premium",
            stripe_customer_id:
              typeof session.customer === "string" ? session.customer : null,
          })
          .eq("id", userId)

        if (error) {
          console.error("Erreur passage premium :", error.message)
        }
      }
    }

    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated"
    ) {
      const subscription = event.data.object as any

      const customerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : null

      if (customerId) {
        const isActive = ["active", "trialing"].includes(subscription.status)

        const { error } = await supabaseAdmin
          .from("profiles")
          .update({
            plan: isActive ? "premium" : "free",
          })
          .eq("stripe_customer_id", customerId)

        if (error) {
          console.error("Erreur update abonnement :", error.message)
        }
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as any

      const customerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : null

      if (customerId) {
        const { error } = await supabaseAdmin
          .from("profiles")
          .update({
            plan: "free",
          })
          .eq("stripe_customer_id", customerId)

        if (error) {
          console.error("Erreur downgrade abonnement supprimé :", error.message)
        }
      }
    }

    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as any

      const customerId =
        typeof invoice.customer === "string" ? invoice.customer : null

      if (customerId) {
        const { error } = await supabaseAdmin
          .from("profiles")
          .update({
            plan: "free",
          })
          .eq("stripe_customer_id", customerId)

        if (error) {
          console.error("Erreur downgrade paiement échoué :", error.message)
        }
      }
    }

    return new Response("ok", { status: 200 })
  } catch (err) {
    console.error("Webhook handler error:", err)
    return new Response("Webhook handler failed", { status: 500 })
  }
}