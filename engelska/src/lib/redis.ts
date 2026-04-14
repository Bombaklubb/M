import { kv } from '@vercel/kv';

export const redis = kv;
export const KEY_PREFIX = 'engelskajakten:';

export function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export function getDateKey(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
}
