import { useLayoutEffect, useRef } from 'react'
import LogoPlacita from '../encabezado/LogoPlacita'

const DURACION_TRANSICION = 450
const DURACION_REAJUSTE = 240
const CURVA_FLUIDA = 'cubic-bezier(0.16, 1, 0.3, 1)'

function rectanguloCambio(rectanguloAnterior, rectanguloNuevo) {
  if (!rectanguloAnterior) return true

  return ['top', 'left', 'width', 'height'].some(
    (propiedad) => Math.abs(rectanguloAnterior[propiedad] - rectanguloNuevo[propiedad]) > 0.5,
  )
}

function TransicionLogo({ rectanguloOrigen, destinoRef, alTerminar }) {
  const capaRef = useRef(null)

  useLayoutEffect(() => {
    const capa = capaRef.current
    const destino = destinoRef.current
    if (!capa || !destino) return undefined

    let animacionActiva
    let rectanguloDestinoAnterior
    let cancelada = false
    const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const animarHaciaDestino = (origen, duracion) => {
      const destinoActual = destino.getBoundingClientRect()
      rectanguloDestinoAnterior = destinoActual

      animacionActiva?.cancel()
      Object.assign(capa.style, {
        top: `${destinoActual.top}px`,
        left: `${destinoActual.left}px`,
        width: `${destinoActual.width}px`,
        height: `${destinoActual.height}px`,
      })

      const origenCentroX = origen.left + origen.width / 2
      const origenCentroY = origen.top + origen.height / 2
      const destinoCentroX = destinoActual.left + destinoActual.width / 2
      const destinoCentroY = destinoActual.top + destinoActual.height / 2
      const escala = destinoActual.width > 0 ? origen.width / destinoActual.width : 1

      const nuevaAnimacion = capa.animate(
        [
          {
            transform: `translate3d(${origenCentroX - destinoCentroX}px, ${origenCentroY - destinoCentroY}px, 0) scale(${escala})`,
          },
          { transform: 'translate3d(0, 0, 0) scale(1)' },
        ],
        {
          duration: reducirMovimiento ? 1 : duracion,
          easing: CURVA_FLUIDA,
          fill: 'both',
        },
      )

      animacionActiva = nuevaAnimacion
      nuevaAnimacion.finished.then(() => {
        if (!cancelada && animacionActiva === nuevaAnimacion) alTerminar()
      }).catch(() => {})
    }

    const preparar = async () => {
      await document.fonts.ready
      if (cancelada) return
      animarHaciaDestino(rectanguloOrigen, DURACION_TRANSICION)
    }

    const reajustar = () => {
      if (!animacionActiva || animacionActiva.playState !== 'running') return

      const destinoActual = destino.getBoundingClientRect()
      if (!rectanguloCambio(rectanguloDestinoAnterior, destinoActual)) return

      const posicionActual = capa.getBoundingClientRect()
      animarHaciaDestino(posicionActual, DURACION_REAJUSTE)
    }

    const observador = new ResizeObserver(reajustar)
    observador.observe(destino)
    window.addEventListener('resize', reajustar)
    preparar()

    return () => {
      cancelada = true
      animacionActiva?.cancel()
      observador.disconnect()
      window.removeEventListener('resize', reajustar)
    }
  }, [alTerminar, destinoRef, rectanguloOrigen])

  return (
    <div ref={capaRef} className="transicion-logo" aria-hidden="true">
      <LogoPlacita className="transicion-logo__svg" decorativo />
    </div>
  )
}

export default TransicionLogo
