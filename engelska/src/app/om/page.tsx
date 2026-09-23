"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "@/components/ui/Header";
import { loadStudent } from "@/lib/storage";
import { STAGES } from "@/lib/stages";
import { CHEST_META } from "@/lib/gamification";
import type { StudentData, ChestType } from "@/lib/types";
import { JAKT_APPS } from "@/components/ui/JakterMenu";

/** Vad varje app i Jaktlänkar tränar. Länkarna själva kommer från menyn. */
const JAKT_BESKRIVNING: Record<string, string> = {
  Läsjakten: "läsförståelse på svenska.",
  Mattejakten: "matematik.",
  Svenskajakten: "svenska.",
  Readhunt: "läsförståelse på engelska.",
};

// ─── Om Engelskajakten ────────────────────────────────────────────────────────
// Förklarar appen för elever, vårdnadshavare och kollegor. Siffrorna här speglar
// den faktiska appen (poäng, kistor, priser, nivåer) – ändras något av dem i
// koden bör texten här uppdateras också.

const OVNINGSTYPER = [
  {
    emoji: "🅰️",
    name: "Välj rätt svar",
    desc: "Tre eller fyra alternativ där ett är rätt. Efter svaret kommer en förklaring till varför.",
  },
  {
    emoji: "✏️",
    name: "Fyll i luckan",
    desc: "Skriv ordet som fattas. Flera korrekta former godkänns – både colour och color, både aren't och are not.",
  },
  {
    emoji: "🧩",
    name: "Bygg meningen",
    desc: "Klicka ihop orden till en riktig mening. Går meningen att säga på fler än ett sätt godkänns båda.",
  },
];

const AKTIVITETER = [
  { emoji: "📘", name: "Grammatik", desc: "Appens kärna. 150 kapitel med omkring 1 900 övningar – från am/is/are till perfekt particip och passiv form." },
  { emoji: "🔤", name: "Stavning", desc: "Ord som ofta blir fel, tränade i samma tre övningstyper." },
  { emoji: "📖", name: "Språkregler", desc: "Uppslagsdelen. Här står reglerna förklarade med exempel – bra att titta i före eller under en övning." },
  { emoji: "🔍", name: "Ordsökning", desc: "Hitta gömda engelska ord i rutnätet. Lugnare träning på ordbilder." },
  { emoji: "🎮", name: "Spel", desc: "Memory, Hänga gubben, Tidsattack och Samla mynt. Alla ger riktiga poäng." },
  { emoji: "🔁", name: "Försök igen", desc: "Allt du svarat fel på samlas här. Rätta ett gammalt fel och det försvinner ur listan." },
];

const SPEL = [
  { emoji: "🃏", name: "Memory", desc: "Para ihop svenska ord med engelska. Lätt, Medel eller Svår – svårare bräde ger mer poäng." },
  { emoji: "❤️", name: "Hänga gubben", desc: "Gissa det engelska ordet bokstav för bokstav. Sex liv, inga galgar." },
  { emoji: "⏱️", name: "Tidsattack", desc: "Sextio sekunder. Hur många ord hinner du översätta rätt?" },
  { emoji: "🪙", name: "Samla mynt", desc: "Spring och samla mynt genom att välja rätt översättning." },
];

// Kistorna i samma ordning som de delas ut, med appens egna bilder.
const KISTOR: { type: ChestType; points: string }[] = [
  { type: "wood", points: "20–120 poäng" },
  { type: "silver", points: "50–200 poäng" },
  { type: "gold", points: "120–400 poäng" },
  { type: "ruby", points: "250–600 poäng" },
  { type: "diamond", points: "400–1 000 poäng" },
  { type: "emerald", points: "700–1 500 poäng" },
  { type: "hemlig", points: "1 200–2 500 poäng" },
];

function Section({ emoji, title, children }: { emoji: string; title: string; children: React.ReactNode }) {
  return (
    <section className="card">
      <h2 className="flex items-center gap-2.5 text-lg font-black text-en-800 dark:text-gray-100 mb-4">
        <span className="text-2xl" aria-hidden="true">{emoji}</span>
        {title}
      </h2>
      <div className="space-y-3 text-[15px] leading-relaxed text-gray-700 dark:text-gray-300">
        {children}
      </div>
    </section>
  );
}

export default function OmPage() {
  const [student, setStudent] = useState<StudentData | null>(null);
  useEffect(() => { setStudent(loadStudent()); }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header student={student} />

      {/* Banner */}
      <div
        className="text-white"
        style={{ background: "linear-gradient(135deg, #1e3a8a, #2563eb, #3b82f6)" }}
      >
        <div className="max-w-3xl mx-auto px-4 py-6">
          <Link prefetch={false}
            href="/"
            className="inline-flex items-center gap-1 text-white/75 hover:text-white text-sm mb-3 transition-colors"
          >
            ← Tillbaka
          </Link>
          <div className="flex items-center gap-3">
            <img src="/union-jack.svg" alt="" className="w-11 h-11 rounded-xl object-cover border-2 border-white/30" />
            <div>
              <h1 className="text-2xl font-black">Om Engelskajakten</h1>
              <p className="text-white/80 text-sm">Så fungerar appen</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">

        <Section emoji="🎯" title="Vad är Engelskajakten?">
          <p>
            Engelskajakten tränar <strong>engelsk grammatik, stavning och ordförråd</strong>. Du väljer
            en värld, öppnar ett kapitel och svarar på övningarna. Varje svar rättas direkt och du får
            veta varför det blev rätt eller fel.
          </p>
          <p>
            Appen är gratis, kräver inget konto och fungerar i webbläsaren på Chromebook, dator,
            surfplatta och mobil.
          </p>
          <p className="text-sm">
            Läsförståelse på engelska tränas i en separat app,{" "}
            <a
              href="https://readhunt.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-en-600 dark:text-en-300 underline underline-offset-2 hover:text-en-700"
            >
              Readhunt
            </a>
            .
          </p>
        </Section>

        <Section emoji="🚀" title="Kom igång">
          <ol className="space-y-2.5">
            {[
              ["Skriv ditt namn", "Välj en figur och skriv ett namn. Nästa gång du skriver samma namn hittar appen dina poäng igen."],
              ["Välj värld", "Ordbyn är lättast, Engelska Akademin svårast. Du väljer fritt och kan byta när du vill."],
              ["Öppna ett kapitel", "Svara på övningarna. Behöver du sluta mitt i är det ingen fara – appen kommer ihåg var du var och vilka svar du redan gett."],
            ].map(([rubrik, text], i) => (
              <li key={rubrik} className="flex gap-3">
                <span className="flex-none w-6 h-6 rounded-full bg-en-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span><strong className="text-en-800 dark:text-gray-100">{rubrik}.</strong> {text}</span>
              </li>
            ))}
          </ol>
        </Section>

        <Section emoji="🗺️" title="De fyra världarna">
          <p>
            Världarna är <em>svårighetsnivåer</em>, inte årskurser. Många har lättast att komma igång en
            nivå under sin årskurs och går uppåt när det känns enkelt.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {STAGES.map((s) => (
              <div key={s.id} className="rounded-2xl border-2 border-en-100 dark:border-gray-600 bg-en-50/60 dark:bg-gray-900/50 p-3.5">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-xl not-italic" aria-hidden="true">{s.emoji}</span>
                  <span className="text-base font-black text-en-700 dark:text-en-300">{s.name}</span>
                </div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5">{s.grades}</p>
                <p className="text-sm">{s.description}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section emoji="📚" title="Vad du kan träna på">
          <p>Varje värld har sex flikar:</p>
          <ul className="space-y-2.5">
            {AKTIVITETER.map((a) => (
              <li key={a.name} className="flex gap-3 items-start">
                <span className="flex-none w-8 h-8 rounded-xl bg-en-50 dark:bg-gray-700 flex items-center justify-center text-base" aria-hidden="true">
                  {a.emoji}
                </span>
                <span><strong className="text-en-800 dark:text-gray-100">{a.name}.</strong> {a.desc}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section emoji="✍️" title="De tre övningstyperna">
          <div className="grid gap-2 sm:grid-cols-3">
            {OVNINGSTYPER.map((t) => (
              <div key={t.name} className="rounded-2xl border-2 border-en-100 dark:border-gray-600 bg-en-50/60 dark:bg-gray-900/50 p-3.5">
                <p className="font-bold text-en-800 dark:text-en-200 mb-1">
                  <span aria-hidden="true">{t.emoji}</span> {t.name}
                </p>
                <p className="text-sm">{t.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-sm">
            Svarar du fel hamnar frågan under <strong>Försök igen</strong>, så att du kan ta den en gång
            till senare.
          </p>
        </Section>

        <Section emoji="🎮" title="Spelen">
          <p>Spelen ger riktiga poäng, precis som kapitlen. De finns under fliken Spel i varje värld.</p>
          <ul className="space-y-2.5">
            {SPEL.map((g) => (
              <li key={g.name} className="flex gap-3 items-start">
                <span className="flex-none w-8 h-8 rounded-xl bg-en-50 dark:bg-gray-700 flex items-center justify-center text-base" aria-hidden="true">
                  {g.emoji}
                </span>
                <span><strong className="text-en-800 dark:text-gray-100">{g.name}.</strong> {g.desc}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm">
            Spelen öppnas när du klarat ett kapitel under dagen och är sedan öppna till midnatt. Ett spel
            ger som mest 150 poäng per omgång och 400 poäng per dag, och efter tre omgångar samma dag ger
            det mindre och mindre. Spelen är alltså en belöning för kapitlen, inte en genväg förbi dem.
          </p>
        </Section>

        <Section emoji="⭐" title="Poängen">
          <ul className="space-y-1.5 list-disc pl-5 marker:text-en-500">
            <li>Varje rätt svar ger <strong>15 poäng</strong>.</li>
            <li>Klarar du minst 60 procent av kapitlet får du dessutom en <strong>bonus</strong>.</li>
            <li>Kommer du tillbaka en ny dag väntar en <strong>daglig bonus på 50 poäng</strong>.</li>
            <li>
              Ibland slår en <strong>turbonus</strong> till och dubblar eller tredubblar poängen. Den är
              slumpad och går inte att styra.
            </li>
            <li>
              Att göra om ett kapitel ger mindre varje gång: 100, 70, 50, 30 och sedan 20 procent. Man kan
              alltså inte samla poäng på samma kapitel hur länge som helst.
            </li>
            <li>
              Att rätta gamla fel under <strong>Försök igen</strong> ger 5–15 poäng, upp till 200 poäng per dag.
            </li>
          </ul>
          <p className="text-sm">
            Stjärnan uppe till höger visar <strong>totalt intjänade poäng</strong>. Kundvagnen visar hur
            mycket som finns kvar att handla för. Det du handlar för dras bara från kundvagnen — stjärnan
            minskar aldrig, så du tappar varken nivå, kistor eller märken av att köpa något.
          </p>
        </Section>

        <Section emoji="🏅" title="Nivåerna">
          <p>
            Dina totala poäng ger en nivå, från <strong>1 Nybörjare</strong> till{" "}
            <strong>20 Universums Ordmästare</strong>. Nivån syns på profilen och är helt kosmetisk – den
            låser inte upp något och sjunker aldrig.
          </p>
        </Section>

        <Section emoji="🎁" title="Kistorna">
          <p>Kistor samlas under kistknappen uppe till höger. De kommer på tre sätt:</p>
          <ul className="space-y-1.5 list-disc pl-5 marker:text-amber-500">
            <li>När du passerar en <strong>poänggräns</strong> – den första redan vid 10 poäng.</li>
            <li>När du klarat ett visst <strong>antal kapitel</strong> – den första efter ett enda.</li>
            <li>Som ren <strong>tur</strong> efter ett avklarat kapitel.</li>
          </ul>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {KISTOR.map((c) => {
              const meta = CHEST_META[c.type];
              return (
                <div key={c.type} className="rounded-2xl border-2 border-en-100 dark:border-gray-600 bg-en-50/60 dark:bg-gray-900/50 p-3 text-center">
                  <img src={meta.image} alt="" className="w-10 h-10 mx-auto mb-1.5 object-contain" />
                  <p className="text-sm font-bold text-en-800 dark:text-gray-200">{meta.label}</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">{c.points}</p>
                </div>
              );
            })}
          </div>
          <p className="text-sm">
            En kista öppnas med ett klick och ger poäng, ibland ett märke eller en bonuskista. Ju finare
            kista, desto bättre innehåll.
          </p>
        </Section>

        <Section emoji="🛒" title="Affären">
          <p>
            I affären köper du saker för dina poäng. Allt är utseende – ingenting påverkar övningarna
            eller svårighetsgraden.
          </p>
          <ul className="space-y-1.5 list-disc pl-5 marker:text-emerald-500">
            <li><strong>Figurer</strong> – din avatar (100–2 500 poäng).</li>
            <li><strong>Ramar</strong> – en ram runt figuren (250–3 500 poäng).</li>
            <li><strong>Teman</strong> – bakgrunden i hela appen (100–3 500 poäng).</li>
            <li><strong>Effekter</strong> – rörelse och glitter runt figuren (100–3 000 poäng).</li>
          </ul>
          <p className="text-sm">
            Det du äger sätts på och av i affären, och du kan alltid välja <strong>Standard</strong> för att
            få tillbaka appens vanliga utseende.
          </p>
        </Section>

        <Section emoji="⚔️" title="Bossen">
          <p>
            Varje värld har en egen <strong>boss</strong>. När du klarat tio kapitel i en värld får du
            möta den världens boss, och varje ny strid kostar tio kapitel till. Kapitel i andra världar
            räknas inte. Vinner du får du upp till 200 bonuspoäng och en kista, och första gången också
            ett märke. Bosskortet under fliken Spel visar hur många kapitel som är kvar.
          </p>
        </Section>

        <Section emoji="👤" title="Profil och märken">
          <p>
            Klicka på ditt namn uppe till höger för att se din statistik: nivå, poäng per värld, avklarade
            kapitel och tid i appen. Där finns också de <strong>elva märkena</strong> – för de första
            stegen, för grammatik, stavning, spel, för att vara flitig, och några som är svårare att lista
            ut.
          </p>
        </Section>

        <Section emoji="🧭" title="Jaktlänkar">
          <p>
            Längst ned till höger på varje sida finns knappen <strong>Jaktlänkar ▴</strong>. Den
            öppnar en meny med länkar till de andra apparna i samma familj. De öppnas i en ny flik, så
            Engelskajakten ligger kvar där du var.
          </p>
          <ul className="space-y-2.5">
            {JAKT_APPS.map((app) => (
              <li key={app.url} className="flex gap-3 items-start">
                <span className="flex-none w-8 h-8 rounded-xl bg-en-50 dark:bg-gray-700 flex items-center justify-center" aria-hidden="true">
                  {app.icon}
                </span>
                <span>
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-en-600 dark:text-en-300 underline underline-offset-2 hover:text-en-700"
                  >
                    {app.label}
                  </a>{" "}
                  – {JAKT_BESKRIVNING[app.label] ?? ""}{" "}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({app.url.replace("https://", "")})
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Section>

        <Section emoji="💡" title="Bra att veta">
          <ul className="space-y-1.5 list-disc pl-5 marker:text-gray-400">
            <li>
              <strong>Allt sparas på den enhet du använder</strong> – poäng, märken, kistor och köp.
              Ingenting ligger på en server. Byter du dator eller webbläsare börjar du om från noll, och
              rensar du webbläsarens data försvinner allt.
            </li>
            <li>
              Flera elever kan dela samma enhet. Var och en skriver sitt eget namn och har egna poäng,
              kistor och köp.
            </li>
            <li>
              <strong>Mörkt läge</strong> slås på med måne-knappen uppe till höger.
            </li>
            <li>
              Lämnar du ett kapitel mitt i kommer appen ihåg både var du var och vilka svar du hunnit ge.
            </li>
          </ul>
        </Section>

        {/* Kontaktuppgifterna står redan i den fasta listen längst ned på varje
            sida (se layout.tsx) – ingen dubblett här. */}

        <div className="pt-1 pb-16">
          <Link prefetch={false}
            href="/"
            className="btn-primary w-full bg-en-600 hover:bg-en-700"
          >
            Tillbaka till appen
          </Link>
        </div>
      </main>
    </div>
  );
}
