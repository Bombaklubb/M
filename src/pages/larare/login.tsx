import { useState, FormEvent } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

export default function LarareLogin() {
  const router = useRouter()
  const [teacherCode, setTeacherCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!teacherCode.trim()) {
      setError('Skriv din lärarkod')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherCode: teacherCode.trim().toUpperCase(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Något gick fel')
        setLoading(false)
        return
      }

      // Spara i sessionStorage
      sessionStorage.setItem('teacher', JSON.stringify(data.teacher))

      // Gå till dashboard
      router.push('/larare/dashboard')
    } catch {
      setError('Kunde inte ansluta till servern')
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Logga in som lärare | Matteträning</title>
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
              <div className="text-5xl mb-4">📚</div>
              <h1 className="text-2xl font-bold text-gray-900">Logga in som lärare</h1>
              <p className="text-gray-600 mt-2">Använd din lärarkod för att se elevers arbete</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="teacherCode" className="label">
                  Lärarkod
                </label>
                <input
                  type="text"
                  id="teacherCode"
                  value={teacherCode}
                  onChange={(e) => setTeacherCode(e.target.value.toUpperCase())}
                  className="input text-center text-lg tracking-widest"
                  placeholder="XXXXXX"
                  autoFocus
                />
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
                {loading ? 'Loggar in...' : 'Logga in'}
              </button>
            </form>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Testkoder:</strong>
              </p>
              <ul className="text-sm text-gray-500 mt-2">
                <li>LARARE123 - Anna Andersson</li>
                <li>LARARE456 - Erik Eriksson</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
