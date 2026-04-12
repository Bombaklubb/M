// Anonymous usage analytics — no personal data, GDPR-compliant.
// All events are aggregated server-side; no individual tracking.

const DEVICE_KEY = 'math_device_id';

function getDeviceId(): string {
  let id = localStorage.getItem(DEVICE_KEY);
  if (!id) {
    // Random ID — not tied to any person, name, or IP
    id = `d_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
    localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

async function post(body: object) {
  try {
    await fetch('/api/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    // Silently ignore — analytics must never break the app
  }
}

export function trackVisit() {
  post({ type: 'visit', deviceId: getDeviceId() });
}

export function trackHeartbeat() {
  post({ type: 'heartbeat', deviceId: getDeviceId() });
}

export function trackAnswer(topicTitle: string, correct: boolean) {
  post({ type: 'answer', topic: topicTitle, correct });
}

export function trackSessionEnd(durationSeconds: number) {
  if (durationSeconds > 5) {
    post({ type: 'session', durationSeconds });
  }
}
