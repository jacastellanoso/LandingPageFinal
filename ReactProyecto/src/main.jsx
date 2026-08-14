import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import GaleriaEquipo from './componentes/brandlandingpage/GaleriaEquipo'
import ListaContactos from './componentes/brandlandingpage/ListaContactos'
import SelectorTecnologias from './componentes/brandlandingpage/SelectorTecnologias'

const montajesReact = [
  { id: 'galeriaEquipoRoot', componente: <GaleriaEquipo /> },
  { id: 'tecnologiasRoot', componente: <SelectorTecnologias /> },
  { id: 'contactosRoot', componente: <ListaContactos /> },
]

montajesReact.forEach(({ id, componente }) => {
  const contenedor = document.getElementById(id)

  if (contenedor) {
    createRoot(contenedor).render(
      <StrictMode>
        {componente}
      </StrictMode>,
    )
  }
})
