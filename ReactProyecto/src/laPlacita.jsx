import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import LaPlacita from './componentes/brandlaplacita/LaPlacita'
import './index.css'

const contenedorLaPlacita = document.getElementById('laPlacitaRoot')

if (contenedorLaPlacita) {
  createRoot(contenedorLaPlacita).render(
    <StrictMode>
      <LaPlacita />
    </StrictMode>,
  )
}
