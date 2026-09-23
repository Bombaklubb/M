import React from 'react';
import { JAKT_APPS } from './JaktLinks';

/** Vad varje app i Jaktlänkar tränar. Länkarna själva kommer från menyn. */
const JAKT_BESKRIVNING: Record<string, string> = {
  Svenskajakten: 'svensk grammatik, stavning och ordkunskap.',
  Mattejakten: 'matematik.',
  Engelskajakten: 'engelsk grammatik, stavning och ordförråd.',
  Readhunt: 'läsförståelse på engelska.',
};

/**
 * Sidan "Om Läsjakten".
 *
 * Byggd som motsvarigheten i Engelskajakten: en rubrikrad överst, ett
 * tillbakasteg, och därefter avsnitt med emoji och rubrik. Skillnaden är att
 * Läsjakten är en enda sida utan router, så vyn visas som en egen skärm i
 * stället för på adressen /om.
 *
 * Siffrorna nedan är hämtade ur biblioteket och koden, inte uppskattade.
 * Ändras de någon gång behöver den här texten följa med.
 */

const Avsnitt: React.FC<{ emoji: string; titel: string; children: React.ReactNode }> = ({
  emoji,
  titel,
  children,
}) => (
  <section className="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
    <h2 className="flex items-center gap-2.5 text-lg font-black text-slate-800 dark:text-white mb-4">
      <span className="text-2xl" aria-hidden="true">{emoji}</span>
      {titel}
    </h2>
    <div className="space-y-3 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
      {children}
    </div>
  </section>
);

const FRAGETYPER: [string, string, string][] = [
  ['🔍', 'På raderna', 'Svaret står ordagrant i texten. Du letar upp det.'],
  ['🧠', 'Mellan raderna', 'Svaret står inte utskrivet. Du drar en slutsats av det som står.'],
  ['📖', 'Ord & begrepp', 'Vad ett ord eller uttryck betyder i just den här texten.'],
  ['📝', 'Sammanfatta', 'Vad texten handlar om som helhet, inte en enskild detalj.'],
  ['🎯', 'Författarens syfte', 'Varför texten är skriven och vad den vill med läsaren.'],
  ['📑', 'Textbevis', 'Vilken mening i texten som är belägget. Alternativen är citat.'],
];

interface OmLasjaktenProps {
  onClose: () => void;
}

export const OmLasjakten: React.FC<OmLasjaktenProps> = ({ onClose }) => (
  <div className="min-h-screen bg-sky-50 dark:bg-slate-900">
    {/* Rubrikrad */}
    <div className="bg-gradient-to-r from-emerald-600 to-sky-600 text-white">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-1 text-white/75 hover:text-white text-sm mb-3 transition-colors cursor-pointer"
        >
          ← Tillbaka
        </button>
        <div className="flex items-center gap-3">
          <span className="text-4xl" aria-hidden="true">📚</span>
          <div>
            <h1 className="text-2xl font-black">Om Läsjakten</h1>
            <p className="text-white/80 text-sm">Så fungerar appen</p>
          </div>
        </div>
      </div>
    </div>

    <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">
      <Avsnitt emoji="🎯" titel="Vad är Läsjakten?">
        <p>
          Läsjakten tränar <strong>läsförståelse på svenska</strong>. Du väljer en nivå, får en text
          att läsa och svarar på sex frågor om den. Varje svar rättas direkt, och efteråt kan du se
          vilka du hade rätt på och varför.
        </p>
        <p>
          Biblioteket har 542 texter och drygt 3 200 frågor, från fyra korta meningar upp till
          resonerande texter på sexhundra ord.
        </p>
        <p>
          Appen är gratis, kräver inget konto och fungerar i webbläsaren på Chromebook, dator,
          surfplatta och mobil.
        </p>
      </Avsnitt>

      <Avsnitt emoji="🚀" titel="Kom igång">
        <ol className="space-y-2.5">
          {[
            ['Skriv ditt namn', 'Välj en figur och skriv ett namn. Nästa gång du skriver samma namn hittar appen dina poäng igen.'],
            ['Välj nivå', 'Nivå 1 är lättast, nivå 10 svårast. Du väljer fritt och kan byta när du vill.'],
            ['Läs och svara', 'Texten ligger kvar bredvid frågorna hela tiden. Du får gå tillbaka och läsa om så mycket du vill innan du svarar.'],
          ].map(([rubrik, text], i) => (
            <li key={rubrik} className="flex gap-3">
              <span className="flex-none w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <span>
                <strong className="text-slate-800 dark:text-white">{rubrik}.</strong> {text}
              </span>
            </li>
          ))}
        </ol>
      </Avsnitt>

      <Avsnitt emoji="📊" titel="Nivåerna">
        <p>
          Nivåerna går från 1 till 10 och skiljer sig i både längd och svårighet. På nivå 1 är
          texterna omkring tjugo ord med en sats per mening. På nivå 10 är de sexhundra ord och
          resonerar om något som inte har ett givet svar.
        </p>
        <p>
          Nivån är inte låst till din årskurs. Den som vill utmana sig går upp ett steg, och den som
          vill komma i gång lugnt går ner ett. Efter varje text kan du välja lättare, samma eller
          svårare nivå direkt.
        </p>
      </Avsnitt>

      <Avsnitt emoji="❓" titel="De sex frågetyperna">
        <p>
          Varje text har sex frågor, och de tränar olika saker. Typen står alltid ovanför frågan, så
          att du vet vad du ska leta efter.
        </p>
        <ul className="space-y-2.5">
          {FRAGETYPER.map(([emoji, namn, beskrivning]) => (
            <li key={namn} className="flex gap-3">
              <span className="flex-none text-xl" aria-hidden="true">{emoji}</span>
              <span>
                <strong className="text-slate-800 dark:text-white">{namn}.</strong> {beskrivning}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-sm">
          I profilen ser du hur det går för dig på varje typ. Är en av dem svårare än de andra syns
          det där.
        </p>
      </Avsnitt>

      <Avsnitt emoji="⭐" titel="Poängen">
        <p>
          Hur mycket en text ger beror på nivån. En felfri text ger 80 poäng på nivå 1 och 260 på
          nivå 10. Har du ett fel får du ungefär sextio procent av potten.
        </p>
        <p>
          Läser du om en text du redan gjort ger den en fjärdedel. Att läsa om är bra träning, men
          du kan ju svaren, så det ska inte löna sig bättre än att läsa något nytt.
        </p>
        <p className="text-sm">
          Stjärnan uppe till höger visar allt du tjänat. Kundvagnen visar hur mycket du har kvar att
          handla för.
        </p>
      </Avsnitt>

      <Avsnitt emoji="🎁" titel="Kistorna">
        <p>
          Kistor kommer när du passerar en milstolpe, antingen i poäng eller i antal lästa texter.
          Det finns sju sorter, från brons till den hemliga kistan, och ju ovanligare kista desto mer
          ger den när du öppnar den.
        </p>
        <p>
          Ibland dyker det också upp en överraskning direkt efter en text. Den kan ge bonuspoäng, en
          kista eller ett märke.
        </p>
      </Avsnitt>

      <Avsnitt emoji="🛒" titel="Affären">
        <p>
          I affären köper du figurer, ramar, effekter och teman med dina poäng. Det du utrustar syns
          överallt i appen, inte bara på profilsidan.
        </p>
        <p className="text-sm">
          Poängen du handlar för är skilda från dina livstidspoäng. Du tappar alltså inte några
          märken eller milstolpar av att handla.
        </p>
      </Avsnitt>

      <Avsnitt emoji="🔊" titel="Hjälp när du läser">
        <ul className="space-y-2.5">
          <li>
            <strong className="text-slate-800 dark:text-white">Lyssna.</strong> Appen läser texten
            högt. Bra när ett ord är svårt att avkoda men lätt att förstå.
          </li>
          <li>
            <strong className="text-slate-800 dark:text-white">Lyssna på frågan och på svaren.</strong>{' '}
            Två knappar under varje fråga. De är skilda åt, så att du kan höra om alternativen utan
            att lyssna på hela frågan igen.
          </li>
          <li>
            <strong className="text-slate-800 dark:text-white">Textstorlek.</strong> Tre storlekar,
            uppe vid texten.
          </li>
          <li>
            <strong className="text-slate-800 dark:text-white">Bionic.</strong> Första halvan av
            varje ord blir fetstil. En del tycker att ögat då fastnar mindre.
          </li>
          <li>
            <strong className="text-slate-800 dark:text-white">Understrukna ord.</strong> Klicka på
            ett understruket ord så förklaras det.
          </li>
        </ul>
      </Avsnitt>

      <Avsnitt emoji="🧭" titel="Jaktlänkar">
        <p>
          Längst ned till höger på varje sida finns knappen <strong>Jaktlänkar ▾</strong>. Den öppnar
          en meny med de andra apparna i samma familj. De öppnas i en ny flik, så Läsjakten ligger
          kvar där du var.
        </p>
        <ul className="space-y-2.5">
          {JAKT_APPS.map((app) => (
            <li key={app.url} className="flex gap-3 items-start">
              <span
                className="flex-none w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center"
                aria-hidden="true"
              >
                {app.icon}
              </span>
              <span>
                <a
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-emerald-700 dark:text-emerald-400 underline underline-offset-2 hover:text-emerald-800 dark:hover:text-emerald-300"
                >
                  {app.name}
                </a>{' '}
                – {JAKT_BESKRIVNING[app.name] ?? ''}{' '}
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  ({app.url.replace('https://', '')})
                </span>
              </span>
            </li>
          ))}
        </ul>
        <p className="text-sm">
          Läsjakten och Readhunt tränar samma sak på två språk. Går en text för lätt på svenska kan
          engelskan vara nästa steg.
        </p>
      </Avsnitt>

      <Avsnitt emoji="🔒" titel="Bra att veta">
        <ul className="space-y-2.5">
          <li>Inga personuppgifter samlas in. Ditt namn och dina poäng sparas bara i din egen webbläsare.</li>
          <li>Statistiken som läraren ser är anonym och summerad. Den går inte att koppla till en elev.</li>
          <li>Byter du dator börjar du om, eftersom ingenting sparas på någon server.</li>
          <li>Rensar du webbläsarens data försvinner poängen. Det går inte att få tillbaka.</li>
        </ul>
      </Avsnitt>

      <Avsnitt emoji="✉️" titel="Hör av dig">
        <p>
          Hittar du ett fel i en text, en fråga med två rimliga svar eller något som inte fungerar?
          Skriv gärna. Det är så appen blir bättre.
        </p>
        <p>
          <a
            href="mailto:martin.akdogan@enkoping.se?subject=L%C3%A4sjakten"
            className="font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
          >
            martin.akdogan@enkoping.se
          </a>
        </p>
      </Avsnitt>

      <div className="pt-2 pb-8 text-center">
        <button
          onClick={onClose}
          className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors cursor-pointer"
        >
          ← Tillbaka till Läsjakten
        </button>
      </div>
    </main>
  </div>
);

export default OmLasjakten;
