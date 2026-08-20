import LogoPlacita from './LogoPlacita'
import NavegacionPlacita from './NavegacionPlacita'

function EncabezadoPlacita({ fase, logoRef }) {
  const irAlInicio = (evento) => {
    evento.preventDefault()
    const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reducirMovimiento ? 'instant' : 'smooth' })
  }

  return (
    <header id="inicioPlacita" className="encabezado-placita" data-fase={fase}>
      <a
        className="encabezado-placita__marca"
        href="#inicioPlacita"
        aria-label="Ir al inicio"
        onClick={irAlInicio}
      >
        <LogoPlacita ref={logoRef} />
      </a>

      <NavegacionPlacita />
    </header>
  )
}

export default EncabezadoPlacita
