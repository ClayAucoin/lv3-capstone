// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { configDefaults } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',         // use jsdom to simulate a browser
    globals: true,                // so we can use describe/it/expect globally
    setupFiles: './setupTests.js', // run our setup before tests
    exclude: [...configDefaults.exclude, 'e2e/**'], // optional
  },
})
