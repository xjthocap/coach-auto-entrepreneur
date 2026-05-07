import { NextResponse } from "next/server"
import { render } from "@react-email/render"
import { resend, FROM_EMAIL, REPLY_TO } from "@/lib/resend"
import { supabaseAdmin } from "@/lib/supabase/admin"
import PremiumWelcomeEmail from "@/emails/PremiumWelcomeEmail"

export async function POST(req: Request) {
  // Verify internal secret
  const expectedSecret = process.env.INTERNAL_SECRET
  if (!expectedSecret) {
    console.error("[email/premium-welcome] INTERNAL_SECRET is not configured")
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
  }
  const secret = req.headers.get("x-internal-secret")
  if (!secret || secret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json() as { userId: string; email: string }
    const { userId, email } = body

    if (!userId || !email) {
      return NextResponse.json({ error: "Missing userId or email" }, { status: 400 })
    }

    // Fetch profile first_name
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("first_name")
      .eq("id", userId)
      .single()

    // Compute trial end date (7 days from now)
    const trialEnd = new Date()
    trialEnd.setDate(trialEnd.getDate() + 7)
    const trialEndDate = trialEnd.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })

    const html = await render(
      PremiumWelcomeEmail({
        firstName: profile?.first_name ?? null,
        trialEndDate,
      })
    )

    await resend.emails.send({
      from: FROM_EMAIL,
      replyTo: REPLY_TO,
      to: email,
      subject: "Ton essai Premium de 7 jours a démarré ✨",
      html,
    })

    return NextResponse.json({ sent: true })
  } catch (err) {
    console.error("[email/premium-welcome] error:", err)
    return NextResponse.json({ error: "Failed to send" }, { status: 500 })
  }
}
