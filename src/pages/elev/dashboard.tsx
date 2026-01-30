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
    description: 'Korta övningar inom Tal & Räkning, Geometri m.m.',
    icon: '📝',
    href: '/elev/ova-mer',
    bgColor: 'from-sky-50 to-sky-100',
    iconBg: 'from-sky-400 to-sky-500',
    borderColor: 'border-sky-200 hover:border-sky-400',
  },
  {
    id: 'repetition',
    title: 'Repetition',
    description: 'Genomgång och övningar',
    icon: '📖',
    href: '/elev/repetition',
    bgColor: 'from-leaf-50 to-leaf-100',
    iconBg: 'from-leaf-400 to-leaf-500',
    borderColor: 'border-leaf-200 hover:border-leaf-400',
  },
  {
    id: 'rika-problem',
    title: 'Rika problem',
    description: 'Utmanande problemlösning',
    icon: '🧩',
    href: '/elev/rika-problem',
    bgColor: 'from-purple-50 to-purple-100',
    iconBg: 'from-purple-400 to-purple-500',
    borderColor: 'border-purple-200 hover:border-purple-400',
  },
  {
    id: 'utmaning',
    title: 'Utmaning',
    description: 'Svårare problem',
    icon: '🏆',
    href: '/elev/utmaning',
    bgColor: 'from-sunny-50 to-sunny-100',
    iconBg: 'from-sunny-400 to-sunny-500',
    borderColor: 'border-sunny-200 hover:border-sunny-400',
  },
]

export default function ElevDashboard() {
  const router = useRouter()
  const [student, setStudent] = useState<Student | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = sessionStorage.getItem('student')
    if (!stored) {
      router.push('/')
      return
    }

    try {
      const studentData = JSON.parse(stored)
      setStudent(studentData)

      fetch(`/api/students/${studentData.id}/stats`)
        .then((res) => res.json())
        .then((data) => {
          setStats(data)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    } catch {
      router.push('/')
    }
  }, [router])

  const handleLogout = () => {
    sessionStorage.removeItem('student')
    router.push('/')
  }

  if (loading || !student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-primary-50">
        <div className="text-xl text-gray-600 animate-pulse">Laddar...</div>
      </div>
    )
  }

  const firstName = student.name.split(' ')[0]

  return (
    <>
      <Head>
        <title>Dashboard | Matteverkstan</title>
      </Head>

      <div className="min-h-screen">
        {/* Header */}
        <header className="bg-gradient-to-r from-primary-400 via-primary-500 to-sky-400">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center justify-between py-4">
              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-6 text-white/80">
                <Link href="/elev/ova-mer" className="hover:text-white transition-colors">Öva mer</Link>
                <Link href="/elev/repetition" className="hover:text-white transition-colors">Repetition</Link>
                <Link href="/elev/rika-problem" className="hover:text-white transition-colors">Rika problem</Link>
                <Link href="/elev/utmaning" className="hover:text-white transition-colors">Utmaning</Link>
              </nav>

              {/* User info */}
              <div className="flex items-center gap-3">
                <div className="text-right text-white">
                  <div className="font-semibold">{student.name}</div>
                  <div className="text-sm text-white/80">ÅK {student.grade}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                  {firstName[0]}
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-2 text-white/70 hover:text-white text-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-8">
          {/* Greeting */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Hej {firstName}! <span className="animate-bounce-gentle inline-block">👋</span>
            </h1>
            <p className="text-gray-600">Välj något att öva på.</p>
          </div>

          {/* Main sections grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {sections.map((section) => (
              <Link
                key={section.id}
                href={section.href}
                className="group"
              >
                <div className={`relative overflow-hidden bg-gradient-to-br ${section.bgColor} rounded-3xl p-6 border-2 ${section.borderColor} hover:shadow-lg transition-all duration-300 h-full`}>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/30 rounded-full -mr-6 -mt-6 group-hover:scale-110 transition-transform" />

                  <div className={`w-14 h-14 bg-gradient-to-br ${section.iconBg} rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-md group-hover:scale-105 transition-transform`}>
                    {section.icon}
                  </div>

                  <h3 className="text-lg font-bold text-gray-800 mb-1">
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {section.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Stats section */}
          <div className="bg-white rounded-3xl shadow-card p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Min statistik</h2>
              <Link
                href="/elev/statistik"
                className="text-primary-500 hover:text-primary-600 font-medium text-sm flex items-center gap-1"
              >
                Se mer
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {stats && stats.totalAttempts > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-2xl p-4 text-center">
                  <div className="text-3xl font-bold text-sky-600 mb-1">
                    {stats.totalAttempts}
                  </div>
                  <div className="text-sm text-gray-600">Uppgifter</div>
                </div>

                <div className="bg-gradient-to-br from-leaf-50 to-leaf-100 rounded-2xl p-4 text-center">
                  <div className="text-3xl font-bold text-leaf-600 mb-1">
                    {stats.accuracy}%
                  </div>
                  <div className="text-sm text-gray-600">Rätt</div>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-leaf-400 to-leaf-500 rounded-full"
                      style={{ width: `${stats.accuracy}%` }}
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    {stats.richProblemsCompleted}
                  </div>
                  <div className="text-sm text-gray-600">Rika problem</div>
                </div>

                <div className="bg-gradient-to-br from-sunny-50 to-sunny-100 rounded-2xl p-4 text-center">
                  <div className="text-3xl font-bold text-sunny-600 mb-1">
                    {stats.challengesCompleted}
                  </div>
                  <div className="text-sm text-gray-600">Utmaningar</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-5xl mb-4">🚀</div>
                <p className="font-medium">Du har inte börjat öva ännu!</p>
                <p className="text-sm">Välj en sektion ovan för att börja.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  )
}
