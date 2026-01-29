import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

interface Student {
  id: string
  name: string
  grade: number
  classId: string | null
}

interface Stats {
  totalAttempts: number
  correctAttempts: number
  accuracy: number
  richProblemsCompleted: number
  challengesCompleted: number
}

const sections = [
  {
    id: 'ova-mer',
    title: 'Öva mer',
    description: 'Korta övningar med direkt feedback',
    icon: '📝',
    href: '/elev/ova-mer',
    color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
  },
  {
    id: 'repetition',
    title: 'Repetition',
    description: 'Lektioner och genomgångar',
    icon: '📖',
    href: '/elev/repetition',
    color: 'bg-green-50 hover:bg-green-100 border-green-200',
  },
  {
    id: 'rika-problem',
    title: 'Rika problem',
    description: 'E / C / A nivåer',
    icon: '🧩',
    href: '/elev/rika-problem',
    color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
  },
  {
    id: 'utmaning',
    title: 'Utmaning',
    description: 'Svårare problem och logik',
    icon: '🏆',
    href: '/elev/utmaning',
    color: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
  },
  {
    id: 'statistik',
    title: 'Min statistik',
    description: 'Se din utveckling',
    icon: '📊',
    href: '/elev/statistik',
    color: 'bg-gray-50 hover:bg-gray-100 border-gray-200',
  },
]

export default function ElevDashboard() {
  const router = useRouter()
  const [student, setStudent] = useState<Student | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Hämta studentdata från sessionStorage
    const stored = sessionStorage.getItem('student')
    if (!stored) {
      router.push('/elev/login')
      return
    }

    try {
      const studentData = JSON.parse(stored)
      setStudent(studentData)

      // Hämta statistik
      fetch(`/api/students/${studentData.id}/stats`)
        .then((res) => res.json())
        .then((data) => {
          setStats(data)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    } catch {
      router.push('/elev/login')
    }
  }, [router])

  const handleLogout = () => {
    sessionStorage.removeItem('student')
    router.push('/')
  }

  if (loading || !student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Laddar...</div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Dashboard | Matteträning</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Hej, {student.name}!
              </h1>
              <p className="text-sm text-gray-600">Årskurs {student.grade}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Logga ut
            </button>
          </div>
        </header>

        {/* Stats overview */}
        {stats && stats.totalAttempts > 0 && (
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="card text-center">
                <div className="text-3xl font-bold text-primary-600">
                  {stats.totalAttempts}
                </div>
                <div className="text-sm text-gray-600">Uppgifter</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-success-600">
                  {stats.accuracy}%
                </div>
                <div className="text-sm text-gray-600">Rätt</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {stats.richProblemsCompleted}
                </div>
                <div className="text-sm text-gray-600">Rika problem</div>
              </div>
            </div>
          </div>
        )}

        {/* Main sections */}
        <main className="max-w-4xl mx-auto px-4 py-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Vad vill du göra?
          </h2>

          <div className="grid gap-4">
            {sections.map((section) => (
              <Link
                key={section.id}
                href={section.href}
                className={`card card-hover flex items-center gap-4 border-2 ${section.color}`}
              >
                <div className="text-4xl">{section.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {section.title}
                  </h3>
                  <p className="text-gray-600">{section.description}</p>
                </div>
                <div className="text-gray-400">→</div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </>
  )
}
