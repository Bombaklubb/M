import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

interface Student {
  id: string
  name: string
  grade: number
}

interface Challenge {
  id: string
  type: string
  typeTitle: string
  title: string
  difficulty: string
  problemText: string
  hint?: string
  correctAnswer: string
  explanation?: string
}

const challengeTypes = [
  { id: 'logik', name: 'Logiska problem', icon: '🧠' },
  { id: 'talmonster', name: 'Talmönster', icon: '🔢' },
  { id: 'algebra', name: 'Algebra-pussel', icon: '🧮' },
  { id: 'geometri', name: 'Geometri', icon: '📐' },
]

export default function Utmaning() {
  const router = useRouter()
  const [student, setStudent] = useState<Student | null>(null)
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [feedback, setFeedback] = useState<{
    type: 'correct' | 'incorrect'
    message: string
    explanation?: string
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = sessionStorage.getItem('student')
    if (!stored) {
      router.push('/elev/login')
      return
    }
    const studentData = JSON.parse(stored)
    setStudent(studentData)

    fetch(`/api/challenges?grade=${studentData.grade}`)
      .then((res) => res.json())
      .then((data) => {
        setChallenges(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [router])

  const filteredChallenges = selectedType
    ? challenges.filter((c) => c.type === selectedType)
    : challenges

  const handleCheckAnswer = async () => {
    if (!currentChallenge || !student) return

    const cleanAnswer = userAnswer.trim().toLowerCase()
    const correctAnswer = currentChallenge.correctAnswer.toLowerCase()

    const isCorrect = cleanAnswer === correctAnswer

    // Spara försöket
    await fetch('/api/challenges/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: student.id,
        challengeId: currentChallenge.id,
        challengeType: currentChallenge.type,
        difficulty: currentChallenge.difficulty,
        prompt: currentChallenge.problemText,
        userAnswer: cleanAnswer,
        correctAnswer: currentChallenge.correctAnswer,
        isCorrect,
      }),
    }).catch(console.error)

    if (isCorrect) {
      setFeedback({
        type: 'correct',
        message: 'Rätt! Fantastiskt!',
        explanation: currentChallenge.explanation,
      })
    } else {
      setFeedback({
        type: 'incorrect',
        message: `Inte helt rätt. Rätt svar är: ${currentChallenge.correctAnswer}`,
        explanation: currentChallenge.explanation,
      })
    }
  }

  const handleNewChallenge = () => {
    setCurrentChallenge(null)
    setUserAnswer('')
    setFeedback(null)
    setShowHint(false)
  }

  const handleSelectChallenge = (challenge: Challenge) => {
    setCurrentChallenge(challenge)
    setUserAnswer('')
    setFeedback(null)
    setShowHint(false)
  }

  if (!student) return null

  // Visa utmaningslösning
  if (currentChallenge) {
    return (
      <>
        <Head>
          <title>{currentChallenge.title} | Matteträning</title>
        </Head>

        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm">
            <div className="max-w-4xl mx-auto px-4 py-4">
              <button
                onClick={handleNewChallenge}
                className="text-gray-500 hover:text-gray-700 mb-2"
              >
                ← Tillbaka till utmaningar
              </button>
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {challengeTypes.find((t) => t.id === currentChallenge.type)?.icon}
                </span>
                <h1 className="text-xl font-bold text-gray-900">
                  {currentChallenge.title}
                </h1>
              </div>
            </div>
          </header>

          <main className="max-w-2xl mx-auto px-4 py-8">
            <div className="card">
              <div className="whitespace-pre-line text-lg text-gray-800 leading-relaxed mb-6">
                {currentChallenge.problemText}
              </div>

              {!feedback ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="input text-center text-xl"
                    placeholder="Ditt svar"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && userAnswer.trim()) {
                        handleCheckAnswer()
                      }
                    }}
                  />

                  {currentChallenge.hint && (
                    <div className="text-center">
                      {showHint ? (
                        <p className="text-sm text-yellow-700 bg-yellow-50 p-3 rounded-lg">
                          💡 {currentChallenge.hint}
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
                    onClick={handleCheckAnswer}
                    disabled={!userAnswer.trim()}
                    className="btn btn-primary w-full py-3 disabled:opacity-50"
                  >
                    Kontrollera svar
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
                    <p className="font-medium text-lg mb-2">
                      {feedback.type === 'correct' ? '🎉 ' : ''}
                      {feedback.message}
                    </p>
                    {feedback.explanation && (
                      <div className="mt-3 pt-3 border-t border-gray-300 text-sm text-gray-700">
                        <strong>Förklaring:</strong>
                        <p className="mt-1 whitespace-pre-line">{feedback.explanation}</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleNewChallenge}
                    className="btn btn-primary w-full"
                  >
                    Ny utmaning
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </>
    )
  }

  // Visa utmaningslista
  return (
    <>
      <Head>
        <title>Utmaning | Matteträning</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
            <Link href="/elev/dashboard" className="text-gray-500 hover:text-gray-700">
              ← Tillbaka
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Utmaning</h1>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg mb-8">
            <h2 className="font-semibold text-orange-800 mb-1">Extra utmaning!</h2>
            <p className="text-orange-700 text-sm">
              Här finns svårare problem för dig som vill utmana dig själv.
              Tänk kreativt och ge inte upp - ibland tar det tid att lösa knepiga problem!
            </p>
          </div>

          {/* Typ-filter */}
          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={() => setSelectedType(null)}
              className={`px-4 py-2 rounded-full transition-colors ${
                !selectedType
                  ? 'bg-orange-500 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:border-orange-300'
              }`}
            >
              Alla
            </button>
            {challengeTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedType === type.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-orange-300'
                }`}
              >
                {type.icon} {type.name}
              </button>
            ))}
          </div>

          {/* Utmaningslista */}
          {loading ? (
            <div className="text-center py-12 text-gray-600">Laddar utmaningar...</div>
          ) : filteredChallenges.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              Inga utmaningar hittades för din nivå.
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredChallenges.map((challenge) => {
                const typeInfo = challengeTypes.find((t) => t.id === challenge.type)
                return (
                  <button
                    key={challenge.id}
                    onClick={() => handleSelectChallenge(challenge)}
                    className="card card-hover text-left flex items-center gap-4"
                  >
                    <div className="text-3xl">{typeInfo?.icon}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{challenge.title}</div>
                      <div className="text-sm text-gray-600">{typeInfo?.name}</div>
                    </div>
                    <div className="text-gray-400">→</div>
                  </button>
                )
              })}
            </div>
          )}
        </main>
      </div>
    </>
  )
}
