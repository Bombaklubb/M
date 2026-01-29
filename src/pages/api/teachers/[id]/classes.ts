import type { NextApiRequest, NextApiResponse } from 'next'
import { getClassesByTeacher } from '@/lib/database'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Metoden är inte tillåten' })
  }

  try {
    const { id } = req.query

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Lärar-ID krävs' })
    }

    const classes = await getClassesByTeacher(id)

    return res.status(200).json(classes)
  } catch (error) {
    console.error('Get teacher classes error:', error)
    return res.status(500).json({ error: 'Serverfel' })
  }
}
