import type { NextApiRequest, NextApiResponse } from 'next'
import { createTaskAttempt } from '@/lib/db'
import { validateAnswer } from '@/lib/taskGenerator'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metoden är inte tillåten' })
  }

  try {
    const {
      studentId,
      taskId,
      category,
      domain,
      prompt,
      userAnswer,
      correctAnswer,
    } = req.body

    if (!studentId || !category || !prompt || !userAnswer || !correctAnswer) {
      return res.status(400).json({ error: 'Saknar nödvändiga fält' })
    }

    const isCorrect = validateAnswer(userAnswer, correctAnswer)

    // Spara försöket
    createTaskAttempt({
      studentId,
      section: 'ova_mer',
      domain: domain || 'de_fyra_raknesatten',
      category,
      taskId,
      prompt,
      studentAnswer: userAnswer,
      correctAnswer,
      isCorrect,
      score: isCorrect ? 1 : 0,
    })

    return res.status(200).json({ isCorrect })
  } catch (error) {
    console.error('Submit task error:', error)
    return res.status(500).json({ error: 'Serverfel' })
  }
}
