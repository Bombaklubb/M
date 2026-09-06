import type { ReactNode } from 'react';
import { PRINTS, type PrintKey } from './data';
import { Named } from './Named';
import type { Flags } from './usePersisted';

function Backdrop({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  return (
    <div
      onClick={onClose}
      style={{ position: 'absolute', inset: 0, background: 'rgba(17,24,39,.45)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'flex-end', zIndex: 30 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxHeight: '78%', overflowY: 'auto', background: '#fff', borderTop: '3px solid #bfdbfe', borderRadius: '32px 32px 0 0', padding: '16px 18px 34px', boxSizing: 'border-box' }}
      >
        <div style={{ width: 52, height: 5, borderRadius: 99, background: '#e5e7eb', margin: '0 auto 14px' }} />
        {children}
      </div>
    </div>
  );
}

export type DetailItem = { icon: string; label: string; meta: string; ride?: string; tint: string };

export function DetailSheet({ title, sub, items, onClose }: { title: string; sub: string; items: DetailItem[]; onClose: () => void }) {
  return (
    <Backdrop onClose={onClose}>
      <div style={{ fontSize: 23, fontWeight: 900, color: '#111827', lineHeight: 1.1 }}>{title}</div>
      <div style={{ fontSize: 13.5, fontWeight: 700, color: '#6b7280', marginBottom: 12 }}>{sub}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((s, i) => (
          <div key={i} style={{ display: 'flex', gap: 11, alignItems: 'flex-start', background: '#f9fafb', border: '3px solid #e5e7eb', borderRadius: 18, padding: '11px 12px' }}>
            <div style={{ width: 34, height: 34, flex: 'none', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, background: s.tint }}>{s.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#111827', lineHeight: 1.2 }}>{s.label}</div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: '#6b7280' }}>{s.meta}</div>
              {s.ride && (
                <div style={{ fontSize: 13, fontWeight: 600, color: '#6b7280', marginTop: 2 }}>
                  🚗 <Named text={s.ride} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={onClose}
        className="press"
        style={{
          width: '100%', marginTop: 14, border: '3px solid #bfdbfe', background: '#fff', fontSize: 16.5, fontWeight: 900,
          color: '#1d4ed8', borderRadius: 20, padding: '12px 0 13px', cursor: 'pointer',
          boxShadow: '0 4px 0 0 rgba(37,99,235,.18),inset 0 2px 4px 0 rgba(255,255,255,.8)',
        }}
      >
        Stäng
      </button>
    </Backdrop>
  );
}

type PrintProps = {
  sel: Flags;
  onToggle: (k: PrintKey) => void;
  orient: 'port' | 'land';
  onOrient: (o: 'port' | 'land') => void;
  onPrint: () => void;
  onPreview: () => void;
  onClose: () => void;
};

export function PrintPanel({ sel, onToggle, orient, onOrient, onPrint, onPreview, onClose }: PrintProps) {
  const port = orient === 'port';
  const count = PRINTS.filter((p) => sel[p.k]).length;

  return (
    <Backdrop onClose={onClose}>
      <div style={{ fontSize: 21, fontWeight: 900, color: '#111827' }}>Skriv ut veckan</div>
      <div style={{ fontSize: 13.5, fontWeight: 600, color: '#6b7280', marginBottom: 12 }}>Valen sparas till nästa vecka.</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {PRINTS.map((p) => {
          const on = !!sel[p.k];
          return (
            <div
              key={p.k}
              onClick={() => onToggle(p.k)}
              style={{ display: 'flex', alignItems: 'center', gap: 11, background: '#f9fafb', border: `3px solid ${on ? '#bfdbfe' : '#e5e7eb'}`, borderRadius: 18, padding: '11px 12px', cursor: 'pointer' }}
            >
              <div style={{ width: 26, height: 26, flex: 'none', borderRadius: 9, border: `3px solid ${on ? '#2563eb' : '#d1d5db'}`, background: on ? '#2563eb' : '#fff', color: '#fff', fontSize: 15, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {on ? '✓' : ''}
              </div>
              <div style={{ flex: 1, minWidth: 0, fontSize: 15.5, fontWeight: 800, color: '#111827' }}>{p.label}</div>
              <div style={{ fontSize: 19 }}>{p.icon}</div>
            </div>
          );
        })}
      </div>
      <button
        onClick={onPreview}
        className="press"
        style={{
          width: '100%', marginTop: 10, border: '3px solid #e5e7eb', background: '#fff', fontSize: 15,
          fontWeight: 800, color: '#4b5563', borderRadius: 18, padding: '10px 0 11px', cursor: 'pointer',
          boxShadow: '0 3px 0 0 rgba(17,24,39,.08),inset 0 2px 4px 0 rgba(255,255,255,.8)',
        }}
      >
        👁 Titta på veckobladet
      </button>
      <div style={{ display: 'flex', gap: 8, margin: '12px 0 14px' }}>
        <div
          onClick={() => onOrient('port')}
          style={{ flex: 1, textAlign: 'center', fontSize: 14, fontWeight: 800, borderRadius: 16, padding: '8px 0 9px', cursor: 'pointer', background: port ? '#eff6ff' : '#fff', border: `3px solid ${port ? '#bfdbfe' : '#e5e7eb'}`, color: port ? '#1d4ed8' : '#9ca3af' }}
        >
          A4 stående
        </div>
        <div
          onClick={() => onOrient('land')}
          style={{ flex: 1, textAlign: 'center', fontSize: 14, fontWeight: 800, borderRadius: 16, padding: '8px 0 9px', cursor: 'pointer', background: port ? '#fff' : '#eff6ff', border: `3px solid ${port ? '#e5e7eb' : '#bfdbfe'}`, color: port ? '#9ca3af' : '#1d4ed8' }}
        >
          A4 liggande
        </div>
      </div>
      <button
        onClick={onPrint}
        disabled={count === 0}
        className="press"
        style={{
          width: '100%', border: 'none', fontSize: 18, fontWeight: 900, color: '#fff',
          background: count ? 'linear-gradient(to bottom,#dc2626,#b91c1c)' : 'linear-gradient(to bottom,#d1d5db,#9ca3af)',
          borderRadius: 22, padding: '14px 0 15px', cursor: count ? 'pointer' : 'default',
          boxShadow: '0 4px 0 0 rgba(0,0,0,.2),0 6px 12px -2px rgba(0,0,0,.15),inset 0 2px 4px 0 rgba(255,255,255,.3)',
        }}
      >
        {count === 0 ? 'Välj minst ett blad' : `Skriv ut ${count} ${count === 1 ? 'sida' : 'sidor'} →`}
      </button>
    </Backdrop>
  );
}

/** Visar ett utskriftsblad nedskalat i appen, precis som det kommer ut på papper. */
export function SheetPreview({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  const s = 0.72;
  return (
    <div
      onClick={onClose}
      style={{ position: 'absolute', inset: 0, zIndex: 40, background: 'rgba(17,24,39,.6)', backdropFilter: 'blur(2px)', overflowY: 'auto', padding: '18px 0 26px' }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ width: 496 * s, height: 701 * s, margin: '0 auto', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, transform: `scale(${s})`, transformOrigin: 'top left', boxShadow: '0 12px 30px rgba(0,0,0,.35)' }}>
          {children}
        </div>
      </div>
      <button
        onClick={onClose}
        className="press"
        style={{
          display: 'block', width: 496 * s, margin: '14px auto 0', border: '3px solid #bfdbfe', background: '#fff',
          fontSize: 16, fontWeight: 900, color: '#1d4ed8', borderRadius: 20, padding: '11px 0 12px', cursor: 'pointer',
          boxShadow: '0 4px 0 0 rgba(37,99,235,.18),inset 0 2px 4px 0 rgba(255,255,255,.8)',
        }}
      >
        Stäng
      </button>
    </div>
  );
}
