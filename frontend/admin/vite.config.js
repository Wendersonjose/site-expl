import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Admin roda na 5174 para conviver com a loja (5173) em desenvolvimento.
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { port: 5174 },
})
