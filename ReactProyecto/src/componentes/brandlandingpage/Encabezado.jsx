import { useEffect, useState } from 'react'
import MallaDecorativa from './MallaDecorativa'

const enlacesNavegacion = [
  { destino: '#equipo', etiqueta: 'NUESTRO EQUIPO' },
  { destino: '#proyecto', etiqueta: 'NUESTRO PROYECTO' },
  { destino: '#contacto', etiqueta: 'CONTACTO' },
]

function Encabezado() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  useEffect(() => {
    const cerrarConEscape = (evento) => {
      if (evento.key === 'Escape') setMenuAbierto(false)
    }
    document.addEventListener('keydown', cerrarConEscape)
    return () => document.removeEventListener('keydown', cerrarConEscape)
  }, [])

  return (
    <header id="inicio" className="site-header is-compact" data-phase="final">
      <h1 className="visually-hidden">BASDELWEB</h1>
      <div className="header-content">
        <a className="home-reload" href="#inicio" aria-label="Volver al inicio">
          <img
            className="logo logo--imagen"
            src="https://drive.google.com/thumbnail?id=1GVDQMKxwGHzPDw_g10Z_96_-UYtqpn2a&sz=w4000"
            alt="BASDELWEB, donde la web comienza con lo básico"
          />
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuAbierto}
          aria-controls="navegacion-principal"
          aria-label={menuAbierto ? 'Cerrar navegación principal' : 'Abrir navegación principal'}
          onClick={() => setMenuAbierto((estadoActual) => !estadoActual)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        </button>

        <nav
          id="navegacion-principal"
          className={`site-nav${menuAbierto ? ' is-open' : ''}`}
          aria-label="Navegación principal"
        >
          <ul className="site-nav__list">
            {enlacesNavegacion.map((enlace) => (
              <li className="nav-button" key={enlace.destino}>
                <a href={enlace.destino} onClick={() => setMenuAbierto(false)}>
                  <MallaDecorativa className="nav-button__mesh" />
                  <svg className="nav-button__icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14" />
                  </svg>
                  <span className="nav-button__label">{enlace.etiqueta}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Encabezado
