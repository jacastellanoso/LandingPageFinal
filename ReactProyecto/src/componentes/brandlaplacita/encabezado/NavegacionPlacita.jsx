import { useEffect, useRef, useState } from 'react'

const enlacesNavegacion = [
  { destino: '#inicio', etiqueta: 'INICIO' },
  { destino: '#promocionesPlacita', etiqueta: 'PROMOCIONES' },
  { destino: '#menuPlacita', etiqueta: 'MENÚ' },
  { destino: '#contactoPlacita', etiqueta: 'CONTACTO' },
]

function NavegacionPlacita() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [seccionActiva, setSeccionActiva] = useState('inicio')
  const navegacionRef = useRef(null)
  const botonRef = useRef(null)

  useEffect(() => {
    const encabezado = navegacionRef.current?.closest('.encabezado-placita')
    const secciones = enlacesNavegacion
      .map(({ destino }) => document.getElementById(destino.slice(1)))
      .filter((seccion) => seccion && seccion.id !== 'inicio')

    if (!encabezado || secciones.length === 0) return undefined

    let observadorSecciones

    const configurarObservador = () => {
      observadorSecciones?.disconnect()

      const alturaEncabezado = Math.ceil(encabezado.getBoundingClientRect().height)
      document.documentElement.style.setProperty(
        '--alturaEncabezadoPlacita',
        `${alturaEncabezado}px`,
      )

      observadorSecciones = new IntersectionObserver(
        (entradas) => {
          const entradaActiva = entradas
            .filter((entrada) => entrada.isIntersecting)
            .sort((entradaA, entradaB) => entradaB.boundingClientRect.top - entradaA.boundingClientRect.top)[0]

          if (entradaActiva) {
            setSeccionActiva(entradaActiva.target.id)
            return
          }

          const ultimaSeccionSuperada = [...secciones]
            .reverse()
            .find((seccion) => seccion.getBoundingClientRect().top <= alturaEncabezado)

          setSeccionActiva(ultimaSeccionSuperada?.id ?? 'inicio')
        },
        {
          rootMargin: `-${alturaEncabezado}px 0px -65% 0px`,
          threshold: 0,
        },
      )

      secciones.forEach((seccion) => observadorSecciones.observe(seccion))
    }

    configurarObservador()
    const observadorEncabezado = new ResizeObserver(configurarObservador)
    observadorEncabezado.observe(encabezado)

    return () => {
      observadorSecciones?.disconnect()
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
              onClick={() => {
                setSeccionActiva(enlace.destino.slice(1))
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
