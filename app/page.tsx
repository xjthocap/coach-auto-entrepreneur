export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-16 text-center">
        <span className="mb-6 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300">
          Coach pour auto-entrepreneurs
        </span>

        <h1 className="mb-6 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
          Comprends tes charges, ton net et tes prochaines démarches sans stress
        </h1>

        <p className="mb-10 max-w-2xl text-lg text-gray-400 md:text-xl">
          Un SaaS simple pour aider les auto-entrepreneurs à suivre leurs recettes,
          estimer leurs charges et savoir quoi faire au bon moment.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <button className="rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-gray-200">
            Commencer
          </button>

          <button className="rounded-xl border border-white/15 px-6 py-3 font-semibold text-white transition hover:bg-white/5">
            Voir la démo
          </button>
        </div>

        <div className="mt-20 grid w-full max-w-5xl gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
            <h2 className="mb-3 text-xl font-semibold">Estimation simple</h2>
            <p className="text-gray-400">
              Visualise rapidement combien tu vas payer en charges et ce qu’il te reste réellement.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
            <h2 className="mb-3 text-xl font-semibold">Suivi des recettes</h2>
            <p className="text-gray-400">
              Ajoute tes encaissements et garde une vision claire de ton activité mois après mois.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
            <h2 className="mb-3 text-xl font-semibold">Coach démarches</h2>
            <p className="text-gray-400">
              Sache quoi faire, quand le faire, et avance plus sereinement dans ton activité.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}