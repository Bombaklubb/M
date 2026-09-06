import { useEffect, useState } from 'react';
import { colorOf, dayItems, FAMILY_GRADIENT, forPerson, MEMBERS, TABS, TINT, weekDays, weekLabel, type Day, type PrintKey, type TabId } from './data';
import { PrintSheets, WeekSheet } from './PrintSheets';
import { DetailSheet, PrintPanel, SheetPreview, type DetailItem } from './Sheets';
import { toggle, usePersisted, type Flags } from './usePersisted';
import { Hem } from './views/Hem';
import { Mat } from './views/Mat';
import { Stad } from './views/Stad';
import { Tran } from './views/Tran';

type SheetState = null | { type: 'day'; i: number } | { type: 'print' };

export default function App() {
  const [tab, setTab] = useState<TabId>('hem');
  const [filter, setFilter] = useState<string | null>(null);
  const [sheet, setSheet] = useState<SheetState>(null);
  const [selStored, setSel] = usePersisted<Flags>('print-sel', { vecka: true, mat: true, stad: true, tran: true, dat: false });
  const [orient, setOrient] = usePersisted<'port' | 'land'>('orient', 'port');
  const [preview, setPreview] = useState(false);

  // Tavlan kan stå framme dygnet runt: håll koll på datumet så "idag"
  // flyttar sig vid midnatt utan att någon behöver ladda om.
  const [idag, setIdag] = useState(() => new Date().toDateString());
  useEffect(() => {
    const id = setInterval(() => {
      const nu = new Date().toDateString();
      setIdag((förra) => (förra === nu ? förra : nu));
    }, 60_000);
    return () => clearInterval(id);
  }, []);
  const days = weekDays(new Date(idag));

  // Veckobladet kom till efteråt: sparade val utan det ska ändå få det påslaget.
  const sel = { vecka: true, ...selStored };

  /** Rubriken är vägen hem: tillbaka till veckotavlan och stäng det som är öppet. */
  const goHome = () => {
    setTab('hem');
    setSheet(null);
    setPreview(false);
  };

  const openPrint = () => setSheet({ type: 'print' });
  const closeSheet = () => setSheet(null);

  const print = () => {
    setSheet(null);
    requestAnimationFrame(() => window.print());
  };

  const detail = buildDetail(sheet, filter, days);

  return (
    <>
      <div className="app-shell">
        <div
          style={{
            padding: 'calc(env(safe-area-inset-top, 0px) + 16px) 16px 12px',
            background: FAMILY_GRADIENT,
            color: '#fff', flex: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              onClick={goHome}
              className="press"
              title="Till startsidan"
              style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}
            >
              <div style={{ fontSize: 12, fontWeight: 800, opacity: .8, letterSpacing: '.08em', textTransform: 'uppercase' }}>{weekLabel(new Date(idag))}</div>
              <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-.02em', lineHeight: 1.1, textShadow: '0 2px 4px rgba(0,0,0,.3)' }}>Familjeliv</div>
            </div>
            <button
              onClick={openPrint}
              className="press"
              style={{
                display: 'flex', alignItems: 'center', gap: 6, border: '3px solid rgba(255,255,255,.55)',
                background: 'rgba(255,255,255,.18)', backdropFilter: 'blur(6px)', color: '#fff', fontSize: 14,
                fontWeight: 800, padding: '9px 13px 10px', borderRadius: 20, cursor: 'pointer',
                boxShadow: '0 4px 0 0 rgba(0,0,0,.2),inset 0 2px 4px 0 rgba(255,255,255,.3)',
              }}
            >
              🖨 Skriv ut
            </button>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 11 }}>
            {MEMBERS.map((m) => (
              <div
                key={m.name}
                onClick={() => setFilter(filter === m.name ? null : m.name)}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, cursor: 'pointer', opacity: !filter || filter === m.name ? 1 : 0.42 }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 999, border: `3px solid ${filter === m.name ? '#ffffff' : colorOf(m.name).ring}`, overflow: 'hidden', background: '#fff', boxShadow: '0 3px 0 0 rgba(0,0,0,.18)' }}>
                  <div style={{ width: '100%', height: '100%', background: `#eff6ff center/cover no-repeat url(${m.avatar})` }} />
                </div>
                <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: '.01em' }}>{m.short}</div>
              </div>
            ))}
          </div>
        </div>

        {filter && (
          <div
            onClick={() => setFilter(null)}
            style={{ flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#eff6ff', borderBottom: '3px solid #bfdbfe', padding: '8px 0 9px', fontSize: 14, fontWeight: 800, color: '#1d4ed8', cursor: 'pointer' }}
          >
            Visar bara {filter} · tryck för att visa alla ✕
          </div>
        )}

        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          {tab === 'hem' && <Hem days={days} filter={filter} onOpenDay={(i) => setSheet({ type: 'day', i })} />}
          {tab === 'mat' && <Mat onPrint={openPrint} />}
          {tab === 'stad' && <Stad filter={filter} onPrint={openPrint} />}
          {tab === 'tran' && <Tran filter={filter} onPrint={openPrint} />}

          <div
            style={{
              position: 'absolute', left: 0, right: 0, bottom: 0, display: 'flex', gap: 2,
              padding: '9px 8px calc(env(safe-area-inset-bottom, 0px) + 12px)',
              background: 'rgba(255,255,255,.93)', backdropFilter: 'blur(10px)', borderTop: '3px solid #dbeafe',
            }}
          >
            {TABS.map((tb) => (
              <div
                key={tb.id}
                onClick={() => { setTab(tb.id); setSheet(null); }}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '6px 0 4px', borderRadius: 16, cursor: 'pointer', background: tb.id === tab ? '#eff6ff' : 'transparent' }}
              >
                <div style={{ fontSize: 19 }}>{tb.icon}</div>
                <div style={{ fontSize: 11.5, fontWeight: 800, color: tb.id === tab ? '#1d4ed8' : '#9ca3af' }}>{tb.label}</div>
              </div>
            ))}
          </div>

          {detail && <DetailSheet title={detail.title} sub={detail.sub} items={detail.items} onClose={closeSheet} />}

          {sheet?.type === 'print' && (
            <PrintPanel
              sel={sel}
              onToggle={(k: PrintKey) => setSel(() => toggle(sel, k))}
              orient={orient}
              onOrient={setOrient}
              onPrint={print}
              onPreview={() => setPreview(true)}
              onClose={closeSheet}
            />
          )}

          {preview && (
            <SheetPreview onClose={() => setPreview(false)}>
              <WeekSheet />
            </SheetPreview>
          )}
        </div>
      </div>

      <PrintSheets sel={sel} orient={orient} />
    </>
  );
}

function buildDetail(sheet: SheetState, filter: string | null, days: Day[]): { title: string; sub: string; items: DetailItem[] } | null {
  if (!sheet || sheet.type === 'print') return null;

  if (sheet.type === 'day') {
    const d = days[sheet.i];
    const items = dayItems(d, filter).filter((it) => forPerson(it.p, filter));
    return {
      title: `${d.long} ${d.date}`,
      sub: `${items.length} saker på tavlan`,
      items: items.map((it) => ({ icon: it.icon, label: it.label, meta: it.meta, ride: it.ride, tint: TINT[it.k] })),
    };
  }

  return null;
}
