import type { NextApiRequest, NextApiResponse } from 'next'
import { getUnratedRichProblemAttempts } from '@/lib/database'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Metoden är inte tillåten' })
  }

  try {
    const unrated = await getUnratedRichProblemAttempts()

    return res.status(200).json({
      count: unrated.length,
      attempts: unrated,
    })
  } catch (error) {
    console.error('Get unrated problems error:', error)
    return res.status(500).json({ error: 'Serverfel' })
  }
}
