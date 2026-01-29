import type { NextApiRequest, NextApiResponse } from 'next'
import { getClassesByTeacher, getStudentsByClass, getStudents, Student } from '@/lib/database'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Metoden är inte tillåten' })
  }

  try {
    const { id } = req.query

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Lärar-ID krävs' })
    }

    // Hämta lärarens klasser
    const classes = await getClassesByTeacher(id)
    const classIds = classes.map((c) => c.id)

    // Hämta elever i dessa klasser
    let students: Student[] = []

    if (classIds.length > 0) {
      for (const classId of classIds) {
        const classStudents = await getStudentsByClass(classId)
        students = [...students, ...classStudents]
      }
    }

    // Om inga klasser, hämta alla elever (för demo)
    if (students.length === 0) {
      students = await getStudents()
    }

    return res.status(200).json(students)
  } catch (error) {
    console.error('Get teacher students error:', error)
    return res.status(500).json({ error: 'Serverfel' })
  }
}
