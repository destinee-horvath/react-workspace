import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Study Workspace App',
        short_name: 'StudyApp',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#1a1a1a',
        icons: [
          {
            src: 'main-icon-512x512.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'main-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ],
      }
    })
  ]
})
