import type { NextApiRequest, NextApiResponse } from 'next'
import { getRandomProblem } from '@/lib/richProblems'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Metoden är inte tillåten' })
  }

  try {
    const { grade, level } = req.query

    const gradeNum = parseInt(grade as string) || 5
    const levelFilter = level as 'E' | 'C' | 'A' | undefined

    const problem = getRandomProblem(gradeNum, levelFilter)

    if (!problem) {
      return res.status(404).json({ error: 'Inget problem hittades' })
    }

    return res.status(200).json(problem)
  } catch (error) {
    console.error('Random problem error:', error)
    return res.status(500).json({ error: 'Serverfel' })
  }
}
