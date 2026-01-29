import type { NextApiRequest, NextApiResponse } from 'next'
import { createRichProblemAttempt } from '@/lib/db'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metoden är inte tillåten' })
  }

  try {
    const { studentId, problemId, theme, level, problemText, responseText } = req.body

    if (!studentId || !problemId || !theme || !level || !responseText) {
      return res.status(400).json({ error: 'Saknar nödvändiga fält' })
    }

    const attempt = createRichProblemAttempt({
      studentId,
      theme,
      level,
      problemId,
      problemText: problemText || '',
      responseText,
    })

    return res.status(200).json({ success: true, attemptId: attempt.id })
  } catch (error) {
    console.error('Submit rich problem error:', error)
    return res.status(500).json({ error: 'Serverfel' })
  }
}
