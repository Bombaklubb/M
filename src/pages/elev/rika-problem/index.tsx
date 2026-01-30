import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

interface Student {
  id: string
  name: string
  grade: number
}

interface Theme {
  id: string
  title: string
  description: string
  icon: string
}

interface RandomProblem {
  id: string
  theme: string
  themeTitle: string
  level: 'E' | 'C' | 'A'
  title: string
  problemText: string
  tips?: string
}

export default function RikaProblem() {
  const router = useRouter()
  const [student, setStudent] = useState<Student | null>(null)
  const [themes, setThemes] = useState<Theme[]>([])
  const [loading, setLoading] = useState(true)
  const [customTheme, setCustomTheme] = useState('')
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [randomProblem, setRandomProblem] = useState<RandomProblem | null>(null)
  const [randomLevel, setRandomLevel] = useState<'E' | 'C' | 'A' | ''>('')
  const [loadingRandom, setLoadingRandom] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem('student')
    if (!stored) {
      router.push('/')
      return
    }
    const studentData = JSON.parse(stored)
    setStudent(studentData)

    fetch(`/api/rich-problems/themes?grade=${studentData.grade}`)
      .then((res) => res.json())
      .then((data) => {
        setThemes(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [router])

  const handleRandomProblem = async () => {
    if (!student) return
    setLoadingRandom(true)
    setRandomProblem(null)

    try {
      const url = `/api/rich-problems/random?grade=${student.grade}${randomLevel ? `&level=${randomLevel}` : ''}`
      const res = await fetch(url)
      const data = await res.json()
      if (data && data.id) {
        setRandomProblem(data)
      }
    } catch (err) {
      console.error('Error fetching random problem:', err)
    }
    setLoadingRandom(false)
  }

  const handleCustomSubmit = () => {
    if (!customTheme.trim()) return
    // Navigate to custom theme page
    router.push(`/elev/rika-problem/custom?theme=${encodeURIComponent(customTheme.trim())}`)
  }

  if (!student) return null

  return (
    <>
      <Head>
        <title>Rika problem | Matteverkstan</title>
      </Head>

      <div className="min-h-screen">
        {/* Header */}
        <header className="bg-gradient-to-r from-purple-400 via-purple-500 to-pink-400">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
            <Link href="/elev/dashboard" className="text-white/80 hover:text-white flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Tillbaka
            </Link>
            <h1 className="text-xl font-bold text-white">Rika problem</h1>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Info box */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 p-5 rounded-3xl mb-8">
            <h2 className="font-bold text-purple-800 mb-2 text-lg">Vad är rika problem?</h2>
            <p className="text-purple-700">
              Rika problem är uppgifter där du får tänka och resonera mer fritt.
              Det finns tre nivåer: <span className="font-semibold">E</span> (enklare), <span className="font-semibold">C</span> (mellan) och <span className="font-semibold">A</span> (svårare).
            </p>
          </div>

          {/* Random problem section */}
          <div className="bg-white rounded-3xl shadow-card p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-sunny-400 to-orange-400 rounded-2xl flex items-center justify-center text-2xl">
                🎲
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Slumpa ett problem</h3>
                <p className="text-sm text-gray-500">Få ett slumpmässigt problem att lösa</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-4">
              <select
                value={randomLevel}
                onChange={(e) => setRandomLevel(e.target.value as 'E' | 'C' | 'A' | '')}
                className="input py-2 px-4 w-auto"
              >
                <option value="">Alla nivåer</option>
                <option value="E">E - Enklare</option>
                <option value="C">C - Mellan</option>
                <option value="A">A - Svårare</option>
              </select>

              <button
                onClick={handleRandomProblem}
                disabled={loadingRandom}
                className="btn btn-warning flex items-center gap-2"
              >
                {loadingRandom ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Slumpar...
                  </>
                ) : (
                  <>
                    <span>🎲</span>
                    Slumpa problem
                  </>
                )}
              </button>
            </div>

            {/* Show random problem */}
            {randomProblem && (
              <div className="mt-4 p-5 bg-gradient-to-r from-sunny-50 to-orange-50 rounded-2xl border-2 border-sunny-200">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    randomProblem.level === 'E' ? 'bg-leaf-100 text-leaf-700' :
                    randomProblem.level === 'C' ? 'bg-sunny-100 text-sunny-700' :
                    'bg-coral-100 text-coral-700'
                  }`}>
                    Nivå {randomProblem.level}
                  </span>
                  <span className="text-gray-500 text-sm">{randomProblem.themeTitle}</span>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">{randomProblem.title}</h4>
                <p className="text-gray-700 whitespace-pre-line mb-4">{randomProblem.problemText}</p>
                {randomProblem.tips && (
                  <p className="text-sm text-purple-600 bg-purple-50 p-3 rounded-xl">
                    💡 Tips: {randomProblem.tips}
                  </p>
                )}
                <Link
                  href={`/elev/rika-problem/${randomProblem.theme}?problem=${randomProblem.id}`}
                  className="btn btn-primary mt-4 inline-block"
                >
                  Svara på detta problem
                </Link>
              </div>
            )}
          </div>

          {/* Custom theme section */}
          <div className="bg-white rounded-3xl shadow-card p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-sky-400 rounded-2xl flex items-center justify-center text-2xl">
                ✏️
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Eget tema</h3>
                <p className="text-sm text-gray-500">Skriv in ett eget ämne du vill ha problem om</p>
              </div>
            </div>

            {!showCustomForm ? (
              <button
                onClick={() => setShowCustomForm(true)}
                className="btn btn-secondary"
              >
                Skriv eget tema
              </button>
            ) : (
              <div className="space-y-4">
                <input
                  type="text"
                  value={customTheme}
                  onChange={(e) => setCustomTheme(e.target.value)}
                  placeholder="T.ex. fotboll, rymden, djur, godis..."
                  className="input"
                  autoFocus
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleCustomSubmit}
                    disabled={!customTheme.trim()}
                    className="btn btn-primary disabled:opacity-50"
                  >
                    Skapa problem
                  </button>
                  <button
                    onClick={() => {
                      setShowCustomForm(false)
                      setCustomTheme('')
                    }}
                    className="btn btn-secondary"
                  >
                    Avbryt
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Existing themes */}
          <h3 className="font-bold text-gray-800 mb-4">Välj ett tema</h3>

          {loading ? (
            <div className="text-center py-12 text-gray-600">Laddar teman...</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {themes.map((theme) => (
                <Link
                  key={theme.id}
                  href={`/elev/rika-problem/${theme.id}`}
                  className="bg-white rounded-2xl shadow-soft p-5 border-2 border-gray-100 hover:border-purple-300 hover:shadow-md transition-all flex items-center gap-4 group"
                >
                  <div className="text-4xl group-hover:scale-110 transition-transform">{theme.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{theme.title}</h3>
                    <p className="text-gray-500 text-sm">{theme.description}</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-300 group-hover:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  )
}
