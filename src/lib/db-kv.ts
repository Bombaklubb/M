// Databas-adapter som använder Vercel KV i produktion och JSON-fil lokalt
import { kv } from '@vercel/kv'

// Typdefinitioner (samma som i db.ts)
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
  grade: number
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

// Skapa unik ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

// KV-nycklar
const KEYS = {
  teachers: 'mattetraning:teachers',
  classes: 'mattetraning:classes',
  students: 'mattetraning:students',
  taskAttempts: 'mattetraning:taskAttempts',
  richProblemAttempts: 'mattetraning:richProblemAttempts',
  challengeAttempts: 'mattetraning:challengeAttempts',
}

// Hjälpfunktioner för att läsa/skriva till KV
async function getList<T>(key: string): Promise<T[]> {
  try {
    const data = await kv.get<T[]>(key)
    return data || []
  } catch {
    return []
  }
}

async function setList<T>(key: string, data: T[]): Promise<void> {
  await kv.set(key, data)
}

// ========== TEACHER OPERATIONS ==========

export async function getTeachers(): Promise<Teacher[]> {
  return getList<Teacher>(KEYS.teachers)
}

export async function getTeacherByCode(code: string): Promise<Teacher | undefined> {
  const teachers = await getTeachers()
  return teachers.find(t => t.teacherCode === code)
}

export async function getTeacherById(id: string): Promise<Teacher | undefined> {
  const teachers = await getTeachers()
  return teachers.find(t => t.id === id)
}

export async function createTeacher(data: Omit<Teacher, 'id' | 'createdAt'>): Promise<Teacher> {
  const teachers = await getTeachers()
  const teacher: Teacher = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  }
  teachers.push(teacher)
  await setList(KEYS.teachers, teachers)
  return teacher
}

// ========== CLASS OPERATIONS ==========

export async function getClasses(): Promise<Class[]> {
  return getList<Class>(KEYS.classes)
}

export async function getClassByCode(code: string): Promise<Class | undefined> {
  const classes = await getClasses()
  return classes.find(c => c.classCode === code)
}

export async function getClassById(id: string): Promise<Class | undefined> {
  const classes = await getClasses()
  return classes.find(c => c.id === id)
}

export async function getClassesByTeacher(teacherId: string): Promise<Class[]> {
  const classes = await getClasses()
  return classes.filter(c => c.teacherId === teacherId)
}

export async function createClass(data: Omit<Class, 'id' | 'createdAt'>): Promise<Class> {
  const classes = await getClasses()
  const cls: Class = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  }
  classes.push(cls)
  await setList(KEYS.classes, classes)
  return cls
}

// ========== STUDENT OPERATIONS ==========

export async function getStudents(): Promise<Student[]> {
  return getList<Student>(KEYS.students)
}

export async function getStudentById(id: string): Promise<Student | undefined> {
  const students = await getStudents()
  return students.find(s => s.id === id)
}

export async function getStudentsByClass(classId: string): Promise<Student[]> {
  const students = await getStudents()
  return students.filter(s => s.classId === classId)
}

export async function getStudentsByGrade(grade: number): Promise<Student[]> {
  const students = await getStudents()
  return students.filter(s => s.grade === grade)
}

export async function findOrCreateStudent(name: string, grade: number, classId: string | null): Promise<Student> {
  const students = await getStudents()

  let student = students.find(
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
    students.push(student)
    await setList(KEYS.students, students)
  }

  return student
}

export async function createStudent(data: Omit<Student, 'id' | 'createdAt'>): Promise<Student> {
  const students = await getStudents()
  const student: Student = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  }
  students.push(student)
  await setList(KEYS.students, students)
  return student
}

// ========== TASK ATTEMPT OPERATIONS ==========

export async function getTaskAttempts(): Promise<TaskAttempt[]> {
  return getList<TaskAttempt>(KEYS.taskAttempts)
}

export async function getTaskAttemptsByStudent(studentId: string): Promise<TaskAttempt[]> {
  const attempts = await getTaskAttempts()
  return attempts.filter(t => t.studentId === studentId)
}

export async function getTaskAttemptsByStudentAndSection(studentId: string, section: string): Promise<TaskAttempt[]> {
  const attempts = await getTaskAttempts()
  return attempts.filter(t => t.studentId === studentId && t.section === section)
}

export async function createTaskAttempt(data: Omit<TaskAttempt, 'id' | 'createdAt'>): Promise<TaskAttempt> {
  const attempts = await getTaskAttempts()
  const attempt: TaskAttempt = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  }
  attempts.push(attempt)
  await setList(KEYS.taskAttempts, attempts)
  return attempt
}

// ========== RICH PROBLEM ATTEMPT OPERATIONS ==========

export async function getRichProblemAttempts(): Promise<RichProblemAttempt[]> {
  return getList<RichProblemAttempt>(KEYS.richProblemAttempts)
}

export async function getRichProblemAttemptsByStudent(studentId: string): Promise<RichProblemAttempt[]> {
  const attempts = await getRichProblemAttempts()
  return attempts.filter(r => r.studentId === studentId)
}

export async function getUnratedRichProblemAttempts(): Promise<RichProblemAttempt[]> {
  const attempts = await getRichProblemAttempts()
  return attempts.filter(r => !r.teacherRating)
}

export async function getRichProblemAttemptById(id: string): Promise<RichProblemAttempt | undefined> {
  const attempts = await getRichProblemAttempts()
  return attempts.find(r => r.id === id)
}

export async function createRichProblemAttempt(data: Omit<RichProblemAttempt, 'id' | 'createdAt' | 'updatedAt'>): Promise<RichProblemAttempt> {
  const attempts = await getRichProblemAttempts()
  const now = new Date().toISOString()
  const attempt: RichProblemAttempt = {
    ...data,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  }
  attempts.push(attempt)
  await setList(KEYS.richProblemAttempts, attempts)
  return attempt
}

export async function updateRichProblemAttempt(id: string, data: Partial<RichProblemAttempt>): Promise<RichProblemAttempt | undefined> {
  const attempts = await getRichProblemAttempts()
  const index = attempts.findIndex(r => r.id === id)
  if (index === -1) return undefined

  attempts[index] = {
    ...attempts[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }
  await setList(KEYS.richProblemAttempts, attempts)
  return attempts[index]
}

// ========== CHALLENGE ATTEMPT OPERATIONS ==========

export async function getChallengeAttempts(): Promise<ChallengeAttempt[]> {
  return getList<ChallengeAttempt>(KEYS.challengeAttempts)
}

export async function getChallengeAttemptsByStudent(studentId: string): Promise<ChallengeAttempt[]> {
  const attempts = await getChallengeAttempts()
  return attempts.filter(c => c.studentId === studentId)
}

export async function createChallengeAttempt(data: Omit<ChallengeAttempt, 'id' | 'createdAt'>): Promise<ChallengeAttempt> {
  const attempts = await getChallengeAttempts()
  const attempt: ChallengeAttempt = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  }
  attempts.push(attempt)
  await setList(KEYS.challengeAttempts, attempts)
  return attempt
}

// ========== STATISTICS ==========

export async function getStudentStats(studentId: string) {
  const attempts = await getTaskAttemptsByStudent(studentId)
  const richProblems = await getRichProblemAttemptsByStudent(studentId)
  const challenges = await getChallengeAttemptsByStudent(studentId)

  const totalAttempts = attempts.length
  const correctAttempts = attempts.filter(a => a.isCorrect).length
  const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0

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

// ========== SEED DATABASE ==========

export async function seedDatabase(): Promise<void> {
  const now = new Date().toISOString()

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

  const students: Student[] = [
    { id: generateId(), name: 'Alma Svensson', grade: 3, classId: klass3A.id, createdAt: now },
    { id: generateId(), name: 'Hugo Berg', grade: 3, classId: klass3A.id, createdAt: now },
    { id: generateId(), name: 'Ella Lindgren', grade: 3, classId: klass3A.id, createdAt: now },
    { id: generateId(), name: 'Oscar Nilsson', grade: 3, classId: klass3A.id, createdAt: now },
    { id: generateId(), name: 'Maja Johansson', grade: 6, classId: klass6B.id, createdAt: now },
    { id: generateId(), name: 'Leo Karlsson', grade: 6, classId: klass6B.id, createdAt: now },
    { id: generateId(), name: 'Wilma Larsson', grade: 6, classId: klass6B.id, createdAt: now },
    { id: generateId(), name: 'Liam Persson', grade: 6, classId: klass6B.id, createdAt: now },
    { id: generateId(), name: 'Olivia Olsson', grade: 9, classId: klass9C.id, createdAt: now },
    { id: generateId(), name: 'William Gustafsson', grade: 9, classId: klass9C.id, createdAt: now },
    { id: generateId(), name: 'Astrid Eriksson', grade: 9, classId: klass9C.id, createdAt: now },
    { id: generateId(), name: 'Noah Andersson', grade: 9, classId: klass9C.id, createdAt: now },
  ]

  await setList(KEYS.teachers, [teacher1, teacher2])
  await setList(KEYS.classes, [klass3A, klass6B, klass9C])
  await setList(KEYS.students, students)
  await setList(KEYS.taskAttempts, [])
  await setList(KEYS.richProblemAttempts, [])
  await setList(KEYS.challengeAttempts, [])
}
