import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

interface Teacher {
  id: string
  name: string
}

interface RichProblemAttempt {
  id: string
  studentId: string
  theme: string
  level: string
  problemText: string
  responseText: string
  teacherRating?: string
  teacherFeedback?: string
  createdAt: string
}

interface Student {
  id: string
  name: string
  grade: number
}

export default function RikaProblemLarare() {
  const router = useRouter()
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [unrated, setUnrated] = useState<RichProblemAttempt[]>([])
  const [students, setStudents] = useState<Record<string, Student>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = sessionStorage.getItem('teacher')
    if (!stored) {
      router.push('/larare/login')
      return
    }

    const teacherData = JSON.parse(stored)
    setTeacher(teacherData)

    // Hämta obedömda problem och elever
    Promise.all([
      fetch('/api/rich-problems/unrated').then((r) => r.json()),
      fetch(`/api/teachers/${teacherData.id}/students`).then((r) => r.json()),
    ])
      .then(([unratedData, studentsData]) => {
        setUnrated(unratedData.attempts || [])

        // Skapa en map av elever för snabb lookup
        const studentMap: Record<string, Student> = {}
        studentsData.forEach((s: Student) => {
          studentMap[s.id] = s
        })
        setStudents(studentMap)

        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [router])

  if (!teacher) return null

  return (
    <>
      <Head>
        <title>Rika problem - Bedömning | Matteträning</title>
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
            <h1 className="text-xl font-bold text-gray-900">
              Rika problem - Bedömning
            </h1>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          {loading ? (
            <div className="text-center py-12 text-gray-600">Laddar...</div>
          ) : unrated.length === 0 ? (
            <div className="card text-center py-12">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Alla bedömda!
              </h2>
              <p className="text-gray-600">
                Det finns inga rika problem som väntar på bedömning.
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-6">
                {unrated.length} problem väntar på bedömning
              </p>

              <div className="space-y-4">
                {unrated.map((attempt) => {
                  const student = students[attempt.studentId]
                  return (
                    <Link
                      key={attempt.id}
                      href={`/larare/rika-problem/${attempt.id}`}
                      className="card card-hover block"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-medium text-gray-900">
                            {student?.name || 'Okänd elev'}
                          </span>
                          {student && (
                            <span className="text-gray-500 ml-2">
                              (Åk {student.grade})
                            </span>
                          )}
                        </div>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">
                          {attempt.level}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {attempt.theme.replace(/_/g, ' ')}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(attempt.createdAt).toLocaleDateString('sv-SE')}
                      </p>
                    </Link>
                  )
                })}
              </div>
            </>
          )}
        </main>
      </div>
    </>
  )
}
