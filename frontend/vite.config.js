import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'One Stop Career Advisor J&K',
        short_name: 'One Stop J&K',
        description: 'Personalized career and education guidance for J&K students',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      // Proxy all /api/* calls to the Express backend in development
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
