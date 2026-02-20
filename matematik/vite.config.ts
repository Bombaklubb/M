import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    target: ['chrome64', 'firefox67', 'safari12', 'edge79'],
  },
})
