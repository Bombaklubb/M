import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Head>
        <title>Matteträning ÅK 1-9</title>
        <meta name="description" content="Matematikträning för årskurs 1-9 enligt svensk läroplan" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen relative overflow-hidden">
        {/* Bakgrundsdekorationer */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-primary-200/30 rounded-full blur-3xl" />
          <div className="absolute top-40 right-20 w-40 h-40 bg-sky-200/40 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-1/4 w-48 h-48 bg-leaf-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-40 right-1/3 w-36 h-36 bg-sunny-200/30 rounded-full blur-3xl" />
        </div>

        {/* Header med gradient */}
        <div className="relative bg-gradient-to-r from-primary-400 via-primary-500 to-sky-400 text-white">
          <div className="absolute inset-0 overflow-hidden">
            <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 120" fill="none">
              <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,69.3C960,85,1056,107,1152,101.3C1248,96,1344,64,1392,48L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" fill="white"/>
            </svg>
          </div>

          <div className="relative max-w-4xl mx-auto px-6 pt-12 pb-24 text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6">
              <span>Enligt Lgr22</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
              Matematikträning ÅK 1–9
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-xl mx-auto">
              Träna matte enligt svensk läroplan för årskurs 1–9
            </p>
          </div>
        </div>

        {/* Huvudinnehåll */}
        <div className="relative max-w-4xl mx-auto px-6 -mt-8">
          <div className="bg-white rounded-3xl shadow-card p-8 md:p-12">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
              Vem vill logga in?
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Elev-knapp */}
              <Link href="/elev/login" className="group">
                <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100 rounded-3xl p-8 border-2 border-primary-200 hover:border-primary-400 hover:shadow-lg transition-all duration-300">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-200/50 rounded-full -mr-10 -mt-10 group-hover:scale-110 transition-transform" />

                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center text-4xl mb-4 shadow-lg group-hover:scale-105 transition-transform">
                      <span role="img" aria-label="Elev">👩‍🎓</span>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Logga in som Elev
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Öva matematik och följ din progression
                    </p>

                    <div className="inline-flex items-center gap-2 text-primary-600 font-semibold group-hover:gap-3 transition-all">
                      <span>Öva matematik</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Lärare-knapp */}
              <Link href="/larare/login" className="group">
                <div className="relative overflow-hidden bg-gradient-to-br from-leaf-50 to-leaf-100 rounded-3xl p-8 border-2 border-leaf-200 hover:border-leaf-400 hover:shadow-lg transition-all duration-300">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-leaf-200/50 rounded-full -mr-10 -mt-10 group-hover:scale-110 transition-transform" />

                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-leaf-400 to-leaf-600 rounded-2xl flex items-center justify-center text-4xl mb-4 shadow-lg group-hover:scale-105 transition-transform">
                      <span role="img" aria-label="Lärare">👩‍🏫</span>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Logga in som Lärare
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Följ elevers progression och ge feedback
                    </p>

                    <div className="inline-flex items-center gap-2 text-leaf-600 font-semibold group-hover:gap-3 transition-all">
                      <span>Följ eleverna</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-4 mt-8 mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 text-center shadow-soft">
              <div className="text-3xl mb-2">📊</div>
              <h4 className="font-semibold text-gray-800">Statistik</h4>
              <p className="text-sm text-gray-600">Följ din utveckling</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 text-center shadow-soft">
              <div className="text-3xl mb-2">🎯</div>
              <h4 className="font-semibold text-gray-800">Anpassat</h4>
              <p className="text-sm text-gray-600">För din årskurs</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 text-center shadow-soft">
              <div className="text-3xl mb-2">🏆</div>
              <h4 className="font-semibold text-gray-800">Utmaningar</h4>
              <p className="text-sm text-gray-600">Testa dina gränser</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative text-center py-8 text-gray-500 text-sm">
          <div className="flex items-center justify-center gap-4">
            <span>Om appen</span>
            <span>•</span>
            <span>Hjälp</span>
            <span>•</span>
            <span>Kontakt</span>
          </div>
        </footer>
      </main>
    </>
  )
}
