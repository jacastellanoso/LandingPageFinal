import { useEffect, useState } from 'react'
import LogoPlacita from '../encabezado/LogoPlacita'
import ContactoPlacita from '../contacto/ContactoPlacita'

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
  const navegarInternamente = (evento, destinoId) => {
    evento.preventDefault()
    const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (destinoId === 'inicioPlacita') {
      window.scrollTo({ top: 0, behavior: reducirMovimiento ? 'instant' : 'smooth' })
      return
    }

    if (
      destinoId === 'contactoPlacita' &&
      window.matchMedia('(max-width: 700px)').matches
    ) {
      window.dispatchEvent(new Event('abrir-contacto-placita'))
      return
    }

    document.getElementById(destinoId)?.scrollIntoView({
      behavior: reducirMovimiento ? 'instant' : 'smooth',
      block: 'start',
    })
  }

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
          <li><a href="#inicioPlacita" onClick={(evento) => navegarInternamente(evento, 'inicioPlacita')}>Inicio</a></li>
          <li><a href="#promocionesPlacita" onClick={(evento) => navegarInternamente(evento, 'promocionesPlacita')}>Promociones</a></li>
          <li><a href="#menuPlacita" onClick={(evento) => navegarInternamente(evento, 'menuPlacita')}>Menú</a></li>
          <li><a href="#contactoPlacita" onClick={(evento) => navegarInternamente(evento, 'contactoPlacita')}>Contacto</a></li>
        </ul>
      </nav>

      <div className="integracionContactoPlacita">
        <ContactoPlacita />
      </div>
    </footer>
  )
}

export default PiePlacita
