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

export default function LarareDashboard() {
  const router = useRouter()
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [classes, setClasses] = useState<Class[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null)
  const [unratedCount, setUnratedCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = sessionStorage.getItem('teacher')
    if (!stored) {
      router.push('/larare/login')
      return
    }

    const teacherData = JSON.parse(stored)
    setTeacher(teacherData)

    // Hämta data
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

  // Hämta unika årskurser
  const grades = [...new Set(students.map((s) => s.grade))].sort()

  if (!teacher) return null

  return (
    <>
      <Head>
        <title>Lärardashboard | Matteträning</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{teacher.name}</h1>
              <p className="text-sm text-gray-600">Lärarkod: {teacher.teacherCode}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Logga ut
            </button>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8">
          {loading ? (
            <div className="text-center py-12 text-gray-600">Laddar...</div>
          ) : (
            <>
              {/* Snabblänkar */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <Link
                  href="/larare/rika-problem"
                  className="card card-hover bg-purple-50 border-2 border-purple-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">📝</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Rika problem</h3>
                      <p className="text-sm text-gray-600">
                        {unratedCount > 0 ? (
                          <span className="text-purple-600 font-medium">
                            {unratedCount} väntar på bedömning
                          </span>
                        ) : (
                          'Alla bedömda'
                        )}
                      </p>
                    </div>
                  </div>
                </Link>

                <div className="card bg-blue-50 border-2 border-blue-200">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">👥</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Elever</h3>
                      <p className="text-sm text-gray-600">
                        {students.length} elever totalt
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card bg-green-50 border-2 border-green-200">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">🏫</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Klasser</h3>
                      <p className="text-sm text-gray-600">
                        {classes.length} klasser
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Klasskoder */}
              {classes.length > 0 && (
                <div className="card mb-8">
                  <h2 className="font-semibold text-gray-900 mb-4">Dina klasskoder</h2>
                  <div className="flex flex-wrap gap-4">
                    {classes.map((cls) => (
                      <div
                        key={cls.id}
                        className="bg-gray-100 px-4 py-2 rounded-lg"
                      >
                        <span className="font-mono font-bold text-primary-600">
                          {cls.classCode}
                        </span>
                        <span className="text-gray-600 ml-2">({cls.name})</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-3">
                    Dela koden med eleverna så de kan logga in i rätt klass
                  </p>
                </div>
              )}

              {/* Elevlista */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900">Elever</h2>

                  {/* Årskursfilter */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedGrade(null)}
                      className={`px-3 py-1 rounded text-sm ${
                        !selectedGrade
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Alla
                    </button>
                    {grades.map((g) => (
                      <button
                        key={g}
                        onClick={() => setSelectedGrade(g)}
                        className={`px-3 py-1 rounded text-sm ${
                          selectedGrade === g
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Åk {g}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredStudents.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">
                    Inga elever hittades
                  </p>
                ) : (
                  <div className="divide-y">
                    {filteredStudents.map((student) => {
                      const cls = classes.find((c) => c.id === student.classId)
                      return (
                        <Link
                          key={student.id}
                          href={`/larare/elev/${student.id}`}
                          className="flex items-center justify-between py-3 hover:bg-gray-50 px-2 rounded"
                        >
                          <div>
                            <div className="font-medium text-gray-900">
                              {student.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              Årskurs {student.grade}
                              {cls && ` • ${cls.name}`}
                            </div>
                          </div>
                          <span className="text-gray-400">→</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </>
  )
}
