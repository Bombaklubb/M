import type { NextApiRequest, NextApiResponse } from 'next'
import { updateRichProblemAttempt } from '@/lib/db'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metoden är inte tillåten' })
  }

  try {
    const { id } = req.query
    const { teacherId, rating, feedback } = req.body

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'ID krävs' })
    }

    if (!teacherId || !rating) {
      return res.status(400).json({ error: 'Lärar-ID och betyg krävs' })
    }

    const updated = updateRichProblemAttempt(id, {
      teacherId,
      teacherRating: rating,
      teacherFeedback: feedback || undefined,
      ratedAt: new Date().toISOString(),
    })

    if (!updated) {
      return res.status(404).json({ error: 'Försöket hittades inte' })
    }

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Rate rich problem error:', error)
    return res.status(500).json({ error: 'Serverfel' })
  }
}
