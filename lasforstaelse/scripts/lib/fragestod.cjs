//
// Hjälpfunktion för de skript som skriver om texter utan att röra frågorna.
//
// Risken vid en språklig omskrivning är att ett ord som en fråga hänger på
// försvinner. Frågan "Vad betyder ordet paus i texten?" blir obesvarbar om
// ordet paus stryks, och "Varför rostas bönorna?" faller om rostningen skrivs
// bort. Felet syns inte i valideringen, eftersom texten i övrigt är korrekt.
//
// Funktionen plockar automatiskt ut de bärande orden: alla ord om minst fem
// bokstäver som finns både i en fråga (eller dess rätta svar) och i den
// ursprungliga texten. De måste finnas kvar även efter omskrivningen.
//
// Spärren är medvetet sträng. Byter omskrivningen böjningsform på ett bärande
// ord slår den till, och då får ändringen granskas för hand i stället för att
// glida igenom.

// Frågeord och metaord som finns i nästan varje frågeformulering. De säger
// ingenting om vad texten måste innehålla: en fråga som börjar "Vilket område
// handlar texten om" faller inte för att ordet "vilket" strukits ur texten.
// Utan undantaget larmar spärren på slumpmässiga sammanträffanden, och då blir
// den brus i stället för skydd.
const UTAN_INNEHALL = new Set([
  'vilket',
  'vilken',
  'vilka',
  'vilkas',
  'varför',
  'varifrån',
  'enligt',
  'texten',
  'textens',
  'stycket',
]);

function normalisera(s) {
  return s.toLowerCase().replace(/[^a-zåäöéA-ZÅÄÖÉ0-9\s-]/g, ' ');
}

function ord(s) {
  return normalisera(s)
    .split(/\s+/)
    .filter((o) => o.replace(/[^a-zåäöé]/g, '').length >= 5 && !UTAN_INNEHALL.has(o));
}

/** Ord som en fråga eller dess facit hänger på och som finns i texten. */
function barandeOrd(text, questions) {
  const iText = new Set(ord(text));
  const barande = new Set();
  for (const q of questions || []) {
    const kallor = [q.q];
    if (Array.isArray(q.options) && typeof q.correct === 'number') {
      kallor.push(q.options[q.correct] || '');
    }
    for (const kalla of kallor) {
      for (const o of ord(kalla)) {
        if (iText.has(o)) barande.add(o);
      }
    }
  }
  return [...barande].sort();
}

/** Returnerar de bärande ord som saknas i den nya texten. */
function saknade(gammalText, nyText, questions) {
  const iNy = new Set(ord(nyText));
  return barandeOrd(gammalText, questions).filter((o) => !iNy.has(o));
}

function lix(text) {
  const meningar = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length || 1;
  const alla = text.trim().split(/\s+/).filter(Boolean);
  if (!alla.length) return 0;
  const langa = alla.filter((o) => o.replace(/[^a-zA-ZåäöÅÄÖéÉ]/g, '').length > 6).length;
  return Math.round(alla.length / meningar + (langa * 100) / alla.length);
}

const raknaOrd = (s) => s.trim().split(/\s+/).filter(Boolean).length;

module.exports = { barandeOrd, saknade, lix, raknaOrd };
