import type { NextApiRequest, NextApiResponse } from 'next'
import { getStudentById } from '@/lib/db'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Metoden är inte tillåten' })
  }

  try {
    const { id } = req.query

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Student-ID krävs' })
    }

    const student = getStudentById(id)

    if (!student) {
      return res.status(404).json({ error: 'Eleven hittades inte' })
    }

    return res.status(200).json(student)
  } catch (error) {
    console.error('Get student error:', error)
    return res.status(500).json({ error: 'Serverfel' })
  }
}
