import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  server: {
    host: '0.0.0.0',
    port: 5173,

    // En Docker sobre Windows los eventos de archivos no llegan al contenedor
    watch: process.env.VITE_USE_POLLING === 'true' ? { usePolling: true, interval: 300 } : undefined,

    allowedHosts: [
      // Cualquier túnel rápido de Cloudflare (la URL cambia en cada arranque)
      '.trycloudflare.com',
    ],
  },
})