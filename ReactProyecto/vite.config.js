import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      input: {
        index: resolve(import.meta.dirname, 'index.html'),
        landingPage: resolve(import.meta.dirname, 'landingpage.html'),
        laPlacita: resolve(import.meta.dirname, 'laplacita.html'),
        brandParcial: resolve(import.meta.dirname, 'brandparcial.html'),
        animacionLogo: resolve(import.meta.dirname, 'animacionlogo.html'),
        galeriaChente: resolve(import.meta.dirname, 'chente.html'),
        iconoCarga: resolve(import.meta.dirname, 'iconocarga.html'),
        iconosParcial: resolve(import.meta.dirname, 'iconosparcial.html'),
      },
    },
  },
})
