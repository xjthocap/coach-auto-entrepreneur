import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f6fb] text-slate-800">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 md:px-8 md:py-8">
        <header className="mb-10 rounded-[28px] border border-white/70 bg-white/70 px-6 py-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4f7df3] text-2xl font-bold text-white shadow-md">
                AE
              </div>

              <div>
                <p className="text-3xl font-semibold tracking-tight">
                  Coach Auto-Entrepreneur
                </p>
                <p className="text-sm text-slate-500">
                  Le copilote simple pour piloter tes revenus et tes démarches
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="rounded-2xl bg-[#4f7df3] px-5 py-3 font-semibold text-white shadow-[0_10px_20px_rgba(79,125,243,0.25)] transition hover:bg-[#3e6eea]"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </header>

        <section className="grid flex-1 items-center gap-10 md:grid-cols-2">
          <div>
            <span className="inline-flex rounded-full border border-blue-200 bg-[#edf3ff] px-4 py-2 text-sm font-medium text-[#3f6fe9]">
              SaaS pour micro-entrepreneurs
            </span>

            <h1 className="mt-6 text-5xl font-semibold leading-tight tracking-tight text-slate-900 md:text-6xl">
              Comprends enfin combien tu gagnes vraiment.
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-500">
              Suis tes revenus, estime tes charges, visualise ton net et garde
              une vue claire sur ton activité dans un espace simple, propre et
              rassurant.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/login"
                className="rounded-2xl bg-[#4f7df3] px-6 py-4 text-center font-semibold text-white shadow-[0_10px_20px_rgba(79,125,243,0.25)] transition hover:bg-[#3e6eea]"
              >
                Commencer
              </Link>

              <Link
                href="/settings"
                className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-center font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                Voir les paramètres
              </Link>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/80 bg-white/80 p-6 shadow-[0_20px_40px_rgba(15,23,42,0.06)]">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] border border-blue-200 bg-gradient-to-br from-[#dfe9ff] to-white p-5 shadow-[0_12px_30px_rgba(79,125,243,0.18)]">
                <p className="text-sm font-medium text-slate-500">CA</p>
                <p className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
                  4 920 €
                </p>
              </div>

              <div className="rounded-[24px] border border-white/80 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
                <p className="text-sm font-medium text-slate-500">Net estimé</p>
                <p className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
                  3 884 €
                </p>
              </div>

              <div className="rounded-[24px] border border-white/80 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
                <p className="text-sm font-medium text-slate-500">
                  Charges estimées
                </p>
                <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
                  1 036 €
                </p>
                <p className="mt-2 text-sm text-slate-500">21,20 %</p>
              </div>

              <div className="rounded-[24px] border border-white/80 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
                <p className="text-sm font-medium text-slate-500">Impôt</p>
                <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
                  83,64 €
                </p>
                <p className="mt-2 text-sm text-slate-500">1,70 %</p>
              </div>
            </div>

            <div className="mt-6 rounded-[24px] border border-slate-100 bg-[#fbfcff] p-5">
              <p className="text-lg font-semibold text-slate-900">
                Pourquoi ce SaaS ?
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                Pour aider les auto-entrepreneurs à comprendre leurs chiffres,
                éviter les mauvaises surprises et garder un pilotage simple de
                leur activité.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}