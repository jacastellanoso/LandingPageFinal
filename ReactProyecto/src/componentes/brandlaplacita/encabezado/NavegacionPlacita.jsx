import { useEffect, useRef, useState } from 'react'

const enlacesNavegacion = [
  { destino: '#inicioPlacita', etiqueta: 'INICIO' },
  { destino: '#promocionesPlacita', etiqueta: 'PROMOCIONES' },
  { destino: '#menuPlacita', etiqueta: 'MENÚ' },
  { destino: '#contactoPlacita', etiqueta: 'CONTACTO' },
]

function NavegacionPlacita() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [seccionActiva, setSeccionActiva] = useState('inicioPlacita')
  const navegacionRef = useRef(null)
  const botonRef = useRef(null)

  useEffect(() => {
    const encabezado = navegacionRef.current?.closest('.encabezado-placita')
    const secciones = enlacesNavegacion
      .map(({ destino }) => document.getElementById(destino.slice(1)))
      .filter((seccion) => seccion && seccion.id !== 'inicioPlacita')
    const pie = document.getElementById('contactoPlacita')?.closest('footer')

    if (!encabezado || !pie || secciones.length === 0) return undefined

    let cuadroAnimacion

    const actualizarSeccionActiva = () => {
      const alturaEncabezado = Math.ceil(encabezado.getBoundingClientRect().height)
      document.documentElement.style.setProperty(
        '--alturaEncabezadoPlacita',
        `${alturaEncabezado}px`,
      )

      if (window.scrollY <= 10) {
        setSeccionActiva('inicioPlacita')
        return
      }

      if (pie.getBoundingClientRect().top < window.innerHeight) {
        setSeccionActiva('contactoPlacita')
        return
      }

      const ultimaSeccionSuperada = [...secciones]
        .filter((seccion) => seccion.id !== 'contactoPlacita')
        .reverse()
        .find((seccion) => {
          const margenDesplazamiento = Number.parseFloat(
            window.getComputedStyle(seccion).scrollMarginTop,
          )
          const lineaActivacion = Math.max(
            alturaEncabezado,
            Number.isFinite(margenDesplazamiento) ? margenDesplazamiento : 0,
          )

          return seccion.getBoundingClientRect().top <= lineaActivacion + 1
        })

      setSeccionActiva(ultimaSeccionSuperada?.id ?? 'inicioPlacita')
    }

    const solicitarActualizacion = () => {
      if (cuadroAnimacion) return

      cuadroAnimacion = window.requestAnimationFrame(() => {
        cuadroAnimacion = undefined
        actualizarSeccionActiva()
      })
    }

    actualizarSeccionActiva()
    window.addEventListener('scroll', solicitarActualizacion, { passive: true })
    window.addEventListener('resize', solicitarActualizacion)

    const observadorEncabezado = new ResizeObserver(solicitarActualizacion)
    observadorEncabezado.observe(encabezado)

    return () => {
      window.removeEventListener('scroll', solicitarActualizacion)
      window.removeEventListener('resize', solicitarActualizacion)
      if (cuadroAnimacion) window.cancelAnimationFrame(cuadroAnimacion)
      observadorEncabezado.disconnect()
      document.documentElement.style.removeProperty('--alturaEncabezadoPlacita')
    }
  }, [])

  useEffect(() => {
    const cerrarConEscape = (evento) => {
      if (evento.key !== 'Escape' || !menuAbierto) return

      setMenuAbierto(false)
      botonRef.current?.focus()
    }

    const cerrarFuera = (evento) => {
      if (!navegacionRef.current?.contains(evento.target)) setMenuAbierto(false)
    }

    if (menuAbierto) {
      document.addEventListener('keydown', cerrarConEscape)
      document.addEventListener('pointerdown', cerrarFuera)
    }

    return () => {
      document.removeEventListener('keydown', cerrarConEscape)
      document.removeEventListener('pointerdown', cerrarFuera)
    }
  }, [menuAbierto])

  return (
    <nav
      ref={navegacionRef}
      className={`navegacion-placita${menuAbierto ? ' navegacion-placita--abierta' : ''}`}
      aria-label="Navegación principal de La Placita"
    >
      <button
        ref={botonRef}
        className="navegacion-placita__boton"
        type="button"
        aria-expanded={menuAbierto}
        aria-controls="enlaces-placita"
        aria-label={menuAbierto ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
        onClick={() => setMenuAbierto((estadoActual) => !estadoActual)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      <ul id="enlaces-placita" className="navegacion-placita__lista">
        {enlacesNavegacion.map((enlace) => (
          <li key={enlace.destino}>
            <a
              href={enlace.destino}
              className={seccionActiva === enlace.destino.slice(1) ? 'navegacionActiva' : undefined}
              aria-current={seccionActiva === enlace.destino.slice(1) ? 'location' : undefined}
              onClick={(evento) => {
                evento.preventDefault()
                const destinoId = enlace.destino.slice(1)
                const reducirMovimiento = window.matchMedia(
                  '(prefers-reduced-motion: reduce)',
                ).matches

                if (
                  enlace.destino === '#contactoPlacita' &&
                  window.matchMedia('(max-width: 700px)').matches
                ) {
                  window.dispatchEvent(new Event('abrir-contacto-placita'))
                } else if (enlace.destino === '#inicioPlacita') {
                  window.scrollTo({
                    top: 0,
                    behavior: reducirMovimiento ? 'instant' : 'smooth',
                  })
                } else {
                  document.getElementById(destinoId)?.scrollIntoView({
                    behavior: reducirMovimiento ? 'instant' : 'smooth',
                    block: 'start',
                  })
                }
                setSeccionActiva(destinoId)
                setMenuAbierto(false)
              }}
            >
              {enlace.etiqueta}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default NavegacionPlacita
