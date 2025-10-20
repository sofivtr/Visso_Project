/// <reference types="vitest" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  test: {

    environment: 'jsdom',       // importante: configura entorno tipo navegador
    globals: true,              // para usar expect, test, etc. sin importar
    setupFiles: './src/tests/setup.ts', // archivo para configuraciones globales
    css: true,
  }
})

