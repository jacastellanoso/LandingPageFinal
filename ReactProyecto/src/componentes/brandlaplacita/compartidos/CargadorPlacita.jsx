import { useEffect, useState } from 'react'

function CargadorPlacita({ etiqueta = 'Cargando' }) {
  const [contenido, setContenido] = useState('')

  useEffect(() => {
    const controlador = new AbortController()

    const cargarIconos = async () => {
      try {
        const respuesta = await fetch('/iconocarga.html', { signal: controlador.signal })
        if (!respuesta.ok) return

        const documento = new DOMParser().parseFromString(await respuesta.text(), 'text/html')
        const cargador = documento.querySelector('.loader')
        if (!cargador) return

        cargador.removeAttribute('role')
        cargador.removeAttribute('aria-live')
        cargador.removeAttribute('aria-label')
        cargador.querySelector('.visually-hidden')?.remove()
        setContenido(cargador.outerHTML)
      } catch (error) {
        if (error.name !== 'AbortError') setContenido('')
      }
    }

    cargarIconos()
    return () => controlador.abort()
  }, [])

  return (
    <div
      className="cargadorIconosPlacita"
      role="status"
      aria-live="polite"
      aria-label={etiqueta}
    >
      {contenido ? (
        <div aria-hidden="true" dangerouslySetInnerHTML={{ __html: contenido }} />
      ) : (
        <span className="cargadorIconosPlacita__alternativo" aria-hidden="true" />
      )}
    </div>
  )
}

export default CargadorPlacita
