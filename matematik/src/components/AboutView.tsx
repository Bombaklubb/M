import React from 'react';
import AppHeader from './AppHeader';
import { useApp } from '../contexts/AppContext';
import { WORLDS } from '../data/worlds';
import { CHEST_META } from '../utils/chestStorage';
import type { ChestType } from '../types';

// ─── Om Mattejakten ─────────────────────────────────────────────────────────────
// Förklarar appen för elever, vårdnadshavare och kollegor. Siffrorna här speglar
// den faktiska appen (poäng, kistor, priser, nivåer) – ändras något av dem i
// koden bör texten här uppdateras också.

const BG: React.CSSProperties = {
  backgroundImage: "url('/Matematisk bakgrund med glödande symboler.png')",
  backgroundSize: 'cover', backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed',
};

const AKTIVITETER = [
  { emoji: '✦', name: 'Kapitel', desc: 'Appens kärna. 113 kapitel med drygt 1 400 övningar – från att räkna till 10 ända upp till derivata och logaritmer.' },
  { emoji: '⚔️', name: 'Äventyr', desc: '17 berättelser där matematiken är en del av handlingen. Klarar du ett äventyr låser du upp ett samlarföremål.' },
  { emoji: '🧩', name: 'Problemlösning', desc: '26 rika problem att utforska. Samma problem går att lösa på tre nivåer – E, C och A.' },
  { emoji: '🎮', name: 'Spel', desc: 'Memory, Hänga gubben, Tidsattack, Samla mynt och Boss Challenge. Alla ger poäng.' },
  { emoji: '🔁', name: 'Försök igen', desc: 'Allt du svarat fel på samlas här. Rätta ett gammalt fel och det försvinner ur listan.' },
];

const OVNINGSTYPER = [
  { emoji: '🅰️', name: 'Välj rätt svar', desc: 'Några alternativ där ett är rätt. Efter svaret kommer en förklaring.' },
  { emoji: '✏️', name: 'Skriv svaret', desc: 'Skriv talet eller ordet som fattas. Både komma och punkt fungerar som decimaltecken.' },
  { emoji: '👍', name: 'Sant eller falskt', desc: 'Ta ställning till ett påstående.' },
  { emoji: '🕐', name: 'Ställ klockan', desc: 'Dra visarna till rätt tid på en riktig urtavla.' },
  { emoji: '🔢', name: 'Sortera', desc: 'Lägg talen i rätt ordning, till exempel från minst till störst.' },
  { emoji: '🔗', name: 'Para ihop', desc: 'Matcha ihop det som hör samman, som uttryck med rätt svar.' },
];

const SPEL = [
  { emoji: '🃏', name: 'Memory', desc: 'Para ihop uppgiften med rätt svar. Lätt, Medel eller Svår.' },
  { emoji: '❤️', name: 'Hänga gubben', desc: 'Gissa matematikordet bokstav för bokstav. Sex liv, inga galgar.' },
  { emoji: '⏱️', name: 'Tidsattack', desc: 'Sextio sekunder – hur många uppgifter hinner du lösa?' },
  { emoji: '🪙', name: 'Samla mynt', desc: 'Spring och samla mynt genom att svara rätt. Tre liv.' },
  { emoji: '⚔️', name: 'Boss Challenge', desc: 'En riktig strid med HP-mätare. Varje boss har en egen mekanik.' },
];

const KISTOR: ChestType[] = ['wood', 'silver', 'gold', 'rubin', 'smaragd', 'diamant', 'hemlig'];

function Section({ emoji, title, children }: { emoji: string; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl p-5"
      style={{ background: 'rgba(255,255,255,0.95)', boxShadow: '0 4px 18px rgba(120,80,20,0.12)' }}>
      <h2 className="flex items-center gap-2.5 text-lg font-black text-gray-800 mb-4">
        <span className="text-2xl" aria-hidden="true">{emoji}</span>
        {title}
      </h2>
      <div className="space-y-3 text-[15px] leading-relaxed text-gray-700">{children}</div>
    </section>
  );
}

/** Liten ruta med emoji + rubrik + text. */
function Item({ emoji, name, desc }: { emoji: string; name: string; desc: string }) {
  return (
    <li className="flex gap-3 items-start">
      <span className="flex-none w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-base"
        aria-hidden="true">{emoji}</span>
      <span><strong className="text-gray-900">{name}.</strong> {desc}</span>
    </li>
  );
}

export default function AboutView() {
  const { setView, currentStudent } = useApp();
  const back = currentStudent ? 'dashboard' : 'login';

  return (
    <div className="min-h-screen" style={BG}>
      {currentStudent && <AppHeader />}

      {/* Banner */}
      <div className={currentStudent ? 'pt-16 text-white' : 'pt-6 text-white'}
        style={{ background: 'linear-gradient(135deg,#78350f 0%,#b45309 50%,#d97706 100%)' }}>
        <div className="max-w-3xl mx-auto px-4 py-6">
          <button onClick={() => setView(back as any)}
            className="inline-flex items-center gap-1 text-white/75 hover:text-white text-sm mb-3 transition-colors cursor-pointer">
            ← Tillbaka
          </button>
          <div className="flex items-center gap-3">
            <img src="/mattejakten.png" alt="" className="w-12 h-12 object-contain drop-shadow" />
            <div>
              <h1 className="text-2xl font-black">Om Mattejakten</h1>
              <p className="text-white/80 text-sm">Så fungerar appen</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">

        <Section emoji="🎯" title="Vad är Mattejakten?">
          <p>
            Mattejakten tränar <strong>matematik från lågstadiet till gymnasiet</strong>. Du väljer en
            värld, öppnar ett kapitel och svarar på övningarna. Varje svar rättas direkt och du får veta
            varför det blev rätt eller fel.
          </p>
          <p>
            Appen är gratis, kräver inget konto och fungerar i webbläsaren på Chromebook, dator,
            surfplatta och mobil.
          </p>
        </Section>

        <Section emoji="🚀" title="Kom igång">
          <ol className="space-y-2.5">
            {[
              ['Skriv ditt namn', 'Välj en figur och skriv ett namn. Nästa gång du skriver samma namn hittar appen dina poäng igen.'],
              ['Välj värld', 'Dinosaurie Världen är lättast, Rymd Akademin svårast. Du väljer fritt och kan byta när du vill.'],
              ['Öppna ett kapitel', 'Svara på övningarna. Behöver du sluta mitt i är det ingen fara – appen kommer ihåg hur långt du kommit.'],
            ].map(([rubrik, text], i) => (
              <li key={rubrik} className="flex gap-3">
                <span className="flex-none w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span><strong className="text-gray-900">{rubrik}.</strong> {text}</span>
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
            {WORLDS.map(w => (
              <div key={w.id} className="rounded-2xl border-2 border-orange-100 bg-orange-50/60 p-3.5">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-xl" aria-hidden="true">{w.emoji}</span>
                  <span className="text-base font-black text-orange-800">{w.name}</span>
                </div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">
                  {w.subtitle} · {w.topicIds.length} kapitel
                </p>
                <p className="text-sm">{w.storyIntro}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section emoji="📚" title="Vad du kan träna på">
          <p>Varje värld har flera sätt att öva:</p>
          <ul className="space-y-2.5">
            {AKTIVITETER.map(a => <Item key={a.name} {...a} />)}
          </ul>
        </Section>

        <Section emoji="✍️" title="De sex övningstyperna">
          <div className="grid gap-2 sm:grid-cols-3">
            {OVNINGSTYPER.map(t => (
              <div key={t.name} className="rounded-2xl border-2 border-orange-100 bg-orange-50/60 p-3.5">
                <p className="font-bold text-orange-800 mb-1">
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

        <Section emoji="🧩" title="Problemlösning">
          <p>
            Under Problemlösning finns <strong>26 rika problem</strong> – uppgifter med låg tröskel och
            högt tak. Samma problem utforskas på tre nivåer:
          </p>
          <ul className="space-y-1.5 list-disc pl-5 marker:text-violet-500">
            <li><strong>E – Utforska.</strong> Hitta ett exempel som fungerar. Ofta finns det många rätta svar.</li>
            <li><strong>C – Undersöka.</strong> Hitta alla lösningar och förklara hur du vet att du hittat dem.</li>
            <li><strong>A – Generalisera.</strong> Formulera en regel och förklara varför den fungerar.</li>
          </ul>
          <p className="text-sm">
            Här finns inga snabba facit. Vissa uppgifter besvaras i fritext och rättas inte alls – i stället
            får du se ett resonemang att jämföra ditt eget med.
          </p>
        </Section>

        <Section emoji="🎮" title="Spelen">
          <p>Spelen ger poäng precis som kapitlen och finns under fliken Spel i varje värld.</p>
          <ul className="space-y-2.5">
            {SPEL.map(g => <Item key={g.name} {...g} />)}
          </ul>
          <p className="text-sm">
            <strong>Boss Challenge</strong> låses upp efter fem avklarade övningar. Varje boss har en egen
            mekanik – kombobesvärjelse, isregenerering eller sköld – och en seger ger 120 poäng.
          </p>
        </Section>

        <Section emoji="⭐" title="Poängen">
          <ul className="space-y-1.5 list-disc pl-5 marker:text-orange-500">
            <li>Varje rätt svar i ett kapitel ger <strong>15 poäng</strong>, plus bonus för två eller tre stjärnor.</li>
            <li>Kommer du tillbaka en ny dag väntar en <strong>daglig bonus på 50 poäng</strong>.</li>
            <li>
              Ibland slår en <strong>turbonus</strong> till och dubblar eller tredubblar poängen. Den är
              slumpad och går inte att styra.
            </li>
            <li>
              Att göra om ett kapitel ger mindre varje gång: 100, 70, 50, 30 och sedan 20 procent. Man kan
              alltså inte samla poäng på samma kapitel hur länge som helst.
            </li>
            <li>Att rätta gamla fel under <strong>Försök igen</strong> ger 25–50 poäng.</li>
          </ul>
          <p className="text-sm">
            Stjärnan uppe till höger visar <strong>totalt intjänade poäng</strong>. Kundvagnen visar hur
            mycket som finns kvar att handla för. Det du handlar för dras bara från kundvagnen — stjärnan
            minskar aldrig, så du tappar varken nivå, kistor eller märken av att köpa något.
          </p>
        </Section>

        <Section emoji="🏅" title="Nivåerna">
          <p>
            Dina totala poäng ger en nivå, från <strong>Nybörjare</strong> till{' '}
            <strong>Matte-Legenden</strong> – elva nivåer där den sista nås vid 5 000 poäng. Nivån syns på
            Min sida och är helt kosmetisk: den låser inte upp något och sjunker aldrig.
          </p>
        </Section>

        <Section emoji="🎁" title="Kistorna">
          <p>Kistor samlas under pokalknappen uppe till höger. De kommer på flera sätt:</p>
          <ul className="space-y-1.5 list-disc pl-5 marker:text-amber-500">
            <li>När du passerar en <strong>poänggräns</strong> – den första redan vid 10 poäng.</li>
            <li>När du klarat ett visst <strong>antal kapitel</strong> – den första efter ett enda.</li>
            <li>När du får <strong>tre stjärnor</strong> eller alla rätt på ett kapitel.</li>
            <li>När du klarat <strong>alla kapitel i en värld</strong>.</li>
            <li>Som ren <strong>tur</strong> efter ett avklarat kapitel.</li>
          </ul>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {KISTOR.map(type => {
              const meta = CHEST_META[type];
              return (
                <div key={type} className="rounded-2xl border-2 border-orange-100 bg-orange-50/60 p-3 text-center">
                  <img src={meta.image} alt="" className="w-10 h-10 mx-auto mb-1.5 object-contain" />
                  <p className="text-sm font-bold text-gray-800">{meta.label}</p>
                </div>
              );
            })}
          </div>
          <p className="text-sm">
            En kista öppnas med ett klick och ger 20–120 poäng. Finare kistor ger dessutom märken och
            bonuskistor – diamantkistan ger alltid en smaragdkista på köpet.
          </p>
        </Section>

        <Section emoji="🛒" title="Affären">
          <p>
            I affären köper du saker för dina poäng. Allt är utseende – ingenting påverkar övningarna
            eller svårighetsgraden.
          </p>
          <ul className="space-y-1.5 list-disc pl-5 marker:text-emerald-500">
            <li><strong>Avatarer</strong> – din figur, över hundra att välja bland (150–5 000 poäng).</li>
            <li><strong>Ramar</strong> – en ram runt figuren (250–3 500 poäng).</li>
            <li><strong>Teman</strong> – bakgrunden på startsidan och Min sida (350–4 500 poäng).</li>
            <li><strong>Effekter</strong> – snöfall, bubblor och glitter runt figuren (100–3 000 poäng).</li>
          </ul>
          <p className="text-sm">
            Det du äger sätts på och av under <strong>Mina köp</strong>, och du kan alltid välja{' '}
            <strong>Standardtema</strong> för att få tillbaka appens vanliga utseende.
          </p>
        </Section>

        <Section emoji="👤" title="Min sida">
          <p>
            Klicka på ditt namn uppe till höger för att se din statistik: nivå, poäng, avklarade kapitel
            och träffsäkerhet. Där finns också <strong>31 utmärkelser</strong> att låsa upp,{' '}
            <strong>nio märken</strong> som kommer ur kistorna och en <strong>samling</strong> med 24
            föremål från äventyren.
          </p>
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
              Lämnar du ett kapitel mitt i kommer appen ihåg hur långt du hunnit.
            </li>
            <li>
              Svarar du fel är det inget misslyckande – frågan hamnar under Försök igen så att du får
              chansen igen när du är redo.
            </li>
          </ul>
        </Section>

        <div className="pt-1 pb-16">
          <button onClick={() => setView(back as any)}
            className="w-full py-3.5 rounded-2xl font-black text-white text-lg transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
            style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', border: '2px solid #b45309' }}>
            Tillbaka till appen
          </button>
        </div>
      </main>
    </div>
  );
}
