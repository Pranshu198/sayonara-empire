import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// Code-splitting (Pass 3): vendor libraries alag chunk; deep content pools (84 files), bhaari panels
// aur poora World Atlas dynamic imports se lazy chunks me — entry chunk Pass 2 se halka gzip me
export default defineConfig({
  plugins: [react()],
  base: '/sayonara-empire/',
  build: {
    target: 'es2022', // Pass 3.4: modern baseline — kam transpilation helpers
    modulePreload: { polyfill: false }, // Pass 3.4: modern browsers ko polyfill chunk nahi
    chunkSizeWarningLimit: 6000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor'
          return undefined
        },
      },
    },
  },
})
