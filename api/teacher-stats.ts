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
    // Get all usage entries from today
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const todayKey = `usage:${today}`;

    const todayEntries: UsageEntry[] = (await kv.get(todayKey)) || [];
    const totalCount: number = (await kv.get('usage:total')) || 0;

    // Calculate stats
    const topicsMap = new Map<string, number>();
    const levelsMap = new Map<number, number>();
    const hourlyMap = new Map<number, number>();

    // Initialize hourly map with 24 hours
    for (let i = 0; i < 24; i++) {
      hourlyMap.set(i, 0);
    }

    todayEntries.forEach((entry) => {
      // Count topics
      topicsMap.set(entry.topic, (topicsMap.get(entry.topic) || 0) + 1);

      // Count levels
      levelsMap.set(entry.level, (levelsMap.get(entry.level) || 0) + 1);

      // Count hourly
      const hour = new Date(entry.timestamp).getHours();
      hourlyMap.set(hour, (hourlyMap.get(hour) || 0) + 1);
    });

    // Sort and get top topics
    const topTopics = Array.from(topicsMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic, count]) => ({ topic, count }));

    // Sort and get top levels
    const topLevels = Array.from(levelsMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([level, count]) => ({ level, count }));

    // Convert hourly map to array
    const hourlyUsage = Array.from(hourlyMap.entries())
      .map(([hour, count]) => ({ hour, count }));

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
