import { useEffect, useState } from 'react'
import MallaDecorativa from './MallaDecorativa'

function TarjetaContacto({ integrante, indice }) {
  const [correoCopiado, setCorreoCopiado] = useState(false)

  useEffect(() => {
    if (!correoCopiado) return undefined
    const temporizador = window.setTimeout(() => setCorreoCopiado(false), 1800)
    return () => window.clearTimeout(temporizador)
  }, [correoCopiado])

  const copiarCorreo = async () => {
    try {
      await navigator.clipboard.writeText(integrante.correo)
      setCorreoCopiado(true)
    } catch {
      setCorreoCopiado(false)
    }
  }

  return (
    <li className="contact-card" style={{ '--contact-delay': `${indice * 90}ms` }}>
      <MallaDecorativa className="contact-card__mesh" tipo="contacto" />
      <span className="contact-card__name">{integrante.nombre}</span>
      <span className="contact-card__role">
        <svg className="contact-card__role-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14" />
        </svg>
        <span>{integrante.rol}</span>
      </span>
      <span className="contact-card__links">
        <a
          className="contact-link"
          href={integrante.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`GitHub de ${integrante.nombre}`}
        >
          <span>GitHub</span>
        </a>
        <a
          className={`contact-link${correoCopiado ? ' is-copied' : ''}`}
          href={`mailto:${integrante.correo}`}
          aria-label={`Enviar correo a ${integrante.nombre}`}
          onClick={copiarCorreo}
        >
          <span>{correoCopiado ? '¡Copiado!' : 'Correo'}</span>
        </a>
      </span>
    </li>
  )
}

export default TarjetaContacto
