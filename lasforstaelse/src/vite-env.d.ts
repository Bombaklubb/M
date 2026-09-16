/// <reference types="vite/client" />

// Utan den här raden känner TypeScript inte till import.meta.env, som Vite
// fyller i vid bygget. main.tsx använder import.meta.env.PROD för att bara
// registrera service workern i den byggda versionen.

// Sätts av vite.config.ts vid varje bygge och används för att göra adressen
// till library.json unik per driftsättning.
declare const __BIBLIOTEK_BYGGE__: string;
