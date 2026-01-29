import type { NextApiRequest, NextApiResponse } from 'next'
import { createChallengeAttempt } from '@/lib/db'
import { getChallengeById } from '@/lib/challenges'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metoden är inte tillåten' })
  }

  try {
    const {
      studentId,
      challengeId,
      challengeType,
      difficulty,
      prompt,
      userAnswer,
      isCorrect,
    } = req.body

    if (!studentId || !challengeId) {
      return res.status(400).json({ error: 'Saknar nödvändiga fält' })
    }

    // Hämta rätt svar
    const challenge = getChallengeById(challengeId)

    createChallengeAttempt({
      studentId,
      challengeId,
      challengeType: challengeType || 'unknown',
      difficulty: difficulty || 'mellan',
      prompt: prompt || '',
      studentAnswer: userAnswer,
      correctAnswer: challenge?.correctAnswer,
      isCorrect,
    })

    // Returnera korrekt svar och förklaring
    return res.status(200).json({
      isCorrect,
      correctAnswer: challenge?.correctAnswer,
      explanation: challenge?.explanation,
    })
  } catch (error) {
    console.error('Submit challenge error:', error)
    return res.status(500).json({ error: 'Serverfel' })
  }
}
