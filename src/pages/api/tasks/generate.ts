import type { NextApiRequest, NextApiResponse } from 'next'
import { generateTask } from '@/lib/taskGenerator'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Metoden är inte tillåten' })
  }

  try {
    const { category, grade } = req.query

    if (!category || typeof category !== 'string') {
      return res.status(400).json({ error: 'Kategori krävs' })
    }

    const gradeNum = parseInt(grade as string) || 5

    if (gradeNum < 1 || gradeNum > 9) {
      return res.status(400).json({ error: 'Ogiltig årskurs (1-9)' })
    }

    const task = generateTask(category, gradeNum)

    return res.status(200).json(task)
  } catch (error) {
    console.error('Generate task error:', error)
    return res.status(500).json({ error: 'Serverfel' })
  }
}
