import { DAYS, dayItems, forPerson, TINT } from '../data';

type Props = { filter: string | null; onOpenDay: (i: number) => void };

export function Hem({ filter, onOpenDay }: Props) {
  return (
    <div
      style={{
        height: '100%', display: 'flex', gap: 12, overflowX: 'auto',
        padding: '14px 16px 100px', scrollSnapType: 'x mandatory', boxSizing: 'border-box',
      }}
    >
      {DAYS.map((d, i) => {
        const items = dayItems(d).filter((it) => forPerson(it.p, filter));
        return (
          <div
            key={d.name}
            onClick={() => onOpenDay(i)}
            style={{
              flex: 'none', width: 178, scrollSnapAlign: 'start', display: 'flex', flexDirection: 'column',
              gap: 8, background: '#fff', border: `3px solid ${d.today ? '#1d4ed8' : '#dbeafe'}`,
              borderRadius: 24, padding: '12px 11px', cursor: 'pointer',
              boxShadow: '0 4px 0 0 rgba(37,99,235,.12),0 8px 16px -4px rgba(37,99,235,.08),inset 0 2px 4px 0 rgba(255,255,255,.8)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 16, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.04em', color: d.today ? '#1d4ed8' : '#111827' }}>
                {d.name}
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#9ca3af' }}>{d.date}</div>
            </div>
            {items.map((it, j) => (
              <div
                key={j}
                style={{
                  display: 'flex', gap: 8, alignItems: 'flex-start', background: '#f9fafb',
                  border: '2px solid #e5e7eb', borderRadius: 14, padding: '8px 9px',
                }}
              >
                <div style={{ width: 26, height: 26, flex: 'none', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, background: TINT[it.k] }}>
                  {it.icon}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', lineHeight: 1.2, textWrap: 'pretty' }}>{it.label}</div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: '#6b7280', lineHeight: 1.25 }}>{it.meta}</div>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div style={{ fontSize: 12.5, fontWeight: 800, color: '#9ca3af', textAlign: 'center', paddingTop: 2 }}>Inget inplanerat</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
