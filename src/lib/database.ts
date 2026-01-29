// Unified databas-layer som fungerar både lokalt (JSON) och på Vercel (KV)

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

// Kolla om vi kör på Vercel med KV
function isVercelKV(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
}

// Skapa unik ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

// Dynamisk import av rätt databas-backend
async function getDB() {
  if (isVercelKV()) {
    return await import('./db-kv')
  } else {
    // Wrapper för sync-funktionerna i db.ts
    const db = await import('./db')
    return {
      ...db,
      // Gör sync-funktioner async
      getTeachers: async () => db.getTeachers(),
      getTeacherByCode: async (code: string) => db.getTeacherByCode(code),
      getTeacherById: async (id: string) => db.getTeacherById(id),
      getClasses: async () => db.getClasses(),
      getClassByCode: async (code: string) => db.getClassByCode(code),
      getClassById: async (id: string) => db.getClassById(id),
      getClassesByTeacher: async (teacherId: string) => db.getClassesByTeacher(teacherId),
      getStudents: async () => db.getStudents(),
      getStudentById: async (id: string) => db.getStudentById(id),
      getStudentsByClass: async (classId: string) => db.getStudentsByClass(classId),
      getStudentsByGrade: async (grade: number) => db.getStudentsByGrade(grade),
      findOrCreateStudent: async (name: string, grade: number, classId: string | null) => db.findOrCreateStudent(name, grade, classId),
      getTaskAttempts: async () => db.getTaskAttempts(),
      getTaskAttemptsByStudent: async (studentId: string) => db.getTaskAttemptsByStudent(studentId),
      getTaskAttemptsByStudentAndSection: async (studentId: string, section: string) => db.getTaskAttemptsByStudentAndSection(studentId, section),
      createTaskAttempt: async (data: Omit<TaskAttempt, 'id' | 'createdAt'>) => db.createTaskAttempt(data),
      getRichProblemAttempts: async () => db.getRichProblemAttempts(),
      getRichProblemAttemptsByStudent: async (studentId: string) => db.getRichProblemAttemptsByStudent(studentId),
      getUnratedRichProblemAttempts: async () => db.getUnratedRichProblemAttempts(),
      getRichProblemAttemptById: async (id: string) => db.getRichProblemAttemptById(id),
      createRichProblemAttempt: async (data: Omit<RichProblemAttempt, 'id' | 'createdAt' | 'updatedAt'>) => db.createRichProblemAttempt(data),
      updateRichProblemAttempt: async (id: string, data: Partial<RichProblemAttempt>) => db.updateRichProblemAttempt(id, data),
      getChallengeAttempts: async () => db.getChallengeAttempts(),
      getChallengeAttemptsByStudent: async (studentId: string) => db.getChallengeAttemptsByStudent(studentId),
      createChallengeAttempt: async (data: Omit<ChallengeAttempt, 'id' | 'createdAt'>) => db.createChallengeAttempt(data),
      getStudentStats: async (studentId: string) => db.getStudentStats(studentId),
    }
  }
}

// ========== EXPORTERADE ASYNC FUNKTIONER ==========

export async function getTeachers(): Promise<Teacher[]> {
  const db = await getDB()
  return db.getTeachers()
}

export async function getTeacherByCode(code: string): Promise<Teacher | undefined> {
  const db = await getDB()
  return db.getTeacherByCode(code)
}

export async function getTeacherById(id: string): Promise<Teacher | undefined> {
  const db = await getDB()
  return db.getTeacherById(id)
}

export async function getClasses(): Promise<Class[]> {
  const db = await getDB()
  return db.getClasses()
}

export async function getClassByCode(code: string): Promise<Class | undefined> {
  const db = await getDB()
  return db.getClassByCode(code)
}

export async function getClassById(id: string): Promise<Class | undefined> {
  const db = await getDB()
  return db.getClassById(id)
}

export async function getClassesByTeacher(teacherId: string): Promise<Class[]> {
  const db = await getDB()
  return db.getClassesByTeacher(teacherId)
}

export async function getStudents(): Promise<Student[]> {
  const db = await getDB()
  return db.getStudents()
}

export async function getStudentById(id: string): Promise<Student | undefined> {
  const db = await getDB()
  return db.getStudentById(id)
}

export async function getStudentsByClass(classId: string): Promise<Student[]> {
  const db = await getDB()
  return db.getStudentsByClass(classId)
}

export async function getStudentsByGrade(grade: number): Promise<Student[]> {
  const db = await getDB()
  return db.getStudentsByGrade(grade)
}

export async function findOrCreateStudent(name: string, grade: number, classId: string | null): Promise<Student> {
  const db = await getDB()
  return db.findOrCreateStudent(name, grade, classId)
}

export async function getTaskAttempts(): Promise<TaskAttempt[]> {
  const db = await getDB()
  return db.getTaskAttempts()
}

export async function getTaskAttemptsByStudent(studentId: string): Promise<TaskAttempt[]> {
  const db = await getDB()
  return db.getTaskAttemptsByStudent(studentId)
}

export async function getTaskAttemptsByStudentAndSection(studentId: string, section: string): Promise<TaskAttempt[]> {
  const db = await getDB()
  return db.getTaskAttemptsByStudentAndSection(studentId, section)
}

export async function createTaskAttempt(data: Omit<TaskAttempt, 'id' | 'createdAt'>): Promise<TaskAttempt> {
  const db = await getDB()
  return db.createTaskAttempt(data)
}

export async function getRichProblemAttempts(): Promise<RichProblemAttempt[]> {
  const db = await getDB()
  return db.getRichProblemAttempts()
}

export async function getRichProblemAttemptsByStudent(studentId: string): Promise<RichProblemAttempt[]> {
  const db = await getDB()
  return db.getRichProblemAttemptsByStudent(studentId)
}

export async function getUnratedRichProblemAttempts(): Promise<RichProblemAttempt[]> {
  const db = await getDB()
  return db.getUnratedRichProblemAttempts()
}

export async function getRichProblemAttemptById(id: string): Promise<RichProblemAttempt | undefined> {
  const db = await getDB()
  return db.getRichProblemAttemptById(id)
}

export async function createRichProblemAttempt(data: Omit<RichProblemAttempt, 'id' | 'createdAt' | 'updatedAt'>): Promise<RichProblemAttempt> {
  const db = await getDB()
  return db.createRichProblemAttempt(data)
}

export async function updateRichProblemAttempt(id: string, data: Partial<RichProblemAttempt>): Promise<RichProblemAttempt | undefined> {
  const db = await getDB()
  return db.updateRichProblemAttempt(id, data)
}

export async function getChallengeAttempts(): Promise<ChallengeAttempt[]> {
  const db = await getDB()
  return db.getChallengeAttempts()
}

export async function getChallengeAttemptsByStudent(studentId: string): Promise<ChallengeAttempt[]> {
  const db = await getDB()
  return db.getChallengeAttemptsByStudent(studentId)
}

export async function createChallengeAttempt(data: Omit<ChallengeAttempt, 'id' | 'createdAt'>): Promise<ChallengeAttempt> {
  const db = await getDB()
  return db.createChallengeAttempt(data)
}

export async function getStudentStats(studentId: string) {
  const db = await getDB()
  return db.getStudentStats(studentId)
}
