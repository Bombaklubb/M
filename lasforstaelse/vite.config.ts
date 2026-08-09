import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
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
