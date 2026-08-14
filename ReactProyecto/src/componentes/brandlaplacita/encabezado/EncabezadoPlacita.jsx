import LogoPlacita from './LogoPlacita'
import NavegacionPlacita from './NavegacionPlacita'

function EncabezadoPlacita({ fase, logoRef }) {
  return (
    <header id="inicio" className="encabezado-placita" data-fase={fase}>
      <a className="encabezado-placita__marca" href="#inicio" aria-label="Ir al inicio">
        <LogoPlacita ref={logoRef} />
      </a>

      <NavegacionPlacita />
    </header>
  )
}

export default EncabezadoPlacita
