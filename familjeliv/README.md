# Familjeliv

Familjens vecka på ett ställe: veckotavlan med alla sju dagar, matansvar, städschema
och träningar — plus färdiga A4-blad att sätta på kylskåpet.

Byggd från en Claude Design-prototyp (`Familjetavlan.dc.html`) med React + Vite + TypeScript.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # bygger till dist/
npm test         # testar lösenordsskyddet
```

## Lösenordsskydd

`middleware.ts` körs på Vercels edge före att något innehåll levereras. Utan giltig kaka
får besökaren bara inloggningssidan — appens HTML, JS och familjens schema lämnar aldrig
servern. Kakan är `HttpOnly`, `Secure` och innehåller en HMAC-signatur, inte lösenordet.

Sätt i Vercel under **Settings → Environment Variables**:

| Variabel | Värde | Krävs |
| --- | --- | --- |
| `APP_PASSWORD` | familjens lösenord (annars används `mkasb`) | nej, men rekommenderas |
| `AUTH_SECRET` | valfri lång slumpsträng som signerar kakan | nej, men rekommenderas |

Byter du någon av dem loggas alla ut automatiskt. Middleware kör bara på Vercel —
lokalt (`npm run dev`) är appen olåst. `npm test` paketerar middleware på samma sätt
som Vercel gör och provkör inloggningen; kör det efter varje ändring i filen.

**Importera ingenting från `src/` i `middleware.ts`.** Edge-funktionen paketeras för sig,
och en import in i appens källkod fäller hela funktionen: sidan svarar 500
(`MIDDLEWARE_INVOCATION_FAILED`) i stället för att fråga efter lösenordet, alltså är
appen nere. Behöver middleware något från appen skrivs det i klartext i filen, med ett
test som jämför värdena så de inte glider isär.

## Så hänger koden ihop

| Fil | Innehåll |
| --- | --- |
| `src/data.ts` | Familjen, veckans dagar, måltider, sysslor och träningar |
| | `PERSON_COLOR`: varje persons färg — ring, platta och textfärg, uppslagen med `colorOf(namn)` |
| | Matansvaret: `cook` per måltid — middag mån–fre, lunch och middag lör–sön |
| | `weekDays()`: veckan räknas ut från dagens datum, så "idag" flyttar sig av sig självt |
| `src/App.tsx` | Skalet: rubrik med avatarfilter, flikar, bottenpaneler |
| `src/views/` | En fil per flik: Hem, Mat, Städ, Träning |
| `src/Sheets.tsx` | Detaljpanelen och utskriftspanelen |
| `src/PrintSheets.tsx` | De fyra A4-bladen, renderas bara i `@media print` |
| `src/usePersisted.ts` | Sparar utskriftsvalen i `localStorage` |
| `middleware.ts` | Lösenordsskyddet på Vercels edge |
| `design/` | Designprototyperna från Claude Design som appen är byggd efter |

## Vad appen innehåller

Bara det familjen själv fört in: vem som har matansvaret för varje lunch och middag,
sysslorna per person, och träningarna med tid och vem som skjutsar. Rätter, inköpslistor
och packlistor finns medvetet inte — de bestäms löpande och hör inte hemma på ett schema
som ska gälla en hel vecka.

## Familjen

| Person | Djur | Färg |
| --- | --- | --- |
| Martin | Gris | Grön |
| Karin | Kanin | Blå |
| Astrid | Tupp | Lila |
| Signe | Mus | Rosa |
| Bodil | Orm | Orange |

Avatarerna är handritade SVG:er i `public/avatars/` med personens färg som bakgrund.
Färgen följer med genom hela appen *och* utskrifterna: ringen runt avataren, namnet på
städkortet, räknaren, den som är matansvarig — och varje gång ett namn dyker upp på ett
utskriftsblad. `<Named>` i `PrintSheets.tsx` färgar namnen i vilken text som helst, så
ansvaret går att läsa på en meter från kylskåpsdörren.

## Utskrift

🖨-knappen väljer vilka blad som ska med och stående eller liggande A4. Bladen skalas
till exakt A4-format och skrivs ut via webbläsarens vanliga utskrift.

Alla blad delar samma ram: rundad kant, familjens färger som ett band överst och
en färgnyckel längst ned på veckobladet.

| Blad | Innehåll |
| --- | --- |
| **Veckobladet** | Kylskåpslappen: en rad per dag med träning, matansvar och städ |
| Matansvar | Vem som fixar lunch och middag, dag för dag |
| Städschema | Sysslorna per person |
| Träningskalender | Tider och vem som skjutsar och hämtar |

Veckobladet är förvalt och går att titta på i appen innan utskrift — knappen
👁 **Titta på veckobladet** i utskriftspanelen visar bladet nedskalat, precis som det
kommer ut på papper. Sysslorna som görs varje dag står på alla sju dagarna, inte bara
en gång: den som läser lappen ska se att rummen städas dagligen. För att veckan ska
rymmas på ett enda A4 skrivs de som löpande text, och personer med identiska sysslor
slås ihop ("Astrid & Signe rummet").

Bladen måste rymmas på sidan — en rad som växer förbi papperskanten klipps bort utan
att synas på skärmen. Efter varje ändring i `PrintSheets.tsx` är det värt att mäta i
en riktig webbläsare att inget element har `scrollHeight` större än `clientHeight`.

## Deploy

Eget Vercel-projekt, importerat från `Bombaklubb/M`:

| Inställning | Värde |
| --- | --- |
| Project Name | `familjeliv` → familjeliv.vercel.app |
| Root Directory | `familjeliv` |
| Framework | Vite (hittas automatiskt) |
| Environment Variables | `APP_PASSWORD`, `AUTH_SECRET` |

`middleware.ts` ligger i mappens rot och plockas upp av Vercel utan extra konfiguration.
Adressen finns inte hårdkodad någonstans i koden, så den går att byta när som helst.

Miljövariabler läses vid bygget. Lägger du till eller ändrar `APP_PASSWORD` eller
`AUTH_SECRET` måste du göra en **Redeploy** efteråt, annars kör den gamla bygget vidare
utan dem.

### När en ny version inte dyker upp

`vercel.json` har en `ignoreCommand` som hoppar över bygget när ingenting i `familjeliv/`
ändrats — repot innehåller ett tiotal appar och alla får en deploy vid varje push.

Hobby-kontot tillåter 100 deployer per dygn för hela kontot. Slår taket i får pushar
inga bygge alls, och då syns de inte ens som misslyckade rader under **Deployments** —
de saknas helt. Jämför översta radens commit med `git log origin/main` för att se vad
som faktiskt är ute. En **Redeploy** hjälper inte då: den bygger om den deploy du pekar
på, alltså den gamla commiten.
