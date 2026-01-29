import type { NextApiRequest, NextApiResponse } from 'next'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

// Denna route skapar testdata i databasen
// Anropa GET /api/seed för att fylla databasen

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Använd GET eller POST' })
  }

  try {
    const now = new Date().toISOString()

    // Skapa lärare
    const teacher1 = {
      id: generateId(),
      name: 'Anna Andersson',
      teacherCode: 'LARARE123',
      createdAt: now,
    }

    const teacher2 = {
      id: generateId(),
      name: 'Erik Eriksson',
      teacherCode: 'LARARE456',
      createdAt: now,
    }

    // Skapa klasser
    const klass3A = {
      id: generateId(),
      name: 'Klass 3A',
      classCode: '3A2024',
      teacherId: teacher1.id,
      createdAt: now,
    }

    const klass6B = {
      id: generateId(),
      name: 'Klass 6B',
      classCode: '6B2024',
      teacherId: teacher1.id,
      createdAt: now,
    }

    const klass9C = {
      id: generateId(),
      name: 'Klass 9C',
      classCode: '9C2024',
      teacherId: teacher2.id,
      createdAt: now,
    }

    // Skapa elever
    const students = [
      { id: generateId(), name: 'Alma Svensson', grade: 3, classId: klass3A.id, createdAt: now },
      { id: generateId(), name: 'Hugo Berg', grade: 3, classId: klass3A.id, createdAt: now },
      { id: generateId(), name: 'Ella Lindgren', grade: 3, classId: klass3A.id, createdAt: now },
      { id: generateId(), name: 'Oscar Nilsson', grade: 3, classId: klass3A.id, createdAt: now },
      { id: generateId(), name: 'Maja Johansson', grade: 6, classId: klass6B.id, createdAt: now },
      { id: generateId(), name: 'Leo Karlsson', grade: 6, classId: klass6B.id, createdAt: now },
      { id: generateId(), name: 'Wilma Larsson', grade: 6, classId: klass6B.id, createdAt: now },
      { id: generateId(), name: 'Liam Persson', grade: 6, classId: klass6B.id, createdAt: now },
      { id: generateId(), name: 'Olivia Olsson', grade: 9, classId: klass9C.id, createdAt: now },
      { id: generateId(), name: 'William Gustafsson', grade: 9, classId: klass9C.id, createdAt: now },
      { id: generateId(), name: 'Astrid Eriksson', grade: 9, classId: klass9C.id, createdAt: now },
      { id: generateId(), name: 'Noah Andersson', grade: 9, classId: klass9C.id, createdAt: now },
    ]

    // Skapa databas-objektet
    const db = {
      teachers: [teacher1, teacher2],
      classes: [klass3A, klass6B, klass9C],
      students,
      taskAttempts: [],
      richProblemAttempts: [],
      challengeAttempts: [],
    }

    // Skapa data-mappen om den inte finns
    const dataDir = join(process.cwd(), 'data')
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true })
    }

    // Skriv till fil
    const dbPath = join(dataDir, 'db.json')
    writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8')

    return res.status(200).json({
      success: true,
      message: 'Databasen har fyllts med testdata!',
      data: {
        teachers: 2,
        classes: 3,
        students: 12,
      },
      credentials: {
        teacherCodes: ['LARARE123', 'LARARE456'],
        classCodes: ['3A2024', '6B2024', '9C2024'],
      },
    })
  } catch (error) {
    console.error('Seed error:', error)
    return res.status(500).json({ error: 'Kunde inte skapa testdata' })
  }
}
