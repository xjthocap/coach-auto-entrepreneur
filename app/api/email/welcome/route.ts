import { NextResponse } from "next/server"
import { render } from "@react-email/render"
import { resend, FROM_EMAIL, REPLY_TO } from "@/lib/resend"
import { createClient } from "@/lib/supabase/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import WelcomeEmail from "@/emails/WelcomeEmail"

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Vérifier si l'email a déjà été envoyé (champ welcome_sent_at dans profiles)
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("first_name, welcome_sent_at")
      .eq("id", user.id)
      .single()

    if (profile?.welcome_sent_at) {
      return NextResponse.json({ skipped: true })
    }

    // Envoyer l'email
    const html = await render(WelcomeEmail({ firstName: profile?.first_name }))

    await resend.emails.send({
      from: FROM_EMAIL,
      replyTo: REPLY_TO,
      to: user.email,
      subject: "Bienvenue sur KeskiReste 🎉",
      html,
    })

    // Marquer comme envoyé
    await supabaseAdmin
      .from("profiles")
      .update({ welcome_sent_at: new Date().toISOString() })
      .eq("id", user.id)

    return NextResponse.json({ sent: true })
  } catch (err) {
    console.error("Welcome email error:", err)
    return NextResponse.json({ error: "Failed to send" }, { status: 500 })
  }
}
