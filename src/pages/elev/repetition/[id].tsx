import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

interface Student {
  id: string
  name: string
  grade: number
}

interface LessonStep {
  type: 'text' | 'example' | 'exercise'
  content: string
  correctAnswer?: string
  hint?: string
}

interface Lesson {
  id: string
  title: string
  description: string
  category: string
  icon: string
  steps: LessonStep[]
}

export default function LessonPage() {
  const router = useRouter()
  const { id } = router.query

  const [student, setStudent] = useState<Student | null>(null)
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect'; message: string } | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = sessionStorage.getItem('student')
    if (!stored) {
      router.push('/elev/login')
      return
    }
    setStudent(JSON.parse(stored))
  }, [router])

  useEffect(() => {
    if (!id || !student) return

    fetch(`/api/lessons/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found')
        return res.json()
      })
      .then((data) => {
        setLesson(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [id, student])

  const handleSubmitExercise = () => {
    if (!lesson) return

    const step = lesson.steps[currentStep]
    if (step.type !== 'exercise' || !step.correctAnswer) return

    const cleanAnswer = userAnswer.trim().toLowerCase()
    const correctAnswer = step.correctAnswer.toLowerCase()

    const isCorrect = cleanAnswer === correctAnswer ||
      parseFloat(cleanAnswer) === parseFloat(correctAnswer)

    if (isCorrect) {
      setFeedback({ type: 'correct', message: 'Rätt! Bra jobbat!' })
    } else {
      setFeedback({
        type: 'incorrect',
        message: `Inte helt rätt. Rätt svar är: ${step.correctAnswer}`,
      })
    }
  }

  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1)
    setUserAnswer('')
    setFeedback(null)
    setShowHint(false)
  }

  if (!student) return null

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Laddar lektion...</div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Lektionen hittades inte</p>
          <Link href="/elev/repetition" className="btn btn-primary">
            Tillbaka
          </Link>
        </div>
      </div>
    )
  }

  const step = lesson.steps[currentStep]
  const isLastStep = currentStep === lesson.steps.length - 1
  const progress = ((currentStep + 1) / lesson.steps.length) * 100

  return (
    <>
      <Head>
        <title>{lesson.title} | Matteträning</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <Link href="/elev/repetition" className="text-gray-500 hover:text-gray-700">
                ← Tillbaka
              </Link>
              <span className="text-sm text-gray-600">
                {currentStep + 1} / {lesson.steps.length}
              </span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">
              {lesson.icon} {lesson.title}
            </h1>
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-8">
          <div className="card">
            {step.type === 'text' && (
              <div>
                <div className="prose prose-lg whitespace-pre-line text-gray-700">
                  {step.content}
                </div>
                <button
                  onClick={handleNextStep}
                  className="btn btn-primary w-full mt-6"
                  disabled={isLastStep}
                >
                  {isLastStep ? 'Klart!' : 'Nästa'}
                </button>
                {isLastStep && (
                  <Link
                    href="/elev/repetition"
                    className="btn btn-secondary w-full mt-3 text-center block"
                  >
                    Tillbaka till lektioner
                  </Link>
                )}
              </div>
            )}

            {step.type === 'example' && (
              <div>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <pre className="whitespace-pre-wrap font-mono text-gray-800">
                    {step.content}
                  </pre>
                </div>
                <button
                  onClick={handleNextStep}
                  className="btn btn-primary w-full mt-6"
                  disabled={isLastStep}
                >
                  {isLastStep ? 'Klart!' : 'Nästa'}
                </button>
                {isLastStep && (
                  <Link
                    href="/elev/repetition"
                    className="btn btn-secondary w-full mt-3 text-center block"
                  >
                    Tillbaka till lektioner
                  </Link>
                )}
              </div>
            )}

            {step.type === 'exercise' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Övning
                </h3>
                <div className="math-display mb-6 whitespace-pre-line">
                  {step.content}
                </div>

                {!feedback ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className="input text-center text-xl font-mono"
                      placeholder="Ditt svar"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && userAnswer.trim()) {
                          handleSubmitExercise()
                        }
                      }}
                    />

                    {step.hint && (
                      <div>
                        {showHint ? (
                          <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded">
                            💡 {step.hint}
                          </p>
                        ) : (
                          <button
                            onClick={() => setShowHint(true)}
                            className="text-sm text-primary-600 hover:text-primary-700"
                          >
                            Visa ledtråd
                          </button>
                        )}
                      </div>
                    )}

                    <button
                      onClick={handleSubmitExercise}
                      disabled={!userAnswer.trim()}
                      className="btn btn-primary w-full disabled:opacity-50"
                    >
                      Svara
                    </button>
                  </div>
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
                    </div>

                    {!isLastStep ? (
                      <button
                        onClick={handleNextStep}
                        className="btn btn-primary w-full"
                      >
                        Fortsätt
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <div className="text-center text-success-600 font-semibold py-4">
                          🎉 Du har klarat lektionen!
                        </div>
                        <Link
                          href="/elev/repetition"
                          className="btn btn-primary w-full text-center block"
                        >
                          Tillbaka till lektioner
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  )
}
