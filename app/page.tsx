import Link from "next/link"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f7f8f4] text-[#0f172a]">
      {/* NAVBAR */}
      <header className="w-full border-b border-black/5 bg-[#f7f8f4]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="text-3xl font-extrabold tracking-tight">
            KeskiReste<span className="text-[#22c55e]">.</span>
          </div>

          <nav className="hidden items-center gap-10 md:flex">
            <a href="#features" className="text-sm font-medium text-slate-700 transition hover:text-slate-950">
              Fonctionnalités
            </a>
            <a href="#pricing" className="text-sm font-medium text-slate-700 transition hover:text-slate-950">
              Tarifs
            </a>
            <a href="#faq" className="text-sm font-medium text-slate-700 transition hover:text-slate-950">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
           <Link href="/login">
            <button className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-black/5 md:inline-flex">
              Se connecter
            </button>
            </Link>
            <Link href="/signup">
            <button className="rounded-xl bg-[#0f172a] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">
              Essayer gratuitement
            </button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 py-16 md:py-24 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="mb-5 text-sm font-semibold uppercase tracking-wide text-[#16a34a]">
            Le copilote financier des auto-entrepreneurs
          </p>

          <h1 className="max-w-2xl text-5xl font-black leading-[0.95] tracking-tight text-slate-950 md:text-7xl">
            Sache enfin
            <br />
            combien il te reste
            <br />
            <span className="text-[#16a34a]">vraiment.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            KeskiReste t’aide à suivre tes revenus, anticiper tes charges et voir
            exactement ce que tu peux dépenser. Simple, clair, sans prise de tête.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href="/signup">
              <button className="rounded-2xl bg-[#0f172a] px-7 py-4 text-base font-semibold text-white transition hover:opacity-90">
                Essayer gratuitement
              </button>
            </Link>
            <button className="rounded-2xl border border-slate-200 bg-white px-7 py-4 text-base font-semibold text-slate-900 transition hover:bg-slate-50">
              Voir la démo
            </button>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex -space-x-3">
              <div className="h-10 w-10 rounded-full border-2 border-white bg-slate-300" />
              <div className="h-10 w-10 rounded-full border-2 border-white bg-slate-400" />
              <div className="h-10 w-10 rounded-full border-2 border-white bg-slate-500" />
            </div>
            <p className="text-sm text-slate-600">
              Déjà adopté par des auto-entrepreneurs qui veulent mieux piloter leur activité.
            </p>
          </div>
        </div>

        {/* MOCKUP */}
        <div className="rounded-[32px] border border-slate-200 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-6">
          <div className="grid gap-4 md:grid-cols-[220px_1fr]">
            {/* Sidebar */}
            <div className="rounded-[24px] bg-[#f8fafc] p-5">
              <div className="text-2xl font-extrabold tracking-tight">
                KeskiReste<span className="text-[#22c55e]">.</span>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  "Tableau de bord",
                  "Revenus",
                  "Dépenses",
                  "Charges",
                  "Trésorerie",
                  "Documents",
                  "IA Assistant",
                  "Paramètres",
                ].map((item, i) => (
                  <div
                    key={item}
                    className={`rounded-xl px-4 py-3 text-sm font-medium ${
                      i === 0
                        ? "bg-white text-slate-950 shadow-sm"
                        : "text-slate-500"
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Dashboard */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4 rounded-[24px] bg-[#f8fafc] p-5">
                <div>
                  <p className="text-sm text-slate-500">Bonjour Alex 👋</p>
                  <h3 className="mt-1 text-2xl font-bold text-slate-950">
                    Voici ta situation aujourd’hui.
                  </h3>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600">
                  Mai 2026
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
                <div className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm">
                  <p className="text-sm text-slate-500">Ton vrai disponible</p>
                  <div className="mt-3 flex items-end gap-3">
                    <span className="text-4xl font-black text-[#16a34a]">
                      1 650,00 €
                    </span>
                    <span className="mb-1 text-sm text-slate-500">
                      sur 3 250,00 € encaissés
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-[#f8fafc] p-4">
                      <p className="text-sm text-slate-500">À mettre de côté</p>
                      <p className="mt-2 text-2xl font-bold text-slate-950">
                        1 120 €
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Charges sociales + impôts
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#f8fafc] p-4">
                      <p className="text-sm text-slate-500">Dépenses du mois</p>
                      <p className="mt-2 text-2xl font-bold text-slate-950">
                        480 €
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Abonnements, outils, frais
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#f8fafc] p-4">
                      <p className="text-sm text-slate-500">Prévision fin de mois</p>
                      <p className="mt-2 text-2xl font-bold text-slate-950">
                        1 170 €
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Disponible estimé
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="mb-3 text-sm text-slate-500">
                      Évolution de la trésorerie
                    </p>
                    <div className="flex h-40 items-end gap-3 rounded-2xl bg-[#f8fafc] p-4">
                      {[25, 35, 33, 48, 52, 58, 72].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t-xl bg-[#22c55e]/80"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm">
                    <p className="text-sm text-slate-500">Taux de sécurité</p>
                    <div className="mt-4 flex items-center justify-center">
                      <div className="flex h-32 w-32 items-center justify-center rounded-full border-[12px] border-[#dcfce7] border-t-[#16a34a] border-r-[#16a34a] text-2xl font-black text-slate-950">
                        51%
                      </div>
                    </div>
                    <p className="mt-4 text-center text-sm text-slate-500">
                      Part de ton chiffre déjà sécurisée
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm">
                    <p className="text-sm font-semibold text-slate-950">IA Assistant</p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      En mai, tu peux encore dépenser environ <b>1 650 €</b> sans
                      impacter tes charges à venir.
                    </p>
                    <button className="mt-5 w-full rounded-xl bg-[#0f172a] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90">
                      Poser une question
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="border-y border-black/5 bg-white/40">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Pensé pour les indépendants qui veulent reprendre le contrôle
          </p>
          <div className="mt-8 grid grid-cols-2 gap-6 text-center text-2xl font-semibold text-slate-300 md:grid-cols-5">
            <span>Freelances</span>
            <span>Coachs</span>
            <span>Consultants</span>
            <span>Créateurs</span>
            <span>Artisans</span>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#16a34a]">
            Pensé pour les auto-entrepreneurs
          </p>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
            Tout ce qu’il te faut,
            <br />
            rien de plus.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {[
            {
              title: "Dashboard clair",
              desc: "Visualise tes revenus, tes charges et ton disponible en temps réel.",
            },
            {
              title: "Anticipe tes charges",
              desc: "KeskiReste calcule automatiquement ce que tu dois mettre de côté.",
            },
            {
              title: "IA Assistant",
              desc: "Pose tes questions et comprends ta situation simplement.",
            },
            {
              title: "Tout au même endroit",
              desc: "Centralise tes chiffres sans te perdre dans 10 outils.",
            },
            {
              title: "Exports & documents",
              desc: "Retrouve tes données et justificatifs en quelques clics.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#dcfce7] text-xl">
                ✦
              </div>
              <h3 className="text-lg font-bold text-slate-950">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-6 rounded-[32px] bg-[#f3f1ea] p-8 md:grid-cols-[1.4fr_0.8fr] md:p-10">
          <div>
            <p className="text-2xl font-bold leading-relaxed text-slate-950">
              “KeskiReste m’a permis de reprendre le contrôle sur mes finances.
              Je sais enfin où j’en suis chaque mois.”
            </p>
            <div className="mt-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-slate-300" />
              <div>
                <p className="font-semibold text-slate-900">Julie</p>
                <p className="text-sm text-slate-500">Graphiste freelance</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center rounded-[24px] bg-white p-8">
            <p className="text-5xl font-black text-[#16a34a]">4,9/5</p>
            <p className="mt-3 text-slate-600">Basé sur les premiers retours utilisateurs</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              <li>✓ Facile à utiliser</li>
              <li>✓ Gain de temps</li>
              <li>✓ Vision claire</li>
              <li>✓ Plus de sérénité</li>
            </ul>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="mx-auto max-w-7xl px-6 pb-20">
        <div className="overflow-hidden rounded-[36px] bg-[#0f172a] text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
          <div className="grid gap-10 p-8 md:p-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[#86efac]">
                Un prix simple
              </p>
              <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
                Zéro prise de tête.
              </h2>

              <div className="mt-8 flex items-end gap-3">
                <span className="text-5xl font-black text-[#4ade80]">19,90 €</span>
                <span className="pb-2 text-lg text-slate-300">/ mois</span>
              </div>

              <p className="mt-4 max-w-lg text-lg leading-8 text-slate-300">
                Sans engagement. Annule quand tu veux. Toutes les fonctionnalités
                essentielles pour garder le contrôle sur ton activité.
              </p>

              <button className="mt-8 rounded-2xl bg-[#22c55e] px-7 py-4 text-base font-bold text-[#0f172a] transition hover:opacity-90">
                Essayer gratuitement pendant 14 jours
              </button>
            </div>

            <div className="rounded-[28px] bg-white/5 p-8 backdrop-blur">
              <ul className="space-y-4 text-base text-slate-200">
                <li>✓ Tableau de bord complet</li>
                <li>✓ Calcul automatique des charges</li>
                <li>✓ IA Assistant illimité</li>
                <li>✓ Suivi de trésorerie</li>
                <li>✓ Mises à jour régulières</li>
                <li>✓ Support réactif</li>
                <li>✓ Données sécurisées</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            "Données sécurisées en France",
            "Conforme RGPD",
            "Paiement 100% sécurisé",
            "Support humain réactif",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-center text-sm font-medium text-slate-700"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-5xl px-6 pb-24">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#16a34a]">
            FAQ
          </p>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
            Les questions qu’on se pose avant de se lancer
          </h2>
        </div>

        <div className="mt-12 space-y-4">
          {[
            {
              q: "Est-ce que KeskiReste est fait pour les auto-entrepreneurs ?",
              a: "Oui. Le produit est pensé pour les indépendants qui veulent suivre simplement leurs revenus, leurs charges et leur disponible réel.",
            },
            {
              q: "Est-ce que j’ai besoin d’être bon en gestion ?",
              a: "Non. Justement, KeskiReste simplifie les chiffres pour que tu comprennes ta situation sans avoir besoin d’être comptable.",
            },
            {
              q: "Est-ce que je peux annuler quand je veux ?",
              a: "Oui, l’abonnement est sans engagement.",
            },
            {
              q: "À quoi sert l’IA Assistant ?",
              a: "Elle t’aide à comprendre tes chiffres, répondre à tes questions et te guider dans la lecture de ta situation financière.",
            },
          ].map((item) => (
            <div
              key={item.q}
              className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-slate-950">{item.q}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="border-t border-black/5 bg-white/60">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <h2 className="text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
            Tu encaisses.
            <br />
            <span className="text-[#16a34a]">On te dit ce qu’il te reste.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Reprends le contrôle sur ton activité avec un outil simple, clair et
            pensé pour les auto-entrepreneurs.
          </p>
          <button className="mt-8 rounded-2xl bg-[#0f172a] px-8 py-4 text-base font-semibold text-white transition hover:opacity-90">
            Commencer gratuitement
          </button>
        </div>
      </section>
    </main>
  )
}