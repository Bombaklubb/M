import { Fragment } from 'react';
import { BUYS, colorOf, MEALS, SLOT_LABEL } from '../data';
import type { Flags } from '../usePersisted';

type Props = {
  bought: Flags;
  onToggleBuy: (item: string) => void;
  onPrint: () => void;
};

export function Mat({ bought, onToggleBuy, onPrint }: Props) {
  const left = BUYS.filter((b) => !bought[b]).length;

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '16px 16px 100px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: '#111827' }}>🍽 Matschema</div>
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

      {MEALS.map((m) => (
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
            <div style={{ fontSize: 12, fontWeight: 800, color: '#9ca3af' }}>{m.date}</div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {MEALS.filter((x) => x.day === m.day).length > 1 && (
              <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: '.05em', textTransform: 'uppercase', color: '#9ca3af', lineHeight: 1.2 }}>
                {SLOT_LABEL[m.slot]}
              </div>
            )}
            <div style={{ fontSize: 17, fontWeight: 800, color: '#111827', lineHeight: 1.2 }}>{m.dish}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#6b7280' }}>
              {m.cook ? (
                <>
                  {/* Två ansvariga ska få var sin färg: "Astrid & Signe". */}
                  {m.cook.split(' & ').map((name, k) => (
                    <Fragment key={name}>
                      {k > 0 && ' & '}
                      <span style={{ fontWeight: 800, color: colorOf(name).fg }}>{name}</span>
                    </Fragment>
                  ))} lagar · {m.when}
                </>
              ) : (
                <>Flexibelt · {m.when}</>
              )}
            </div>
          </div>
          <div style={{ fontSize: 20 }}>{m.emoji}</div>
        </div>
      ))}

      <div
        style={{
          background: '#fff', border: '3px solid #bfdbfe', borderRadius: 24, padding: '13px 15px 15px',
          boxShadow: '0 4px 0 0 rgba(37,99,235,.12),inset 0 2px 4px 0 rgba(255,255,255,.8)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}>
          <div style={{ fontSize: 17, fontWeight: 900, color: '#111827' }}>🛒 Inköpslista</div>
          <div style={{ fontSize: 12.5, fontWeight: 800, color: '#1d4ed8', background: '#eff6ff', border: '2px solid #bfdbfe', borderRadius: 999, padding: '3px 10px 4px' }}>
            {left} kvar
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {BUYS.map((b) => {
            const on = !!bought[b];
            return (
              <div
                key={b}
                onClick={() => onToggleBuy(b)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, background: on ? '#ecfdf5' : '#f9fafb',
                  border: `2px solid ${on ? '#a7f3d0' : '#e5e7eb'}`, borderRadius: 999, padding: '6px 12px 7px',
                  cursor: 'pointer', fontSize: 14, fontWeight: 700, color: on ? '#9ca3af' : '#111827',
                  textDecoration: on ? 'line-through' : 'none',
                }}
              >
                {b}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
