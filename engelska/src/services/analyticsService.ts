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

function getAnonymousDeviceId(): string {
  const storageKey = 'engelskajakten_anonymous_device_id';
  let deviceId = localStorage.getItem(storageKey);
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem(storageKey, deviceId);
  }
  return deviceId;
}

async function trackEvent(
  type: 'pageview' | 'task_complete' | 'error' | 'session_time',
  data?: {
    questionType?: string;
    timeSeconds?: number;
    correct?: boolean;
  }
): Promise<void> {
  try {
    const deviceId = getAnonymousDeviceId();
    await fetch('/api/stats/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, deviceId, data }),
    });
  } catch {
    // Tyst fel – analytics ska inte påverka användarupplevelsen
  }
}

export function trackPageView(): void {
  trackEvent('pageview');
}

export function trackTaskComplete(correct: boolean, questionType?: string): void {
  trackEvent('task_complete', { correct, questionType });
}

export function trackSessionTime(seconds: number): void {
  if (seconds > 0) {
    trackEvent('session_time', { timeSeconds: seconds });
  }
}

// Session-tid tracker
let sessionStartTime: number | null = null;

export function startSession(): void {
  sessionStartTime = Date.now();

  const handleUnload = () => {
    if (sessionStartTime) {
      const seconds = Math.round((Date.now() - sessionStartTime) / 1000);
      if (navigator.sendBeacon) {
        const deviceId = getAnonymousDeviceId();
        const data = JSON.stringify({
          type: 'session_time',
          deviceId,
          data: { timeSeconds: Math.min(seconds, 3600) },
        });
        navigator.sendBeacon('/api/stats/track', data);
      }
    }
  };

  window.addEventListener('beforeunload', handleUnload);
  window.addEventListener('pagehide', handleUnload);

  // Skicka tid var 5:e minut för långa sessioner
  setInterval(() => {
    if (sessionStartTime) {
      const seconds = Math.round((Date.now() - sessionStartTime) / 1000);
      trackSessionTime(seconds);
      sessionStartTime = Date.now();
    }
  }, 5 * 60 * 1000);
}

export interface TeacherStats {
  activeNow: number;
  visitorsToday: number;
  tasksToday: number;
  totalTimeToday: string;
  totalTimeTodaySeconds: number;
  totalErrorsToday: number;
  totalVisitors: number;
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
