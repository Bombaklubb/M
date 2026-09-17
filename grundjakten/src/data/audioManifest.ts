/**
 * Vilka inspelade ljudfiler som finns i public/audio/.
 *
 * Nyckeln är SpeechToken.id, värdet true. Finns nyckeln spelas
 * /audio/<mapp>/<id>.mp3 i stället för talsyntes.
 *
 * VARFÖR EN MANIFESTFIL OCH INTE EN 404-KOLL:
 * Vercel skriver om alla okända sökvägar till index.html (se vercel.json), så
 * ett anrop till en saknad mp3 ger status 200 med HTML i kroppen – en
 * 404-baserad fallback skulle alltså aldrig fungera. Dessutom skulle en
 * nätverkskoll före varje ljud ge en synlig fördröjning på en Chromebook.
 *
 * SÅ HÄR LÄGGER DU TILL RIKTIGA INSPELNINGAR:
 *   1. Lägg filen i public/audio/letters/snd-b.mp3
 *   2. Lägg till 'snd-b': true nedan
 * Klart. soundTokenFor() börjar returnera inspelningen och hasIsolatedSound()
 * börjar returnera true för b, vilket automatiskt låser upp de svårare
 * övningstyperna för den bokstaven. Ingen komponent behöver ändras.
 */
export const AUDIO_MANIFEST: Record<string, true> = {
  // Tomt i v1 – allt tal går via Web Speech API.
};

/** Mappar ett token-id till dess sökväg under /audio/. */
export function audioPathFor(id: string): string {
  if (id.startsWith('snd-') || id.startsWith('name-') || id.startsWith('kw-')) {
    return `/audio/letters/${id}.mp3`;
  }
  if (id.startsWith('word-')) return `/audio/words/${id}.mp3`;
  return `/audio/${id}.mp3`;
}
