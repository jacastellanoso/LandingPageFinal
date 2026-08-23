import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import LaPlacita from './componentes/brandlaplacita/LaPlacita'
import Error404Placita from './componentes/brandlaplacita/errores/Error404Placita'
import './index.css'

const contenedorLaPlacita =
  document.getElementById('laPlacitaRoot')

function obtenerPaginaActual() {
  const partesRuta = window.location.pathname
    .split('/')
    .filter(Boolean)

  if (partesRuta.length === 0) {
    return ''
  }

  return partesRuta[
    partesRuta.length - 1
  ].toLowerCase()
}

const paginaActual = obtenerPaginaActual()

const rutasValidasPlacita = [
  '',
  'index.html',
  'laplacita.html',
]

const rutaValida =
  rutasValidasPlacita.includes(paginaActual)

if (contenedorLaPlacita) {
  createRoot(contenedorLaPlacita).render(
    <StrictMode>
      {rutaValida ? (
        <LaPlacita />
      ) : (
        <Error404Placita />
      )}
    </StrictMode>,
  )
}