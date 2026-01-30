import type { NextApiRequest, NextApiResponse } from 'next'
import { getClassByCode, getStudentsByClass, getClassById } from '@/lib/database'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metoden är inte tillåten' })
  }

  try {
    const { classCode } = req.body

    if (!classCode || typeof classCode !== 'string') {
      return res.status(400).json({ error: 'Klasskod krävs' })
    }

    // Hämta klassen
    const cls = await getClassByCode(classCode.toUpperCase())
    if (!cls) {
      return res.status(400).json({ error: 'Ogiltig klasskod' })
    }

    // Hämta alla elever i klassen
    const students = await getStudentsByClass(cls.id)

    if (students.length === 0) {
      return res.status(400).json({ error: 'Inga elever hittades i denna klass' })
    }

    return res.status(200).json({
      className: cls.name,
      classCode: cls.classCode,
      students: students.map(s => ({
        id: s.id,
        name: s.name,
        grade: s.grade,
      })),
    })
  } catch (error) {
    console.error('Student login error:', error)
    return res.status(500).json({ error: 'Serverfel' })
  }
}
