import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  // Bygg-id som libraryService hänger på adressen till library.json.
  //
  // Servicearbetaren svarar ur cachen först för den filen, vilket är rätt för
  // en två megabyte stor fil på ett skolnät. Men det gjorde också att en elev
  // kunde se gårdagens nivåindelning i en app vars kod var ny: skalet hämtas
  // över nätet, datafilen ur cachen. Med ett nytt id i adressen blir varje
  // bygge en cachemiss, och filen hämtas om en gång per driftsättning.
  define: {
    __BIBLIOTEK_BYGGE__: JSON.stringify(Date.now().toString(36)),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5174,
  },
  build: {
    rollupOptions: {
      output: {
        /**
         * Allt låg tidigare i en enda fil på närmare 500 kB. På en skoldator
         * som laddar appen för första gången samtidigt som tjugonio andra i
         * samma klassrum är det den enskilt tyngsta posten före biblioteket.
         *
         * Biblioteken ändras sällan medan appens egen kod ändras ofta. Delas
         * de isär kan webbläsaren behålla den stora, oföränderliga delen i
         * cachen mellan lektionerna, och en ny version av appen tvingar bara
         * fram en ny nedladdning av den lilla delen.
         */
        manualChunks: {
          react: ['react', 'react-dom'],
          animation: ['framer-motion'],
          ikoner: ['lucide-react'],
        },
      },
    },
  },
});
