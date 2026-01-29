import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

interface Student {
  id: string
  name: string
  grade: number
}

interface Problem {
  id: string
  theme: string
  themeTitle: string
  level: 'E' | 'C' | 'A'
  title: string
  problemText: string
  tips?: string
}

const levelColors = {
  E: 'bg-green-100 text-green-800 border-green-300',
  C: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  A: 'bg-red-100 text-red-800 border-red-300',
}

const levelLabels = {
  E: 'E - Grundläggande',
  C: 'C - Utvecklad',
  A: 'A - Avancerad',
}

export default function ThemePage() {
  const router = useRouter()
  const { theme } = router.query

  const [student, setStudent] = useState<Student | null>(null)
  const [problems, setProblems] = useState<Problem[]>([])
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null)
  const [responseText, setResponseText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = sessionStorage.getItem('student')
    if (!stored) {
      router.push('/elev/login')
      return
    }
    setStudent(JSON.parse(stored))
  }, [router])

  useEffect(() => {
    if (!theme || !student) return

    fetch(`/api/rich-problems?theme=${theme}&grade=${student.grade}`)
      .then((res) => res.json())
      .then((data) => {
        setProblems(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [theme, student])

  const handleSubmit = async () => {
    if (!selectedProblem || !student || !responseText.trim()) return

    setSubmitting(true)

    try {
      await fetch('/api/rich-problems/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: student.id,
          problemId: selectedProblem.id,
          theme: selectedProblem.theme,
          level: selectedProblem.level,
          problemText: selectedProblem.problemText,
          responseText: responseText.trim(),
        }),
      })

      setSubmitted(true)
    } catch {
      console.error('Failed to submit')
    }
    setSubmitting(false)
  }

  const handleBack = () => {
    setSelectedProblem(null)
    setResponseText('')
    setSubmitted(false)
  }

  if (!student) return null

  const themeTitle = problems[0]?.themeTitle || 'Rika problem'

  // Visa problem-lösnings-vy
  if (selectedProblem) {
    if (submitted) {
      return (
        <>
          <Head>
            <title>{selectedProblem.title} | Matteträning</title>
          </Head>

          <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="card max-w-md text-center">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Inlämnat!
              </h2>
              <p className="text-gray-600 mb-6">
                Din lärare kommer att titta på din lösning och ge återkoppling.
              </p>
              <div className="space-y-3">
                <button
                  onClick={handleBack}
                  className="btn btn-primary w-full"
                >
                  Gör ett annat problem
                </button>
                <Link
                  href="/elev/dashboard"
                  className="btn btn-secondary w-full block text-center"
                >
                  Tillbaka till dashboard
                </Link>
              </div>
            </div>
          </div>
        </>
      )
    }

    return (
      <>
        <Head>
          <title>{selectedProblem.title} | Matteträning</title>
        </Head>

        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm">
            <div className="max-w-4xl mx-auto px-4 py-4">
              <button
                onClick={handleBack}
                className="text-gray-500 hover:text-gray-700 mb-2"
              >
                ← Tillbaka till problem
              </button>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${
                    levelColors[selectedProblem.level]
                  }`}
                >
                  {selectedProblem.level}
                </span>
                <h1 className="text-xl font-bold text-gray-900">
                  {selectedProblem.title}
                </h1>
              </div>
            </div>
          </header>

          <main className="max-w-3xl mx-auto px-4 py-8">
            <div className="card mb-6">
              <h2 className="font-semibold text-gray-900 mb-4">Uppgift</h2>
              <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                {selectedProblem.problemText}
              </div>

              {selectedProblem.tips && (
                <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r">
                  <p className="text-sm text-yellow-800">
                    💡 <strong>Tips:</strong> {selectedProblem.tips}
                  </p>
                </div>
              )}
            </div>

            <div className="card">
              <h2 className="font-semibold text-gray-900 mb-4">Din lösning</h2>
              <p className="text-sm text-gray-600 mb-4">
                Skriv din lösning nedan. Förklara hur du tänker och visa dina beräkningar.
              </p>

              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                className="input min-h-[200px] resize-y"
                placeholder="Skriv din lösning här...

Till exempel:
- Vad jag vet/förstår av uppgiften
- Hur jag löser den (steg för steg)
- Mitt svar
- Varför jag tror det är rätt"
              />

              <div className="flex justify-end mt-4">
                <button
                  onClick={handleSubmit}
                  disabled={!responseText.trim() || submitting}
                  className="btn btn-primary disabled:opacity-50"
                >
                  {submitting ? 'Skickar...' : 'Lämna in'}
                </button>
              </div>
            </div>
          </main>
        </div>
      </>
    )
  }

  // Visa problemlista
  return (
    <>
      <Head>
        <title>{themeTitle} | Matteträning</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
            <Link
              href="/elev/rika-problem"
              className="text-gray-500 hover:text-gray-700"
            >
              ← Tillbaka
            </Link>
            <h1 className="text-xl font-bold text-gray-900">{themeTitle}</h1>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          {loading ? (
            <div className="text-center py-12 text-gray-600">Laddar problem...</div>
          ) : problems.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              Inga problem hittades för ditt tema och årskurs.
            </div>
          ) : (
            <>
              {/* Förklaring av nivåer */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {(['E', 'C', 'A'] as const).map((level) => (
                  <div
                    key={level}
                    className={`p-3 rounded-lg border ${levelColors[level]} text-center`}
                  >
                    <div className="font-medium">{level}</div>
                    <div className="text-xs mt-1 opacity-80">
                      {level === 'E' && 'Grundläggande'}
                      {level === 'C' && 'Utvecklad'}
                      {level === 'A' && 'Avancerad'}
                    </div>
                  </div>
                ))}
              </div>

              {/* Problemlista per nivå */}
              {(['E', 'C', 'A'] as const).map((level) => {
                const levelProblems = problems.filter((p) => p.level === level)
                if (levelProblems.length === 0) return null

                return (
                  <div key={level} className="mb-8">
                    <h2
                      className={`text-lg font-semibold mb-4 ${
                        level === 'E'
                          ? 'text-green-700'
                          : level === 'C'
                          ? 'text-yellow-700'
                          : 'text-red-700'
                      }`}
                    >
                      {levelLabels[level]}
                    </h2>
                    <div className="grid gap-3">
                      {levelProblems.map((problem) => (
                        <button
                          key={problem.id}
                          onClick={() => setSelectedProblem(problem)}
                          className="card card-hover text-left"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">
                              {problem.title}
                            </span>
                            <span className="text-gray-400">→</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </>
          )}
        </main>
      </div>
    </>
  )
}
