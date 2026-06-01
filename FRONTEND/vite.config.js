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
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@mui')) return 'vendor-mui';
            if (id.includes('react')) return 'vendor-react';
            if (id.includes('axios') || id.includes('dayjs') || id.includes('react-hook-form')) return 'vendor-utils';
            return 'vendor';
          }
        }
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
