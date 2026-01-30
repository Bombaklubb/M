import Head from 'next/head'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [grade, setGrade] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Skriv ditt namn')
      return
    }

    if (!grade) {
      setError('Välj din årskurs')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          grade: parseInt(grade),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Något gick fel')
        setLoading(false)
        return
      }

      sessionStorage.setItem('student', JSON.stringify(data.student))
      router.push('/elev/dashboard')
    } catch {
      setError('Kunde inte ansluta till servern')
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Matteverkstan</title>
        <meta name="description" content="Träna matematik för årskurs 1-9" />
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
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
              Matteverkstan
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-xl mx-auto">
              Träna matematik för årskurs 1–9
            </p>
          </div>
        </div>

        {/* Huvudinnehåll - Inloggningsformulär */}
        <div className="relative max-w-md mx-auto px-6 -mt-8">
          <div className="bg-white rounded-3xl shadow-card p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">
                👩‍🎓
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                Vad heter du?
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="label">
                  Ditt namn
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input text-lg"
                  placeholder="Skriv ditt namn"
                  autoFocus
                />
              </div>

              <div>
                <label htmlFor="grade" className="label">
                  Årskurs
                </label>
                <select
                  id="grade"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="input text-lg"
                >
                  <option value="">Välj årskurs</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((g) => (
                    <option key={g} value={g}>
                      Årskurs {g}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="bg-coral-50 text-coral-500 p-4 rounded-2xl text-sm flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full py-4 text-lg disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Laddar...
                  </span>
                ) : (
                  'Börja träna!'
                )}
              </button>
            </form>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 mt-6 mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center shadow-soft">
              <div className="text-2xl mb-1">📊</div>
              <p className="text-xs text-gray-600 font-medium">Statistik</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center shadow-soft">
              <div className="text-2xl mb-1">🎯</div>
              <p className="text-xs text-gray-600 font-medium">Anpassat</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center shadow-soft">
              <div className="text-2xl mb-1">🏆</div>
              <p className="text-xs text-gray-600 font-medium">Utmaningar</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative text-center py-6 text-gray-400 text-sm">
          <p>Matteverkstan</p>
        </footer>
      </main>
    </>
  )
}
