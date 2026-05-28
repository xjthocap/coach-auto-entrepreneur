// keskireste. — Service Worker
// Stratégie : Network-first (toujours les données fraîches), fallback cache

const CACHE_NAME = "keskireste-v1"

// Assets statiques à pré-cacher
const PRECACHE_ASSETS = [
  "/",
  "/dashboard",
  "/logos/icon-192.png",
  "/logos/icon-512.png",
]

// ── Install ───────────────────────────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
  )
  self.skipWaiting()
})

// ── Activate ──────────────────────────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// ── Fetch : Network-first ────────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event

  // Ignorer les requêtes non-GET, API Supabase, Stripe, etc.
  if (
    request.method !== "GET" ||
    request.url.includes("supabase.co") ||
    request.url.includes("stripe.com") ||
    request.url.includes("/api/stripe/") ||
    request.url.includes("/_next/webpack-hmr")
  ) {
    return
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Mettre en cache les ressources statiques Next.js (_next/static)
        if (response.ok && request.url.includes("/_next/static/")) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
        }
        return response
      })
      .catch(() => {
        // Offline fallback depuis le cache
        return caches.match(request).then((cached) => {
          if (cached) return cached
          // Fallback vers /dashboard si page non cachée
          if (request.destination === "document") {
            return caches.match("/dashboard")
          }
        })
      })
  )
})
