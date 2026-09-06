import { Fragment, type ReactNode } from 'react';
import {
  choreDay, colorOf, FAMILY_KIDS, FAMILY_PARENTS, MEALS, mealWho, MEMBERS, PEOPLE,
  sheetDayFor, SLOT_LABEL, TRAININGS, trainingRide, weekLong, weekRows,
} from './data';
import { Named } from './Named';

const A4_W = 793.7;
const A4_H = 1122.5;
const SHEET_W = 496;
const SHEET_H = 701;

type Props = { sel: Record<string, boolean>; orient: 'port' | 'land' };

export function PrintSheets({ sel, orient }: Props) {
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
      {sel.mat && <Page><MealSheet /></Page>}
      {sel.stad && <Page><ChoreSheet /></Page>}
      {sel.tran && <Page><TrainingSheet /></Page>}
    </div>
  );
}

const FAMILY = MEMBERS.map((m) => m.name);

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
    padding: '6px 7px 6px 5px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 4,
    minWidth: 0,
    // Raderna delar sidan lika; overflow hidden är spärren mot att en lång
    // rad trycker ut bladet under papperskanten.
    overflow: 'hidden',
  });

  return (
    <Sheet>
      <Head title="Veckan" sub={weekLong()} right="Familjen" />
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'grid', gridTemplateColumns: '34px 0.98fr 0.55fr 1.47fr', gridTemplateRows: 'auto repeat(7,auto)', marginTop: 8 }}>
        {['', '🤸 Träning', '🍽 Mat', '🧹 Städ'].map((h, i) => (
          <div key={i} style={{ borderBottom: '2px solid #111827', padding: '0 8px 5px 6px', fontSize: 10, fontWeight: 900, letterSpacing: '.06em', textTransform: 'uppercase', color: '#4b5563' }}>
            {h}
          </div>
        ))}

        {rows.map((r, i) => {
          const weekend = i >= 5;
          return (
            <Fragment key={r.day}>
              <div style={{ ...cell(weekend), paddingLeft: 0, fontSize: 13.5, fontWeight: 900, textTransform: 'uppercase', color: '#111827' }}>
                {r.day}
              </div>

              <div style={cell(weekend)}>
                {r.trainings.length === 0 && <Empty />}
                {r.trainings.map((t, j) => (
                  <div key={j}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#111827', lineHeight: 1.1 }}>{t.title}</div>
                    <div style={{ fontSize: 10.5, fontWeight: 700, lineHeight: 1.15 }}><Named text={t.meta} /></div>
                    {t.ride && (
                      <div style={{ fontSize: 9, fontWeight: 600, color: '#6b7280', lineHeight: 1.15 }}>
                        🚗 <Named text={t.ride} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div style={cell(weekend)}>
                {r.meals.length === 0 && <Empty />}
                {r.meals.map((m) => (
                  <div key={m.slot} style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 8.5, fontWeight: 900, letterSpacing: '.06em', textTransform: 'uppercase', color: '#6b7280', lineHeight: 1.25 }}>
                      {SLOT_LABEL[m.slot]}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#111827', lineHeight: 1.15 }}><Named text={mealWho(m)} /></div>
                  </div>
                ))}
              </div>

              <div style={cell(weekend)}>
                {r.chores.length === 0 && <Empty />}
                {r.chores.length > 0 && (
                  // Sysslorna flyter som en löpande text i stället för en rad per
                  // person: dagliga sysslor står på alla sju dagar, och bara så
                  // ryms veckan på ett enda A4.
                  <div style={{ fontSize: 9, fontWeight: 600, color: '#4b5563', lineHeight: 1.3 }}>
                    {r.chores.map((g, j) => (
                      <Fragment key={g.who}>
                        {j > 0 && <span style={{ color: '#9ca3af' }}> · </span>}
                        <Named text={g.who} /> {g.labels.join(', ')}
                      </Fragment>
                    ))}
                  </div>
                )}
              </div>
            </Fragment>
          );
        })}
      </div>
      <Legend />
      <Foot left="" />
    </Sheet>
  );
}

function Empty() {
  return <div style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af' }}>—</div>;
}

function MealSheet() {
  return (
    <Sheet>
      <Head title="Matansvar" sub={`${weekLong()} · vem som fixar maten`} right={FAMILY_PARENTS} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: 6 }}>
        {MEALS.map((m, i) => {
          const firstOfDay = MEALS.findIndex((x) => x.day === m.day) === i;
          return (
            <div className="srow" key={`${m.day}-${m.slot}`}>
              <div className="sk">{firstOfDay ? sheetDayFor(m.day) : ''}</div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <div className="sm" style={{ width: 74, flex: 'none', textTransform: 'uppercase', fontWeight: 800, fontSize: 12.5 }}>
                  {SLOT_LABEL[m.slot]}
                </div>
                <div className="st"><Named text={mealWho(m)} /></div>
              </div>
            </div>
          );
        })}
      </div>
      <Foot left="" />
    </Sheet>
  );
}

function ChoreSheet() {
  return (
    <Sheet>
      <Head title="Städschema" sub={weekLong()} right="Familjen" />
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 8, marginTop: 10 }}>
        {PEOPLE.map((p) => {
          const c = colorOf(p.name);
          return (
            <div className="pers" key={p.name} style={{ borderColor: c.base }}>
              <div className="pnm" style={{ color: c.fg }}>
                <span style={{ display: 'inline-block', width: 9, height: 9, borderRadius: 99, background: c.base, marginRight: 7 }} />
                {p.name}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {p.tasks.map((t, i) => (
                  <div className="ptask" key={i}>
                    <span style={{ width: 8, height: 8, borderRadius: 99, background: c.base, flex: 'none' }} />
                    {t.label} — {choreDay(t)}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <Foot left="" />
    </Sheet>
  );
}

function TrainingSheet() {
  return (
    <Sheet>
      <Head title="Träningar" sub={`${weekLong()} · tider och skjuts`} right={FAMILY_KIDS} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: 6 }}>
        {TRAININGS.map((t, i) => (
          <div className="srow" key={i}>
            <div className="sk">{sheetDayFor(t.day)}</div>
            <div style={{ flex: 1 }}>
              <div className="st">{t.title} {t.time}</div>
              <div className="sm">
                <Named text={t.person} />
                {t.place && <> · {t.place}</>}
                {trainingRide(t) && <> · <Named text={trainingRide(t)} /></>}
              </div>
            </div>
          </div>
        ))}
      </div>
      <Foot left="" />
    </Sheet>
  );
}
