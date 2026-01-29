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

const ratings = [
  { value: 'pa_vag', label: 'På väg', description: 'Eleven är på väg mot målet', color: 'bg-yellow-100 border-yellow-400 hover:bg-yellow-200' },
  { value: 'godtagbart', label: 'Godtagbart', description: 'Eleven når målet', color: 'bg-green-100 border-green-400 hover:bg-green-200' },
  { value: 'starkt', label: 'Starkt', description: 'Eleven når målet med god marginal', color: 'bg-blue-100 border-blue-400 hover:bg-blue-200' },
]

export default function BedomRiktProblem() {
  const router = useRouter()
  const { id } = router.query

  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [attempt, setAttempt] = useState<RichProblemAttempt | null>(null)
  const [student, setStudent] = useState<Student | null>(null)
  const [selectedRating, setSelectedRating] = useState<string>('')
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
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

    fetch(`/api/rich-problems/${id}`)
      .then((r) => r.json())
      .then(async (attemptData) => {
        setAttempt(attemptData)

        if (attemptData.teacherRating) {
          setSelectedRating(attemptData.teacherRating)
          setFeedback(attemptData.teacherFeedback || '')
        }

        // Hämta elev
        const studentRes = await fetch(`/api/students/${attemptData.studentId}`)
        const studentData = await studentRes.json()
        setStudent(studentData)

        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id, teacher])

  const handleSubmit = async () => {
    if (!attempt || !teacher || !selectedRating) return

    setSubmitting(true)

    try {
      await fetch(`/api/rich-problems/${attempt.id}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: teacher.id,
          rating: selectedRating,
          feedback: feedback.trim(),
        }),
      })

      setSubmitted(true)
    } catch {
      console.error('Failed to submit rating')
    }
    setSubmitting(false)
  }

  if (!teacher) return null

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Laddar...</div>
      </div>
    )
  }

  if (!attempt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Problemet hittades inte</p>
          <Link href="/larare/rika-problem" className="btn btn-primary">
            Tillbaka
          </Link>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <>
        <Head>
          <title>Bedömning sparad | Matteträning</title>
        </Head>

        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="card max-w-md text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Bedömning sparad!
            </h2>
            <p className="text-gray-600 mb-6">
              Eleven kommer kunna se din återkoppling.
            </p>
            <Link href="/larare/rika-problem" className="btn btn-primary">
              Tillbaka till listan
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Bedöm rikt problem | Matteträning</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Link
              href="/larare/rika-problem"
              className="text-gray-500 hover:text-gray-700 mb-2 inline-block"
            >
              ← Tillbaka till listan
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-900">
                Bedöm rikt problem
              </h1>
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">
                {attempt.level}
              </span>
            </div>
            {student && (
              <p className="text-sm text-gray-600">
                {student.name} - Årskurs {student.grade}
              </p>
            )}
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Uppgiften */}
          <div className="card mb-6">
            <h2 className="font-semibold text-gray-900 mb-3">Uppgift</h2>
            <div className="whitespace-pre-line text-gray-700 bg-gray-50 p-4 rounded">
              {attempt.problemText}
            </div>
          </div>

          {/* Elevens svar */}
          <div className="card mb-6">
            <h2 className="font-semibold text-gray-900 mb-3">Elevens svar</h2>
            <div className="whitespace-pre-line text-gray-700 bg-blue-50 p-4 rounded border-l-4 border-blue-400">
              {attempt.responseText}
            </div>
          </div>

          {/* Bedömning */}
          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-4">Din bedömning</h2>

            <div className="space-y-3 mb-6">
              {ratings.map((rating) => (
                <button
                  key={rating.value}
                  onClick={() => setSelectedRating(rating.value)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                    selectedRating === rating.value
                      ? `${rating.color} border-current`
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{rating.label}</div>
                  <div className="text-sm text-gray-600">{rating.description}</div>
                </button>
              ))}
            </div>

            <div className="mb-6">
              <label className="label">Återkoppling till eleven (valfritt)</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="input min-h-[100px] resize-y"
                placeholder="Skriv din återkoppling här..."
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!selectedRating || submitting}
              className="btn btn-primary w-full py-3 disabled:opacity-50"
            >
              {submitting ? 'Sparar...' : 'Spara bedömning'}
            </button>
          </div>
        </main>
      </div>
    </>
  )
}
