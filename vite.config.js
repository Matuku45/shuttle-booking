import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  // Backend URL based on environment
  const API_BASE_URL =
    mode === 'production'
      ? 'https://shuttle-booking-system.fly.dev' // Production backend
      : 'http://localhost:3000';                 // Local backend

  return {
    plugins: [react(), tailwindcss()],
    server: {
      host: true,      // listen on all interfaces
      port: 5173,      // frontend dev port
      strictPort: false,
      open: true,
      cors: true,      // allow all origins in dev
      watch: {
        usePolling: true,
      },
      proxy: {
        // Redirect API calls in dev to backend
        '/api': {
          target: API_BASE_URL,
          changeOrigin: true,
        },
        '/users': {
          target: API_BASE_URL,
          changeOrigin: true,
        },
      },
    },
    preview: {
      host: true,
      port: 4173,
      open: true,
    },
    define: {
      // Frontend environment variable for backend
      __API_BASE_URL__: JSON.stringify(API_BASE_URL),
    },
  };
});
