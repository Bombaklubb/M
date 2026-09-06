import { CAL_MARK, DATES, MONTH_LABEL } from '../data';

export function Datum() {
  const cells = [
    { num: '', dot: '', bg: 'transparent', border: 'transparent', fg: '#9ca3af' },
    ...Array.from({ length: 30 }, (_, i) => {
      const d = i + 1;
      const mark = CAL_MARK[d];
      return {
        num: String(d), dot: mark ?? '',
        bg: mark ? '#f0f4ff' : '#fff',
        border: mark ? '#c7d7fe' : '#e5e7eb',
        fg: mark ? '#312e81' : '#6b7280',
      };
    }),
  ];

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '16px 16px 100px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontSize: 22, fontWeight: 900, color: '#111827' }}>📅 Viktiga datum</div>

      <div
        style={{
          background: '#fff', border: '3px solid #e0e8ff', borderRadius: 24, padding: '13px 13px 15px',
          boxShadow: '0 4px 0 0 rgba(79,70,229,.12),inset 0 2px 4px 0 rgba(255,255,255,.8)',
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 900, color: '#312e81', marginBottom: 9 }}>{MONTH_LABEL}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,minmax(0,1fr))', gap: 5 }}>
          {cells.map((c, i) => (
            <div
              key={i}
              style={{
                aspectRatio: '1', borderRadius: 11, border: `2px solid ${c.border}`, background: c.bg,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 800, color: c.fg, lineHeight: 1 }}>{c.num}</div>
              <div style={{ fontSize: 9, lineHeight: 1 }}>{c.dot}</div>
            </div>
          ))}
        </div>
      </div>

      {DATES.map((d, i) => (
        <div
          key={i}
          style={{
            display: 'flex', gap: 12, alignItems: 'center', background: '#fff', border: '3px solid #e0e8ff',
            borderRadius: 22, padding: '11px 14px',
            boxShadow: '0 4px 0 0 rgba(79,70,229,.12),inset 0 2px 4px 0 rgba(255,255,255,.8)',
          }}
        >
          <div style={{ width: 46, flex: 'none', textAlign: 'center', background: '#f0f4ff', borderRadius: 14, padding: '6px 0 7px' }}>
            <div style={{ fontSize: 19, fontWeight: 900, color: '#4338ca', lineHeight: 1 }}>{d.num}</div>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: '#6366f1', textTransform: 'uppercase' }}>{d.mon}</div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16.5, fontWeight: 800, color: '#111827', lineHeight: 1.2, textWrap: 'pretty' }}>{d.title}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#6b7280' }}>{d.meta}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
