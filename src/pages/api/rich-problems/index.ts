import type { NextApiRequest, NextApiResponse } from 'next'
import { getProblemsForThemeAndGrade } from '@/lib/richProblems'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Metoden är inte tillåten' })
  }

  try {
    const { theme, grade } = req.query

    if (!theme || typeof theme !== 'string') {
      return res.status(400).json({ error: 'Tema krävs' })
    }

    const gradeNum = parseInt(grade as string) || 5

    const problems = getProblemsForThemeAndGrade(theme, gradeNum)

    return res.status(200).json(problems)
  } catch (error) {
    console.error('Get rich problems error:', error)
    return res.status(500).json({ error: 'Serverfel' })
  }
}
