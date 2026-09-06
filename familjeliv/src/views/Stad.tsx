import { choreDay, colorOf, PEOPLE } from '../data';

type Props = {
  filter: string | null;
  view: 'person' | 'vecka';
  onView: (v: 'person' | 'vecka') => void;
  onPrint: () => void;
};

export function Stad({ filter, view, onView, onPrint }: Props) {
  const person = view === 'person';
  const people = PEOPLE.filter((p) => !filter || p.name === filter);

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '16px 16px 100px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: '#111827' }}>🧹 Städschema</div>
        <button
          onClick={onPrint}
          className="press"
          style={{
            border: '3px solid #bfdbfe', background: 'linear-gradient(to bottom,#eff6ff,#dbeafe)', color: '#1d4ed8',
            fontSize: 13.5, fontWeight: 800, padding: '7px 12px 8px', borderRadius: 16, cursor: 'pointer',
            boxShadow: '0 3px 0 0 rgba(37,99,235,.2),inset 0 2px 4px 0 rgba(255,255,255,.8)',
          }}
        >
          🖨 A4
        </button>
      </div>

      <div style={{ display: 'flex', gap: 7, background: '#eef1f7', border: '3px solid #e5e7eb', borderRadius: 18, padding: 5 }}>
        <div
          onClick={() => onView('person')}
          style={{ flex: 1, textAlign: 'center', fontSize: 14, fontWeight: 800, borderRadius: 13, padding: '7px 0 8px', cursor: 'pointer', background: person ? '#fff' : 'transparent', color: person ? '#1d4ed8' : '#6b7280' }}
        >
          Per person
        </div>
        <div
          onClick={() => onView('vecka')}
          style={{ flex: 1, textAlign: 'center', fontSize: 14, fontWeight: 800, borderRadius: 13, padding: '7px 0 8px', cursor: 'pointer', background: person ? 'transparent' : '#fff', color: person ? '#6b7280' : '#1d4ed8' }}
        >
          Veckorutnät
        </div>
      </div>

      {person ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {people.map((p) => {
            const c = colorOf(p.name);
            return (
            <div
              key={p.name}
              style={{
                background: '#fff', border: '3px solid #dbeafe', borderRadius: 24, padding: '12px 14px 14px',
                boxShadow: '0 4px 0 0 rgba(37,99,235,.12),inset 0 2px 4px 0 rgba(255,255,255,.8)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 999, border: `3px solid ${c.ring}`, overflow: 'hidden', flex: 'none' }}>
                  <div style={{ width: '100%', height: '100%', background: `#eff6ff center/cover no-repeat url(${p.avatar})` }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 17, fontWeight: 900, color: c.fg, lineHeight: 1.15 }}>{p.name}</div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: '#6b7280' }}>{p.role}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {p.tasks.map((t) => (
                  <div
                    key={t.label}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f9fafb', border: '2px solid #e5e7eb', borderRadius: 14, padding: '9px 10px' }}
                  >
                    <div style={{ width: 10, height: 10, flex: 'none', borderRadius: 99, background: c.base }} />
                    <div style={{ flex: 1, minWidth: 0, fontSize: 15, fontWeight: 700, color: '#111827' }}>{t.label}</div>
                    <div style={{ fontSize: 12.5, fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', textAlign: 'right', flex: 'none' }}>{choreDay(t)}</div>
                  </div>
                ))}
              </div>
            </div>
            );
          })}
        </div>
      ) : (
        <div
          style={{
            background: '#fff', border: '3px solid #dbeafe', borderRadius: 24, padding: '12px 12px 14px',
            boxShadow: '0 4px 0 0 rgba(37,99,235,.12),inset 0 2px 4px 0 rgba(255,255,255,.8)',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '66px repeat(7,minmax(0,1fr))', gap: 4, alignItems: 'center' }}>
            <div />
            {['M', 'T', 'O', 'T', 'F', 'L', 'S'].map((d, i) => (
              <div key={i} style={{ fontSize: 11.5, fontWeight: 900, color: '#9ca3af', textAlign: 'center' }}>{d}</div>
            ))}
            {PEOPLE.map((p) => (
              <Row key={p.name} name={p.name} cells={[0, 1, 2, 3, 4, 5, 6].map((d) => p.tasks.some((t) => t.d === d || t.day === 'dagl'))} />
            ))}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#6b7280', marginTop: 10, textAlign: 'center' }}>Ifylld ruta = syssla den dagen</div>
        </div>
      )}
    </div>
  );
}

function Row({ name, cells }: { name: string; cells: boolean[] }) {
  return (
    <>
      <div style={{ fontSize: 14, fontWeight: 900, color: '#111827' }}>{name}</div>
      {cells.map((has, i) => (
        <div
          key={i}
          style={{
            aspectRatio: '1', borderRadius: 9, border: `2px solid ${has ? '#bfdbfe' : '#e5e7eb'}`,
            background: has ? '#eff6ff' : '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
          }}
        >
          {has ? '🧹' : ''}
        </div>
      ))}
    </>
  );
}
