import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/hikasustravel.com/',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          mapbox: ['mapbox-gl'],
          swiper: ['swiper'],
          router: ['react-router-dom'],
        },
      },
    },
  },
})
