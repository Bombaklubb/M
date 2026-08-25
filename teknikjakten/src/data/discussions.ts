import { DiscussionPage } from '../types';

/**
 * Bokens sex uppslag med samtalsfrågor, ett i varje område utom
 * "Vad är teknik?" som saknar ett sådant uppslag.
 *
 * Frågorna har inget facit och rättas därför inte av appen – de ligger som en
 * flik i Bygg och prova, av samma skäl som projekten inte är kapitel.
 */
export const DISCUSSIONS: DiscussionPage[] = [
  {
    id: 'diskutera-bostad',
    areaId: 'bostad',
    bookPages: '31',
    prompts: [
      {
        kind: 'Fundera',
        questions: [
          'Föreställ dig hur ett hem ser ut om 50 år. Vad tror du ser likadant ut som i dag och vad tror du har förändrats?',
          'Det har alltid varit viktigt att kunna laga mat och hålla sig varm. Hur tror du att vi kommer att göra i framtiden för att laga mat och hålla oss varma?',
        ],
      },
      {
        kind: 'Diskutera',
        intro: 'Förr i tiden bestod många bostäder av ett enda stort rum. I dag har de flesta bostäder i stället flera mindre rum.',
        questions: [
          'Hur tror du att förändringen har påverkat människors sätt att leva tillsammans?',
        ],
      },
      {
        kind: 'Undersök',
        intro: 'Fjärrvärme, värmepump, biovärme, elvärme och solenergi är exempel på olika sätt att värma upp våra bostäder.',
        questions: [
          'Hur värms ditt hem upp? Ta reda på hur det går till.',
        ],
      },
    ],
  },

  {
    id: 'diskutera-vardag',
    areaId: 'vardag',
    bookPages: '55',
    prompts: [
      {
        kind: 'Undersök',
        intro: 'I skolan finns föremål av många olika material.',
        questions: [
          'Välj fem olika föremål som är tekniska lösningar och undersök vilket eller vilka material de är gjorda av. Varför är de gjorda i just det materialet?',
          'Undersök om någon av de tekniska lösningarna har delar som är sammanfogade, och då på vilket sätt.',
        ],
      },
      {
        kind: 'Diskutera',
        questions: [
          'Vilka material återvinner ni i ert hem? Hur gör ni för att återvinna?',
        ],
      },
      {
        kind: 'Diskutera',
        intro: 'Elektricitet är en viktig del i våra liv. Många av våra tekniska lösningar behöver elektricitet för att fungera.',
        questions: [
          'Hur skulle du påverkas om elektriciteten försvann under en vecka?',
        ],
      },
    ],
  },

  {
    id: 'diskutera-utveckling',
    areaId: 'utveckling',
    bookPages: '75',
    prompts: [
      {
        kind: 'Undersök',
        questions: [
          'Undersök några tekniska föremål i skolan. Vilken funktion har föremålen? Kan du se på föremålen vilka funktioner de har?',
        ],
      },
      {
        kind: 'Jämför',
        questions: [
          'Jämför stolen som du sitter på i skolan med stolarna som du har hemma. På vilket sätt skiljer sig stolarna åt? Vilka likheter finns?',
        ],
      },
      {
        kind: 'Undersök',
        questions: [
          'Välj tre föremål i klassrummet. Berätta vilken funktion föremålen har. Kom på två nya funktioner för varje föremål.',
        ],
      },
      {
        kind: 'Jämför',
        questions: [
          'Jämför ett par vinterskor med ett par sommarskor. Vilka skillnader och likheter finns det?',
        ],
      },
    ],
  },

  {
    id: 'diskutera-rorelse',
    areaId: 'rorelse',
    bookPages: '97',
    prompts: [
      {
        kind: 'Jämför',
        intro: 'Tekniska lösningar är ofta inspirerade av naturen, djur och människokroppen.',
        questions: [
          'Jämför armbågen med ett ledgångjärn på ett par glasögon. Vilka likheter finns det?',
          'På vilka fler ställen i din kropp finns det leder?',
          'Hur skiljer sig rörelserna mellan olika leder?',
        ],
      },
      {
        kind: 'Undersök',
        intro: 'I skolan finns många föremål som innehåller rörliga delar.',
        questions: [
          'Hitta minst tre föremål som innehåller rörliga delar och ta reda på hur delarna fungerar.',
        ],
      },
      {
        kind: 'Undersök',
        questions: [
          'Hitta minst tre föremål i skolan som består av enkla maskiner. Vilka enkla maskiner består föremålen av?',
        ],
      },
    ],
  },

  {
    id: 'diskutera-system',
    areaId: 'system',
    bookPages: '121',
    prompts: [
      {
        kind: 'Diskutera',
        intro: 'Människor har alltid använt vägar för att förflytta sig.',
        questions: [
          'På vilka olika sätt har människor förflyttat sig?',
          'Hur har vägarna anpassats efter utvecklingen av olika sätt att transportera sig?',
        ],
      },
      {
        kind: 'Diskutera',
        questions: [
          'På vilket sätt är vatten- och avloppssystemet beroende av elektricitet i energisystemet?',
        ],
      },
      {
        kind: 'Jämför',
        intro: 'Vatten- och avloppssystemet och energisystemet är två tekniska system.',
        questions: [
          'Vilka likheter och skillnader finns det mellan systemen?',
        ],
      },
    ],
  },

  {
    id: 'diskutera-digital',
    areaId: 'digital',
    bookPages: '151',
    prompts: [
      {
        kind: 'Fundera',
        intro: 'Digital teknik har förändrat vårt samhälle och hur vi lever våra liv. I dag söker vi ofta fakta, beställer saker och skickar meddelanden på internet.',
        questions: [
          'Hur tror du att människor gjorde dessa saker innan internet fanns?',
        ],
      },
      {
        kind: 'Diskutera',
        questions: [
          'Hur tror du vi kommer att använda och påverkas av AI i framtiden? Vad kan bli bra och vad tror du kommer att bli mindre bra?',
        ],
      },
      {
        kind: 'Diskutera',
        intro: 'Vad brukar du tänka på för att vara säker på nätet? Hur tänker du kring:',
        questions: [
          'lösenord?',
          'namn, adress och telefonnummer?',
          'fotografier?',
        ],
      },
    ],
  },
];
