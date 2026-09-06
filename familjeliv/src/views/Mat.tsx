import { colorOf, MEALS, SLOT_LABEL } from '../data';

type Props = { onPrint: () => void };

export function Mat({ onPrint }: Props) {
  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '16px 16px 100px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: '#111827' }}>🍽 Matansvar</div>
        <button
          onClick={onPrint}
          className="press"
          style={{
            border: '3px solid #fde68a', background: 'linear-gradient(to bottom,#fffbeb,#fef3c7)', color: '#b45309',
            fontSize: 13.5, fontWeight: 800, padding: '7px 12px 8px', borderRadius: 16, cursor: 'pointer',
            boxShadow: '0 3px 0 0 rgba(245,158,11,.25),inset 0 2px 4px 0 rgba(255,255,255,.8)',
          }}
        >
          🖨 A4
        </button>
      </div>

      {MEALS.map((m) => {
        const c = m.cook ? colorOf(m.cook) : null;
        return (
          <div
            key={`${m.day}-${m.slot}`}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, background: '#fff', border: '3px solid #dbeafe',
              borderRadius: 22, padding: '12px 14px',
              boxShadow: '0 4px 0 0 rgba(37,99,235,.12),inset 0 2px 4px 0 rgba(255,255,255,.8)',
            }}
          >
            <div style={{ width: 46, flex: 'none', textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 900, textTransform: 'uppercase', color: '#1d4ed8' }}>{m.day}</div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 900, letterSpacing: '.05em', textTransform: 'uppercase', color: '#9ca3af', lineHeight: 1.2 }}>
                {SLOT_LABEL[m.slot]}
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, color: c ? c.fg : '#6b7280', lineHeight: 1.2 }}>
                {m.cook ?? 'Flexibelt'}
              </div>
            </div>
            {c && <div style={{ width: 14, height: 14, borderRadius: 99, background: c.base, flex: 'none' }} />}
          </div>
        );
      })}
    </div>
  );
}
