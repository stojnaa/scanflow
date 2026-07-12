import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Samopotpisan sertifikat za testiranje na telefonu (kamera zahteva HTTPS/secure context).
// Generiše se lokalno u .cert/ (nije u git-u) — vidi README za komandu.
const keyPath = fileURLToPath(new URL('./.cert/key.pem', import.meta.url))
const certPath = fileURLToPath(new URL('./.cert/cert.pem', import.meta.url))
const httpsCert = existsSync(keyPath) && existsSync(certPath)
  ? { key: readFileSync(keyPath), cert: readFileSync(certPath) }
  : undefined

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    https: httpsCert,
    // Kada je VITE_API_URL='/api' (npm run dev:phone), pozivi ka backendu idu preko
    // istog (https) origina i Vite ih prosledi na Django — bez mixed-content/CORS glavobolje.
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
