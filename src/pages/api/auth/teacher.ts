import type { NextApiRequest, NextApiResponse } from 'next'
import { getTeacherByCode } from '@/lib/database'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metoden är inte tillåten' })
  }

  try {
    const { teacherCode } = req.body

    if (!teacherCode || typeof teacherCode !== 'string') {
      return res.status(400).json({ error: 'Lärarkod krävs' })
    }

    const teacher = await getTeacherByCode(teacherCode)

    if (!teacher) {
      return res.status(401).json({ error: 'Ogiltig lärarkod' })
    }

    return res.status(200).json({
      teacher: {
        id: teacher.id,
        name: teacher.name,
        teacherCode: teacher.teacherCode,
      },
    })
  } catch (error) {
    console.error('Teacher login error:', error)
    return res.status(500).json({ error: 'Serverfel' })
  }
}
