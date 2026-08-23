import Encabezado from './componentes/brandlandingpage/encabezado/Encabezado'
import LogoOficial from './componentes/brandlandingpage/identidad/LogoOficial'
import PiePagina from './componentes/brandlandingpage/contacto/PiePagina'
import SeccionEquipo from './componentes/brandlandingpage/equipo/SeccionEquipo'
import SeccionProyecto from './componentes/brandlandingpage/proyecto/SeccionProyecto'
import './App.css'

function App() {
  return (
    <>
      <Encabezado />
      <main aria-label="Zonas de trabajo de la landing page">
        <LogoOficial />
        <SeccionEquipo />
        <SeccionProyecto />
      </main>
      <PiePagina />
    </>
  )
}

export default App
