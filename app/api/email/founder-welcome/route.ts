import { NextResponse } from "next/server"
import { render } from "@react-email/render"
import { resend, FROM_EMAIL, REPLY_TO } from "@/lib/resend"
import { supabaseAdmin } from "@/lib/supabase/admin"
import FounderWelcomeEmail from "@/emails/FounderWelcomeEmail"

export async function POST(req: Request) {
  // Verify internal secret
  const secret = req.headers.get("x-internal-secret")
  if (!secret || secret !== process.env.INTERNAL_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json() as { userId: string; email: string; founderNumber: number }
    const { userId, email, founderNumber } = body

    if (!userId || !email) {
      return NextResponse.json({ error: "Missing userId or email" }, { status: 400 })
    }

    // Fetch profile first_name
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("first_name")
      .eq("id", userId)
      .single()

    const html = await render(
      FounderWelcomeEmail({
        firstName: profile?.first_name ?? null,
        founderNumber: founderNumber ?? null,
      })
    )

    await resend.emails.send({
      from: FROM_EMAIL,
      replyTo: REPLY_TO,
      to: email,
      subject: `⭐ Bienvenue Founder #${founderNumber} — KeskiReste`,
      html,
    })

    return NextResponse.json({ sent: true })
  } catch (err) {
    console.error("[email/founder-welcome] error:", err)
    return NextResponse.json({ error: "Failed to send" }, { status: 500 })
  }
}
