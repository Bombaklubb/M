import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

interface Teacher {
  id: string
  name: string
  teacherCode: string
}

interface Class {
  id: string
  name: string
  classCode: string
}

interface Student {
  id: string
  name: string
  grade: number
  classId: string | null
}

const sidebarItems = [
  { id: 'elever', label: 'Elever', icon: '👥', href: '#elever' },
  { id: 'ova-mer', label: 'Öva mer', icon: '📝', href: '#' },
  { id: 'repetition', label: 'Repetition', icon: '📖', href: '#' },
  { id: 'rika-problem', label: 'Rika problem', icon: '🧩', href: '/larare/rika-problem' },
  { id: 'utmaning', label: 'Utmaning', icon: '🏆', href: '#' },
  { id: 'statistik', label: 'Min statistik', icon: '📊', href: '#' },
]

export default function LarareDashboard() {
  const router = useRouter()
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [classes, setClasses] = useState<Class[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null)
  const [unratedCount, setUnratedCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('elever')

  useEffect(() => {
    const stored = sessionStorage.getItem('teacher')
    if (!stored) {
      router.push('/larare/login')
      return
    }

    const teacherData = JSON.parse(stored)
    setTeacher(teacherData)

    Promise.all([
      fetch(`/api/teachers/${teacherData.id}/classes`).then((r) => r.json()),
      fetch(`/api/teachers/${teacherData.id}/students`).then((r) => r.json()),
      fetch('/api/rich-problems/unrated').then((r) => r.json()),
    ])
      .then(([classesData, studentsData, unratedData]) => {
        setClasses(classesData)
        setStudents(studentsData)
        setUnratedCount(unratedData.count || 0)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [router])

  const handleLogout = () => {
    sessionStorage.removeItem('teacher')
    router.push('/')
  }

  const filteredStudents = selectedGrade
    ? students.filter((s) => s.grade === selectedGrade)
    : students

  const grades = [...new Set(students.map((s) => s.grade))].sort()

  if (!teacher) return null

  const firstName = teacher.name.split(' ')[0]

  return (
    <>
      <Head>
        <title>Lärardashboard | Matteträning</title>
      </Head>

      <div className="min-h-screen flex">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 p-4">
          <div className="mb-8">
            <Link href="/" className="text-xl font-bold text-primary-600">
              Lärardashboard
            </Link>
          </div>

          <nav className="space-y-1 flex-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                  activeSection === item.id
                    ? 'bg-primary-100 text-primary-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
                {item.id === 'rika-problem' && unratedCount > 0 && (
                  <span className="ml-auto bg-coral-400 text-white text-xs px-2 py-0.5 rounded-full">
                    {unratedCount}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-gray-700 w-full rounded-2xl hover:bg-gray-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logga ut</span>
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-gray-100 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold text-gray-800 md:hidden">Lärardashboard</h1>

                {/* Filter */}
                <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                  <span className="text-sm text-gray-500 px-2">Visa:</span>
                  <button
                    onClick={() => setSelectedGrade(null)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      !selectedGrade
                        ? 'bg-white shadow-sm text-gray-800'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Alla årskurser
                  </button>
                  {grades.map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGrade(g)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        selectedGrade === g
                          ? 'bg-white shadow-sm text-gray-800'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      ÅK {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* User */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="font-semibold text-gray-800">{teacher.name}</div>
                  <div className="text-xs text-gray-500">Lärare</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-leaf-400 to-leaf-600 flex items-center justify-center text-white font-bold">
                  {firstName[0]}
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 p-6 bg-gradient-to-br from-sky-50/50 via-white to-primary-50/50">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-500 animate-pulse">Laddar...</div>
              </div>
            ) : (
              <div className="max-w-6xl mx-auto">
                {/* Quick stats */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <Link
                    href="/larare/rika-problem"
                    className="bg-white rounded-2xl p-5 shadow-soft border border-gray-100 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center text-2xl shadow-sm group-hover:scale-105 transition-transform">
                        🧩
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Rika problem</h3>
                        {unratedCount > 0 ? (
                          <p className="text-sm text-coral-500 font-medium">
                            {unratedCount} väntar på bedömning
                          </p>
                        ) : (
                          <p className="text-sm text-gray-500">Alla bedömda</p>
                        )}
                      </div>
                    </div>
                  </Link>

                  <div className="bg-white rounded-2xl p-5 shadow-soft border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-sky-500 flex items-center justify-center text-2xl shadow-sm">
                        👥
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Elever</h3>
                        <p className="text-sm text-gray-500">{students.length} elever totalt</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-5 shadow-soft border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-leaf-400 to-leaf-500 flex items-center justify-center text-2xl shadow-sm">
                        🏫
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Klasser</h3>
                        <p className="text-sm text-gray-500">
                          {classes.map((c) => c.classCode).join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Student list */}
                <div className="bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h2 className="font-bold text-gray-800">Elever</h2>
                      <span className="text-sm text-gray-500">
                        {filteredStudents.length} elever
                      </span>
                    </div>
                  </div>

                  {/* Mobile filter */}
                  <div className="md:hidden px-6 py-3 border-b border-gray-100 flex gap-2 overflow-x-auto">
                    <button
                      onClick={() => setSelectedGrade(null)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap ${
                        !selectedGrade
                          ? 'bg-primary-100 text-primary-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      Alla
                    </button>
                    {grades.map((g) => (
                      <button
                        key={g}
                        onClick={() => setSelectedGrade(g)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap ${
                          selectedGrade === g
                            ? 'bg-primary-100 text-primary-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        ÅK {g}
                      </button>
                    ))}
                  </div>

                  {/* Table header */}
                  <div className="hidden md:grid grid-cols-12 px-6 py-3 bg-gray-50 text-sm text-gray-500 font-medium">
                    <div className="col-span-5">Namn</div>
                    <div className="col-span-2">Årskurs</div>
                    <div className="col-span-3">Klass</div>
                    <div className="col-span-2 text-right">Resultat</div>
                  </div>

                  {/* Student rows */}
                  {filteredStudents.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <div className="text-4xl mb-3">🔍</div>
                      <p>Inga elever hittades</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {filteredStudents.map((student) => {
                        const cls = classes.find((c) => c.id === student.classId)
                        return (
                          <Link
                            key={student.id}
                            href={`/larare/elev/${student.id}`}
                            className="grid grid-cols-12 px-6 py-4 hover:bg-primary-50/50 transition-colors items-center"
                          >
                            <div className="col-span-12 md:col-span-5 flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-300 to-primary-500 flex items-center justify-center text-white font-semibold text-sm">
                                {student.name[0]}
                              </div>
                              <span className="font-medium text-gray-800">{student.name}</span>
                            </div>
                            <div className="hidden md:block col-span-2 text-gray-600">
                              ÅK {student.grade}
                            </div>
                            <div className="hidden md:block col-span-3 text-gray-500">
                              {cls?.name || '-'}
                            </div>
                            <div className="hidden md:flex col-span-2 justify-end items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  className={`w-4 h-4 ${star <= 3 ? 'text-sunny-400' : 'text-gray-200'}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  )
}
