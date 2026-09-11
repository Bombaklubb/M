import React from 'react';

const ADRESS = 'martin.akdogan@enkoping.se';

/** mailto med förifyllt ämne, så att posten går att sortera i inkorgen. */
const brev = (amne: string) => `mailto:${ADRESS}?subject=${encodeURIComponent(amne)}`;

/**
 * Kontaktrutan på startsidan.
 *
 * Tidigare låg kontaktuppgiften som en lös textrad längst ner till vänster.
 * Den syntes knappt och sa ingenting om vad man skulle höra av sig om, så den
 * fungerade mest som en signatur. Rutan säger nu vad avsändaren är ute efter
 * och ger två färdiga vägar in: en fråga eller ett tips.
 *
 * Knapparna är vanliga mailto-länkar med förifyllt ämne. Det kostar ingenting
 * i kod och gör posten sorterbar för den som tar emot den.
 *
 * Bredden är hållen så att rutan aldrig når fram till Jaktlänkar, som ligger
 * i motsatt hörn. På en telefon slutar rutan omkring 190 pixlar in, och
 * Jaktlänkar börjar först en bit därefter.
 */
export const KontaktRuta: React.FC = () => (
  <div className="fixed bottom-4 left-4 z-40 max-w-[11rem] sm:max-w-[15rem]">
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-3">
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
        Hör av dig om du har
      </p>

      <div className="flex flex-wrap gap-2 mb-2">
        <a
          href={brev('Fråga om Läsjakten')}
          className="inline-flex items-center gap-1 rounded-lg bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 px-2 py-1 text-xs font-semibold text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
        >
          <span aria-hidden="true">❓</span> Frågor
        </a>
        <a
          href={brev('Tips till Läsjakten')}
          className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 px-2 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
        >
          <span aria-hidden="true">💡</span> Tips
        </a>
      </div>

      {/* index.css ger varje länk min-height 44px som touch-yta. Utan
          items-center lägger sig texten i överkant av den ytan, och rutan får
          en tom remsa längst ner som ser ut som ett fel. */}
      <a
        href={brev('Läsjakten')}
        className="flex items-center text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors break-words"
      >
        {ADRESS}
      </a>
    </div>
  </div>
);

export default KontaktRuta;
