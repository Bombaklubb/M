import React from 'react';

interface AboutViewProps {
  onClose: () => void;
}

// Nivåtabellen speglar readhunt/TEXT-SPEC.md och det faktiska biblioteket.
const LEVELS = [
  { range: '1–3', tier: 'Nybörjare', words: '25–80 ord', desc: 'Korta berättelser med vardagsord. Svåra ord förklaras på svenska.' },
  { range: '4–6', tier: 'Mellan', words: '150–415 ord', desc: 'Längre texter, både berättelser och faktatexter. Ordförklaringar på engelska.' },
  { range: '7–9', tier: 'Avancerad', words: '500–590 ord', desc: 'Resonerande faktatexter där svaret sällan står ordagrant i texten.' },
  { range: '10', tier: 'Expert', words: '590–625 ord', desc: 'Texter som väger argument mot varandra och kräver att man drar egna slutsatser.' },
];

const TOOLS = [
  {
    chip: <span className="flex gap-0.5"><span className="text-[10px] font-bold">A</span><span className="text-xs font-bold">A</span><span className="text-sm font-bold">A</span></span>,
    name: 'Textstorlek',
    desc: 'Tre storlekar. Valet sparas och följer med till nästa text.',
  },
  {
    chip: <span className="text-[11px] font-bold"><span className="font-black">Bio</span>nic</span>,
    name: 'Bionic Reading',
    desc: 'Början av varje ord görs fetstilt. Ögat fäster lättare och många läser snabbare — särskilt vid lässvårigheter.',
  },
  {
    chip: <span className="text-sm">🔊</span>,
    name: 'Uppläsning',
    desc: 'Texten läses upp på engelska. Går att pausa, stoppa och ändra hastighet.',
  },
  {
    chip: <span className="text-sm">👆</span>,
    name: 'Ordförklaringar',
    desc: 'Klicka på ett understruket ord för att se vad det betyder. På nivå 1–3 på svenska, därefter på engelska.',
  },
  {
    chip: <span className="text-sm">🌙</span>,
    name: 'Mörkt läge',
    desc: 'Växla mellan ljus och mörk bakgrund uppe till höger.',
  },
];

const CHESTS = [
  { img: '/content/bronskista.png', name: 'Brons', points: '10–200 poäng' },
  { img: '/content/silverkista.png', name: 'Silver', points: '300–4 000 poäng' },
  { img: '/content/guldkista.png', name: 'Guld', points: '1 200–7 000 poäng' },
  { img: '/content/smaragdkista.png', name: 'Smaragd', points: '8 000–12 000 poäng' },
  { img: '/content/rubinkista.png', name: 'Rubin', points: '15 000–20 000 poäng' },
  { img: '/content/diamantkista.png', name: 'Diamant', points: '25 000–40 000 poäng' },
  { img: '/content/hemligakista-blurrad.png', name: 'Hemlig', points: '60 000+ poäng' },
];

const Section: React.FC<{ emoji: string; title: string; children: React.ReactNode }> = ({ emoji, title, children }) => (
  <section className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm p-5 sm:p-6">
    <h2 className="flex items-center gap-2.5 text-lg font-black text-slate-900 dark:text-slate-100 mb-4">
      <span className="text-2xl">{emoji}</span>
      {title}
    </h2>
    <div className="space-y-3 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
      {children}
    </div>
  </section>
);

export const AboutView: React.FC<AboutViewProps> = ({ onClose }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Banner */}
      <div
        className="text-white"
        style={{ background: 'linear-gradient(135deg, #4338ca, #6366f1, #8b5cf6)' }}
      >
        <div className="max-w-3xl mx-auto px-4 py-6">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-3 transition-colors"
          >
            ← Tillbaka
          </button>
          <div className="flex items-center gap-3">
            <span className="text-4xl">📖</span>
            <div>
              <h1 className="text-2xl font-black">Om appen</h1>
              <p className="text-white/80 text-sm">Så fungerar Readhunt</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {/* Kort om appen */}
        <Section emoji="🎯" title="Vad är Readhunt?">
          <p>
            Readhunt tränar <strong>läsförståelse på engelska</strong>. Eleven läser en text och svarar
            på sex frågor om den. Biblioteket innehåller {242} texter fördelade på tio nivåer, i både
            berättande och faktabaserad form.
          </p>
          <p>
            Appen är gratis, kräver inget konto och fungerar i webbläsaren på dator, surfplatta och mobil.
          </p>
        </Section>

        {/* Kom igång */}
        <Section emoji="🚀" title="Kom igång">
          <ol className="space-y-2.5">
            {[
              ['Skriv ditt namn', 'Välj en figur och skriv ett namn. Nästa gång du skriver samma namn hittar appen dina poäng igen.'],
              ['Välj nivå', 'Nivå 1 är kortast, nivå 10 längst och svårast. Du väljer fritt och kan byta när du vill.'],
              ['Läs och svara', 'Texten står kvar bredvid frågorna hela tiden — du behöver inte komma ihåg den.'],
            ].map(([rubrik, text], i) => (
              <li key={rubrik} className="flex gap-3">
                <span className="flex-none w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span><strong className="text-slate-900 dark:text-slate-100">{rubrik}.</strong> {text}</span>
              </li>
            ))}
          </ol>
        </Section>

        {/* Nivåerna */}
        <Section emoji="📶" title="Nivåerna 1–10">
          <p>
            Nivåerna följer ungefär årskurs 1–10, men siffran är en <em>textnivå</em>, inte en årskurs.
            Många läser bäst en eller två nivåer under sin årskurs i början. Det som skiljer nivåerna åt
            är både hur långa texterna är och hur mycket man måste tänka själv.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {LEVELS.map((l) => (
              <div key={l.range} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-3.5">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-base font-black text-indigo-700 dark:text-indigo-300">Nivå {l.range}</span>
                  <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{l.tier}</span>
                </div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">{l.words}</p>
                <p className="text-sm">{l.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Frågorna */}
        <Section emoji="❓" title="De två sorternas frågor">
          <p>Varje text har sex frågor, och de är av två slag:</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-2xl border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-900/20 p-3.5">
              <p className="font-bold text-sky-900 dark:text-sky-200 mb-1">🔍 On the Lines</p>
              <p className="text-sm">Svaret står ordagrant i texten. Det gäller att hitta det.</p>
            </div>
            <div className="rounded-2xl border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-900/20 p-3.5">
              <p className="font-bold text-violet-900 dark:text-violet-200 mb-1">🧠 Between the Lines</p>
              <p className="text-sm">Svaret står inte utskrivet. Man måste dra en slutsats av det man läst.</p>
            </div>
          </div>
          <p className="text-sm">
            Efter inlämning visas facit med förklaring till varje fråga, så att fel svar också blir något att lära av.
          </p>
        </Section>

        {/* Hjälpmedel */}
        <Section emoji="🛠️" title="Hjälpmedel när du läser">
          <p>Ovanför texten finns knappar som gör läsningen lättare. De påverkar inte poängen.</p>
          <ul className="space-y-2.5">
            {TOOLS.map((t) => (
              <li key={t.name} className="flex gap-3 items-start">
                <span className="flex-none min-w-[52px] h-7 px-2 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200">
                  {t.chip}
                </span>
                <span><strong className="text-slate-900 dark:text-slate-100">{t.name}.</strong> {t.desc}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Poäng */}
        <Section emoji="⭐" title="Poängen">
          <p>Poängen beror på hur många rätt man har och vilken nivå texten ligger på.</p>
          <ul className="space-y-1.5 list-disc pl-5 marker:text-indigo-500">
            <li>Alla rätt på nivå 1 ger 140 poäng, alla rätt på nivå 10 ger 275. En svårare text är alltså värd mer.</li>
            <li>Alla sex rätt ger en extra bonus.</li>
            <li>Ibland slår en <strong>slumpad bonus</strong> till och dubblar eller tredubblar poängen. Den går inte att styra.</li>
            <li>Att läsa om en text man redan klarat ger bara en fjärdedel av poängen — man kan alltså inte samla poäng på samma text om och om igen.</li>
          </ul>
          <p className="text-sm">
            Stjärnan uppe till höger visar <strong>totalt intjänade poäng</strong>. Kundvagnen visar hur mycket
            som finns kvar att handla för. Poäng man handlar för dras bara från kundvagnen — stjärnan
            minskar aldrig, så man tappar inte kistor eller märken av att köpa något.
          </p>
        </Section>

        {/* Kistor */}
        <Section emoji="🎁" title="Kistorna">
          <p>Kistor är belöningar som samlas under kistknappen uppe till höger. De kommer på tre sätt:</p>
          <ul className="space-y-1.5 list-disc pl-5 marker:text-amber-500">
            <li>När man passerar en <strong>poänggräns</strong> (första kistan redan vid 10 poäng).</li>
            <li>När man klarat ett visst <strong>antal texter</strong> (den första efter en enda text).</li>
            <li>Som ren <strong>tur</strong> efter en avklarad text.</li>
          </ul>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {CHESTS.map((c) => (
              <div key={c.name} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-3 text-center">
                <img src={c.img} alt="" className="w-9 h-9 mx-auto mb-1.5 object-contain" />
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{c.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">{c.points}</p>
              </div>
            ))}
          </div>
          <p className="text-sm">
            En kista öppnas med ett klick och ger poäng, ibland ett märke, en bonuskista eller ett gratis
            föremål från affären. Ju finare kista, desto bättre innehåll. Öppnade kistor ställs upp på
            troféhyllan.
          </p>
        </Section>

        {/* Affären */}
        <Section emoji="🛒" title="Affären">
          <p>
            I affären köper man saker för sina poäng. Allt är utseende — ingenting påverkar texterna,
            frågorna eller svårighetsgraden.
          </p>
          <ul className="space-y-1.5 list-disc pl-5 marker:text-indigo-500">
            <li><strong>Avatarer</strong> — figuren som visas vid namnet (150–5 000 poäng).</li>
            <li><strong>Ramar</strong> — en ram runt figuren (250–3 500 poäng).</li>
            <li><strong>Effekter</strong> — rörelse och glitter runt figuren (500–2 800 poäng).</li>
          </ul>
          <p className="text-sm">
            Under <strong>Mina köp</strong> finns allt man äger, och där byter man vad som ska vara påsatt.
            Föremål som ramlat ut ur en kista hamnar också där.
          </p>
        </Section>

        {/* Profil */}
        <Section emoji="👤" title="Profil och märken">
          <p>
            Klicka på namnet uppe till höger för att se din statistik: antal lästa texter, andel rätt,
            hur det går på de två frågetyperna och på berättelser respektive faktatexter. Där finns också
            alla märken man samlat — för antal texter, för många rätt i rad, för att ha läst på morgonen
            eller kvällen, och en del som är svårare att lista ut.
          </p>
        </Section>

        {/* Bra att veta */}
        <Section emoji="💡" title="Bra att veta">
          <ul className="space-y-1.5 list-disc pl-5 marker:text-slate-400">
            <li>
              <strong>Poängen sparas i webbläsaren</strong> på den enhet man använder. Byter man dator eller
              surfplatta börjar man om från noll, och rensar man webbläsarens data försvinner poängen.
            </li>
            <li>
              Flera elever kan använda samma enhet — var och en skriver sitt eget namn och har egna poäng,
              kistor och köp.
            </li>
            <li>
              Appen samlar inte in några personuppgifter. Namnet lämnar aldrig enheten.
            </li>
            <li>
              Samma text kommer inte tillbaka förrän alla texter på nivån är lästa.
            </li>
          </ul>
        </Section>

        {/* Kontakt */}
        <section className="rounded-3xl border-2 border-dashed border-indigo-200 dark:border-indigo-800 bg-indigo-50/60 dark:bg-indigo-900/20 p-5 text-center">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            Frågor eller tips?{' '}
            <a
              href="mailto:martin.akdogan@enkoping.se"
              className="font-bold text-indigo-700 dark:text-indigo-300 hover:underline"
            >
              martin.akdogan@enkoping.se
            </a>
          </p>
        </section>

        <div className="pt-1 pb-4">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl font-bold text-white text-base transition-all active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #4338ca, #6366f1)' }}
          >
            Tillbaka till appen
          </button>
        </div>
      </main>
    </div>
  );
};
