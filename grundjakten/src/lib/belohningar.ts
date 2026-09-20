import type { Kista, KistTyp, Progress } from '@/types';
import {
  KIST_META,
  PASS_MILSTOLPAR,
  UTMARKELSER,
  XP_MILSTOLPAR,
} from '@/data/belohningar';

/**
 * Kistor och utmärkelser.
 *
 * Två regler bär allt:
 *
 *  1. Varje milstolpe delas ut EN gång. `progress.utdelade` håller nycklarna,
 *     så en elev som öppnar en kista som i sin tur trycker XP:n förbi nästa
 *     milstolpe inte kan mata sig själv i en oändlig kedja. Listan är ändlig
 *     och varje post kan bara betalas en gång.
 *  2. Utmärkelser räknas alltid om från grunden ur `progress`. De lagras som
 *     id-lista, men sanningen är villkoret i data/belohningar.ts. Ändras ett
 *     krav följer läget med i stället för att frysa fast i ett gammalt beslut.
 */

let raknare = 0;

function nyKista(typ: KistTyp): Kista {
  raknare += 1;
  return { id: `k-${Date.now().toString(36)}-${raknare}`, typ, oppnad: false };
}

/**
 * Kistor eleven tjänat in men ännu inte fått.
 *
 * Anropas efter varje pass och efter varje öppnad kista. Returnerar både
 * kistorna och de milstolpenycklar som ska bokföras som utdelade.
 */
export function nyaKistor(progress: Progress): { kistor: Kista[]; nycklar: string[] } {
  const kistor: Kista[] = [];
  const nycklar: string[] = [];
  const redan = new Set(progress.utdelade);

  for (const m of PASS_MILSTOLPAR) {
    const nyckel = `pass-${m.pass}`;
    if (progress.sessions.length >= m.pass && !redan.has(nyckel)) {
      kistor.push(nyKista(m.typ));
      nycklar.push(nyckel);
    }
  }

  for (const m of XP_MILSTOLPAR) {
    const nyckel = `xp-${m.xp}`;
    if (progress.xp >= m.xp && !redan.has(nyckel)) {
      kistor.push(nyKista(m.typ));
      nycklar.push(nyckel);
    }
  }

  return { kistor, nycklar };
}

/** Träkistan varje avklarat pass ger. */
export function passKista(): Kista {
  return nyKista('tra');
}

export function oOppnade(progress: Progress): Kista[] {
  return progress.kistor.filter((k) => !k.oppnad);
}

/**
 * Öppna en kista.
 *
 * XP slumpas inom kistans spann, och silver och guld kan dessutom ge en
 * utmärkelse eleven inte redan har. Har hon alla ger kistan bara XP – den blir
 * aldrig tom, för en öppnad kista utan innehåll vore ett löfte som svek.
 */
export function oppnaKista(
  progress: Progress,
  kistId: string,
  slump: () => number = Math.random
): Progress {
  const kista = progress.kistor.find((k) => k.id === kistId);
  if (!kista || kista.oppnad) return progress;

  const meta = KIST_META[kista.typ];
  const xp = meta.xpMin + Math.floor(slump() * (meta.xpMax - meta.xpMin + 1));

  let utmarkelse: string | undefined;
  if (kista.typ !== 'tra') {
    const kvar = UTMARKELSER.filter((u) => !progress.badges.includes(u.id));
    if (kvar.length > 0) utmarkelse = kvar[Math.floor(slump() * kvar.length)].id;
  }

  return {
    ...progress,
    xp: progress.xp + xp,
    kistor: progress.kistor.map((k) =>
      k.id === kistId ? { ...k, oppnad: true, xp, utmarkelse } : k
    ),
    badges: utmarkelse ? [...progress.badges, utmarkelse] : progress.badges,
  };
}

/**
 * Utmärkelser eleven förtjänat.
 *
 * Räknas om varje gång, och de som redan ligger i listan behålls – en
 * utmärkelse som en gång delats ut tas aldrig ifrån eleven, inte ens om
 * villkoret skulle sluta gälla. Samma princip som bästa resultat per uppgift.
 */
export function utvarderaUtmarkelser(progress: Progress): string[] {
  const nya = UTMARKELSER.filter(
    (u) => !progress.badges.includes(u.id) && u.uppfyllt(progress)
  ).map((u) => u.id);
  return nya;
}
