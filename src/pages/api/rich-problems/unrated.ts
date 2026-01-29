import type { NextApiRequest, NextApiResponse } from 'next'
import { getUnratedRichProblemAttempts } from '@/lib/db'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Metoden är inte tillåten' })
  }

  try {
    const unrated = getUnratedRichProblemAttempts()

    return res.status(200).json({
      count: unrated.length,
      attempts: unrated,
    })
  } catch (error) {
    console.error('Get unrated problems error:', error)
    return res.status(500).json({ error: 'Serverfel' })
  }
}
