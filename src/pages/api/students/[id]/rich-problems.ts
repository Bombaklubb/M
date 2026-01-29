import type { NextApiRequest, NextApiResponse } from 'next'
import { getRichProblemAttemptsByStudent } from '@/lib/db'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Metoden är inte tillåten' })
  }

  try {
    const { id } = req.query

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Student-ID krävs' })
    }

    const attempts = getRichProblemAttemptsByStudent(id)

    // Sortera efter datum, nyast först
    attempts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return res.status(200).json(attempts)
  } catch (error) {
    console.error('Get student rich problems error:', error)
    return res.status(500).json({ error: 'Serverfel' })
  }
}
