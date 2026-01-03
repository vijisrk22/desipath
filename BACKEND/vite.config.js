import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [
        laravel({
            input: ["resources/sass/app.scss", "resources/js/app.js"],
            refresh: true,
        }),
        react(),
    ],
    server: {
        watch: {
            ignored: ["**/node_modules/**", "**/vendor/**"],
        },
        proxy: {
            '/api': 'http://localhost:8000', // Ensure API calls route correctly
          }
    },
    esbuild: {
        jsx: 'automatic', // Automatically transforms JSX (React 17+)
      },
});
