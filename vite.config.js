
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico'],

      manifest: {
        name: 'TaskFlow — Планувальник завдань',
        short_name: 'TaskFlow',
        description: 'Зручний планувальник завдань',
        theme_color: '#6258ff',
        background_color: '#f7f8ff',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          }
        ]
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        navigateFallback: '/index.html'
      }
    })
  ],

  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: [
      'swim-performing-glucose-essential.trycloudflare.com'
    ]
  }
})
