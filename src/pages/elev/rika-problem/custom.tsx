import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

interface Student {
  id: string
  name: string
  grade: number
}

// Genererar enkla problem baserat på tema
function generateProblemsForTheme(theme: string, grade: number) {
  const problems = [
    {
      level: 'E' as const,
      title: `${theme} - Enkel uppgift`,
      problemText: `Du ska planera en aktivitet med temat "${theme}".

Om du har 100 kr att använda och varje sak kostar 15 kr:
a) Hur många saker kan du köpa?
b) Hur mycket pengar får du tillbaka?

Visa hur du tänker.`,
    },
    {
      level: 'C' as const,
      title: `${theme} - Mellansvår uppgift`,
      problemText: `I en grupp som gillar ${theme} finns ${10 + grade * 2} personer.

a) Om gruppen ska delas i lika stora lag, på hur många sätt kan det göras?
b) Om ${Math.floor(grade / 2) + 1} nya personer tillkommer varje vecka, hur många finns det efter 4 veckor?
c) Hur lång tid tar det innan gruppen har fördubblats?

Visa dina beräkningar och resonemang.`,
    },
    {
      level: 'A' as const,
      title: `${theme} - Svår uppgift`,
      problemText: `Du ska organisera ett evenemang med temat "${theme}".

Lokalhyran är 500 kr plus 25 kr per person.
Inträdet är 40 kr per person.

a) Skriv en formel för vinsten V beroende på antal besökare n.
b) Hur många besökare behövs för att gå plus minus noll?
c) Om du vill ha minst 300 kr i vinst, hur många besökare behövs då?
d) Rita en graf som visar vinsten för 0-50 besökare.

Förklara dina resonemang och visa alla uträkningar.`,
    },
  ]

  return problems
}

export default function CustomRikaProblem() {
  const router = useRouter()
  const { theme } = router.query
  const [student, setStudent] = useState<Student | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<'E' | 'C' | 'A' | null>(null)
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem('student')
    if (!stored) {
      router.push('/')
      return
    }
    setStudent(JSON.parse(stored))
  }, [router])

  if (!student || !theme) return null

  const problems = generateProblemsForTheme(theme as string, student.grade)
  const currentProblem = selectedLevel ? problems.find(p => p.level === selectedLevel) : null

  const handleSubmit = async () => {
    if (!currentProblem || !answer.trim()) return

    try {
      await fetch('/api/rich-problems/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: student.id,
          theme: `custom_${theme}`,
          level: selectedLevel,
          problemId: `custom_${theme}_${selectedLevel}`,
          problemText: currentProblem.problemText,
          responseText: answer,
        }),
      })
      setSubmitted(true)
    } catch (err) {
      console.error('Submit error:', err)
    }
  }

  return (
    <>
      <Head>
        <title>{theme} | Rika problem | Matteverkstan</title>
      </Head>

      <div className="min-h-screen">
        <header className="bg-gradient-to-r from-purple-400 via-purple-500 to-pink-400">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
            <Link href="/elev/rika-problem" className="text-white/80 hover:text-white flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Tillbaka
            </Link>
            <h1 className="text-xl font-bold text-white capitalize">{theme}</h1>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          {!selectedLevel ? (
            <>
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">✏️</div>
                <h2 className="text-2xl font-bold text-gray-800 capitalize mb-2">
                  Problem om {theme}
                </h2>
                <p className="text-gray-600">Välj vilken nivå du vill arbeta med</p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {problems.map((problem) => (
                  <button
                    key={problem.level}
                    onClick={() => setSelectedLevel(problem.level)}
                    className={`p-6 rounded-3xl border-2 text-left transition-all hover:shadow-lg ${
                      problem.level === 'E'
                        ? 'bg-leaf-50 border-leaf-200 hover:border-leaf-400'
                        : problem.level === 'C'
                        ? 'bg-sunny-50 border-sunny-200 hover:border-sunny-400'
                        : 'bg-coral-50 border-coral-200 hover:border-coral-400'
                    }`}
                  >
                    <div className={`text-3xl font-bold mb-2 ${
                      problem.level === 'E' ? 'text-leaf-600' :
                      problem.level === 'C' ? 'text-sunny-600' : 'text-coral-600'
                    }`}>
                      {problem.level}
                    </div>
                    <div className="font-semibold text-gray-800">
                      {problem.level === 'E' ? 'Enklare' : problem.level === 'C' ? 'Mellan' : 'Svårare'}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {problem.level === 'E' ? 'Grundläggande uppgift' :
                       problem.level === 'C' ? 'Kräver mer tänkande' :
                       'Utmanande problem'}
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : submitted ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Bra jobbat!</h2>
              <p className="text-gray-600 mb-6">Ditt svar har sparats.</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    setSelectedLevel(null)
                    setAnswer('')
                    setSubmitted(false)
                  }}
                  className="btn btn-primary"
                >
                  Prova en annan nivå
                </button>
                <Link href="/elev/rika-problem" className="btn btn-secondary">
                  Tillbaka till rika problem
                </Link>
              </div>
            </div>
          ) : currentProblem && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => setSelectedLevel(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className={`px-4 py-2 rounded-full font-bold ${
                  selectedLevel === 'E' ? 'bg-leaf-100 text-leaf-700' :
                  selectedLevel === 'C' ? 'bg-sunny-100 text-sunny-700' :
                  'bg-coral-100 text-coral-700'
                }`}>
                  Nivå {selectedLevel}
                </span>
              </div>

              <div className="bg-white rounded-3xl shadow-card p-6 mb-6">
                <h3 className="font-bold text-gray-800 text-lg mb-4">{currentProblem.title}</h3>
                <p className="text-gray-700 whitespace-pre-line">{currentProblem.problemText}</p>
              </div>

              <div className="bg-white rounded-3xl shadow-card p-6">
                <label className="label text-lg">Ditt svar</label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="input min-h-48 text-base"
                  placeholder="Skriv din lösning här. Visa hur du tänker och räknar..."
                />
                <button
                  onClick={handleSubmit}
                  disabled={!answer.trim()}
                  className="btn btn-primary mt-4 disabled:opacity-50"
                >
                  Skicka svar
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  )
}
