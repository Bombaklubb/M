import { dayItems, forPerson, type Day } from '../data';

type Props = { days: Day[]; filter: string | null; onOpenDay: (i: number) => void };

/** Veckotavlan: sju dagar som alltid ryms — rader på telefonen, kolumner på skärm. */
export function Hem({ days, filter, onOpenDay }: Props) {
  return (
    <div className="week">
      {days.map((d, i) => {
        const items = dayItems(d).filter((it) => forPerson(it.p, filter));
        return (
          <div
            key={d.name}
            className={d.today ? 'daycard today' : 'daycard'}
            onClick={() => onOpenDay(i)}
          >
            <div className="dayhead">
              <div className="dayname">{d.name}</div>
              <div className="daydate">{d.date}</div>
              {d.today && <div className="todaytag">idag</div>}
            </div>
            <div className="dayitems">
              {items.length === 0 && <div className="dayempty">Inget inplanerat</div>}
              {items.map((it, j) => (
                <div className="dayitem" key={j}>
                  <div className="dayline">
                    <span className="dayicon">{it.icon}</span>
                    <span className="daylabel">{it.label}</span>
                  </div>
                  <span className="daymeta">{it.meta}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
