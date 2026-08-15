import { useEffect, useRef } from 'react'

function AnimacionLogo({ alTerminar }) {
  const iframeRef = useRef(null)
  const limpiarEscuchaRef = useRef(() => {})

  useEffect(() => () => limpiarEscuchaRef.current(), [])

  const manejarCarga = (evento) => {
    limpiarEscuchaRef.current()

    const documentoAnimacion = evento.currentTarget.contentDocument
    const marcaAnimada = documentoAnimacion?.querySelector('.marca')
    const logoAnimado = documentoAnimacion?.querySelector('.logo')

    if (!marcaAnimada || !logoAnimado) return

    const manejarFinal = (eventoAnimacion) => {
      if (eventoAnimacion.animationName !== 'finalizar-introduccion') return

      marcaAnimada.removeEventListener('animationend', manejarFinal)
      alTerminar(logoAnimado.getBoundingClientRect())
    }

    marcaAnimada.addEventListener('animationend', manejarFinal)
    limpiarEscuchaRef.current = () => {
      marcaAnimada.removeEventListener('animationend', manejarFinal)
    }
  }

  return (
    <iframe
      ref={iframeRef}
      className="animacion-logo"
      src="/animacionlogo.html"
      title="Animación del logotipo de Comedor La Placita"
      loading="eager"
      onLoad={manejarCarga}
    />
  )
}

export default AnimacionLogo
