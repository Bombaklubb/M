import { useState, FormEvent } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

export default function ElevLogin() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [grade, setGrade] = useState('')
  const [classCode, setClassCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!name.trim()) {
      setError('Skriv ditt namn')
      setLoading(false)
      return
    }

    if (!grade) {
      setError('Välj din årskurs')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          grade: parseInt(grade),
          classCode: classCode.trim() || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Något gick fel')
        setLoading(false)
        return
      }

      // Spara i sessionStorage
      sessionStorage.setItem('student', JSON.stringify(data.student))

      // Gå till dashboard
      router.push('/elev/dashboard')
    } catch {
      setError('Kunde inte ansluta till servern')
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Logga in som elev | Matteträning</title>
      </Head>

      <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
          >
            ← Tillbaka
          </Link>

          <div className="card">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">🎒</div>
              <h1 className="text-2xl font-bold text-gray-900">Logga in som elev</h1>
              <p className="text-gray-600 mt-2">Fyll i dina uppgifter för att börja träna</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="label">
                  Ditt namn
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
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
                  className="input"
                >
                  <option value="">Välj årskurs</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((g) => (
                    <option key={g} value={g}>
                      Årskurs {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="classCode" className="label">
                  Klasskod <span className="text-gray-400">(valfritt)</span>
                </label>
                <input
                  type="text"
                  id="classCode"
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                  className="input"
                  placeholder="T.ex. 3A2024"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Fråga din lärare om klasskoden
                </p>
              </div>

              {error && (
                <div className="bg-error-50 text-error-600 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full py-3 text-lg disabled:opacity-50"
              >
                {loading ? 'Loggar in...' : 'Börja träna'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  )
}
