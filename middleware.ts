import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

const PROTECTED_ROUTES = [
  "/dashboard",
  "/revenues",
  "/Expenses",
  "/history",
  "/settings",
  "/onboarding",
]

const AUTH_ROUTES = ["/login", "/signup", "/forgot-password", "/reset-password"]

// Routes qui appartiennent à la landing (keskireste.fr)
const LANDING_ROUTES = ["/", "/histoire", "/legal"]

const APP_HOST = "app.keskireste.fr"
const LANDING_HOST = "keskireste.fr"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const host = request.headers.get("host") ?? ""
  const isAppSubdomain = host === APP_HOST || host.startsWith("app.")

  // ── Routage par domaine ──────────────────────────────────────────────────

  // Sur app.keskireste.fr : la racine "/" redirige vers /dashboard
  if (isAppSubdomain && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Sur keskireste.fr : les routes app redirigent vers app.keskireste.fr
  if (!isAppSubdomain && host.includes(LANDING_HOST)) {
    const isAppRoute = PROTECTED_ROUTES.some((r) => pathname.startsWith(r)) ||
      AUTH_ROUTES.some((r) => pathname.startsWith(r))
    if (isAppRoute) {
      return NextResponse.redirect(`https://${APP_HOST}${pathname}${request.nextUrl.search}`)
    }
  }

  // ── Auth Supabase (inchangé) ─────────────────────────────────────────────

  const response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r))
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r))

  // Rediriger vers /login si non authentifié sur une route protégée
  if (isProtected && !user) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirectTo", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Rediriger vers /dashboard si déjà connecté sur une page auth
  if (isAuthRoute && user && !pathname.startsWith("/reset-password")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return response
}

export const config = {
  matcher: [
    // Exclure les fichiers statiques, les routes API internes Next.js,
    // et la route webhook Stripe (doit recevoir le body brut sans interférence)
    "/((?!_next/static|_next/image|favicon.ico|api/stripe/webhook|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
