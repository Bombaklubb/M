import { Fragment, type ReactNode } from 'react';
import {
  BUYS, CAL_MARK, CHORE_FOOTER, colorOf, DAILY_CHORES, DATES, FAMILY_KIDS, FAMILY_PARENTS,
  MEALS, mealWho, MEMBERS, MONTH_LABEL, PEOPLE, PERSON_COLOR, SLOT_LABEL, TRAININGS,
  TRAINING_FOOTER, WEEK_LONG, weekRows,
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
      {sel.vecka && <Page><WeekSheet /></Page>}
      {sel.mat && <Page><MealSheet bought={bought} /></Page>}
      {sel.stad && <Page><ChoreSheet /></Page>}
      {sel.tran && <Page><TrainingSheet /></Page>}
      {sel.dat && <Page><DateSheet /></Page>}
    </div>
  );
}

const FAMILY = MEMBERS.map((m) => m.name);
const NAME_RE = new RegExp(`\\b(${Object.keys(PERSON_COLOR).join('|')})\\b`, 'g');

/**
 * Skriver ut en text där familjens namn får sin egen färg. Samma färgkod som i
 * appen, så den som läser bladet på kylskåpet hittar sitt namn direkt.
 */
function Named({ text }: { text: string }) {
  return (
    <>
      {text.split(NAME_RE).map((part, i) =>
        FAMILY.includes(part)
          ? <span key={i} style={{ color: colorOf(part).fg, fontWeight: 800 }}>{part}</span>
          : <Fragment key={i}>{part}</Fragment>,
      )}
    </>
  );
}

/** Ramen som alla blad delar: kant, rundade hörn och familjebandet överst. */
function Sheet({ children }: { children: ReactNode }) {
  return (
    <div className="sheet">
      <div className="sheet-frame">
        <div className="sheet-ribbon">
          {FAMILY.map((name) => <span key={name} style={{ background: colorOf(name).base }} />)}
        </div>
        <div className="sheet-body">{children}</div>
      </div>
    </div>
  );
}

/** Färgnyckeln: prickar med namn, så koden går att läsa utan appen. */
function Legend() {
  return (
    <div style={{ display: 'flex', gap: 11, alignItems: 'center', flexWrap: 'wrap', padding: '9px 0 8px' }}>
      {FAMILY.map((name) => (
        <span key={name} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10.5, fontWeight: 800, color: colorOf(name).fg }}>
          <span style={{ width: 8, height: 8, borderRadius: 99, background: colorOf(name).base }} />
          {name}
        </span>
      ))}
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
      <span><Named text={left} /></span>
      <span>Familjeliv</span>
    </div>
  );
}

/**
 * Veckobladet: en rad per dag med träning, middag och vem som gör vad.
 * Kylskåpslappen — den som sätts upp en gång och gäller veckan ut.
 */
export function WeekSheet() {
  const rows = weekRows();
  const cell = (weekend: boolean): React.CSSProperties => ({
    borderBottom: '1px solid #d1d5db',
    background: weekend ? '#f4f5f7' : 'transparent',
    padding: '5px 7px 5px 6px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 3,
    minWidth: 0,
    // Raderna delar sidan lika; overflow hidden är spärren mot att en lång
    // syssla trycker ut bladet under papperskanten.
    overflow: 'hidden',
  });

  return (
    <Sheet>
      <Head title="Veckan" sub={WEEK_LONG} right="Familjen" />
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'grid', gridTemplateColumns: '44px 1.3fr 1fr 1.05fr', gridTemplateRows: 'auto repeat(7,auto)', marginTop: 8 }}>
        {['', '🤸 Träning', '🍽 Mat', '🧹 Vem gör vad'].map((h, i) => (
          <div key={i} style={{ borderBottom: '2px solid #111827', padding: '0 7px 4px 6px', fontSize: 9.5, fontWeight: 900, letterSpacing: '.06em', textTransform: 'uppercase', color: '#4b5563' }}>
            {h}
          </div>
        ))}

        {rows.map((r, i) => {
          const weekend = i >= 5;
          return (
            <Fragment key={r.day}>
              <div style={{ ...cell(weekend), paddingLeft: 0, fontSize: 12.5, fontWeight: 900, textTransform: 'uppercase', color: '#111827', justifyContent: 'center' }}>
                {r.day}
              </div>

              <div style={cell(weekend)}>
                {r.trainings.length === 0 && <Empty />}
                {r.trainings.map((t, j) => (
                  <div key={j}>
                    <div style={{ fontSize: 11.5, fontWeight: 800, color: '#111827', lineHeight: 1.1 }}>{t.title}</div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: '#4b5563', lineHeight: 1.15 }}><Named text={t.meta} /></div>
                  </div>
                ))}
              </div>

              <div style={cell(weekend)}>
                {r.meals.length === 0 && <Empty />}
                {r.meals.map((m) => (
                  <div key={m.slot}>
                    {r.meals.length > 1 && (
                      <div style={{ fontSize: 8.5, fontWeight: 900, letterSpacing: '.06em', color: '#6b7280', lineHeight: 1.3 }}>
                        {SLOT_LABEL[m.slot].toUpperCase()}
                      </div>
                    )}
                    <div style={{ fontSize: 11.5, fontWeight: 800, color: '#111827', lineHeight: 1.1 }}>{m.dish}</div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: '#4b5563', lineHeight: 1.15 }}><Named text={`${m.cook} · ${m.when}`} /></div>
                  </div>
                ))}
              </div>

              <div style={cell(weekend)}>
                {r.chores.length === 0 && <Empty />}
                {r.chores.map((c, j) => (
                  <div key={j} style={{ fontSize: 10.5, fontWeight: 600, color: '#4b5563', lineHeight: 1.15 }}>
                    <Named text={`${c.who} ${c.label.toLowerCase()}`} />
                  </div>
                ))}
              </div>
            </Fragment>
          );
        })}
      </div>
      <Legend />
      <Foot left={`Varje dag: ${DAILY_CHORES.join(' · ')} · ${CHORE_FOOTER.toLowerCase()}`} />
    </Sheet>
  );
}

function Empty() {
  return <div style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af' }}>—</div>;
}

function MealSheet({ bought }: { bought: Flags }) {
  const left = BUYS.filter((b) => !bought[b]).map((b) => b.toLowerCase());
  return (
    <Sheet>
      <Head title="Matschema" sub="Vecka 37 · vem som lagar" right={FAMILY_PARENTS} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: 6 }}>
        {MEALS.map((m, i) => {
          const twoMeals = MEALS.filter((x) => x.day === m.day).length > 1;
          const firstOfDay = MEALS.findIndex((x) => x.day === m.day) === i;
          return (
            <div className="srow" key={`${m.day}-${m.slot}`}>
              <div className="sk">{firstOfDay ? m.sheetDay : ''}</div>
              <div style={{ flex: 1 }}>
                <div className="st">{twoMeals ? `${SLOT_LABEL[m.slot]}: ${m.dish}` : m.dish}</div>
                <div className="sm"><Named text={`${mealWho(m)}${m.note ? ` · ${m.note}` : ''}`} /></div>
              </div>
            </div>
          );
        })}
      </div>
      <Foot left={left.length ? `Handla: ${left.join(', ')}` : 'Allt är inhandlat'} />
    </Sheet>
  );
}

function ChoreSheet() {
  return (
    <Sheet>
      <Head title="Städschema" sub="Vecka 37 · kryssa av när det är klart" right="Familjen" />
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 8, marginTop: 10 }}>
        {PEOPLE.map((p) => {
          const c = colorOf(p.name);
          return (
            <div className="pers" key={p.name} style={{ borderColor: c.base }}>
              <div className="pnm" style={{ color: c.fg }}>
                <span style={{ display: 'inline-block', width: 9, height: 9, borderRadius: 99, background: c.base, marginRight: 7 }} />
                {p.name}
                {/\d+\s*år/.test(p.role) && <span> · {p.role}</span>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {p.tasks.map((t, i) => (
                  <div className="ptask" key={i}>
                    <span className="box" style={{ borderColor: c.base }} />
                    {t.label} — {t.day}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <Foot left={CHORE_FOOTER} />
    </Sheet>
  );
}

function TrainingSheet() {
  return (
    <Sheet>
      <Head title="Träningar" sub="Vecka 37 · tider, plats och skjuts" right={FAMILY_KIDS} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: 6 }}>
        {TRAININGS.map((t, i) => (
          <div className="srow" key={i}>
            <div className="sk">{t.sheetDay}</div>
            <div style={{ flex: 1 }}>
              <div className="st">{t.sheet.title}</div>
              <div className="sm"><Named text={t.sheet.meta} /></div>
            </div>
          </div>
        ))}
      </div>
      <Foot left={TRAINING_FOOTER} />
    </Sheet>
  );
}

function DateSheet() {
  const cells = [null, ...Array.from({ length: 30 }, (_, i) => i + 1)];
  return (
    <Sheet>
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
              <div className="st"><Named text={d.title} /></div>
              <div className="sm"><Named text={d.meta} /></div>
            </div>
          </div>
        ))}
      </div>
      <Foot left="🤸 träning · 📅 möte · 🎂 födelsedag" />
    </Sheet>
  );
}
