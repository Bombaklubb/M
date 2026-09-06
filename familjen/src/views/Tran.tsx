import { TC, TRAININGS } from '../data';

type Props = { filter: string | null; onOpenTraining: (i: number) => void; onPrint: () => void };

export function Tran({ filter, onOpenTraining, onPrint }: Props) {
  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '16px 16px 100px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: '#111827' }}>🤸 Träningar</div>
        <button
          onClick={onPrint}
          className="press"
          style={{
            border: '3px solid #fecdd3', background: 'linear-gradient(to bottom,#fff1f2,#ffe4e6)', color: '#be123c',
            fontSize: 13.5, fontWeight: 800, padding: '7px 12px 8px', borderRadius: 16, cursor: 'pointer',
            boxShadow: '0 3px 0 0 rgba(225,29,72,.2),inset 0 2px 4px 0 rgba(255,255,255,.8)',
          }}
        >
          🖨 A4
        </button>
      </div>

      {TRAININGS.map((t, i) => {
        if (filter && !t.who.includes(filter)) return null;
        const c = TC[t.c];
        return (
          <div
            key={i}
            onClick={() => onOpenTraining(i)}
            style={{
              display: 'flex', gap: 12, background: '#fff', border: `3px solid ${c.border}`, borderRadius: 24,
              padding: '13px 14px', cursor: 'pointer',
              boxShadow: '0 4px 0 0 rgba(225,29,72,.12),inset 0 2px 4px 0 rgba(255,255,255,.8)',
            }}
          >
            <div style={{ width: 58, flex: 'none', textAlign: 'center', background: c.tint, borderRadius: 16, padding: '8px 0 9px' }}>
              <div style={{ fontSize: 13, fontWeight: 900, textTransform: 'uppercase', color: c.fg }}>{t.day}</div>
              <div style={{ fontSize: 17, fontWeight: 900, color: c.fg, lineHeight: 1.1 }}>{t.time}</div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 17, fontWeight: 900, color: '#111827', lineHeight: 1.2 }}>{t.title}</div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: '#4b5563' }}>{t.place}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: c.fg, marginTop: 3 }}>{t.who}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
