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

export default function RikaProblem() {
  const router = useRouter()
  const [student, setStudent] = useState<Student | null>(null)
  const [themes, setThemes] = useState<Theme[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = sessionStorage.getItem('student')
    if (!stored) {
      router.push('/elev/login')
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

  if (!student) return null

  return (
    <>
      <Head>
        <title>Rika problem | Matteträning</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
            <Link href="/elev/dashboard" className="text-gray-500 hover:text-gray-700">
              ← Tillbaka
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Rika problem</h1>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg mb-8">
            <h2 className="font-semibold text-purple-800 mb-2">Vad är rika problem?</h2>
            <p className="text-purple-700 text-sm">
              Rika problem är uppgifter där du får tänka och resonera mer fritt.
              Det finns tre nivåer: E (enklare), C (mellan) och A (svårare).
              Skriv dina lösningar och förklaringar - din lärare kommer ge återkoppling!
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-600">Laddar teman...</div>
          ) : (
            <div className="grid gap-4">
              {themes.map((theme) => (
                <Link
                  key={theme.id}
                  href={`/elev/rika-problem/${theme.id}`}
                  className="card card-hover flex items-center gap-4"
                >
                  <div className="text-4xl">{theme.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{theme.title}</h3>
                    <p className="text-gray-600 text-sm">{theme.description}</p>
                  </div>
                  <div className="text-gray-400">→</div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  )
}
