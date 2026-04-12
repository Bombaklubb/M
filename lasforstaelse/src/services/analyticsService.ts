/**
 * GDPR-SÄKRAD ANALYTICS SERVICE
 *
 * Denna service spårar anonym, aggregerad statistik utan personlig data.
 *
 * GDPR-PRINCIPER:
 * 1. INGEN personlig data samlas in
 * 2. Device-ID är ett slumpmässigt UUID som inte kan kopplas till en person
 * 3. Endast aggregerad statistik visas (aldrig individuella data)
 * 4. Data lagras anonymiserat i Redis
 */

// Generera eller hämta anonymt device-ID
function getAnonymousDeviceId(): string {
  const storageKey = 'lasjakten_anonymous_device_id';
  let deviceId = localStorage.getItem(storageKey);

  if (!deviceId) {
    // Generera nytt slumpmässigt UUID (ingen personlig info)
    deviceId = crypto.randomUUID();
    localStorage.setItem(storageKey, deviceId);
  }

  return deviceId;
}

// Skicka tracking-event till API
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
      body: JSON.stringify({
        type,
        deviceId,
        data,
      }),
    });
  } catch (error) {
    // Tyst fel - analytics ska inte påverka användarupplevelsen
    console.debug('Analytics tracking failed:', error);
  }
}

// Spåra sidvisning (kallas vid app-start)
export function trackPageView(): void {
  trackEvent('pageview');
}

// Spåra avslutad uppgift
export function trackTaskComplete(correct: boolean, questionType?: string): void {
  trackEvent('task_complete', { correct, questionType });
}

// Spåra sessionstid (kallas vid avslut eller regelbundet)
export function trackSessionTime(seconds: number): void {
  if (seconds > 0) {
    trackEvent('session_time', { timeSeconds: seconds });
  }
}

// Spåra specifikt fel-typ
export function trackError(questionType: string): void {
  trackEvent('error', { questionType });
}

// Session-tid tracker
let sessionStartTime: number | null = null;

export function startSession(): void {
  sessionStartTime = Date.now();

  // Skicka tid när användaren lämnar sidan
  const handleUnload = () => {
    if (sessionStartTime) {
      const seconds = Math.round((Date.now() - sessionStartTime) / 1000);
      // Använd sendBeacon för att garantera att data skickas
      if (navigator.sendBeacon) {
        const data = JSON.stringify({
          type: 'session_time',
          deviceId: getAnonymousDeviceId(),
          data: { timeSeconds: Math.min(seconds, 3600) }, // Max 1 timme
        });
        navigator.sendBeacon('/api/stats/track', data);
      }
    }
  };

  window.addEventListener('beforeunload', handleUnload);
  window.addEventListener('pagehide', handleUnload);

  // Skicka tid var 5:e minut (för långa sessioner)
  setInterval(() => {
    if (sessionStartTime) {
      const seconds = Math.round((Date.now() - sessionStartTime) / 1000);
      trackSessionTime(seconds);
      sessionStartTime = Date.now(); // Återställ för nästa intervall
    }
  }, 5 * 60 * 1000);
}

// Hämta statistik (för lärarvy)
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
  try {
    const response = await fetch('/api/stats/get', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Fel lösenord');
      }
      throw new Error('Kunde inte hämta statistik');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch teacher stats:', error);
    throw error;
  }
}
