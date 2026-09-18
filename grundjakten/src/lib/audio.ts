import type { Letter, SpeechToken } from '@/types';
import { pickVoice, speechSupported } from './speech';
import { AUDIO_MANIFEST, audioPathFor } from '@/data/audioManifest';

/**
 * Enda vägen in till ljud i hela appen.
 *
 * Anroparen vet aldrig om det blev en inspelad fil eller talsyntes – och det
 * är hela poängen. Inspelningar kan läggas till i efterhand utan att någon
 * komponent rörs.
 */

let currentAudio: HTMLAudioElement | null = null;
let watchdog: number | null = null;
let unlocked = false;
let rateScale = 1;

/**
 * Räknare som stiger vid varje stop().
 *
 * Talet startas en kort stund efter cancel() (se playTts), och under den
 * stunden kan eleven hinna trycka på något annat. Utan den här räknaren skulle
 * det gamla yttrandet ändå säga ifrån, efter det nya.
 */
let generation = 0;

/**
 * Chrome sväljer yttrandet om speak() anropas i samma tick som cancel().
 * Det är en känd bugg, och den slog till exakt när en elev tryckte på örat
 * medan instruktionen fortfarande lästes upp – örat kändes dött.
 */
const CANCEL_PAUS_MS = 70;

/** Korta yttranden behöver ingen vakthund. Se startWatchdog. */
const VAKTHUND_GRANS = 140;

/** Global uppspelningshastighet, sätts från elevens inställning. */
export function setRateScale(scale: number): void {
  rateScale = scale;
}

/**
 * Chrome kräver en användargest innan ljud får spelas. Anropas vid första
 * tryckningen på inloggningsskärmen.
 */
export function unlock(): void {
  if (unlocked) return;
  unlocked = true;
  try {
    if (speechSupported) {
      // Ett tomt yttrande ger 'synthesis-failed' i Chrome. Ett mellanslag med
      // volym 0 väcker motorn utan att höras och utan att fela.
      const warmup = new SpeechSynthesisUtterance(' ');
      warmup.volume = 0;
      window.speechSynthesis.speak(warmup);
    }
  } catch {
    /* ignoreras – ljudet är en bonus, inte ett krav för att appen ska starta */
  }
}

export function stop(): void {
  generation += 1;
  if (watchdog !== null) {
    window.clearInterval(watchdog);
    watchdog = null;
  }
  if (speechSupported) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      /* ignoreras */
    }
  }
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
}

function playRecording(id: string): Promise<void> {
  return new Promise((resolve) => {
    const audio = new Audio(audioPathFor(id));
    currentAudio = audio;
    const done = () => {
      if (currentAudio === audio) currentAudio = null;
      resolve();
    };
    audio.onended = done;
    // Går filen inte att spela vill vi hellre gå vidare tyst än att hänga.
    audio.onerror = done;
    audio.play().catch(done);
  });
}

/**
 * Vakthund mot Chromes 15-sekundersgräns.
 *
 * Bara för långa texter. pause()/resume() är i sig riskabelt – hinner
 * yttrandet ta slut mittemellan kan motorn bli kvar i paus, och då tystnar
 * ALLT tal efteråt utan felmeddelande. Ett bokstavsnamn tar en halv sekund
 * och behöver inte den risken.
 */
function startWatchdog(text: string): void {
  if (text.length < VAKTHUND_GRANS) return;
  if (watchdog !== null) window.clearInterval(watchdog);
  watchdog = window.setInterval(() => {
    if (!window.speechSynthesis.speaking) {
      window.clearInterval(watchdog!);
      watchdog = null;
      return;
    }
    window.speechSynthesis.pause();
    window.speechSynthesis.resume();
  }, 8000);
}

function playTts(token: SpeechToken): Promise<void> {
  if (!speechSupported) return Promise.resolve();

  const min = generation;

  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(token.text);
    utterance.lang = token.lang;
    utterance.rate = Math.max(0.1, (token.rate ?? 0.9) * rateScale);
    if (token.pitch !== undefined) utterance.pitch = token.pitch;
    const voice = pickVoice(token.lang);
    if (voice) utterance.voice = voice;

    const finish = () => {
      if (watchdog !== null) {
        window.clearInterval(watchdog);
        watchdog = null;
      }
      resolve();
    };
    utterance.onend = finish;
    utterance.onerror = (e) => {
      // 'interrupted' betyder att vi själva avbröt – då är det inte ett fel.
      if (e.error !== 'interrupted') finish();
      else resolve();
    };

    // Vänta ut cancel() innan vi talar, annars sväljer Chrome yttrandet.
    window.setTimeout(() => {
      // Hann något annat starta under pausen? Då är det yttrandet som gäller.
      if (generation !== min) {
        resolve();
        return;
      }
      // cancel() nollställer inte paus-läget. Blir motorn kvar i paus tystnar
      // allt tal efteråt, utan att något fel rapporteras.
      if (window.speechSynthesis.paused) window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance);
      startWatchdog(token.text);
    }, CANCEL_PAUS_MS);
  });
}

export async function play(token: SpeechToken): Promise<void> {
  stop();
  if (AUDIO_MANIFEST[token.id]) return playRecording(token.id);
  return playTts(token);
}

/** Spelar en följd av token med paus emellan – används vid ljudning. */
export async function playSequence(tokens: SpeechToken[], gapMs = 320): Promise<void> {
  for (const token of tokens) {
    await play(token);
    await new Promise((r) => window.setTimeout(r, gapMs));
  }
}

/**
 * Enda stället där frågan "hur säger jag den här bokstavens ljud?" avgörs.
 *
 * Ordningen är: inspelning > utsträckt TTS-fonem > nyckelordsfras.
 * För klusiler (b d g k p t) är Letter.sound null, så de landar alltid på
 * "B som i boll" tills någon spelar in ett riktigt fonem.
 */
export function soundTokenFor(letter: Letter): SpeechToken {
  const recordedId = `snd-${letter.id}`;
  if (AUDIO_MANIFEST[recordedId]) {
    return { id: recordedId, text: letter.keyword.phrase.text, lang: 'sv-SE' };
  }
  return letter.sound ?? letter.keyword.phrase;
}

/**
 * Går det att spela ett pålitligt ISOLERAT fonem för den här bokstaven?
 *
 * Generatorn frågar den här innan den skapar övningar som kräver att eleven
 * skiljer fonem åt utan bildstöd. Falskt för klusiler i v1 – de får
 * nyckelordsförankrade övningar i stället, vilket fungerar lika bra
 * pedagogiskt och inte lär ut fel ljud.
 */
export function hasIsolatedSound(letter: Letter): boolean {
  return AUDIO_MANIFEST[`snd-${letter.id}`] === true || letter.sound !== null;
}
