/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  test: {
    globals: true,                     // permite usar describe, test, expect sin importar
    environment: "jsdom",              // simula el DOM
    setupFiles: "./src/setupTests.ts", // archivo de configuración
    include: ["src/**/*.test.{ts,tsx}"],
  },
})
