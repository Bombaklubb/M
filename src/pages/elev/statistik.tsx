import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

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

export default function Statistik() {
  const router = useRouter()
  const [student, setStudent] = useState<Student | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = sessionStorage.getItem('student')
    if (!stored) {
      router.push('/elev/login')
      return
    }
    const studentData = JSON.parse(stored)
    setStudent(studentData)

    fetch(`/api/students/${studentData.id}/stats`)
      .then((res) => res.json())
      .then((data) => {
        setStats(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [router])

  if (!student) return null

  return (
    <>
      <Head>
        <title>Min statistik | Matteträning</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
            <Link href="/elev/dashboard" className="text-gray-500 hover:text-gray-700">
              ← Tillbaka
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Min statistik</h1>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          {loading ? (
            <div className="text-center py-12 text-gray-600">Laddar statistik...</div>
          ) : !stats || stats.totalAttempts === 0 ? (
            <div className="card text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Ingen statistik ännu
              </h2>
              <p className="text-gray-600 mb-6">
                Börja träna för att se din utveckling här!
              </p>
              <Link href="/elev/ova-mer" className="btn btn-primary">
                Börja öva
              </Link>
            </div>
          ) : (
            <>
              {/* Översikt */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="card text-center">
                  <div className="text-3xl font-bold text-primary-600">
                    {stats.totalAttempts}
                  </div>
                  <div className="text-sm text-gray-600">Uppgifter lösta</div>
                </div>
                <div className="card text-center">
                  <div className="text-3xl font-bold text-success-600">
                    {stats.accuracy}%
                  </div>
                  <div className="text-sm text-gray-600">Rätt svar</div>
                </div>
                <div className="card text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {stats.richProblemsCompleted}
                  </div>
                  <div className="text-sm text-gray-600">Rika problem</div>
                </div>
                <div className="card text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    {stats.challengesCompleted}
                  </div>
                  <div className="text-sm text-gray-600">Utmaningar</div>
                </div>
              </div>

              {/* Progress-bar */}
              <div className="card mb-8">
                <h2 className="font-semibold text-gray-900 mb-4">Din träffprocent</h2>
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-6">
                    <div
                      className={`h-6 rounded-full transition-all duration-500 ${
                        stats.accuracy >= 80
                          ? 'bg-success-500'
                          : stats.accuracy >= 50
                          ? 'bg-yellow-500'
                          : 'bg-orange-500'
                      }`}
                      style={{ width: `${stats.accuracy}%` }}
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-bold text-gray-800">{stats.accuracy}%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {stats.correctAttempts} av {stats.totalAttempts} rätt
                </p>
              </div>

              {/* Kategorier */}
              {Object.keys(stats.categoryStats).length > 0 && (
                <div className="card">
                  <h2 className="font-semibold text-gray-900 mb-4">Resultat per kategori</h2>
                  <div className="space-y-4">
                    {Object.entries(stats.categoryStats).map(([category, data]) => {
                      const percentage = Math.round((data.correct / data.total) * 100)
                      const categoryName = category
                        .replace(/_/g, ' ')
                        .replace(/^\w/, (c) => c.toUpperCase())

                      return (
                        <div key={category}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700">{categoryName}</span>
                            <span className="text-gray-500">
                              {data.correct}/{data.total} ({percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full transition-all ${
                                percentage >= 80
                                  ? 'bg-success-500'
                                  : percentage >= 50
                                  ? 'bg-yellow-500'
                                  : 'bg-orange-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Tips baserat på svaga områden */}
                  {(() => {
                    const weakCategories = Object.entries(stats.categoryStats)
                      .filter(([, data]) => (data.correct / data.total) < 0.5)
                      .map(([category]) => category.replace(/_/g, ' '))

                    if (weakCategories.length > 0) {
                      return (
                        <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r">
                          <p className="text-yellow-800 text-sm">
                            💡 <strong>Tips:</strong> Du kan förbättra dig på{' '}
                            {weakCategories.join(', ')}. Prova att göra fler uppgifter i dessa områden!
                          </p>
                        </div>
                      )
                    }
                    return null
                  })()}
                </div>
              )}

              {/* Rika problem bedömningar */}
              {stats.richProblemsCompleted > 0 && (
                <div className="card mt-8">
                  <h2 className="font-semibold text-gray-900 mb-4">Rika problem</h2>
                  <p className="text-gray-600">
                    Du har lämnat in {stats.richProblemsCompleted} rika problem.
                    {stats.richProblemsRated > 0 ? (
                      <span>
                        {' '}
                        {stats.richProblemsRated} av dem har fått återkoppling.
                      </span>
                    ) : (
                      <span> Väntar på återkoppling från lärare.</span>
                    )}
                  </p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </>
  )
}
