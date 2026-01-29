// Enkel JSON-databas med typsäker access
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

// Typdefinitioner
export interface Teacher {
  id: string
  name: string
  teacherCode: string
  createdAt: string
}

export interface Class {
  id: string
  name: string
  classCode: string
  teacherId: string
  createdAt: string
}

export interface Student {
  id: string
  name: string
  grade: number // 1-9
  classId: string | null
  createdAt: string
}

export interface TaskAttempt {
  id: string
  studentId: string
  section: 'ova_mer' | 'repetition'
  domain: string
  category: string
  taskId?: string
  prompt: string
  studentAnswer: string
  correctAnswer: string
  isCorrect: boolean
  score: number
  timeSpent?: number
  metadata?: string
  createdAt: string
}

export interface RichProblemAttempt {
  id: string
  studentId: string
  theme: string
  level: 'E' | 'C' | 'A'
  problemId: string
  problemText: string
  responseText: string
  teacherId?: string
  teacherRating?: 'pa_vag' | 'godtagbart' | 'starkt'
  teacherFeedback?: string
  ratedAt?: string
  createdAt: string
  updatedAt: string
}

export interface ChallengeAttempt {
  id: string
  studentId: string
  challengeId: string
  challengeType: 'logik' | 'talmonster' | 'algebra' | 'geometri'
  difficulty: 'lagre' | 'mellan' | 'hogre'
  prompt: string
  studentAnswer: string
  correctAnswer?: string
  isCorrect?: boolean
  createdAt: string
}

export interface Database {
  teachers: Teacher[]
  classes: Class[]
  students: Student[]
  taskAttempts: TaskAttempt[]
  richProblemAttempts: RichProblemAttempt[]
  challengeAttempts: ChallengeAttempt[]
}

const DB_PATH = join(process.cwd(), 'data', 'db.json')

// Skapa unik ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

// Initialisera tom databas
function getEmptyDb(): Database {
  return {
    teachers: [],
    classes: [],
    students: [],
    taskAttempts: [],
    richProblemAttempts: [],
    challengeAttempts: [],
  }
}

// Läs databas
export function readDb(): Database {
  try {
    if (!existsSync(DB_PATH)) {
      return getEmptyDb()
    }
    const data = readFileSync(DB_PATH, 'utf-8')
    return JSON.parse(data)
  } catch {
    return getEmptyDb()
  }
}

// Skriv databas
export function writeDb(db: Database): void {
  writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8')
}

// ========== TEACHER OPERATIONS ==========

export function getTeachers(): Teacher[] {
  return readDb().teachers
}

export function getTeacherByCode(code: string): Teacher | undefined {
  return readDb().teachers.find(t => t.teacherCode === code)
}

export function getTeacherById(id: string): Teacher | undefined {
  return readDb().teachers.find(t => t.id === id)
}

export function createTeacher(data: Omit<Teacher, 'id' | 'createdAt'>): Teacher {
  const db = readDb()
  const teacher: Teacher = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  }
  db.teachers.push(teacher)
  writeDb(db)
  return teacher
}

// ========== CLASS OPERATIONS ==========

export function getClasses(): Class[] {
  return readDb().classes
}

export function getClassByCode(code: string): Class | undefined {
  return readDb().classes.find(c => c.classCode === code)
}

export function getClassById(id: string): Class | undefined {
  return readDb().classes.find(c => c.id === id)
}

export function getClassesByTeacher(teacherId: string): Class[] {
  return readDb().classes.filter(c => c.teacherId === teacherId)
}

export function createClass(data: Omit<Class, 'id' | 'createdAt'>): Class {
  const db = readDb()
  const cls: Class = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  }
  db.classes.push(cls)
  writeDb(db)
  return cls
}

// ========== STUDENT OPERATIONS ==========

export function getStudents(): Student[] {
  return readDb().students
}

export function getStudentById(id: string): Student | undefined {
  return readDb().students.find(s => s.id === id)
}

export function getStudentsByClass(classId: string): Student[] {
  return readDb().students.filter(s => s.classId === classId)
}

export function getStudentsByGrade(grade: number): Student[] {
  return readDb().students.filter(s => s.grade === grade)
}

export function findOrCreateStudent(name: string, grade: number, classId: string | null): Student {
  const db = readDb()

  // Hitta befintlig elev
  let student = db.students.find(
    s => s.name.toLowerCase() === name.toLowerCase() &&
         s.grade === grade &&
         s.classId === classId
  )

  if (!student) {
    student = {
      id: generateId(),
      name,
      grade,
      classId,
      createdAt: new Date().toISOString(),
    }
    db.students.push(student)
    writeDb(db)
  }

  return student
}

export function createStudent(data: Omit<Student, 'id' | 'createdAt'>): Student {
  const db = readDb()
  const student: Student = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  }
  db.students.push(student)
  writeDb(db)
  return student
}

// ========== TASK ATTEMPT OPERATIONS ==========

export function getTaskAttempts(): TaskAttempt[] {
  return readDb().taskAttempts
}

export function getTaskAttemptsByStudent(studentId: string): TaskAttempt[] {
  return readDb().taskAttempts.filter(t => t.studentId === studentId)
}

export function getTaskAttemptsByStudentAndSection(studentId: string, section: string): TaskAttempt[] {
  return readDb().taskAttempts.filter(t => t.studentId === studentId && t.section === section)
}

export function createTaskAttempt(data: Omit<TaskAttempt, 'id' | 'createdAt'>): TaskAttempt {
  const db = readDb()
  const attempt: TaskAttempt = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  }
  db.taskAttempts.push(attempt)
  writeDb(db)
  return attempt
}

// ========== RICH PROBLEM ATTEMPT OPERATIONS ==========

export function getRichProblemAttempts(): RichProblemAttempt[] {
  return readDb().richProblemAttempts
}

export function getRichProblemAttemptsByStudent(studentId: string): RichProblemAttempt[] {
  return readDb().richProblemAttempts.filter(r => r.studentId === studentId)
}

export function getUnratedRichProblemAttempts(): RichProblemAttempt[] {
  return readDb().richProblemAttempts.filter(r => !r.teacherRating)
}

export function getRichProblemAttemptById(id: string): RichProblemAttempt | undefined {
  return readDb().richProblemAttempts.find(r => r.id === id)
}

export function createRichProblemAttempt(data: Omit<RichProblemAttempt, 'id' | 'createdAt' | 'updatedAt'>): RichProblemAttempt {
  const db = readDb()
  const now = new Date().toISOString()
  const attempt: RichProblemAttempt = {
    ...data,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  }
  db.richProblemAttempts.push(attempt)
  writeDb(db)
  return attempt
}

export function updateRichProblemAttempt(id: string, data: Partial<RichProblemAttempt>): RichProblemAttempt | undefined {
  const db = readDb()
  const index = db.richProblemAttempts.findIndex(r => r.id === id)
  if (index === -1) return undefined

  db.richProblemAttempts[index] = {
    ...db.richProblemAttempts[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }
  writeDb(db)
  return db.richProblemAttempts[index]
}

// ========== CHALLENGE ATTEMPT OPERATIONS ==========

export function getChallengeAttempts(): ChallengeAttempt[] {
  return readDb().challengeAttempts
}

export function getChallengeAttemptsByStudent(studentId: string): ChallengeAttempt[] {
  return readDb().challengeAttempts.filter(c => c.studentId === studentId)
}

export function createChallengeAttempt(data: Omit<ChallengeAttempt, 'id' | 'createdAt'>): ChallengeAttempt {
  const db = readDb()
  const attempt: ChallengeAttempt = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  }
  db.challengeAttempts.push(attempt)
  writeDb(db)
  return attempt
}

// ========== STATISTICS ==========

export function getStudentStats(studentId: string) {
  const attempts = getTaskAttemptsByStudent(studentId)
  const richProblems = getRichProblemAttemptsByStudent(studentId)
  const challenges = getChallengeAttemptsByStudent(studentId)

  const totalAttempts = attempts.length
  const correctAttempts = attempts.filter(a => a.isCorrect).length
  const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0

  // Statistik per kategori
  const categoryStats: Record<string, { total: number; correct: number }> = {}
  for (const attempt of attempts) {
    if (!categoryStats[attempt.category]) {
      categoryStats[attempt.category] = { total: 0, correct: 0 }
    }
    categoryStats[attempt.category].total++
    if (attempt.isCorrect) {
      categoryStats[attempt.category].correct++
    }
  }

  return {
    totalAttempts,
    correctAttempts,
    accuracy,
    categoryStats,
    richProblemsCompleted: richProblems.length,
    richProblemsRated: richProblems.filter(r => r.teacherRating).length,
    challengesCompleted: challenges.length,
  }
}
