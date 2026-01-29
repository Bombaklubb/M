import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

interface Student {
  id: string
  name: string
  grade: number
}

interface Task {
  id: string
  category: string
  domain: string
  prompt: string
  correctAnswer: string
  hint?: string
  explanation?: string
}

interface Result {
  task: Task
  userAnswer: string
  isCorrect: boolean
}

const categories = [
  { id: 'addition', name: 'Addition', icon: '➕' },
  { id: 'subtraktion', name: 'Subtraktion', icon: '➖' },
  { id: 'multiplikation', name: 'Multiplikation', icon: '✖️' },
  { id: 'division', name: 'Division', icon: '➗' },
  { id: 'algebra', name: 'Algebra & mönster', icon: '🔢' },
  { id: 'blandade', name: 'Blandade', icon: '🎲' },
]

export default function OvaMer() {
  const router = useRouter()
  const [student, setStudent] = useState<Student | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect'; message: string } | null>(null)
  const [results, setResults] = useState<Result[]>([])
  const [showSummary, setShowSummary] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem('student')
    if (!stored) {
      router.push('/elev/login')
      return
    }
    setStudent(JSON.parse(stored))
  }, [router])

  const fetchNewTask = useCallback(async () => {
    if (!student || !selectedCategory) return

    setLoading(true)
    setFeedback(null)
    setUserAnswer('')

    try {
      const res = await fetch(
        `/api/tasks/generate?category=${selectedCategory}&grade=${student.grade}`
      )
      const data = await res.json()
      setCurrentTask(data)
    } catch {
      console.error('Failed to fetch task')
    }
    setLoading(false)
  }, [student, selectedCategory])

  useEffect(() => {
    if (selectedCategory && student) {
      fetchNewTask()
    }
  }, [selectedCategory, student, fetchNewTask])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentTask || !userAnswer.trim() || !student) return

    try {
      const res = await fetch('/api/tasks/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: student.id,
          taskId: currentTask.id,
          category: currentTask.category,
          domain: currentTask.domain,
          prompt: currentTask.prompt,
          userAnswer: userAnswer.trim(),
          correctAnswer: currentTask.correctAnswer,
        }),
      })

      const data = await res.json()

      const result: Result = {
        task: currentTask,
        userAnswer: userAnswer.trim(),
        isCorrect: data.isCorrect,
      }

      setResults((prev) => [...prev, result])

      if (data.isCorrect) {
        setFeedback({ type: 'correct', message: 'Rätt! Bra jobbat!' })
      } else {
        setFeedback({
          type: 'incorrect',
          message: `Inte riktigt. Rätt svar är ${currentTask.correctAnswer}`,
        })
      }

      // Kolla om vi nått 10 uppgifter
      if (results.length + 1 >= 10) {
        setTimeout(() => setShowSummary(true), 1500)
      }
    } catch {
      console.error('Failed to submit answer')
    }
  }

  const handleNextTask = () => {
    if (results.length >= 10) {
      setShowSummary(true)
    } else {
      fetchNewTask()
    }
  }

  const handleReset = () => {
    setSelectedCategory(null)
    setCurrentTask(null)
    setResults([])
    setShowSummary(false)
    setFeedback(null)
    setUserAnswer('')
  }

  if (!student) {
    return null
  }

  // Visa kategori-val
  if (!selectedCategory) {
    return (
      <>
        <Head>
          <title>Öva mer | Matteträning</title>
        </Head>

        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm">
            <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
              <Link href="/elev/dashboard" className="text-gray-500 hover:text-gray-700">
                ← Tillbaka
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Öva mer</h1>
            </div>
          </header>

          <main className="max-w-4xl mx-auto px-4 py-8">
            <p className="text-gray-600 mb-6">Välj vad du vill träna på:</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="card card-hover text-center py-8"
                >
                  <div className="text-4xl mb-2">{cat.icon}</div>
                  <div className="font-medium text-gray-900">{cat.name}</div>
                </button>
              ))}
            </div>
          </main>
        </div>
      </>
    )
  }

  // Visa sammanfattning
  if (showSummary) {
    const correct = results.filter((r) => r.isCorrect).length
    const total = results.length
    const percentage = Math.round((correct / total) * 100)

    // Hitta svaga områden
    const incorrectCategories = results
      .filter((r) => !r.isCorrect)
      .map((r) => r.task.category)
    const weakArea = incorrectCategories.length > 0
      ? [...new Set(incorrectCategories)][0]
      : null

    return (
      <>
        <Head>
          <title>Resultat | Matteträning</title>
        </Head>

        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="card max-w-md w-full text-center">
            <div className="text-6xl mb-4">
              {percentage >= 80 ? '🌟' : percentage >= 50 ? '👍' : '💪'}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Bra jobbat!
            </h2>

            <p className="text-lg text-gray-600 mb-6">
              Du fick <span className="font-bold text-primary-600">{correct}</span> av{' '}
              <span className="font-bold">{total}</span> rätt ({percentage}%)
            </p>

            <div className="space-y-2 mb-6 text-left">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-2 rounded flex items-center gap-2 text-sm ${
                    result.isCorrect
                      ? 'bg-success-50 text-success-600'
                      : 'bg-error-50 text-error-600'
                  }`}
                >
                  <span>{result.isCorrect ? '✓' : '✗'}</span>
                  <span className="font-mono">{result.task.prompt.split('\n')[0]}</span>
                  {!result.isCorrect && (
                    <span className="ml-auto text-gray-500">
                      Ditt: {result.userAnswer} | Rätt: {result.task.correctAnswer}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {weakArea && (
              <div className="bg-warning-50 p-4 rounded-lg mb-6 text-left">
                <p className="text-warning-600 font-medium">
                  💡 Tips: Öva mer på {weakArea}
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleReset}
                className="btn btn-secondary flex-1"
              >
                Välj ny kategori
              </button>
              <button
                onClick={() => {
                  setResults([])
                  setShowSummary(false)
                  fetchNewTask()
                }}
                className="btn btn-primary flex-1"
              >
                Öva igen
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  // Visa övning
  return (
    <>
      <Head>
        <title>Öva mer | Matteträning</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleReset}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Tillbaka
              </button>
              <h1 className="text-xl font-bold text-gray-900">
                {categories.find((c) => c.id === selectedCategory)?.name}
              </h1>
            </div>
            <div className="text-sm text-gray-600">
              {results.length + 1} / 10
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-8">
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((results.length) / 10) * 100}%` }}
            />
          </div>

          {loading ? (
            <div className="card text-center py-12">
              <div className="text-xl text-gray-600">Laddar uppgift...</div>
            </div>
          ) : currentTask ? (
            <div className="card">
              {/* Uppgift */}
              <div className="math-display mb-8 whitespace-pre-line">
                {currentTask.prompt}
              </div>

              {/* Svarsformulär */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="answer" className="label">
                    Ditt svar:
                  </label>
                  <input
                    type="text"
                    id="answer"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="input text-center text-2xl font-mono"
                    placeholder="?"
                    autoFocus
                    disabled={!!feedback}
                  />
                </div>

                {currentTask.hint && !feedback && (
                  <p className="text-sm text-gray-500 text-center">
                    💡 {currentTask.hint}
                  </p>
                )}

                {!feedback ? (
                  <button
                    type="submit"
                    disabled={!userAnswer.trim()}
                    className="btn btn-primary w-full py-3 text-lg disabled:opacity-50"
                  >
                    Svara
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div
                      className={`p-4 rounded-lg ${
                        feedback.type === 'correct'
                          ? 'feedback-correct'
                          : 'feedback-incorrect'
                      }`}
                    >
                      <p className="font-medium">
                        {feedback.type === 'correct' ? '✓ ' : '✗ '}
                        {feedback.message}
                      </p>
                      {currentTask.explanation && feedback.type === 'incorrect' && (
                        <p className="text-sm mt-2 text-gray-600">
                          {currentTask.explanation}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={handleNextTask}
                      className="btn btn-primary w-full py-3 text-lg"
                    >
                      {results.length >= 10 ? 'Se resultat' : 'Nästa uppgift'}
                    </button>
                  </div>
                )}
              </form>
            </div>
          ) : (
            <div className="card text-center py-12">
              <p className="text-gray-600">Kunde inte ladda uppgift</p>
              <button onClick={fetchNewTask} className="btn btn-primary mt-4">
                Försök igen
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  )
}
