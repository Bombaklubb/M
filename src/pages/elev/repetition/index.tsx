import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

interface Student {
  id: string
  name: string
  grade: number
}

interface Lesson {
  id: string
  title: string
  description: string
  category: string
  icon: string
}

const categories = [
  { id: 'uppstallning', name: 'Uppställning', description: 'De fyra räknesätten', icon: '📝' },
  { id: 'enheter', name: 'Enheter', description: 'Längd, massa och volym', icon: '📐' },
  { id: 'algebra', name: 'Algebra', description: 'Mönster och ekvationer', icon: '🔢' },
]

export default function Repetition() {
  const router = useRouter()
  const [student, setStudent] = useState<Student | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = sessionStorage.getItem('student')
    if (!stored) {
      router.push('/elev/login')
      return
    }
    const studentData = JSON.parse(stored)
    setStudent(studentData)

    // Hämta lektioner för årskursen
    fetch(`/api/lessons?grade=${studentData.grade}`)
      .then((res) => res.json())
      .then((data) => {
        setLessons(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [router])

  const filteredLessons = selectedCategory
    ? lessons.filter((l) => l.category === selectedCategory)
    : lessons

  if (!student) return null

  return (
    <>
      <Head>
        <title>Repetition | Matteträning</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
            <Link href="/elev/dashboard" className="text-gray-500 hover:text-gray-700">
              ← Tillbaka
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Repetition</h1>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Kategorier */}
          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full transition-colors ${
                !selectedCategory
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:border-primary-300'
              }`}
            >
              Alla
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-primary-300'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>

          {/* Lektioner */}
          {loading ? (
            <div className="text-center py-12 text-gray-600">Laddar lektioner...</div>
          ) : filteredLessons.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Inga lektioner hittades för din årskurs.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredLessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  href={`/elev/repetition/${lesson.id}`}
                  className="card card-hover flex items-center gap-4"
                >
                  <div className="text-4xl">{lesson.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                    <p className="text-gray-600 text-sm">{lesson.description}</p>
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
