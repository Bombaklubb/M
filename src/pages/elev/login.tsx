import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

interface Student {
  id: string
  name: string
  grade: number
}

export default function ElevLogin() {
  const router = useRouter()
  const [step, setStep] = useState<'code' | 'select'>('code')
  const [classCode, setClassCode] = useState('')
  const [students, setStudents] = useState<Student[]>([])
  const [className, setClassName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCodeSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!classCode.trim()) {
      setError('Skriv din klasskod')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classCode: classCode.trim().toUpperCase(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Ogiltig klasskod')
        setLoading(false)
        return
      }

      if (data.students && data.students.length > 0) {
        setStudents(data.students)
        setClassName(data.className || '')
        setStep('select')
      }
      setLoading(false)
    } catch {
      setError('Kunde inte ansluta till servern')
      setLoading(false)
    }
  }

  const handleSelectStudent = (student: Student) => {
    sessionStorage.setItem('student', JSON.stringify(student))
    router.push('/elev/dashboard')
  }

  return (
    <>
      <Head>
        <title>Logga in som elev | Matteträning</title>
      </Head>

      <main className="min-h-screen relative overflow-hidden">
        {/* Bakgrundsdekorationer */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-20 left-10 w-40 h-40 bg-primary-200/30 rounded-full blur-3xl" />
          <div className="absolute top-40 right-20 w-32 h-32 bg-sky-200/40 rounded-full blur-3xl" />
          <div className="absolute bottom-40 left-1/4 w-48 h-48 bg-leaf-200/30 rounded-full blur-3xl" />
        </div>

        <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Tillbaka
            </Link>

            <div className="bg-white rounded-3xl shadow-card p-8">
              {step === 'code' ? (
                <>
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg">
                      👩‍🎓
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Logga in som elev</h1>
                    <p className="text-gray-500 mt-2">Skriv in din klasskod för att börja</p>
                  </div>

                  <form onSubmit={handleCodeSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="classCode" className="label">
                        Klasskod
                      </label>
                      <input
                        type="text"
                        id="classCode"
                        value={classCode}
                        onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                        className="input text-center text-xl font-mono tracking-wider"
                        placeholder="T.ex. 6B2024"
                        autoFocus
                      />
                      <p className="text-sm text-gray-500 mt-2 text-center">
                        Fråga din lärare om klasskoden
                      </p>
                    </div>

                    {error && (
                      <div className="bg-coral-50 text-coral-500 p-4 rounded-2xl text-sm flex items-center gap-2">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary w-full py-4 text-lg disabled:opacity-50"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Söker...
                        </span>
                      ) : (
                        'Fortsätt'
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <button
                      onClick={() => setStep('code')}
                      className="text-gray-500 hover:text-gray-700 text-sm mb-4 inline-flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Byt klasskod
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">Välj ditt namn</h1>
                    <p className="text-gray-500 mt-1">{className}</p>
                  </div>

                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {students.map((student) => (
                      <button
                        key={student.id}
                        onClick={() => handleSelectStudent(student)}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 hover:border-primary-300 hover:bg-primary-50 transition-all text-left group"
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-300 to-primary-500 flex items-center justify-center text-white font-bold text-lg group-hover:scale-105 transition-transform">
                          {student.name[0]}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800">{student.name}</div>
                          <div className="text-sm text-gray-500">Årskurs {student.grade}</div>
                        </div>
                        <svg className="w-5 h-5 text-gray-300 group-hover:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
