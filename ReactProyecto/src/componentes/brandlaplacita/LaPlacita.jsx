import { useCallback, useEffect, useRef, useState } from 'react'
import AnimacionLogo from './animacion/AnimacionLogo'
import CarruselPromociones from './promociones/CarruselPromociones'
import TituloSeccionPlacita from './compartidos/TituloSeccionPlacita'
import EncabezadoPlacita from './encabezado/EncabezadoPlacita'
import PiePlacita from './pie/PiePlacita'
import TransicionLogo from './transicion/TransicionLogo'
import './laPlacita.css'
import GaleriaMenu from './menu/GaleriaMenu'

const introVistaClave = 'laPlacitaIntroSeen'

function obtenerFaseInicial() {
  try {
    return sessionStorage.getItem(introVistaClave) === 'true' ? 'completa' : 'introduccion'
  } catch {
    return 'introduccion'
  }
}

function LaPlacita() {
  const [fase, setFase] = useState(obtenerFaseInicial)
  const [rectanguloOrigen, setRectanguloOrigen] = useState(null)
  const rectanguloPendienteRef = useRef(null)
  const transicionSolicitadaRef = useRef(false)
  const recursosListosRef = useRef({
    promociones: false,
    menu: false,
  })
  const logoDestinoRef = useRef(null)

  useEffect(() => {
    const introduccionActiva = fase === 'introduccion' || fase === 'transicion'
    document.documentElement.classList.toggle('placita-intro-activa', introduccionActiva)

    return () => document.documentElement.classList.remove('placita-intro-activa')
  }, [fase])

  const iniciarTransicionSiCorresponde = useCallback(() => {
    const recursosListos = recursosListosRef.current
    const rectanguloPendiente = rectanguloPendienteRef.current

    if (
      transicionSolicitadaRef.current ||
      !rectanguloPendiente ||
      !recursosListos.promociones ||
      !recursosListos.menu
    ) {
      return
    }

    transicionSolicitadaRef.current = true
    setRectanguloOrigen(rectanguloPendiente)
    setFase('transicion')
  }, [])

  const terminarIntroduccion = useCallback((rectangulo) => {
    rectanguloPendienteRef.current = {
      top: rectangulo.top,
      left: rectangulo.left,
      width: rectangulo.width,
      height: rectangulo.height,
    }
    iniciarTransicionSiCorresponde()
  }, [iniciarTransicionSiCorresponde])

  const marcarPromocionesListas = useCallback(() => {
    recursosListosRef.current.promociones = true
    iniciarTransicionSiCorresponde()
  }, [iniciarTransicionSiCorresponde])

  const marcarMenuListo = useCallback(() => {
    recursosListosRef.current.menu = true
    iniciarTransicionSiCorresponde()
  }, [iniciarTransicionSiCorresponde])

  const terminarTransicion = () => {
    try {
      sessionStorage.setItem(introVistaClave, 'true')
    } catch {
      // La página sigue disponible cuando el almacenamiento está bloqueado.
    }

    setFase('completa')
  }

  return (
    <div className={`pagina-placita pagina-placita--${fase}`}>
      {(fase === 'introduccion' || fase === 'transicion') && (
        <div className="introduccion-placita">
          <AnimacionLogo alTerminar={terminarIntroduccion} />
        </div>
      )}

      <EncabezadoPlacita fase={fase} logoRef={logoDestinoRef} />

      {fase === 'transicion' && rectanguloOrigen && (
        <TransicionLogo
          rectanguloOrigen={rectanguloOrigen}
          destinoRef={logoDestinoRef}
          alTerminar={terminarTransicion}
        />
      )}

      <main className="contenido-placita" aria-label="Contenido principal">
        <section
          id="promocionesPlacita"
          className="franjaPlacita franjaPromociones"
          aria-label="Promociones"
        >
          <CarruselPromociones alCompletarCarga={marcarPromocionesListas} />
        </section>
        <section
          id="menuPlacita"
          className="franjaPlacita franjaMenu"
          aria-labelledby="tituloMenuPlacita"
        >
          <TituloSeccionPlacita id="tituloMenuPlacita">Menú</TituloSeccionPlacita>
          <GaleriaMenu alCompletarCarga={marcarMenuListo} />
        </section>
      </main>

      <PiePlacita />

      <div className="derechosPlacita">
        <div className="derechosPlacitaFila">
          Todos los derechos reservados © 2026 - Comedor La Placita
        </div>
        <div className="autorPlacitaFila">
          Diseñada por{' '}
          <a
            href="landingpage.html"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Abrir BAS DEL WEB en una pestaña nueva"
          >
            &lt; BAS DEL WEB &gt;
          </a>
        </div>
      </div>
    </div>
  )
}

export default LaPlacita
