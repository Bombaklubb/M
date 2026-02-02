import { kv } from '@vercel/kv';

interface UsageEntry {
  timestamp: number;
  topic: string;
  level: number;
  textType: string;
}

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get all usage entries from today (for hourly stats)
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const todayKey = `usage:${today}`;

    const todayEntries: UsageEntry[] = (await kv.get(todayKey)) || [];
    const totalCount: number = (await kv.get('usage:total')) || 0;

    // Calculate hourly stats (today only)
    const hourlyMap = new Map<number, number>();

    // Initialize hourly map with 24 hours
    for (let i = 0; i < 24; i++) {
      hourlyMap.set(i, 0);
    }

    todayEntries.forEach((entry) => {
      // Count hourly
      const hour = new Date(entry.timestamp).getHours();
      hourlyMap.set(hour, (hourlyMap.get(hour) || 0) + 1);
    });

    // Convert hourly map to array
    const hourlyUsage = Array.from(hourlyMap.entries())
      .map(([hour, count]) => ({ hour, count }));

    // Get all-time topic stats from KV
    const allTopics = [
      'Djur & Natur',
      'Rymden',
      'Sport & Fritid',
      'Historia & Forntiden',
      'Vetenskap',
      'Äventyr & Spänning',
      '🎲 Slumpa fram en text',
      'Sverige & Världen',
      'Fantasy'
    ];

    const topicsWithCounts = await Promise.all(
      allTopics.map(async (topic) => {
        const count = (await kv.get(`stats:topic:${topic}`)) || 0;
        return { topic, count: Number(count) };
      })
    );

    // Sort and get top 5 topics
    const topTopics = topicsWithCounts
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Get all-time level stats from KV (levels 1-20)
    const allLevels = Array.from({ length: 20 }, (_, i) => i + 1);

    const levelsWithCounts = await Promise.all(
      allLevels.map(async (level) => {
        const count = (await kv.get(`stats:level:${level}`)) || 0;
        return { level, count: Number(count) };
      })
    );

    // Sort and get top 8 levels
    const topLevels = levelsWithCounts
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    return res.status(200).json({
      today: todayEntries.length,
      total: totalCount,
      topTopics,
      topLevels,
      hourlyUsage,
    });
  } catch (error: any) {
    console.error('[TEACHER STATS ERROR]', error);
    return res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Kunde inte hämta statistik',
    });
  }
}
