import {
  BUYS, CAL_MARK, CHORE_FOOTER, DATES, FAMILY_KIDS, FAMILY_PARENTS, MEALS, MONTH_LABEL,
  PEOPLE, TRAININGS, TRAINING_FOOTER, WEEK_LONG,
} from './data';
import type { Flags } from './usePersisted';

const A4_W = 793.7;
const A4_H = 1122.5;
const SHEET_W = 496;
const SHEET_H = 701;

type Props = { sel: Flags; orient: 'port' | 'land'; bought: Flags };

export function PrintSheets({ sel, orient, bought }: Props) {
  const port = orient === 'port';
  const vars = {
    '--page-w': `${port ? A4_W : A4_H}px`,
    '--page-h': `${port ? A4_H : A4_W}px`,
    '--print-scale': String((port ? A4_W / SHEET_W : A4_W / SHEET_H).toFixed(4)),
  } as React.CSSProperties;

  return (
    <div className="print-root" style={vars}>
      <style>{`@page { size: A4 ${port ? 'portrait' : 'landscape'}; margin: 0; }`}</style>
      {sel.mat && <Page><MealSheet bought={bought} /></Page>}
      {sel.stad && <Page><ChoreSheet /></Page>}
      {sel.tran && <Page><TrainingSheet /></Page>}
      {sel.dat && <Page><DateSheet /></Page>}
    </div>
  );
}

function Page({ children }: { children: React.ReactNode }) {
  return <div className="page">{children}</div>;
}

function Head({ title, sub, right }: { title: string; sub: string; right: string }) {
  return (
    <div className="shead">
      <div>
        <div className="sh1">{title}</div>
        <div className="sh2">{sub}</div>
      </div>
      <div className="sh2" style={{ fontWeight: 800 }}>{right}</div>
    </div>
  );
}

function Foot({ left }: { left: string }) {
  return (
    <div className="sfoot">
      <span>{left}</span>
      <span>Familjetavlan</span>
    </div>
  );
}

function MealSheet({ bought }: { bought: Flags }) {
  const left = BUYS.filter((b) => !bought[b]).map((b) => b.toLowerCase());
  return (
    <div className="sheet">
      <Head title="Matschema" sub={WEEK_LONG} right={FAMILY_PARENTS} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: 6 }}>
        {MEALS.map((m) => (
          <div className="srow" key={m.day}>
            <div className="sk">{m.sheetDay}</div>
            <div style={{ flex: 1 }}>
              <div className="st">{m.dish}</div>
              <div className="sm">{m.printNote ?? m.who}</div>
            </div>
          </div>
        ))}
      </div>
      <Foot left={left.length ? `Handla: ${left.join(', ')}` : 'Allt är inhandlat'} />
    </div>
  );
}

function ChoreSheet() {
  return (
    <div className="sheet">
      <Head title="Städschema" sub="Vecka 37 · kryssa av när det är klart" right="Familjen" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 10, marginTop: 12 }}>
        {PEOPLE.map((p) => (
          <div className="pers" key={p.name}>
            <div className="pnm">
              {p.name}
              {/\d+\s*år/.test(p.role) && <span> · {p.role}</span>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {p.tasks.map((t, i) => (
                <div className="ptask" key={i}>
                  <span className="box" />
                  {t.label} — {t.day}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Foot left={CHORE_FOOTER} />
    </div>
  );
}

function TrainingSheet() {
  return (
    <div className="sheet">
      <Head title="Träningar" sub="Vecka 37 · tider, plats och skjuts" right={FAMILY_KIDS} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: 6 }}>
        {TRAININGS.map((t, i) => (
          <div className="srow" key={i}>
            <div className="sk">{t.sheetDay}</div>
            <div style={{ flex: 1 }}>
              <div className="st">{t.sheet.title}</div>
              <div className="sm">{t.sheet.meta}</div>
            </div>
          </div>
        ))}
      </div>
      <Foot left={TRAINING_FOOTER} />
    </div>
  );
}

function DateSheet() {
  const cells = [null, ...Array.from({ length: 30 }, (_, i) => i + 1)];
  return (
    <div className="sheet">
      <Head title="Viktiga datum" sub={`${MONTH_LABEL} · månadsöversikt`} right="Familjen" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, margin: '14px 0 6px' }}>
        {['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'].map((d) => (
          <div key={d} style={{ fontSize: 12, fontWeight: 900, color: '#4b5563', textAlign: 'center', textTransform: 'uppercase' }}>{d}</div>
        ))}
        {cells.map((d, i) => (
          <div
            key={i}
            style={{
              height: 50, border: d ? '1px solid #9ca3af' : 'none', borderRadius: 6, padding: '3px 4px',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box',
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 800, color: '#111827' }}>{d ?? ''}</div>
            <div style={{ fontSize: 13, textAlign: 'right' }}>{d ? CAL_MARK[d] ?? '' : ''}</div>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {DATES.map((d, i) => (
          <div className="srow" key={i}>
            <div className="sk">{d.num} {d.mon}</div>
            <div style={{ flex: 1 }}>
              <div className="st">{d.title}</div>
              <div className="sm">{d.meta}</div>
            </div>
          </div>
        ))}
      </div>
      <Foot left="🤸 träning · 📅 möte · 🎂 födelsedag" />
    </div>
  );
}
