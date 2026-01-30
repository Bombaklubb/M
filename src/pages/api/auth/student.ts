import type { NextApiRequest, NextApiResponse } from 'next'
import { getStudents, generateId } from '@/lib/database'

// In-memory storage för sessionen (i produktion skulle detta vara i databasen)
const students: Map<string, { id: string; name: string; grade: number }> = new Map()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metoden är inte tillåten' })
  }

  try {
    const { name, grade } = req.body

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Namn krävs' })
    }

    if (!grade || typeof grade !== 'number' || grade < 1 || grade > 9) {
      return res.status(400).json({ error: 'Ogiltig årskurs (1-9)' })
    }

    // Skapa en enkel student-session
    const studentId = generateId()
    const student = {
      id: studentId,
      name: name.trim(),
      grade: grade,
    }

    return res.status(200).json({ student })
  } catch (error) {
    console.error('Student login error:', error)
    return res.status(500).json({ error: 'Serverfel' })
  }
}
