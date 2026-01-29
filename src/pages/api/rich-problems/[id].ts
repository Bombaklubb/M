import type { NextApiRequest, NextApiResponse } from 'next'
import { getRichProblemAttemptById } from '@/lib/db'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Metoden är inte tillåten' })
  }

  try {
    const { id } = req.query

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'ID krävs' })
    }

    const attempt = getRichProblemAttemptById(id)

    if (!attempt) {
      return res.status(404).json({ error: 'Försöket hittades inte' })
    }

    return res.status(200).json(attempt)
  } catch (error) {
    console.error('Get rich problem error:', error)
    return res.status(500).json({ error: 'Serverfel' })
  }
}
