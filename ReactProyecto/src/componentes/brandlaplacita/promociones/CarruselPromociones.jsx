import { useEffect, useState, useCallback } from 'react'
import promocionesPlacita from '../../../data/promocionesPlacita'

const intervaloAutomatico = 6000

function CarruselPromociones() {
  const [indiceActual, setIndiceActual] = useState(0)
  const [enPausa, setEnPausa] = useState(false)

  const totalPromociones = promocionesPlacita.length

  const irSiguiente = useCallback(() => {
    setIndiceActual((indiceAnterior) => (indiceAnterior + 1) % totalPromociones)
  }, [totalPromociones])

  const irAnterior = () => {
    setIndiceActual((indiceAnterior) => (indiceAnterior - 1 + totalPromociones) % totalPromociones)
  }

  const irA = (indice) => {
    setIndiceActual(indice)
  }

  useEffect(() => {
    if (enPausa) return undefined

    const temporizador = setInterval(irSiguiente, intervaloAutomatico)
    return () => clearInterval(temporizador)
  }, [enPausa, irSiguiente])

  const promocionActual = promocionesPlacita[indiceActual]

  return (
    <div
      className="carruselPromociones"
      role="region"
      aria-roledescription="carrusel"
      aria-label="Promociones del Comedor La Placita"
      onMouseEnter={() => setEnPausa(true)}
      onMouseLeave={() => setEnPausa(false)}
      onFocus={() => setEnPausa(true)}
      onBlur={() => setEnPausa(false)}
    >
      <div className="carruselPromociones__pista">
        <img
          key={promocionActual.id}
          src={promocionActual.imagen}
          alt={promocionActual.alt}
          className="carruselPromociones__imagen"
        />

        {promocionActual.titulo && (
          <div className="carruselPromociones__leyenda">
            <p className="carruselPromociones__leyendaTitulo">{promocionActual.titulo}</p>
          </div>
        )}

        <button
          type="button"
          className="carruselPromociones__flecha carruselPromociones__flecha--anterior"
          onClick={irAnterior}
          aria-label="Promoción anterior"
        >
          ‹
        </button>

        <button
          type="button"
          className="carruselPromociones__flecha carruselPromociones__flecha--siguiente"
          onClick={irSiguiente}
          aria-label="Siguiente promoción"
        >
          ›
        </button>
      </div>

      <div className="carruselPromociones__puntos" role="tablist" aria-label="Seleccionar promoción">
        {promocionesPlacita.map((promocion, indice) => (
          <button
            key={promocion.id}
            type="button"
            role="tab"
            aria-selected={indice === indiceActual}
            aria-label={`Ir a la promoción ${indice + 1}`}
            className={`carruselPromociones__punto ${
              indice === indiceActual ? 'carruselPromociones__punto--activo' : ''
            }`}
            onClick={() => irA(indice)}
          />
        ))}
      </div>
    </div>
  )
}

export default CarruselPromociones