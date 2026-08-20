import { readFileSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const rutaProyecto = import.meta.dirname
const rutaEntradaPrincipal = resolve(rutaProyecto, 'index.html')
const rutaLaPlacita = resolve(rutaProyecto, 'laplacita.html')
const htmlLaPlacita = readFileSync(rutaLaPlacita, 'utf8')

const estilosCriticos = `
  html {
    scrollbar-gutter: stable;
  }

  .carruselPromociones__pista {
    aspect-ratio: 16 / 9;
  }

  .contenedorImagen {
    aspect-ratio: 1 / 1;
  }

  .chenteFooter {
    aspect-ratio: 116 / 141;
  }
`

function optimizarDocumentoPrincipal() {
  return {
    name: 'optimizar-documento-principal',
    transformIndexHtml: {
      order: 'pre',
      handler(html, contexto) {
        const nombreArchivo = basename(contexto.filename)
        const esDocumentoPrincipal =
          nombreArchivo === 'index.html' || nombreArchivo === 'laplacita.html'

        if (!esDocumentoPrincipal) {
          return html
        }

        return {
          html: nombreArchivo === 'index.html' ? htmlLaPlacita : html,
          tags: [
            {
              tag: 'link',
              attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
              injectTo: 'head-prepend',
            },
            {
              tag: 'link',
              attrs: {
                rel: 'preconnect',
                href: 'https://fonts.gstatic.com',
                crossorigin: '',
              },
              injectTo: 'head-prepend',
            },
            {
              tag: 'link',
              attrs: { rel: 'preconnect', href: 'https://drive.google.com' },
              injectTo: 'head-prepend',
            },
            {
              tag: 'link',
              attrs: { rel: 'preconnect', href: 'https://script.google.com' },
              injectTo: 'head-prepend',
            },
            {
              tag: 'link',
              attrs: { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
              injectTo: 'head-prepend',
            },
            {
              tag: 'link',
              attrs: { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
              injectTo: 'head-prepend',
            },
            {
              tag: 'link',
              attrs: { rel: 'dns-prefetch', href: '//drive.google.com' },
              injectTo: 'head-prepend',
            },
            {
              tag: 'link',
              attrs: { rel: 'dns-prefetch', href: '//script.google.com' },
              injectTo: 'head-prepend',
            },
            {
              tag: 'style',
              attrs: { 'data-optimizacion-critica': '' },
              children: estilosCriticos,
              injectTo: 'head',
            },
          ],
        }
      },
    },
  }
}

export default defineConfig({
  plugins: [react(), optimizarDocumentoPrincipal()],
  build: {
    target: 'esnext',
    minify: 'oxc',
    cssMinify: 'lightningcss',
    cssCodeSplit: true,
    sourcemap: false,
    modulePreload: {
      polyfill: false,
    },
    rolldownOptions: {
      input: {
        index: rutaEntradaPrincipal,
        landingPage: resolve(rutaProyecto, 'landingpage.html'),
        laPlacita: rutaLaPlacita,
        brandParcial: resolve(rutaProyecto, 'brandparcial.html'),
        animacionLogo: resolve(rutaProyecto, 'animacionlogo.html'),
        galeriaChente: resolve(rutaProyecto, 'chente.html'),
        iconoCarga: resolve(rutaProyecto, 'iconocarga.html'),
        iconosParcial: resolve(rutaProyecto, 'iconosparcial.html'),
      },
    },
  },
})
