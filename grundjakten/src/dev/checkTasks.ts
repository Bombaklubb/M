import type { Exercise } from '@/types';
import { TASKS } from '@/data/tasks';

/**
 * Innehållskontroll för övningsbanken.
 *
 * Med över hundra uppgifter går det inte att klicka igenom dem för hand. Den
 * här kontrollen bygger varje uppgift med flera frön och letar efter de fel
 * som faktiskt drabbar en elev: ett tomt pass, en fråga utan rätt svar, två
 * likadana alternativ, ett svar som inte går att skriva.
 *
 * Körs med `npm run check`.
 */

export interface Fel {
  task: string;
  seed: number;
  meddelande: string;
}

function kollaOvning(ex: Exercise, task: string, seed: number, fel: Fel[]): void {
  const var_ = (m: string) => fel.push({ task, seed, meddelande: m });

  if (!ex.prompt?.text?.trim()) var_(`${ex.kind}: tom instruktion`);
  if (!ex.replay?.text?.trim()) var_(`${ex.kind}: tomt uppspelningsljud`);

  if ('choices' in ex && Array.isArray(ex.choices)) {
    const ratta = ex.choices.filter((c) => c.correct);
    if (ratta.length !== 1) var_(`${ex.kind}: ${ratta.length} rätta svar, ska vara 1`);
    if (ex.choices.length < 2) var_(`${ex.kind}: bara ${ex.choices.length} alternativ`);

    // Två alternativ som ser likadana ut gör uppgiften omöjlig att svara rätt på.
    const etiketter = ex.choices.map((c) => `${c.word ?? ''}|${c.letter ?? ''}|${c.emoji ?? ''}`);
    if (new Set(etiketter).size !== etiketter.length) {
      var_(`${ex.kind}: två alternativ ser likadana ut (${etiketter.join(' , ')})`);
    }
    // Samma id på två alternativ gör att React återanvänder fel nod.
    const ids = ex.choices.map((c) => c.id);
    if (new Set(ids).size !== ids.length) var_(`${ex.kind}: dubbla alternativ-id`);

    for (const c of ex.choices) {
      if (!c.say?.text?.trim()) var_(`${ex.kind}: alternativ utan talat namn`);
      if (!c.word && !c.letter && !c.emoji) var_(`${ex.kind}: alternativ utan innehåll`);
    }
  }

  if (ex.kind === 'type-the-word') {
    if (!ex.answer.trim()) var_('type-the-word: tomt svar');
    if (!ex.accept.includes(ex.answer.toLowerCase())) {
      var_(`type-the-word: "${ex.answer}" finns inte bland godtagna svar`);
    }
    if (ex.sentence && !ex.sentence.includes('___')) {
      var_(`type-the-word: meningen saknar lucka (${ex.sentence})`);
    }
  }

  if (ex.kind === 'order-items') {
    if (ex.target.length < 2) var_('order-items: färre än två objekt');
    const a = [...ex.target].sort().join('|');
    const b = [...ex.items].sort().join('|');
    if (a !== b) var_(`order-items: items är inte samma mängd som target`);
    if (new Set(ex.target).size !== ex.target.length) var_('order-items: dubbletter i target');
  }

  if (ex.kind === 'build-sentence-cards' || ex.kind === 'build-word-tiles') {
    for (const del of ex.target) {
      const iKort = (ex.kind === 'build-sentence-cards' ? ex.cards : ex.tiles).filter((k) => k === del).length;
      const iTarget = ex.target.filter((t) => t === del).length;
      if (iKort < iTarget) var_(`${ex.kind}: "${del}" saknas bland brickorna`);
    }
  }

  if (ex.kind === 'word-picture-pair') {
    if (ex.pairs.length < 2) var_('word-picture-pair: färre än två par');
    const ord = ex.pairs.map((p) => p.word);
    if (new Set(ord).size !== ord.length) var_('word-picture-pair: samma ord två gånger');
  }
}

export function kollaAllaTasks(seeds = [1, 12345, 987654]): { antal: number; fel: Fel[] } {
  const fel: Fel[] = [];
  let antal = 0;

  for (const task of TASKS) {
    const namn = `${task.grupp} – ${task.namn}`;
    for (const seed of seeds) {
      let pass: Exercise[];
      try {
        pass = task.build(seed);
      } catch (e) {
        fel.push({ task: namn, seed, meddelande: `kastade fel: ${(e as Error).message}` });
        continue;
      }

      antal += 1;
      if (pass.length < 4) {
        fel.push({ task: namn, seed, meddelande: `bara ${pass.length} uppgifter i passet` });
      }

      const ids = pass.map((e) => e.id);
      if (new Set(ids).size !== ids.length) {
        fel.push({ task: namn, seed, meddelande: 'två uppgifter i passet delar id' });
      }

      for (const ex of pass) kollaOvning(ex, namn, seed, fel);
    }
  }

  return { antal, fel };
}

/** Dubbletter i katalogen: samma id två gånger bryter uppslagningen. */
export function kollaKatalog(): Fel[] {
  const fel: Fel[] = [];
  const ids = TASKS.map((t) => t.id);
  const sedda = new Set<string>();
  for (const id of ids) {
    if (sedda.has(id)) fel.push({ task: id, seed: 0, meddelande: 'dubblerat uppgifts-id' });
    sedda.add(id);
  }
  for (const t of TASKS) {
    if (!t.namn.trim()) fel.push({ task: t.id, seed: 0, meddelande: 'uppgift utan namn' });
    if (![1, 2, 3, 4].includes(t.niva)) {
      fel.push({ task: t.id, seed: 0, meddelande: `ogiltig nivå ${t.niva}` });
    }
  }
  return fel;
}
