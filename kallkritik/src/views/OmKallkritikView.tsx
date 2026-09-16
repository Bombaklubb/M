import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { MODULES, TRACKS } from '@/data/modules';
import { View } from '@/types';

/**
 * Sidan "Om Källkritikjakten".
 *
 * Byggd som motsvarigheten i Läsjakten: en rubrikrad överst med tillbakasteg,
 * och därefter avsnitt med emoji och rubrik. Formspråket är dock appens eget
 * (clay-kort, Baloo 2, indigo/violett).
 *
 * Siffrorna nedan är hämtade ur koden, inte uppskattade. Antal moduler och
 * temanamn läses direkt från data/modules.ts så texten inte kan glida isär
 * från appen.
 */

const Avsnitt: React.FC<{ emoji: string; titel: string; children: React.ReactNode }> = ({
  emoji,
  titel,
  children,
}) => (
  <section className="clay-card p-5 sm:p-6">
    <h2
      className="flex items-center gap-2.5 text-lg font-extrabold text-gray-800 mb-4"
      style={{ fontFamily: "'Baloo 2', sans-serif" }}
    >
      <span className="text-2xl" aria-hidden="true">{emoji}</span>
      {titel}
    </h2>
    <div className="space-y-3 text-[15px] leading-relaxed text-gray-600 font-medium">
      {children}
    </div>
  </section>
);

interface OmKallkritikViewProps {
  onNavigate: (view: View) => void;
}

export function OmKallkritikView({ onNavigate }: OmKallkritikViewProps) {
  return (
    <div>
      {/* Rubrikrad */}
      <div className="bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 text-white">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-bold mb-3 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Tillbaka
          </button>
          <div className="flex items-center gap-3">
            <span className="text-4xl" aria-hidden="true">🔎</span>
            <div>
              <h1 className="text-2xl font-extrabold" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                Om Källkritikjakten
              </h1>
              <p className="text-white/80 text-sm font-semibold">Så fungerar appen</p>
            </div>
          </div>
        </div>
      </div>

      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-3xl mx-auto px-4 py-6 space-y-5 pb-20"
      >
        <Avsnitt emoji="🎯" titel="Vad är Källkritikjakten?">
          <p>
            Källkritikjakten tränar <strong className="text-gray-800">källkritik på nätet</strong>, med
            särskilt fokus på sociala medier och AI. Du väljer en modul, lär dig en metod och testar
            den sedan på verklighetsnära exempel. Varje svar förklaras direkt.
          </p>
          <p>
            Appen har {MODULES.length} moduler fördelade på {TRACKS.length} teman, med sammanlagt
            drygt 80 frågor och övningar.
          </p>
          <p>
            Den är gratis, kräver inget konto och fungerar i webbläsaren på Chromebook, dator,
            surfplatta och mobil.
          </p>
        </Avsnitt>

        <Avsnitt emoji="🚀" titel="Kom igång">
          <ol className="space-y-2.5">
            {[
              ['Skriv ditt namn', 'Nästa gång du skriver samma namn hittar appen dina poäng och märken igen.'],
              ['Välj en modul', 'Grönt "Börja här!" visar vilken som är nästa i den rekommenderade ordningen. Du får hoppa fritt.'],
              ['Lär dig först, testa sedan', 'De flesta moduler börjar med en kort genomgång av metoden. Sedan kommer frågorna.'],
            ].map(([rubrik, text], i) => (
              <li key={rubrik} className="flex gap-3">
                <span className="flex-none w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span>
                  <strong className="text-gray-800">{rubrik}.</strong> {text}
                </span>
              </li>
            ))}
          </ol>
        </Avsnitt>

        <Avsnitt emoji="🧭" titel={`De ${TRACKS.length} temana`}>
          <p>
            Modulerna är grupperade i teman. Ordningen är genomtänkt: metoderna i det första temat
            används i alla de andra.
          </p>
          <ul className="space-y-2.5">
            {TRACKS.map(track => (
              <li key={track.title} className="flex gap-3">
                <span className="flex-none text-xl" aria-hidden="true">{track.icon}</span>
                <span>
                  <strong className="text-gray-800">{track.title}.</strong> {track.desc}
                </span>
              </li>
            ))}
          </ul>
        </Avsnitt>

        <Avsnitt emoji="🚦" titel="Källkollen">
          <p>
            Källkollen är ett verktyg, inte ett quiz. Du väljer en <strong className="text-gray-800">riktig</strong>{' '}
            sajt eller ett konto, svarar på åtta frågor om den och får en trafikljus-bedömning.
          </p>
          <p>
            Frågorna bygger på de fyra grundfrågorna i källkritik: äkthet, aktualitet, oberoende och
            tendens. Verktyget fungerar i alla ämnen, inte bara här i appen.
          </p>
        </Avsnitt>

        <Avsnitt emoji="⭐" titel="Poäng, nivåer och märken">
          <p>
            Du får XP för varje rätt svar. Poängen höjer din nivå, från{' '}
            <strong className="text-gray-800">Nybörjare</strong> upp till{' '}
            <strong className="text-gray-800">Källkritikguru</strong> på nivå 10.
          </p>
          <p>
            Varje modul har ett eget märke som du låser upp genom att klara den riktigt bra. En modul
            räknas som klarad från 50 procent rätt.
          </p>
          <p className="text-sm">
            Spelar du om en modul får du en fjärdedel av XP:n. Att öva igen är bra, men det ska inte
            löna sig bättre än att göra en ny modul. Ditt bästa resultat sparas alltid.
          </p>
        </Avsnitt>

        <Avsnitt emoji="🎓" titel="För dig som är pedagog">
          <p>
            Varje modulkort har en knapp som heter{' '}
            <strong className="text-gray-800">Innan du börjar – pedagog</strong>. Där finns en färdig
            lektionsguide: startfrågor att ställa innan, hur eleverna arbetar i par, samtalsfrågor
            efteråt och en gemensam klassrumsövning.
          </p>
          <p>
            Appen är byggd för <strong className="text-gray-800">EPA-modellen</strong>. Efter varje
            avslöjat svar dyker en samtalsfråga upp, så att eleven först svarar enskilt, sedan
            diskuterar i par och till sist lyfter frågan i helklass.
          </p>
          <p>
            Efter varje avklarad modul får eleven ett uppdrag att göra{' '}
            <strong className="text-gray-800">utanför appen</strong>, i sitt eget flöde. Det redovisas
            i smågrupp och är tänkt som bryggan mellan övning och verklighet.
          </p>
          <p className="text-sm">
            När alla moduler är klara kan eleven skriva ut ett diplom.
          </p>
        </Avsnitt>

        <Avsnitt emoji="🔒" titel="Bra att veta">
          <ul className="space-y-2.5">
            <li>Inga personuppgifter samlas in. Ditt namn och dina poäng sparas bara i din egen webbläsare.</li>
            <li>Flera elever kan dela samma dator. Var och en skriver sitt namn och ser bara sitt eget resultat.</li>
            <li>Byter du dator börjar du om, eftersom ingenting sparas på någon server.</li>
            <li>Rensar du webbläsarens data försvinner poängen. Det går inte att få tillbaka.</li>
          </ul>
        </Avsnitt>

        <Avsnitt emoji="✉️" titel="Hör av dig">
          <p>
            Hittar du ett faktafel, en fråga med två rimliga svar eller något som inte fungerar? Skriv
            gärna. Det är så appen blir bättre.
          </p>
          <p>
            <a
              href="mailto:martin.akdogan@enkoping.se?subject=K%C3%A4llkritikjakten"
              className="font-bold text-indigo-700 hover:underline"
            >
              martin.akdogan@enkoping.se
            </a>
          </p>
        </Avsnitt>

        <div className="pt-2 text-center">
          <button
            onClick={() => onNavigate('home')}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 border-2 border-indigo-700 text-white font-extrabold transition-colors cursor-pointer"
            style={{ fontFamily: "'Baloo 2', sans-serif" }}
          >
            ← Tillbaka till Källkritikjakten
          </button>
        </div>
      </motion.main>
    </div>
  );
}
