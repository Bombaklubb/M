import type { NextApiRequest, NextApiResponse } from 'next'
import { getLessonById } from '@/lib/lessons'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Metoden är inte tillåten' })
  }

  try {
    const { id } = req.query

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Lektion-ID krävs' })
    }

    const lesson = getLessonById(id)

    if (!lesson) {
      return res.status(404).json({ error: 'Lektionen hittades inte' })
    }

    return res.status(200).json(lesson)
  } catch (error) {
    console.error('Get lesson error:', error)
    return res.status(500).json({ error: 'Serverfel' })
  }
}
