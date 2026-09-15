interface Props {
  onBack: () => void;
}

// ─── Om NP-jakten ────────────────────────────────────────────────────────────
// Förklarar appen för elever, vårdnadshavare och kollegor. Siffrorna här ska
// spegla den faktiska appen – ändras något i innehållet eller i rättningen bör
// den här texten uppdateras också.

function Section({
  emoji,
  title,
  children,
}: {
  emoji: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="paper mt-4">
      <h2 className="flex items-center gap-2.5 border-b-2 border-np pb-2 font-serif text-xl font-bold">
        <span className="text-2xl" aria-hidden="true">
          {emoji}
        </span>
        {title}
      </h2>
      <div className="mt-3 space-y-3 leading-relaxed text-stone-700">{children}</div>
    </section>
  );
}

const DELPROV = [
  {
    emoji: "📖",
    name: "Läsa",
    desc: "Lästexter med frågor efter, precis som i provhäftet. Skönlitteratur, faktatexter, instruktioner, dikter och tidningsartiklar.",
  },
  {
    emoji: "🎧",
    name: "Lyssna",
    desc: "Bara i engelska. Texten läses upp av appen och manuset visas aldrig på skärmen – du lyssnar och svarar, som på det riktiga provet.",
  },
  {
    emoji: "✍️",
    name: "Skriva",
    desc: "Skrivuppgifter i provens texttyper med samma stödord och checklistor som bedömningsanvisningarna använder.",
  },
  {
    emoji: "💬",
    name: "Muntligt",
    desc: "Gruppsamtal med samtalskort, och för åk 9 även förberedd presentation med stödkort. Själva samtalet sker i klassrummet – appen ger strukturen.",
  },
];

const FRAGETYPER = [
  {
    emoji: "🅰️",
    name: "Flervalsfrågor",
    desc: "Ett alternativ är rätt. Efter rättningen står det varför det är rätt och varför de andra inte är det.",
  },
  {
    emoji: "✏️",
    name: "Öppna frågor",
    desc: "Du skriver svaret själv. Vid rättningen får du se exempelsvar för varje poängnivå och sätter din egen poäng.",
  },
  {
    emoji: "🔢",
    name: "Ordningsfrågor",
    desc: "Bara i åk 3. Sätt händelserna i rätt ordning, som i provets tidslinjeuppgifter.",
  },
];

export default function AboutPage({ onBack }: Props) {
  return (
    <div className="mx-auto max-w-3xl">
      <button
        type="button"
        onClick={onBack}
        className="no-print mb-4 text-sm font-medium text-np hover:underline"
      >
        ← Tillbaka
      </button>

      <div className="paper">
        <p className="text-sm font-semibold uppercase tracking-widest text-np">
          Så fungerar appen
        </p>
        <h1 className="mt-2 font-serif text-4xl font-bold leading-tight">
          Om NP-jakten
        </h1>
        <p className="mt-4 text-stone-600">
          NP-jakten är övningsmaterial inför de nationella proven. Allt innehåll är
          nyskrivet – inga riktiga provuppgifter finns i appen – men uppgifterna följer
          provens upplägg, frågetyper och bedömningsanvisningar.
        </p>
      </div>

      <Section emoji="🎯" title="Vad är NP-jakten?">
        <p>
          Appen tränar <strong>svenska</strong> för årskurs 3, 6 och 9 och{" "}
          <strong>engelska</strong> för årskurs 6 och 9. Du väljer ämne, sedan årskurs
          och sedan ett delprov.
        </p>
        <p>
          NP-jakten är gratis, kräver inget konto och fungerar i webbläsaren på
          Chromebook, dator, surfplatta och mobil.
        </p>
      </Section>

      <Section emoji="🚀" title="Kom igång">
        <ol className="space-y-2.5">
          {[
            [
              "Välj ämne",
              "Svenska eller engelska. Ämnena är helt åtskilda – övningar och statistik blandas aldrig.",
            ],
            [
              "Välj årskurs",
              "Uppgifterna är skrivna för den årskursens prov. Behöver du lättare eller svårare material går det bra att välja en annan årskurs.",
            ],
            [
              "Öppna ett delprov",
              "Svara i din egen takt. Behöver du sluta mitt i är det ingen fara – appen kommer ihåg vad du skrivit.",
            ],
          ].map(([rubrik, text], i) => (
            <li key={rubrik} className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-np text-xs font-bold text-white">
                {i + 1}
              </span>
              <span>
                <strong>{rubrik}.</strong> {text}
              </span>
            </li>
          ))}
        </ol>
      </Section>

      <Section emoji="📚" title="Delproven">
        <p>
          Delproven heter samma sak som i de riktiga proven, så att du känner igen dig
          på provdagen.
        </p>
        <ul className="space-y-2.5">
          {DELPROV.map((d) => (
            <li key={d.name} className="flex items-start gap-3">
              <span
                className="flex h-8 w-8 flex-none items-center justify-center rounded bg-np-light text-base"
                aria-hidden="true"
              >
                {d.emoji}
              </span>
              <span>
                <strong>{d.name}.</strong> {d.desc}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section emoji="✍️" title="Frågetyperna">
        <div className="grid gap-2 sm:grid-cols-3">
          {FRAGETYPER.map((t) => (
            <div key={t.name} className="rounded border-2 border-np/25 bg-np-light p-3.5">
              <p className="mb-1 font-bold text-np">
                <span aria-hidden="true">{t.emoji}</span> {t.name}
              </p>
              <p className="text-sm">{t.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section emoji="✅" title="Rättningen">
        <p>
          Du svarar först på hela provet och trycker sedan på{" "}
          <strong>Rätta provet</strong>. Inget rättas i förväg – annars vore det ingen
          provträning.
        </p>
        <ul className="list-disc space-y-1.5 pl-5 marker:text-np">
          <li>
            Flervalsfrågorna rättas av appen, med en förklaring till varje svar.
          </li>
          <li>
            De öppna frågorna rättar du själv. För varje poängnivå finns ett{" "}
            <strong>exempelsvar</strong> att jämföra med, hämtat ur provens
            bedömningsanvisningar.
          </li>
          <li>
            Skrivuppgifterna bedöms mot en <strong>checklista</strong> med provens egna
            krav – för åk 3 till exempel stor bokstav och skiljetecken, inledning,
            handling och avslut, och rätt antal innehållsord.
          </li>
        </ul>
      </Section>

      <Section emoji="📊" title="Min statistik">
        <p>
          Under fliken <strong>Min statistik</strong> ser du hur det gått per{" "}
          <strong>uppgiftstyp</strong> – alltså samma indelning som provens
          bedömningsanvisningar använder: att hitta information, att förstå
          sammanhang, att tolka och dra slutsatser, och att granska och värdera.
        </p>
        <p className="text-sm">
          Statistiken visar bara de prov du rättat, och räknas per ämne. Du kan rensa
          den när du vill.
        </p>
      </Section>

      <Section emoji="⏱" title="Provtiden">
        <p>
          Varje prov har en <strong>klocka</strong> som du kan starta om du vill öva
          under tidspress. Du väljer själv hur många minuter, och de sista fem
          minuterna markeras. Klockan är frivillig – den stoppar ingenting.
        </p>
      </Section>

      <Section emoji="🖨" title="Skriva ut">
        <p>Allt går att skriva ut på papper, i flera varianter:</p>
        <ul className="list-disc space-y-1.5 pl-5 marker:text-np">
          <li>
            <strong>Texten och frågorna</strong> som ett vanligt provhäfte, med länken
            bredvid textens titel.
          </li>
          <li>
            <strong>Samtalskorten</strong> och <strong>stödkorten</strong> för de
            muntliga delarna, färdiga att klippa isär.
          </li>
          <li>
            <strong>Facit</strong> och <strong>observationsschema</strong> för läraren.
          </li>
        </ul>
      </Section>

      <Section emoji="🔒" title="Facit">
        <p>
          Under varje övning finns en facitknapp. Den är{" "}
          <strong>lösenordsskyddad</strong> så att eleverna inte kommer åt svaren av
          misstag – läraren skriver in lösenordet för att öppna den.
        </p>
        <p className="text-sm">
          Upplåsningen gäller så länge webbläsarfliken är öppen, och facit följer aldrig
          med i en vanlig elevutskrift.
        </p>
      </Section>

      <Section emoji="🔊" title="Stöd när du läser">
        <ul className="list-disc space-y-1.5 pl-5 marker:text-np">
          <li>
            <strong>Uppläsning.</strong> Texter, instruktioner och frågor kan läsas upp.
            Engelska texter läses med engelsk röst.
          </li>
          <li>
            <strong>Läsinställningar.</strong> Under <em>Aa</em> uppe till höger går det
            att välja större text, mer luft mellan raderna och ett lättläst typsnitt.
            Valen sparas.
          </li>
          <li>
            <strong>Lästips.</strong> Före varje delprov står några korta råd om hur man
            brukar gå till väga. De går att fälla ihop.
          </li>
        </ul>
      </Section>

      <Section emoji="💡" title="Bra att veta">
        <ul className="list-disc space-y-1.5 pl-5 marker:text-np">
          <li>
            <strong>Allt sparas på den enhet du använder.</strong> Svar, resultat och
            inställningar ligger i webbläsaren, aldrig på en server. Byter du dator eller
            rensar webbläsarens data börjar du om från början.
          </li>
          <li>
            Inget konto behövs, och appen samlar inte in några uppgifter om dig.
          </li>
          <li>
            Innehållet är <strong>nyskrivet övningsmaterial</strong>. Personer, platser
            och händelser i texterna är påhittade.
          </li>
        </ul>
      </Section>

      <div className="no-print py-8">
        <button
          type="button"
          onClick={onBack}
          className="w-full rounded border-2 border-np bg-np px-6 py-3 font-semibold text-white transition hover:bg-np-dark"
        >
          Tillbaka till appen
        </button>
      </div>
    </div>
  );
}
