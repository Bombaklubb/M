// Seed-script för att fylla databasen med exempeldata
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

interface Teacher {
  id: string
  name: string
  teacherCode: string
  createdAt: string
}

interface Class {
  id: string
  name: string
  classCode: string
  teacherId: string
  createdAt: string
}

interface Student {
  id: string
  name: string
  grade: number
  classId: string | null
  createdAt: string
}

interface TaskAttempt {
  id: string
  studentId: string
  section: string
  domain: string
  category: string
  prompt: string
  studentAnswer: string
  correctAnswer: string
  isCorrect: boolean
  score: number
  createdAt: string
}

interface RichProblemAttempt {
  id: string
  studentId: string
  theme: string
  level: string
  problemId: string
  problemText: string
  responseText: string
  teacherId?: string
  teacherRating?: string
  teacherFeedback?: string
  ratedAt?: string
  createdAt: string
  updatedAt: string
}

interface Database {
  teachers: Teacher[]
  classes: Class[]
  students: Student[]
  taskAttempts: TaskAttempt[]
  richProblemAttempts: RichProblemAttempt[]
  challengeAttempts: never[]
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

function seed() {
  console.log('🌱 Startar seeding av databasen...')

  const now = new Date().toISOString()

  // Skapa lärare
  const teacher1: Teacher = {
    id: generateId(),
    name: 'Anna Andersson',
    teacherCode: 'LARARE123',
    createdAt: now,
  }

  const teacher2: Teacher = {
    id: generateId(),
    name: 'Erik Eriksson',
    teacherCode: 'LARARE456',
    createdAt: now,
  }

  console.log('✅ Skapade lärare:', teacher1.name, teacher2.name)

  // Skapa klasser
  const klass3A: Class = {
    id: generateId(),
    name: 'Klass 3A',
    classCode: '3A2024',
    teacherId: teacher1.id,
    createdAt: now,
  }

  const klass6B: Class = {
    id: generateId(),
    name: 'Klass 6B',
    classCode: '6B2024',
    teacherId: teacher1.id,
    createdAt: now,
  }

  const klass9C: Class = {
    id: generateId(),
    name: 'Klass 9C',
    classCode: '9C2024',
    teacherId: teacher2.id,
    createdAt: now,
  }

  console.log('✅ Skapade klasser:', klass3A.name, klass6B.name, klass9C.name)

  // Skapa elever
  const students: Student[] = [
    // Årskurs 3
    { id: generateId(), name: 'Alma Svensson', grade: 3, classId: klass3A.id, createdAt: now },
    { id: generateId(), name: 'Hugo Berg', grade: 3, classId: klass3A.id, createdAt: now },
    { id: generateId(), name: 'Ella Lindgren', grade: 3, classId: klass3A.id, createdAt: now },
    { id: generateId(), name: 'Oscar Nilsson', grade: 3, classId: klass3A.id, createdAt: now },
    // Årskurs 6
    { id: generateId(), name: 'Maja Johansson', grade: 6, classId: klass6B.id, createdAt: now },
    { id: generateId(), name: 'Leo Karlsson', grade: 6, classId: klass6B.id, createdAt: now },
    { id: generateId(), name: 'Wilma Larsson', grade: 6, classId: klass6B.id, createdAt: now },
    { id: generateId(), name: 'Liam Persson', grade: 6, classId: klass6B.id, createdAt: now },
    // Årskurs 9
    { id: generateId(), name: 'Olivia Olsson', grade: 9, classId: klass9C.id, createdAt: now },
    { id: generateId(), name: 'William Gustafsson', grade: 9, classId: klass9C.id, createdAt: now },
    { id: generateId(), name: 'Astrid Eriksson', grade: 9, classId: klass9C.id, createdAt: now },
    { id: generateId(), name: 'Noah Andersson', grade: 9, classId: klass9C.id, createdAt: now },
  ]

  console.log(`✅ Skapade ${students.length} elever`)

  // Skapa exempeldata för uppgiftsförsök
  const alma = students[0]
  const william = students.find(s => s.name === 'William Gustafsson')!

  const taskAttempts: TaskAttempt[] = [
    {
      id: generateId(),
      studentId: alma.id,
      section: 'ova_mer',
      domain: 'de_fyra_raknesatten',
      category: 'addition',
      prompt: '5 + 3 = ?',
      studentAnswer: '8',
      correctAnswer: '8',
      isCorrect: true,
      score: 1,
      createdAt: now,
    },
    {
      id: generateId(),
      studentId: alma.id,
      section: 'ova_mer',
      domain: 'de_fyra_raknesatten',
      category: 'addition',
      prompt: '7 + 6 = ?',
      studentAnswer: '13',
      correctAnswer: '13',
      isCorrect: true,
      score: 1,
      createdAt: now,
    },
    {
      id: generateId(),
      studentId: alma.id,
      section: 'ova_mer',
      domain: 'de_fyra_raknesatten',
      category: 'subtraktion',
      prompt: '12 - 5 = ?',
      studentAnswer: '6',
      correctAnswer: '7',
      isCorrect: false,
      score: 0,
      createdAt: now,
    },
    {
      id: generateId(),
      studentId: william.id,
      section: 'ova_mer',
      domain: 'algebra_och_monster',
      category: 'ekvationer',
      prompt: 'Lös ekvationen: 3x + 5 = 20',
      studentAnswer: 'x = 5',
      correctAnswer: 'x = 5',
      isCorrect: true,
      score: 1,
      createdAt: now,
    },
    {
      id: generateId(),
      studentId: william.id,
      section: 'repetition',
      domain: 'de_fyra_raknesatten',
      category: 'division',
      prompt: '144 ÷ 12 = ?',
      studentAnswer: '12',
      correctAnswer: '12',
      isCorrect: true,
      score: 1,
      createdAt: now,
    },
  ]

  // Rika problem-försök
  const richProblemAttempts: RichProblemAttempt[] = [
    {
      id: generateId(),
      studentId: alma.id,
      theme: 'pengar_och_handel',
      level: 'E',
      problemId: 'pengar_e_1',
      problemText: 'Lisa har 20 kr. Hon köper en glass för 15 kr. Hur mycket pengar har hon kvar?',
      responseText: 'Lisa har 5 kr kvar. Jag räknade 20 - 15 = 5.',
      teacherId: teacher1.id,
      teacherRating: 'godtagbart',
      teacherFeedback: 'Bra! Du visar tydligt hur du tänker.',
      ratedAt: now,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      studentId: william.id,
      theme: 'linjara_samband',
      level: 'C',
      problemId: 'linjar_c_1',
      problemText: 'En taxiresa kostar 50 kr i grundavgift plus 15 kr per km. Skriv en formel för kostnaden och beräkna kostnaden för en resa på 8 km.',
      responseText: 'Formel: K = 50 + 15x där x är antal km. För 8 km: K = 50 + 15·8 = 50 + 120 = 170 kr.',
      createdAt: now,
      updatedAt: now,
    },
  ]

  // Skapa databas-objektet
  const db: Database = {
    teachers: [teacher1, teacher2],
    classes: [klass3A, klass6B, klass9C],
    students,
    taskAttempts,
    richProblemAttempts,
    challengeAttempts: [],
  }

  // Skapa data-mappen om den inte finns
  const dataDir = join(process.cwd(), 'data')
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true })
  }

  // Skriv till fil
  const dbPath = join(dataDir, 'db.json')
  writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8')

  console.log('✅ Skapade exempeldata för uppgiftsförsök')
  console.log('')
  console.log('🎉 Seeding klar!')
  console.log('')
  console.log('Lärarkoder att använda:')
  console.log('  - LARARE123 (Anna Andersson)')
  console.log('  - LARARE456 (Erik Eriksson)')
  console.log('')
  console.log('Klasskoder att använda:')
  console.log('  - 3A2024 (Klass 3A)')
  console.log('  - 6B2024 (Klass 6B)')
  console.log('  - 9C2024 (Klass 9C)')
}

seed()
