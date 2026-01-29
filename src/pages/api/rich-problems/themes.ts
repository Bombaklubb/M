import type { NextApiRequest, NextApiResponse } from 'next'
import { getThemesForGrade } from '@/lib/richProblems'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Metoden är inte tillåten' })
  }

  try {
    const { grade } = req.query
    const gradeNum = parseInt(grade as string) || 5

    const themes = getThemesForGrade(gradeNum)

    return res.status(200).json(themes)
  } catch (error) {
    console.error('Get themes error:', error)
    return res.status(500).json({ error: 'Serverfel' })
  }
}
