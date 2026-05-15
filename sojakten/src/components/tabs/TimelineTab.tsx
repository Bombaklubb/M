import { useState, useEffect } from 'react';
import { TimelineEvent } from '../../types';

export default function TimelineTab({ events, progressHex, inkHex, accentHex }: {
  events: TimelineEvent[];
  progressHex: string;
  inkHex: string;
  accentHex: string;
}) {
  const [images, setImages] = useState<Record<string, string | null>>({});

  useEffect(() => {
    let cancelled = false;
    async function fetchAll() {
      const results: Record<string, string | null> = {};
      await Promise.all(events.filter(e => e.wikiTitle).map(async e => {
        try {
          const res = await fetch(`https://sv.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(e.wikiTitle!)}`, { headers: { Accept: 'application/json' } });
          const data = await res.json();
          results[e.wikiTitle!] = data?.thumbnail?.source ?? null;
        } catch { results[e.wikiTitle!] = null; }
      }));
      if (!cancelled) setImages(results);
    }
    fetchAll();
    return () => { cancelled = true; };
  }, [events.map(e => e.wikiTitle).join()]);

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[22px] top-4 bottom-4 w-0.5 rounded-full" style={{ background: `${progressHex}30` }} />

      <div className="space-y-6">
        {events.map((event, i) => {
          const img = event.wikiTitle ? images[event.wikiTitle] : null;
          return (
            <div key={i} className="flex gap-4">
              {/* Year bubble */}
              <div className="flex-shrink-0 flex flex-col items-center" style={{ width: 44 }}>
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-black text-xs z-10 shadow-md"
                  style={{ background: progressHex, fontSize: '10px', lineHeight: 1.2, textAlign: 'center', padding: '2px' }}>
                  {event.year}
                </div>
              </div>
              {/* Card */}
              <div className="flex-1 clay-card p-4 pb-3">
                <p className="font-heading font-bold text-gray-800 text-base mb-1">{event.title}</p>
                {img && (
                  <img src={img} alt={event.title}
                    className="rounded-xl object-cover w-full mb-2"
                    style={{ maxHeight: '130px', objectPosition: 'center' }} />
                )}
                <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
