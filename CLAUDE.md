@AGENTS.md

# keskireste. — Instructions projet

## Vue d'ensemble
Tableau de bord financier B2B pour auto-entrepreneurs français.
- **Landing** : `keskireste.fr` → `app/page.tsx` + `app/histoire/page.tsx`
- **App** : `app.keskireste.fr` → tout le reste
- **Stack** : Next.js 15 App Router · Supabase · Tailwind · Stripe · Resend

## Architecture

### Routing
- `middleware.ts` gère le routage par hostname :
  - `app.keskireste.fr/` → redirige vers `/dashboard`
  - `keskireste.fr/dashboard` → redirige vers `app.keskireste.fr/dashboard`
- Routes protégées : `/dashboard`, `/revenues`, `/Expenses`, `/history`, `/settings`, `/onboarding`
- Routes auth : `/login`, `/signup`, `/forgot-password`, `/reset-password`

### Supabase
- Client serveur : `@/lib/supabase/server` — `createClient()`
- Client admin (bypass RLS) : `@/lib/supabase/admin` — `getSupabaseAdmin()` — uniquement pour les pages publiques qui lisent des données agrégées (ex: compteur Founders)
- Ne jamais utiliser le client admin côté client

### Plans
- `profile.plan === "premium"` → accès Premium
- `profile.founder_number IS NOT NULL` → Founder (= Premium + badge)
- `profile.declaration_frequency` → `"monthly"` | `"quarterly"`

### Période
- Toujours utiliser `getPeriodRange(frequency, baseDate)` depuis `@/lib/period`
- `parseLocalDate(str)` et `formatLocalDate(date)` présents dans chaque page — ne pas utiliser `new Date(str)` directement (timezone bugs)

## Conventions code

### Responsive — PRIORITÉ ABSOLUE
L'app est utilisée massivement sur mobile (TikTok marketing). Chaque composant doit être parfait sur 375px.
- Valeurs monétaires larges : toujours `clamp()` ex: `clamp(18px, 4.5vw, 26px)`
- Listes : `flex-wrap` sur les lignes date + badges, `shrink-0` sur les montants
- Grilles : `grid-cols-1 md:grid-cols-N` explicite
- Éviter `overflow: hidden` sur les conteneurs de listes (clips les dropdowns)
- Topbar mobile : ligne secondaire `md:hidden` avec `TopbarPeriod compact` + boutons export `iconOnly`

### Composants réutilisables clés
- `TopbarPeriod` — picker de période (compact pour mobile, full pour desktop)
  - Prop `compact` pour le mode mobile
  - Prop `iconOnly` sur `ExportPeriodButton` / `ExportYearButton` pour mobile
- `ExportPeriodButton` / `ExportYearButton` — prop `iconOnly?: boolean` disponible
- `InvoiceStatusBadge` — dropdown absolu, jamais wrapper avec `overflow: hidden`
- `DeleteRevenueButton` / `DeleteExpenseButton` / `GenerateInvoiceButton` — `h-8 w-8` (32px touch target)

### Styles
- Variables CSS dans `app/globals.css` : `--cream-*`, `--ink-*`, `--violet-*`, `--rose-*`, `--lime-*`
- Border radius : `var(--r-sm)`, `var(--r-md)`, `var(--r-lg)`, `var(--r-xl)`
- Shadows : `var(--shadow-md)`, `var(--shadow-lg)`
- Backgrounds page : `var(--cream-100)`
- Cards : `var(--cream-50)`
- La landing (`app/page.tsx`) et `app/histoire/page.tsx` utilisent des styles CSS inline `<style>` avec leurs propres tokens — ne pas mélanger avec Tailwind

### Calculs financiers
- `calculateMicro()` dans `@/lib/calculations` — URSSAF + impôt + CFE
- `estimateIRProvision()` — provision impôt sur le revenu
- `buildAnnualProjection()` — projection annuelle
- `getPeriodRange()` — start/end de période selon fréquence

## Contenu / Tone of voice
- Toujours en français, tutoiement
- Pas de jargon comptable — "disponible réel" pas "trésorerie nette"
- Honnêteté sur les chiffres : ne pas inventer de social proof (0 users au lancement)
- Footer et mentions : "Fait avec ♥ à Mpl." (Montpellier)
- Copyright : © 2025 keskireste

## Offre Founder
- 50 places maximum (`FOUNDER_TOTAL = 50`)
- 99 €/an, prix garanti à vie
- Compteur live via `getFounderCount()` (admin Supabase, comptes `founder_number IS NOT NULL`)
- CTA → `/signup?plan=founder`

## Git
- Branche de travail : `claude/nifty-raman-9a9ba1`
- Push vers `main` : `git push origin claude/nifty-raman-9a9ba1:main`
- Toujours `npx tsc --noEmit` avant de commit

## Ce qu'il ne faut pas faire
- Ne jamais mettre `overflow: hidden` sur un wrapper de liste (clips dropdowns)
- Ne jamais hardcoder des chiffres d'utilisateurs fictifs
- Ne jamais utiliser `new Date("YYYY-MM-DD")` sans `T00:00:00` (bug timezone)
- Ne jamais toucher aux fichiers `.env` ou credentials
- Ne jamais modifier le schéma Supabase sans migration explicite
