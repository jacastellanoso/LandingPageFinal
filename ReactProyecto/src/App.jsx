import Encabezado from './componentes/brandlandingpage/Encabezado'
import LogoOficial from './componentes/brandlandingpage/LogoOficial'
import PiePagina from './componentes/brandlandingpage/PiePagina'
import SeccionEquipo from './componentes/brandlandingpage/SeccionEquipo'
import SeccionProyecto from './componentes/brandlandingpage/SeccionProyecto'
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
