import { useEffect, useState } from 'react'

const cacheChentes = new Map()

async function obtenerChente(id) {
  if (cacheChentes.has(id)) {
    return cacheChentes.get(id)
  }

  const promesa = fetch(
    `${import.meta.env.BASE_URL}chente.html`
  )
    .then((respuesta) => {
      if (!respuesta.ok) {
        throw new Error(
          'No fue posible cargar chente.html'
        )
      }

      return respuesta.text()
    })
    .then((html) => {
      const parser = new DOMParser()

      const documento = parser.parseFromString(
        html,
        'text/html'
      )

      const svg = documento.getElementById(id)

      if (!svg) {
        throw new Error(
          `No se encontró ${id} en chente.html`
        )
      }

      svg.removeAttribute('width')
      svg.removeAttribute('height')

      svg.classList.add('ph11ChenteSvg')

      return svg.outerHTML
    })

  cacheChentes.set(id, promesa)

  return promesa
}

function ChenteDesdeHtml({
  id,
  className = '',
  descripcion = 'Ilustración de Chente',
}) {
  const [svg, setSvg] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    let activo = true

    obtenerChente(id)
      .then((contenido) => {
        if (activo) {
          setSvg(contenido)
          setError(false)
        }
      })
      .catch((problema) => {
        console.error(
          `Error cargando ${id}:`,
          problema
        )

        if (activo) {
          setError(true)
        }
      })

    return () => {
      activo = false
    }
  }, [id])

  if (error) {
    return (
      <div className="ph11ChenteFallback">
        No se pudo cargar la ilustración
      </div>
    )
  }

  if (!svg) {
    return (
      <div
        className="ph11ChenteCargando"
        aria-hidden="true"
      />
    )
  }

  return (
    <div
      className={`ph11ChenteDesdeHtml ${className}`}
      role="img"
      aria-label={descripcion}
      dangerouslySetInnerHTML={{
        __html: svg,
      }}
    />
  )
}

export default ChenteDesdeHtml