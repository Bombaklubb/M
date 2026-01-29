// Uppgiftsgenerator för matematikövningar anpassade efter årskurs

export interface Task {
  id: string
  category: string
  domain: string
  prompt: string
  correctAnswer: string
  hint?: string
  explanation?: string
}

// Hjälpfunktion för slumptal
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Generera unik ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

// ========== ADDITION ==========
function generateAddition(grade: number): Task {
  let a: number, b: number

  if (grade <= 2) {
    // Åk 1-2: tal upp till 20
    a = randomInt(1, 10)
    b = randomInt(1, 10)
  } else if (grade <= 3) {
    // Åk 3: tal upp till 100
    a = randomInt(10, 50)
    b = randomInt(10, 50)
  } else if (grade <= 5) {
    // Åk 4-5: tal upp till 1000
    a = randomInt(100, 500)
    b = randomInt(100, 500)
  } else if (grade <= 6) {
    // Åk 6: decimaler
    a = randomInt(10, 100) / 10
    b = randomInt(10, 100) / 10
  } else {
    // Åk 7-9: negativa tal och decimaler
    const useNegative = Math.random() > 0.5
    if (useNegative) {
      a = randomInt(-50, 50)
      b = randomInt(-50, 50)
    } else {
      a = randomInt(10, 1000) / 10
      b = randomInt(10, 1000) / 10
    }
  }

  const answer = Number((a + b).toFixed(2))

  return {
    id: generateId(),
    category: 'addition',
    domain: 'de_fyra_raknesatten',
    prompt: `${a} + ${b} = ?`,
    correctAnswer: answer.toString(),
    hint: grade <= 3 ? 'Räkna på fingrarna eller rita streck' : undefined,
  }
}

// ========== SUBTRAKTION ==========
function generateSubtraction(grade: number): Task {
  let a: number, b: number

  if (grade <= 2) {
    a = randomInt(5, 20)
    b = randomInt(1, Math.min(a, 10))
  } else if (grade <= 3) {
    a = randomInt(50, 100)
    b = randomInt(10, 50)
  } else if (grade <= 5) {
    a = randomInt(500, 1000)
    b = randomInt(100, 500)
  } else if (grade <= 6) {
    a = randomInt(50, 200) / 10
    b = randomInt(10, Math.floor(a * 10)) / 10
  } else {
    // Åk 7-9
    const useNegative = Math.random() > 0.5
    if (useNegative) {
      a = randomInt(-30, 50)
      b = randomInt(-30, 50)
    } else {
      a = randomInt(100, 500) / 10
      b = randomInt(10, Math.floor(a * 10)) / 10
    }
  }

  const answer = Number((a - b).toFixed(2))

  return {
    id: generateId(),
    category: 'subtraktion',
    domain: 'de_fyra_raknesatten',
    prompt: `${a} − ${b} = ?`,
    correctAnswer: answer.toString(),
  }
}

// ========== MULTIPLIKATION ==========
function generateMultiplication(grade: number): Task {
  let a: number, b: number

  if (grade <= 2) {
    // Enkel multiplikation
    a = randomInt(1, 5)
    b = randomInt(1, 5)
  } else if (grade <= 4) {
    // Tabeller 1-10
    a = randomInt(2, 10)
    b = randomInt(2, 10)
  } else if (grade <= 6) {
    // Större tal
    a = randomInt(10, 50)
    b = randomInt(2, 12)
  } else {
    // Decimaler och negativa
    const type = randomInt(1, 3)
    if (type === 1) {
      a = randomInt(-10, 10)
      b = randomInt(2, 10)
    } else if (type === 2) {
      a = randomInt(10, 50) / 10
      b = randomInt(2, 10)
    } else {
      a = randomInt(10, 100)
      b = randomInt(10, 100) / 10
    }
  }

  const answer = Number((a * b).toFixed(2))

  return {
    id: generateId(),
    category: 'multiplikation',
    domain: 'de_fyra_raknesatten',
    prompt: `${a} × ${b} = ?`,
    correctAnswer: answer.toString(),
    hint: grade <= 4 ? 'Tänk på multiplikationstabellen' : undefined,
  }
}

// ========== DIVISION ==========
function generateDivision(grade: number): Task {
  let a: number, b: number, answer: number

  if (grade <= 3) {
    // Enkel division, jämna tal
    b = randomInt(2, 5)
    answer = randomInt(1, 10)
    a = b * answer
  } else if (grade <= 5) {
    // Division inom tabellerna
    b = randomInt(2, 10)
    answer = randomInt(2, 12)
    a = b * answer
  } else if (grade <= 6) {
    // Kan ge decimaler
    b = randomInt(2, 10)
    a = randomInt(10, 100)
    answer = Number((a / b).toFixed(2))
  } else {
    // Åk 7-9: mer komplexa
    const type = randomInt(1, 2)
    if (type === 1) {
      b = randomInt(2, 20)
      a = randomInt(50, 200)
    } else {
      b = randomInt(10, 50) / 10
      a = randomInt(10, 100)
    }
    answer = Number((a / b).toFixed(2))
  }

  return {
    id: generateId(),
    category: 'division',
    domain: 'de_fyra_raknesatten',
    prompt: `${a} ÷ ${b} = ?`,
    correctAnswer: answer.toString(),
  }
}

// ========== ALGEBRA & MÖNSTER ==========
function generateAlgebra(grade: number): Task {
  if (grade <= 3) {
    // Saknat tal, mönster
    const type = randomInt(1, 3)

    if (type === 1) {
      // □ + b = c
      const b = randomInt(1, 10)
      const c = randomInt(b + 1, 20)
      const answer = c - b
      return {
        id: generateId(),
        category: 'saknat_tal',
        domain: 'algebra_och_monster',
        prompt: `□ + ${b} = ${c}\n\nVad är □?`,
        correctAnswer: answer.toString(),
        hint: 'Tänk: Vad plus ' + b + ' blir ' + c + '?',
      }
    } else if (type === 2) {
      // a - □ = c
      const a = randomInt(10, 20)
      const c = randomInt(1, a - 1)
      const answer = a - c
      return {
        id: generateId(),
        category: 'saknat_tal',
        domain: 'algebra_och_monster',
        prompt: `${a} − □ = ${c}\n\nVad är □?`,
        correctAnswer: answer.toString(),
      }
    } else {
      // Talföljd
      const start = randomInt(1, 10)
      const step = randomInt(2, 5)
      const seq = [start, start + step, start + 2 * step]
      const answer = start + 3 * step
      return {
        id: generateId(),
        category: 'talföljd',
        domain: 'algebra_och_monster',
        prompt: `Fortsätt talföljden:\n${seq.join(', ')}, ?`,
        correctAnswer: answer.toString(),
        hint: 'Hur mycket ökar det mellan varje tal?',
      }
    }
  } else if (grade <= 6) {
    // Enkla uttryck och ekvationer
    const type = randomInt(1, 3)

    if (type === 1) {
      // ax = b
      const a = randomInt(2, 10)
      const x = randomInt(2, 10)
      const b = a * x
      return {
        id: generateId(),
        category: 'ekvation',
        domain: 'algebra_och_monster',
        prompt: `${a}x = ${b}\n\nVad är x?`,
        correctAnswer: x.toString(),
      }
    } else if (type === 2) {
      // x + a = b
      const a = randomInt(5, 20)
      const b = randomInt(a + 5, 50)
      const x = b - a
      return {
        id: generateId(),
        category: 'ekvation',
        domain: 'algebra_och_monster',
        prompt: `x + ${a} = ${b}\n\nVad är x?`,
        correctAnswer: x.toString(),
      }
    } else {
      // Uttryck
      const x = randomInt(2, 10)
      const a = randomInt(2, 5)
      const b = randomInt(1, 10)
      const answer = a * x + b
      return {
        id: generateId(),
        category: 'uttryck',
        domain: 'algebra_och_monster',
        prompt: `Om x = ${x}, vad är ${a}x + ${b}?`,
        correctAnswer: answer.toString(),
      }
    }
  } else {
    // Åk 7-9: mer avancerade ekvationer
    const type = randomInt(1, 4)

    if (type === 1) {
      // ax + b = c
      const a = randomInt(2, 5)
      const x = randomInt(1, 10)
      const b = randomInt(1, 20)
      const c = a * x + b
      return {
        id: generateId(),
        category: 'ekvation',
        domain: 'algebra_och_monster',
        prompt: `Lös ekvationen:\n${a}x + ${b} = ${c}`,
        correctAnswer: x.toString(),
        explanation: `${a}x = ${c} - ${b} = ${c - b}\nx = ${(c - b) / a}`,
      }
    } else if (type === 2) {
      // ax - b = c
      const a = randomInt(2, 5)
      const x = randomInt(5, 15)
      const b = randomInt(1, 20)
      const c = a * x - b
      return {
        id: generateId(),
        category: 'ekvation',
        domain: 'algebra_och_monster',
        prompt: `Lös ekvationen:\n${a}x − ${b} = ${c}`,
        correctAnswer: x.toString(),
      }
    } else if (type === 3) {
      // Proportionalitet: y = kx
      const k = randomInt(2, 8)
      const x = randomInt(3, 12)
      const y = k * x
      return {
        id: generateId(),
        category: 'proportionalitet',
        domain: 'algebra_och_monster',
        prompt: `y är proportionellt mot x.\nOm y = ${k * 5} när x = 5, vad är y när x = ${x}?`,
        correctAnswer: y.toString(),
      }
    } else {
      // Potenser
      const base = randomInt(2, 5)
      const exp = randomInt(2, 4)
      const answer = Math.pow(base, exp)
      return {
        id: generateId(),
        category: 'potenser',
        domain: 'algebra_och_monster',
        prompt: `Beräkna: ${base}^${exp}`,
        correctAnswer: answer.toString(),
        explanation: `${base}^${exp} = ${Array(exp).fill(base).join(' × ')} = ${answer}`,
      }
    }
  }
}

// ========== BLANDADE UPPGIFTER ==========
function generateMixed(grade: number): Task {
  const categories = ['addition', 'subtraktion', 'multiplikation', 'division', 'algebra']
  const category = categories[randomInt(0, categories.length - 1)]

  switch (category) {
    case 'addition':
      return generateAddition(grade)
    case 'subtraktion':
      return generateSubtraction(grade)
    case 'multiplikation':
      return generateMultiplication(grade)
    case 'division':
      return generateDivision(grade)
    case 'algebra':
      return generateAlgebra(grade)
    default:
      return generateAddition(grade)
  }
}

// ========== HUVUDFUNKTION ==========
export function generateTask(category: string, grade: number): Task {
  switch (category) {
    case 'addition':
      return generateAddition(grade)
    case 'subtraktion':
      return generateSubtraction(grade)
    case 'multiplikation':
      return generateMultiplication(grade)
    case 'division':
      return generateDivision(grade)
    case 'algebra':
      return generateAlgebra(grade)
    case 'blandade':
    default:
      return generateMixed(grade)
  }
}

// Generera flera uppgifter
export function generateTasks(category: string, grade: number, count: number): Task[] {
  const tasks: Task[] = []
  for (let i = 0; i < count; i++) {
    tasks.push(generateTask(category, grade))
  }
  return tasks
}

// Validera svar (hanterar olika format)
export function validateAnswer(userAnswer: string, correctAnswer: string): boolean {
  // Rensa svar
  const clean = (s: string) =>
    s
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/,/g, '.')
      .replace(/^x=/, '')
      .replace(/^y=/, '')

  const user = clean(userAnswer)
  const correct = clean(correctAnswer)

  // Direkt jämförelse
  if (user === correct) return true

  // Numerisk jämförelse
  const userNum = parseFloat(user)
  const correctNum = parseFloat(correct)

  if (!isNaN(userNum) && !isNaN(correctNum)) {
    // Tillåt liten avvikelse för decimaler
    return Math.abs(userNum - correctNum) < 0.01
  }

  return false
}
