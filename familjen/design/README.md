# Designunderlaget

Här ligger prototyperna från Claude Design som appen i `familjen/` är byggd efter.
De är ritade i HTML/CSS/JS och körs i Claude Designs egen runtime (`support.js`) —
inte produktionskod, utan facit för hur appen ska se ut och bete sig.

| Fil | Innehåll |
| --- | --- |
| `Familjetavlan.dc.html` | Den färdiga designen: telefonprototypen med alla fem flikar plus tre A4-blad |
| `Familjeappen.dc.html` | Första skissen med tre alternativa startskärmar (1a Veckotavlan, 1b Idag i fokus, 1c Vem gör vad) |
| `ios-frame.jsx` | Telefonramen som prototypen visas i — bara för presentationen |
| `support.js` | Claude Designs runtime som tolkar `.dc.html`-filerna |
| `avatars/` | Familjens avatarer (samma filer används av appen, i `public/avatars/`) |
| `chat.md` | Samtalet där designen togs fram — här står vad som faktiskt önskades |

Öppna en `.dc.html`-fil direkt i webbläsaren för att se prototypen.

## Vad som ändrades på vägen till appen

- **Låsskärmen** fanns inte i designen; den kom till när appen skulle ligga öppet på nätet.
- **Ett fjärde utskriftsblad** (viktiga datum) ritades i samma stil — utskriftspanelen
  erbjöd valet men designen hade inget färdigt blad.
- **Städbladet** låter personkorten växa efter innehåll i stället för fem lika höga rader,
  annars spiller det över sidkanten när någon har tre sysslor.
- Prototypens `x-dc`-runtime används inte i appen — allt är vanlig React.

Åldrar och sysslor (Astrid 11, Signe 8, Bodil 5) är gissningar från designarbetet och
ändras enklast i `src/data.ts`.
