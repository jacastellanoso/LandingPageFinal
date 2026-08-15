import { useEffect, useState } from 'react'
import TituloSeccionPlacita from '../compartidos/TituloSeccionPlacita'
import LogoPlacita from '../encabezado/LogoPlacita'

function ChenteFooter() {
  const [chenteSvg, setChenteSvg] = useState('')

  useEffect(() => {
    const controlador = new AbortController()

    const cargarChente = async () => {
      try {
        const respuesta = await fetch('/chente.html', { signal: controlador.signal })
        if (!respuesta.ok) return

        const documento = new DOMParser().parseFromString(await respuesta.text(), 'text/html')
        const chenteCarnitas = documento.querySelector('#chente-carnitas')
        if (!chenteCarnitas) return

        chenteCarnitas.removeAttribute('id')
        chenteCarnitas.removeAttribute('role')
        chenteCarnitas.removeAttribute('aria-label')
        chenteCarnitas.setAttribute('aria-hidden', 'true')
        chenteCarnitas.setAttribute('focusable', 'false')
        setChenteSvg(chenteCarnitas.outerHTML)
      } catch (error) {
        if (error.name !== 'AbortError') setChenteSvg('')
      }
    }

    cargarChente()
    return () => controlador.abort()
  }, [])

  return (
    <div
      className="chenteFooter"
      role="img"
      aria-label="Chente, personaje de Comedor La Placita"
      dangerouslySetInnerHTML={{ __html: chenteSvg }}
    />
  )
}

function PiePlacita() {
  return (
    <footer className="piePlacita" aria-label="Pie de página">
      <div className="identidadPiePlacita">
        <ChenteFooter />
        <LogoPlacita className="logoPiePlacita" decorativo />
      </div>

      <div className="separadorPiePlacita" aria-hidden="true" />

      <nav className="navegacionPiePlacita" aria-label="Navegación del pie de página">
        <strong>Navegación</strong>
        <ul>
          <li><a href="#inicio">Inicio</a></li>
          <li><a href="#promocionesPlacita">Promociones</a></li>
          <li><a href="#menuPlacita">Menú</a></li>
          <li><a href="#contactoPlacita">Contacto</a></li>
        </ul>
      </nav>

      <section
        id="contactoPlacita"
        className="integracionContactoPlacita"
        aria-labelledby="tituloContactoPlacita"
      >
        <TituloSeccionPlacita id="tituloContactoPlacita" variante="claro">
          Contacto
        </TituloSeccionPlacita>
      </section>
    </footer>
  )
}

export default PiePlacita
