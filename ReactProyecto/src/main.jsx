import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import NavegacionEncabezado from './componentes/brandlandingpage/encabezado/NavegacionEncabezado'
import GaleriaEquipo from './componentes/brandlandingpage/equipo/GaleriaEquipo'
import ListaContactos from './componentes/brandlandingpage/contacto/ListaContactos'
import SelectorTecnologias from './componentes/brandlandingpage/proyecto/SelectorTecnologias'

const montarComponente = (idContenedor, Componente) => {
  const contenedor = document.getElementById(idContenedor)

  if (!contenedor) return

  createRoot(contenedor).render(
    <StrictMode>
      <Componente />
    </StrictMode>,
  )
}

montarComponente('navegacionPrincipal', NavegacionEncabezado)
montarComponente('galeriaEquipo', GaleriaEquipo)
montarComponente('tecnologias', SelectorTecnologias)
montarComponente('contactos', ListaContactos)
