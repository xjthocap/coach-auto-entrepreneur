import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * Route de callback Supabase Auth (flux PKCE).
 *
 * Supabase redirige ici après :
 *   - Confirmation d'email   → type=signup  → /email-confirme
 *   - Réinitialisation MDP   → type=recovery → /reset-password
 *   - Invitation             → type=invite  → /dashboard
 *
 * Configurer dans Supabase Dashboard → Authentication → URL Configuration :
 *   Site URL            : https://ton-domaine.com
 *   Redirect URLs       : https://ton-domaine.com/auth/callback
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)

  const code = searchParams.get("code")
  const type = searchParams.get("type") // "signup" | "recovery" | "invite" | null
  const next = searchParams.get("next") // redirect override optionnel

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Redirection selon le type
      if (type === "recovery") {
        return NextResponse.redirect(`${origin}/reset-password`)
      }
      if (next) {
        return NextResponse.redirect(`${origin}${next}`)
      }
      // Par défaut : confirmation d'email (signup ou invite)
      return NextResponse.redirect(`${origin}/email-confirme`)
    }

    console.error("[auth/callback] exchangeCodeForSession error:", error.message)
  }

  // Erreur ou code manquant → page de login avec message d'erreur
  return NextResponse.redirect(`${origin}/login?error=confirmation_invalide`)
}
