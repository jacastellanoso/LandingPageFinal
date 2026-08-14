import { useEffect, useRef, useState } from 'react'
import AnimacionLogo from './animacion/AnimacionLogo'
import EncabezadoPlacita from './encabezado/EncabezadoPlacita'
import TransicionLogo from './transicion/TransicionLogo'
import './laPlacita.css'

function LaPlacita() {
  const [fase, setFase] = useState('introduccion')
  const [rectanguloOrigen, setRectanguloOrigen] = useState(null)
  const logoDestinoRef = useRef(null)

  useEffect(() => {
    const introduccionActiva = fase === 'introduccion' || fase === 'transicion'
    document.documentElement.classList.toggle('placita-intro-activa', introduccionActiva)

    return () => document.documentElement.classList.remove('placita-intro-activa')
  }, [fase])

  const terminarIntroduccion = (rectangulo) => {
    setRectanguloOrigen({
      top: rectangulo.top,
      left: rectangulo.left,
      width: rectangulo.width,
      height: rectangulo.height,
    })
    setFase('transicion')
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
          alTerminar={() => setFase('completa')}
        />
      )}

      <main className="contenido-placita" aria-label="Contenido principal" />

      <footer className="pie-placita" aria-label="Pie de página" />
    </div>
  )
}

export default LaPlacita
