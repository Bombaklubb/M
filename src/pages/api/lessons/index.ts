import type { NextApiRequest, NextApiResponse } from 'next'
import { getLessonsForGrade } from '@/lib/lessons'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Metoden är inte tillåten' })
  }

  try {
    const { grade } = req.query
    const gradeNum = parseInt(grade as string) || 5

    const lessons = getLessonsForGrade(gradeNum)

    // Returnera utan steps för att minska datamängd
    const lessonsWithoutSteps = lessons.map(({ steps, ...rest }) => rest)

    return res.status(200).json(lessonsWithoutSteps)
  } catch (error) {
    console.error('Get lessons error:', error)
    return res.status(500).json({ error: 'Serverfel' })
  }
}
