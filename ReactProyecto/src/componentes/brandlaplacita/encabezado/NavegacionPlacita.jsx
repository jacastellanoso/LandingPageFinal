import { useEffect, useRef, useState } from 'react'

const enlacesNavegacion = [
  { destino: '#inicio', etiqueta: 'INICIO' },
]

function NavegacionPlacita() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const navegacionRef = useRef(null)
  const botonRef = useRef(null)

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
            <a href={enlace.destino} onClick={() => setMenuAbierto(false)}>
              {enlace.etiqueta}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default NavegacionPlacita
