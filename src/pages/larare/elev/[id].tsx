import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

interface Teacher {
  id: string
  name: string
}

interface Student {
  id: string
  name: string
  grade: number
}

interface Stats {
  totalAttempts: number
  correctAttempts: number
  accuracy: number
  categoryStats: Record<string, { total: number; correct: number }>
  richProblemsCompleted: number
  richProblemsRated: number
  challengesCompleted: number
}

interface RichProblemAttempt {
  id: string
  theme: string
  level: string
  problemText: string
  responseText: string
  teacherRating?: string
  teacherFeedback?: string
  createdAt: string
}

const ratingLabels: Record<string, { text: string; color: string }> = {
  pa_vag: { text: 'På väg', color: 'bg-yellow-100 text-yellow-800' },
  godtagbart: { text: 'Godtagbart', color: 'bg-green-100 text-green-800' },
  starkt: { text: 'Starkt', color: 'bg-blue-100 text-blue-800' },
}

export default function ElevDetail() {
  const router = useRouter()
  const { id } = router.query

  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [student, setStudent] = useState<Student | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [richProblems, setRichProblems] = useState<RichProblemAttempt[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = sessionStorage.getItem('teacher')
    if (!stored) {
      router.push('/larare/login')
      return
    }
    setTeacher(JSON.parse(stored))
  }, [router])

  useEffect(() => {
    if (!id || !teacher) return

    Promise.all([
      fetch(`/api/students/${id}`).then((r) => r.json()),
      fetch(`/api/students/${id}/stats`).then((r) => r.json()),
      fetch(`/api/students/${id}/rich-problems`).then((r) => r.json()),
    ])
      .then(([studentData, statsData, richData]) => {
        setStudent(studentData)
        setStats(statsData)
        setRichProblems(richData)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id, teacher])

  if (!teacher) return null

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Laddar...</div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Eleven hittades inte</p>
          <Link href="/larare/dashboard" className="btn btn-primary">
            Tillbaka
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{student.name} | Matteträning</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Link
              href="/larare/dashboard"
              className="text-gray-500 hover:text-gray-700 mb-2 inline-block"
            >
              ← Tillbaka till dashboard
            </Link>
            <h1 className="text-xl font-bold text-gray-900">{student.name}</h1>
            <p className="text-sm text-gray-600">Årskurs {student.grade}</p>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Statistik-översikt */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="card text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {stats.totalAttempts}
                </div>
                <div className="text-sm text-gray-600">Uppgifter</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-success-600">
                  {stats.accuracy}%
                </div>
                <div className="text-sm text-gray-600">Träffprocent</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.richProblemsCompleted}
                </div>
                <div className="text-sm text-gray-600">Rika problem</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {stats.challengesCompleted}
                </div>
                <div className="text-sm text-gray-600">Utmaningar</div>
              </div>
            </div>
          )}

          {/* Styrkor och svagheter */}
          {stats && Object.keys(stats.categoryStats).length > 0 && (
            <div className="card mb-8">
              <h2 className="font-semibold text-gray-900 mb-4">
                Resultat per kategori
              </h2>
              <div className="space-y-3">
                {Object.entries(stats.categoryStats)
                  .sort((a, b) => (b[1].correct / b[1].total) - (a[1].correct / a[1].total))
                  .map(([category, data]) => {
                    const percentage = Math.round((data.correct / data.total) * 100)
                    const categoryName = category
                      .replace(/_/g, ' ')
                      .replace(/^\w/, (c) => c.toUpperCase())

                    return (
                      <div key={category}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700">{categoryName}</span>
                          <span className={percentage < 50 ? 'text-red-600 font-medium' : 'text-gray-500'}>
                            {data.correct}/{data.total} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              percentage >= 80
                                ? 'bg-success-500'
                                : percentage >= 50
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}

          {/* Rika problem */}
          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-4">
              Rika problem ({richProblems.length})
            </h2>

            {richProblems.length === 0 ? (
              <p className="text-gray-600">Eleven har inte lämnat in några rika problem ännu.</p>
            ) : (
              <div className="space-y-4">
                {richProblems.map((attempt) => (
                  <div key={attempt.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-1 bg-gray-100 rounded text-sm font-medium">
                        {attempt.level} - {attempt.theme.replace(/_/g, ' ')}
                      </span>
                      {attempt.teacherRating ? (
                        <span
                          className={`px-2 py-1 rounded text-sm font-medium ${
                            ratingLabels[attempt.teacherRating]?.color
                          }`}
                        >
                          {ratingLabels[attempt.teacherRating]?.text}
                        </span>
                      ) : (
                        <Link
                          href={`/larare/rika-problem/${attempt.id}`}
                          className="text-sm text-primary-600 hover:text-primary-700"
                        >
                          Bedöm →
                        </Link>
                      )}
                    </div>

                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Uppgift:</strong>
                      <p className="whitespace-pre-line mt-1">{attempt.problemText}</p>
                    </div>

                    <div className="text-sm">
                      <strong>Elevens svar:</strong>
                      <p className="whitespace-pre-line mt-1 bg-gray-50 p-2 rounded">
                        {attempt.responseText}
                      </p>
                    </div>

                    {attempt.teacherFeedback && (
                      <div className="mt-3 text-sm bg-blue-50 p-2 rounded">
                        <strong>Din återkoppling:</strong>
                        <p className="mt-1">{attempt.teacherFeedback}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  )
}
