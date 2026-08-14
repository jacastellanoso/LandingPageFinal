import { useState } from 'react'
import MallaDecorativa from './MallaDecorativa'

function TarjetaEquipo({ integrante, estaVolteada, onCambiarEstado }) {
  const [imagenDisponible, setImagenDisponible] = useState(true)
  const idFrente = `equipo-frente-${integrante.id}`
  const idReverso = `equipo-reverso-${integrante.id}`

  return (
    <article className={`equipo-card${estaVolteada ? ' is-flipped' : ''}`}>
      <span className="equipo-card__inner">
        <span id={idFrente} className="equipo-card__face equipo-card__front" aria-hidden={estaVolteada}>
          <MallaDecorativa className="equipo-card__mesh" tipo="equipo" />
          <span className={`equipo-card__photo${imagenDisponible ? '' : ' is-missing'}`}>
            <span className="equipo-card__photo-fallback" aria-hidden="true">Fotografía pendiente</span>
            <img
              src={integrante.foto}
              alt={`Fotografía de ${integrante.nombre}`}
              draggable="false"
              loading="lazy"
              decoding="async"
              onLoad={() => setImagenDisponible(true)}
              onError={() => setImagenDisponible(false)}
              onContextMenu={(evento) => evento.preventDefault()}
            />
          </span>
          <span className="equipo-card__information">
            <span className="equipo-card__name">{integrante.nombre}</span>
            <span className="equipo-card__role">{integrante.rol}</span>
            <button
              className="equipo-card__toggle equipo-card__toggle--front"
              type="button"
              aria-controls={idReverso}
              aria-expanded={estaVolteada}
              aria-label={`Ver frase de ${integrante.nombre}`}
              tabIndex={estaVolteada ? -1 : 0}
              onClick={onCambiarEstado}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 12a8 8 0 0 0-14.9-4M4 4v4h4M4 12a8 8 0 0 0 14.9 4M20 20v-4h-4" />
              </svg>
              <span>Ver frase</span>
            </button>
          </span>
        </span>

        <span id={idReverso} className="equipo-card__face equipo-card__back" aria-hidden={!estaVolteada}>
          <MallaDecorativa className="equipo-card__mesh" tipo="equipo" />
          <span className="equipo-card__quote">{integrante.frase}</span>
          <button
            className="equipo-card__toggle equipo-card__toggle--back"
            type="button"
            aria-controls={idFrente}
            aria-expanded={estaVolteada}
            aria-label={`Volver a la fotografía de ${integrante.nombre}`}
            tabIndex={estaVolteada ? 0 : -1}
            onClick={onCambiarEstado}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 12a8 8 0 0 0-14.9-4M4 4v4h4M4 12a8 8 0 0 0 14.9 4M20 20v-4h-4" />
            </svg>
            <span>Volver</span>
          </button>
        </span>
      </span>
    </article>
  )
}

export default TarjetaEquipo
