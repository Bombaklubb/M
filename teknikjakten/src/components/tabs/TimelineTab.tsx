import { useState, useEffect } from 'react';
import { TimelineEvent } from '../../types';
import { fetchWikiImage } from '../../utils/imageCache';

export default function TimelineTab({ events, progressHex }: {
  events: TimelineEvent[];
  progressHex: string;
}) {
  const [images, setImages] = useState<Record<string, string | null>>({});
  const eventsKey = events.map(e => e.wikiTitle ?? '').join('|');

  useEffect(() => {
    let cancelled = false;
    async function fetchAll() {
      const results: Record<string, string | null> = {};
      await Promise.all(events.filter(e => e.wikiTitle).map(async e => {
        results[e.wikiTitle!] = await fetchWikiImage(e.wikiTitle!);
      }));
      if (!cancelled) setImages(results);
    }
    fetchAll();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- eventsKey speglar events; att lägga in arrayen skulle hämta bilder vid varje rendering
  }, [eventsKey]);

  return (
    <div className="relative">
      {/* Vertical line – mitt i årtalskolumnen */}
      <div className="absolute left-[36px] top-4 bottom-4 w-0.5 rounded-full" style={{ background: `${progressHex}30` }} />

      <div className="space-y-6">
        {events.map((event, i) => {
          const img = event.wikiTitle ? images[event.wikiTitle] : null;
          // Det längsta ordet avgör textstorleken, inte hela strängen: en text med
          // mellanslag bryts snyggt mellan orden, men ett långt ensamt ord som
          // "Vikingatiden" måste krympa för att inte brytas mitt itu.
          const longestWord = Math.max(...event.year.split(/\s+/).map(w => w.length));
          return (
            <div key={i} className="flex gap-4">
              {/*
                Årtalsbubbla. Texten är inte alltid ett fyrsiffrigt årtal – den kan
                lika gärna vara "Vikingatiden" eller "Slutet av 1700-talet". Texten
                krymper därför efter sin längd i stället för att brytas mitt i ordet.
              */}
              <div className="flex-shrink-0 flex flex-col items-center" style={{ width: 72 }}>
                <div
                  className="w-[72px] min-h-11 rounded-2xl flex items-center justify-center text-white font-black z-10 shadow-md px-1.5 py-1"
                  style={{
                    background: progressHex,
                    fontSize: longestWord > 10 ? '8px' : longestWord > 7 ? '9px' : '11px',
                    lineHeight: 1.2,
                    textAlign: 'center',
                    overflowWrap: 'anywhere',
                  }}
                >
                  {event.year}
                </div>
              </div>
              {/* Card */}
              <div className="flex-1 clay-card p-4 pb-3">
                <p className="font-heading font-bold text-gray-800 text-base mb-1">{event.title}</p>
                {img && (
                  <img src={img} alt={event.title} loading="lazy" width={640} height={130}
                    className="rounded-xl object-cover w-full mb-2"
                    style={{ height: '130px', objectPosition: 'center' }} />
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
