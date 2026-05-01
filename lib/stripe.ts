import Stripe from "stripe"

export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured")
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-04-22.dahlia",
  })
}

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    const instance = getStripe()
    const value = (instance as unknown as Record<string, unknown>)[prop as string]
    return typeof value === "function" ? (value as Function).bind(instance) : value
  },
})