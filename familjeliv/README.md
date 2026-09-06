# Familjeliv

Familjens vecka på ett ställe: dagöversikt, matschema med inköpslista, städschema,
träningar och viktiga datum — plus färdiga A4-blad att sätta på kylskåpet.

Byggd från en Claude Design-prototyp (`Familjetavlan.dc.html`) med React + Vite + TypeScript.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # bygger till dist/
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
lokalt (`npm run dev`) är appen olåst.

## Så hänger koden ihop

| Fil | Innehåll |
| --- | --- |
| `src/data.ts` | Familjen, veckans dagar, måltider, sysslor, träningar och datum |
| `src/App.tsx` | Skalet: rubrik med avatarfilter, flikar, bottenpaneler |
| `src/views/` | En fil per flik: Hem, Mat, Städ, Träning, Datum |
| `src/Sheets.tsx` | Detaljpanelen och utskriftspanelen |
| `src/PrintSheets.tsx` | De fem A4-bladen, renderas bara i `@media print` |
| `src/usePersisted.ts` | Sparar avbockat, inköpslista och utskriftsval i `localStorage` |
| `middleware.ts` | Lösenordsskyddet på Vercels edge |
| `design/` | Designprototyperna från Claude Design som appen är byggd efter |

Avbockade sysslor och inköpslistan sparas per enhet i webbläsaren — ingen server, inget konto.

## Utskrift

🖨-knappen väljer vilka blad som ska med och stående eller liggande A4. Bladen skalas
till exakt A4-format och skrivs ut via webbläsarens vanliga utskrift.

| Blad | Innehåll |
| --- | --- |
| **Veckobladet** | Kylskåpslappen: en rad per dag med träning, middag och vem som gör vad |
| Matschema | Veckans middagar plus vad som är kvar att handla |
| Städschema | Per person, med rutor att kryssa i för hand |
| Träningskalender | Tider, plats, skjuts och vad som ska tas med |
| Viktiga datum | Månadsrutnät och kommande händelser |

Veckobladet är förvalt och går att titta på i appen innan utskrift — knappen
👁 **Titta på veckobladet** i utskriftspanelen visar bladet nedskalat, precis som det
kommer ut på papper. Sysslor som återkommer varje dag hamnar i sidfoten i stället för
i varje ruta, så rutnätet bara visar det som skiljer dagarna åt.

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
