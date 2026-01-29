import type { NextApiRequest, NextApiResponse } from 'next'
import { getStudentById, getStudentStats } from '@/lib/database'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Metoden är inte tillåten' })
  }

  try {
    const { id } = req.query

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Student-ID krävs' })
    }

    const student = await getStudentById(id)
    if (!student) {
      return res.status(404).json({ error: 'Eleven hittades inte' })
    }

    const stats = await getStudentStats(id)

    return res.status(200).json(stats)
  } catch (error) {
    console.error('Get student stats error:', error)
    return res.status(500).json({ error: 'Serverfel' })
  }
}
