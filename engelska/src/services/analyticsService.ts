/**
 * GDPR-SÄKRAD ANALYTICS SERVICE – Engelskajakten
 *
 * Spårar anonym, aggregerad statistik utan personlig data.
 *
 * GDPR-PRINCIPER:
 * 1. INGEN personlig data samlas in
 * 2. Device-ID är ett slumpmässigt UUID som inte kan kopplas till en person
 * 3. Endast aggregerad statistik visas (aldrig individuella data)
 * 4. Data lagras anonymiserat i Redis
 */

import { localDayKey } from '@/lib/dates';

function getAnonymousDeviceId(): string {
  const storageKey = 'engelskajakten_anonymous_device_id';
  let deviceId = localStorage.getItem(storageKey);
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem(storageKey, deviceId);
  }
  return deviceId;
}

/** Lärarsidan ska inte skicka några statistikanrop alls. */
function isTeacherPage(): boolean {
  return window.location.pathname.startsWith('/larare');
}

async function trackEvent(type: 'pageview'): Promise<void> {
  try {
    if (isTeacherPage()) return;
    const deviceId = getAnonymousDeviceId();
    await fetch('/api/stats/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, deviceId }),
    });
  } catch {
    // Tyst fel – analytics ska inte påverka användarupplevelsen
  }
}

/**
 * En sidvisning per webbläsarsession (flik), inte per omladdning. Lärarvyn
 * räknar besökare som unika enheter per dag, så siffrorna där blir desamma –
 * men varje omladdning kostade förut ett anrop mot det delade Vercel-taket.
 */
const PAGEVIEW_SENT_KEY = 'engelskajakten_pageview_sent';

export function trackPageView(): void {
  if (isTeacherPage()) return;
  try {
    // Dagens datum sparas, så att en flik som står öppen över natten ändå
    // räknas som besök nästa dag.
    const today = localDayKey();
    if (sessionStorage.getItem(PAGEVIEW_SENT_KEY) === today) return;
    sessionStorage.setItem(PAGEVIEW_SENT_KEY, today);
  } catch {
    // sessionStorage avstängd: skicka som förut
  }
  trackEvent('pageview');
}

// ─── Klarade kapitel och tid, skickade i klump ────────────────────────────────
//
// Förut kostade varje klarat kapitel ett eget anrop, och tiden skickades i ett
// eget anrop var femte minut – runt tjugo anrop under en lektion. Nu samlas
// kapitlen och tiden ihop och skickas i ett enda anrop:
//   • när det äldsta osända kapitlet är tio minuter gammalt,
//   • när fliken stängs eller laddas om (sendBeacon), och
//   • efter tjugo minuter även om inget kapitel klarats, så att tiden kommer fram.
// Lärarvyn visar samma siffror, men upp till tio minuter senare.

interface QueuedTask {
  correct: boolean;
  questionType?: string;
}

const BATCH_MS = 10 * 60 * 1000;
const TIME_ONLY_MS = 20 * 60 * 1000;
/** Rapporterad tid i ett anrop, som förut. */
const MAX_SECONDS_PER_REPORT = 3600;

/**
 * Lite tid och inga kapitel när fliken laddas om: spara tiden i fliken och
 * skicka den med nästa rapport i stället för i ett eget anrop. Stängs fliken
 * förloras högst så här många sekunder.
 */
const CARRY_OVER_MAX_SECONDS = 60;
const CARRY_OVER_KEY = 'engelskajakten_unsent_seconds';

let queue: QueuedTask[] = [];
let firstQueuedAt: number | null = null;
let sessionStartTime: number | null = null;

/** Tiden sedan förra rapporten. Nollställer räkningen. */
function takeSessionSeconds(): number {
  if (!sessionStartTime) return 0;
  const seconds = Math.round((Date.now() - sessionStartTime) / 1000);
  sessionStartTime = Date.now();
  return Math.min(Math.max(seconds, 0), MAX_SECONDS_PER_REPORT);
}

/** Skickar köade kapitel och tiden sedan förra rapporten i ett anrop. */
function flush(useBeacon: boolean): void {
  if (isTeacherPage()) return;
  const timeSeconds = takeSessionSeconds();
  const tasks = queue;
  queue = [];
  firstQueuedAt = null;
  if (tasks.length === 0 && timeSeconds <= 0) return;
  if (useBeacon && tasks.length === 0 && timeSeconds < CARRY_OVER_MAX_SECONDS) {
    try {
      sessionStorage.setItem(CARRY_OVER_KEY, String(timeSeconds));
      return;
    } catch {
      // sessionStorage avstängd: skicka som vanligt
    }
  }
  try {
    const body = JSON.stringify({
      type: 'batch',
      deviceId: getAnonymousDeviceId(),
      data: { timeSeconds, tasks },
    });
    if (useBeacon && navigator.sendBeacon) {
      navigator.sendBeacon('/api/stats/track', body);
    } else {
      fetch('/api/stats/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Tyst fel – analytics ska inte påverka användarupplevelsen
  }
}

/** Ett klarat (eller misslyckat) kapitel. Skickas tillsammans med andra. */
export function trackTaskComplete(correct: boolean, questionType?: string): void {
  if (isTeacherPage()) return;
  queue.push(questionType ? { correct, questionType } : { correct });
  if (firstQueuedAt === null) firstQueuedAt = Date.now();
  else if (Date.now() - firstQueuedAt >= BATCH_MS) flush(false);
}

export function startSession(): void {
  // Lärarsidan räknar inte tid och skickar inget.
  if (isTeacherPage()) return;
  sessionStartTime = Date.now();
  // Tid som sparades vid en omladdning räknas med från början.
  try {
    const carried = Number(sessionStorage.getItem(CARRY_OVER_KEY) || 0);
    sessionStorage.removeItem(CARRY_OVER_KEY);
    if (carried > 0) sessionStartTime -= Math.min(carried, CARRY_OVER_MAX_SECONDS) * 1000;
  } catch {
    // ingen sparad tid
  }

  // beforeunload och pagehide avfyras båda när fliken stängs. Den första
  // skickar allt och nollställer, så den andra har inget kvar att skicka.
  const handleUnload = () => flush(true);
  window.addEventListener('beforeunload', handleUnload);
  window.addEventListener('pagehide', handleUnload);
  // Kommer eleven tillbaka till en flik som redan lämnat ifrån sig sin tid
  // (pagehide utan att sidan stängdes) börjar räkningen om därifrån.
  window.addEventListener('pageshow', () => {
    if (!sessionStartTime) sessionStartTime = Date.now();
  });

  // Kontrollerar varje minut, utan anrop, om det är dags att skicka. Bara
  // medan fliken syns.
  setInterval(() => {
    if (document.hidden) return;
    const now = Date.now();
    if (firstQueuedAt !== null && now - firstQueuedAt >= BATCH_MS) flush(false);
    else if (firstQueuedAt === null && sessionStartTime && now - sessionStartTime >= TIME_ONLY_MS) flush(false);
  }, 60 * 1000);
}

export interface TeacherStats {
  activeNow: number;
  visitorsToday: number;
  tasksToday: number;
  totalTimeToday: string;
  totalTimeTodaySeconds: number;
  totalErrorsToday: number;
  uniqueDevices: number;   // verkligt unika enheter, hela historiken
  totalVisitors: number;   // summa av dagliga besök senaste 14 dagarna
  totalTasks: number;
  totalTime: string;
  totalTimeSeconds: number;
  totalErrors: number;
  topErrors: { type: string; count: number }[];
  dailyStats: { date: string; visitors: number; tasks: number }[];
  gdprNote: string;
}

export async function fetchTeacherStats(password: string): Promise<TeacherStats | null> {
  const response = await fetch('/api/stats/get', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error('Fel lösenord');
    throw new Error('Kunde inte hämta statistik');
  }

  return response.json();
}
