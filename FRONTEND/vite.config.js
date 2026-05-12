import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    port:3000,
  },
  build: {
    minify: 'esbuild', // Faster and built-in
    sourcemap: false, // Smaller bundle size for production
    rollupOptions: {
      // Allow Vite to use its default chunking strategy to prevent circular dependency TDZ errors
    }
  },
  esbuild: {
    drop: ['console', 'debugger'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  }
})
