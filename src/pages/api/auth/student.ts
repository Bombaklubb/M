import type { NextApiRequest, NextApiResponse } from 'next'
import { findOrCreateStudent, getClassByCode } from '@/lib/db'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metoden är inte tillåten' })
  }

  try {
    const { name, grade, classCode } = req.body

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Namn krävs' })
    }

    if (!grade || typeof grade !== 'number' || grade < 1 || grade > 9) {
      return res.status(400).json({ error: 'Ogiltig årskurs (1-9)' })
    }

    // Om klasskod anges, validera den
    let classId: string | null = null
    if (classCode) {
      const cls = getClassByCode(classCode)
      if (!cls) {
        return res.status(400).json({ error: 'Ogiltig klasskod' })
      }
      classId = cls.id
    }

    // Hitta eller skapa elev
    const student = findOrCreateStudent(name, grade, classId)

    return res.status(200).json({
      student: {
        id: student.id,
        name: student.name,
        grade: student.grade,
        classId: student.classId,
      },
    })
  } catch (error) {
    console.error('Student login error:', error)
    return res.status(500).json({ error: 'Serverfel' })
  }
}
