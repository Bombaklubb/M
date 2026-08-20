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
        background_color: '#f4f6fb',
        theme_color: '#1f2a44',
        orientation: 'portrait',
        icons: [
          { src: '/pwa-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
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
