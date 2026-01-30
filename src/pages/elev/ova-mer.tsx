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
  useGrid?: boolean
  num1?: number
  num2?: number
  operation?: string
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
  { id: 'uppstallning', name: 'Uppställning', icon: '📝', isGrid: true },
  { id: 'algebra', name: 'Algebra & mönster', icon: '🔢' },
  { id: 'blandade', name: 'Blandade', icon: '🎲' },
]

// Grid component för uppställningar
function GridInput({
  num1,
  num2,
  operation,
  onAnswerChange,
  disabled,
}: {
  num1: number
  num2: number
  operation: string
  onAnswerChange: (answer: string) => void
  disabled: boolean
}) {
  const num1Str = num1.toString()
  const num2Str = num2.toString()
  const maxLen = Math.max(num1Str.length, num2Str.length) + 1

  // Result row state
  const [resultDigits, setResultDigits] = useState<string[]>(Array(maxLen + 1).fill(''))
  // Carry row state (minnessiffror)
  const [carryDigits, setCarryDigits] = useState<string[]>(Array(maxLen).fill(''))

  const handleResultChange = (index: number, value: string) => {
    if (disabled) return
    const newDigits = [...resultDigits]
    newDigits[index] = value.slice(-1) // Only last character
    setResultDigits(newDigits)

    // Calculate full answer from digits
    const answer = newDigits.join('').replace(/^0+/, '') || '0'
    onAnswerChange(answer)
  }

  const handleCarryChange = (index: number, value: string) => {
    if (disabled) return
    const newCarry = [...carryDigits]
    newCarry[index] = value.slice(-1)
    setCarryDigits(newCarry)
  }

  const opSymbol = operation === 'addition' ? '+' : operation === 'subtraktion' ? '−' : '×'

  return (
    <div className="flex flex-col items-center">
      <div className="bg-gradient-to-br from-cream-50 to-cream-100 p-6 rounded-2xl border-2 border-cream-300 inline-block">
        {/* Minnessiffror (carry) */}
        <div className="flex justify-end mb-1 pr-1">
          {carryDigits.map((digit, i) => (
            <input
              key={`carry-${i}`}
              type="text"
              inputMode="numeric"
              value={digit}
              onChange={(e) => handleCarryChange(i, e.target.value)}
              className="w-8 h-6 text-center text-xs text-gray-400 bg-transparent border-b border-dashed border-gray-300 focus:outline-none focus:border-primary-400"
              maxLength={1}
              disabled={disabled}
            />
          ))}
        </div>

        {/* Första talet */}
        <div className="flex justify-end font-mono text-2xl">
          {num1Str.padStart(maxLen, ' ').split('').map((digit, i) => (
            <div key={`num1-${i}`} className="w-10 h-12 flex items-center justify-center">
              {digit !== ' ' ? digit : ''}
            </div>
          ))}
        </div>

        {/* Operator och andra talet */}
        <div className="flex justify-end font-mono text-2xl border-b-4 border-gray-800 pb-2">
          <div className="w-10 h-12 flex items-center justify-center text-gray-600">
            {opSymbol}
          </div>
          {num2Str.padStart(maxLen - 1, ' ').split('').map((digit, i) => (
            <div key={`num2-${i}`} className="w-10 h-12 flex items-center justify-center">
              {digit !== ' ' ? digit : ''}
            </div>
          ))}
        </div>

        {/* Svarsrad - rutnät för att skriva in svaret */}
        <div className="flex justify-end mt-2">
          {resultDigits.map((digit, i) => (
            <input
              key={`result-${i}`}
              type="text"
              inputMode="numeric"
              value={digit}
              onChange={(e) => handleResultChange(i, e.target.value)}
              className="w-10 h-12 text-center font-mono text-2xl bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 mx-0.5"
              maxLength={1}
              disabled={disabled}
            />
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-500 mt-4">
        Skriv svaret siffra för siffra i rutorna. Börja från höger!
      </p>
    </div>
  )
}

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
      router.push('/')
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
      // For uppställning, generate grid-friendly tasks
      if (selectedCategory === 'uppstallning') {
        const operations = ['addition', 'subtraktion', 'multiplikation']
        const operation = operations[Math.floor(Math.random() * operations.length)]

        let num1: number, num2: number, correctAnswer: number

        if (student.grade <= 3) {
          num1 = Math.floor(Math.random() * 90) + 10 // 10-99
          num2 = Math.floor(Math.random() * 90) + 10
        } else if (student.grade <= 6) {
          num1 = Math.floor(Math.random() * 900) + 100 // 100-999
          num2 = Math.floor(Math.random() * 900) + 100
        } else {
          num1 = Math.floor(Math.random() * 9000) + 1000 // 1000-9999
          num2 = Math.floor(Math.random() * 900) + 100
        }

        if (operation === 'addition') {
          correctAnswer = num1 + num2
        } else if (operation === 'subtraktion') {
          // Make sure num1 > num2
          if (num1 < num2) [num1, num2] = [num2, num1]
          correctAnswer = num1 - num2
        } else {
          // Multiplikation - smaller numbers
          num1 = Math.floor(Math.random() * (student.grade <= 4 ? 50 : 200)) + 10
          num2 = Math.floor(Math.random() * 9) + 2
          correctAnswer = num1 * num2
        }

        const opName = operation === 'addition' ? 'addition' : operation === 'subtraktion' ? 'subtraktion' : 'multiplikation'
        const opSymbol = operation === 'addition' ? '+' : operation === 'subtraktion' ? '-' : '×'

        setCurrentTask({
          id: `grid_${Date.now()}`,
          category: 'uppstallning',
          domain: opName,
          prompt: `${num1} ${opSymbol} ${num2}`,
          correctAnswer: correctAnswer.toString(),
          useGrid: true,
          num1,
          num2,
          operation: opName,
        })
        setLoading(false)
        return
      }

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

    const isCorrect = userAnswer.trim() === currentTask.correctAnswer

    try {
      await fetch('/api/tasks/submit', {
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
    } catch {
      console.error('Failed to submit')
    }

    const result: Result = {
      task: currentTask,
      userAnswer: userAnswer.trim(),
      isCorrect,
    }

    setResults((prev) => [...prev, result])

    if (isCorrect) {
      setFeedback({ type: 'correct', message: 'Rätt! Bra jobbat!' })
    } else {
      setFeedback({
        type: 'incorrect',
        message: `Inte riktigt. Rätt svar är ${currentTask.correctAnswer}`,
      })
    }

    if (results.length + 1 >= 10) {
      setTimeout(() => setShowSummary(true), 1500)
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
          <title>Öva mer | Matteverkstan</title>
        </Head>

        <div className="min-h-screen">
          <header className="bg-gradient-to-r from-sky-400 via-sky-500 to-primary-400">
            <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
              <Link href="/elev/dashboard" className="text-white/80 hover:text-white flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Tillbaka
              </Link>
              <h1 className="text-xl font-bold text-white">Öva mer</h1>
            </div>
          </header>

          <main className="max-w-4xl mx-auto px-4 py-8">
            <p className="text-gray-600 mb-6">Välj vad du vill träna på:</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="bg-white rounded-2xl shadow-soft p-6 border-2 border-gray-100 hover:border-sky-300 hover:shadow-md transition-all text-center group"
                >
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{cat.icon}</div>
                  <div className="font-semibold text-gray-800">{cat.name}</div>
                  {cat.isGrid && (
                    <div className="text-xs text-sky-500 mt-1">Med rutnät</div>
                  )}
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

    return (
      <>
        <Head>
          <title>Resultat | Matteverkstan</title>
        </Head>

        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-card p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-4">
              {percentage >= 80 ? '🌟' : percentage >= 50 ? '👍' : '💪'}
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Bra jobbat!
            </h2>

            <p className="text-lg text-gray-600 mb-6">
              Du fick <span className="font-bold text-primary-600">{correct}</span> av{' '}
              <span className="font-bold">{total}</span> rätt ({percentage}%)
            </p>

            <div className="space-y-2 mb-6 text-left max-h-60 overflow-y-auto">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-xl flex items-center gap-2 text-sm ${
                    result.isCorrect
                      ? 'bg-leaf-50 text-leaf-700'
                      : 'bg-coral-50 text-coral-700'
                  }`}
                >
                  <span className="font-bold">{result.isCorrect ? '✓' : '✗'}</span>
                  <span className="font-mono">{result.task.prompt}</span>
                  {!result.isCorrect && (
                    <span className="ml-auto text-xs">
                      {result.userAnswer} → {result.task.correctAnswer}
                    </span>
                  )}
                </div>
              ))}
            </div>

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
  const isGridTask = currentTask?.useGrid

  return (
    <>
      <Head>
        <title>Öva mer | Matteverkstan</title>
      </Head>

      <div className="min-h-screen">
        <header className="bg-gradient-to-r from-sky-400 via-sky-500 to-primary-400">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleReset}
                className="text-white/80 hover:text-white flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Tillbaka
              </button>
              <h1 className="text-xl font-bold text-white">
                {categories.find((c) => c.id === selectedCategory)?.name}
              </h1>
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-full text-white text-sm">
              {results.length + 1} / 10
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-8">
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-8 overflow-hidden">
            <div
              className="bg-gradient-to-r from-sky-400 to-primary-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${((results.length) / 10) * 100}%` }}
            />
          </div>

          {loading ? (
            <div className="bg-white rounded-3xl shadow-card p-12 text-center">
              <div className="text-xl text-gray-600 animate-pulse">Laddar uppgift...</div>
            </div>
          ) : currentTask ? (
            <div className="bg-white rounded-3xl shadow-card p-6">
              {/* Uppgift */}
              {isGridTask && currentTask.num1 && currentTask.num2 && currentTask.operation ? (
                <GridInput
                  num1={currentTask.num1}
                  num2={currentTask.num2}
                  operation={currentTask.operation}
                  onAnswerChange={setUserAnswer}
                  disabled={!!feedback}
                />
              ) : (
                <div className="math-display mb-8 whitespace-pre-line">
                  {currentTask.prompt}
                </div>
              )}

              {/* Svarsformulär */}
              <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                {!isGridTask && (
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
                )}

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
                      className={`p-4 rounded-2xl ${
                        feedback.type === 'correct'
                          ? 'bg-leaf-50 border-2 border-leaf-200 text-leaf-700'
                          : 'bg-coral-50 border-2 border-coral-200 text-coral-700'
                      }`}
                    >
                      <p className="font-semibold">
                        {feedback.type === 'correct' ? '✓ ' : '✗ '}
                        {feedback.message}
                      </p>
                    </div>

                    <button
                      onClick={handleNextTask}
                      className="btn btn-primary w-full py-3 text-lg"
                    >
                      {results.length >= 10 ? 'Se resultat' : 'Nästa uppgift →'}
                    </button>
                  </div>
                )}
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-card p-12 text-center">
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
