import type { NextApiRequest, NextApiResponse } from 'next'
import { getChallengesForGrade } from '@/lib/challenges'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Metoden är inte tillåten' })
  }

  try {
    const { grade } = req.query
    const gradeNum = parseInt(grade as string) || 5

    const challenges = getChallengesForGrade(gradeNum)

    // Ta bort correctAnswer och explanation från svaret
    const safeProblems = challenges.map(({ correctAnswer, explanation, ...rest }) => rest)

    return res.status(200).json(safeProblems)
  } catch (error) {
    console.error('Get challenges error:', error)
    return res.status(500).json({ error: 'Serverfel' })
  }
}
