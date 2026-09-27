/**
 * Dagens datum som ÅÅÅÅ-MM-DD i elevens egen tidszon.
 *
 * Förut användes toISOString(), som ger datumet i UTC. I Sverige bytte "dagen"
 * därför klockan 01 på vintern och 02 på sommaren i stället för vid midnatt –
 * för daglig bonus, streak, spellåset och dagstaken för spel och Försök igen.
 */
export function localDayKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Gårdagens datum i elevens tidszon. Klarar sommar- och vintertid. */
export function localYesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return localDayKey(d);
}
