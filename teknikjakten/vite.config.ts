import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    // vite-plugin-pwa genererar manifest.webmanifest och injicerar <link rel="manifest">
    // själv. Lägg därför ALDRIG till en egen public/manifest.json – två manifest i
    // bygget gör att webbläsaren bara läser det första.
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Teknikjakten',
        short_name: 'Teknikjakten',
        description: 'Öva teknik för årskurs 4–6',
        start_url: '/',
        display: 'standalone',
        background_color: '#00040e',
        theme_color: '#02162f',
        orientation: 'portrait',
        icons: [
          { src: '/pwa-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
        /*
         * JPEG-varianten är bara reserv för webbläsare utan WebP-stöd och
         * behöver inte ligga i precachen.
         *
         * Råa designfiler ska inte ligga i public/ över huvud taget – de finns
         * i teknikjakten/design/. Mönstret nedan är ändå kvar som skydd, om en
         * stor bild skulle råka hamna i public/ igen.
         */
        globIgnores: ['**/*bakgrund.png', '**/rymd-bakgrund.jpg'],
        /*
         * Säkerhetsnät. vite-plugin-pwa avbryter hela bygget när en fil är för
         * stor för precachen – det fällde produktionsbygget en gång. Med en
         * höjd gräns blir en oväntat stor fil ett prestandaproblem i stället
         * för en trasig deploy.
         */
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts', expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts-files', expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
          {
            urlPattern: /^https:\/\/sv\.wikipedia\.org\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'wikipedia-images', expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 7 } },
          },
        ],
      },
    }),
  ],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: ['chrome64', 'firefox67', 'safari12', 'edge79'],
  },
})
