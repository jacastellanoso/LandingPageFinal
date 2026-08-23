import { useCallback, useEffect, useState } from 'react'
import CargadorPlacita from '../compartidos/CargadorPlacita'

const intervaloAutomatico = 6000
const appScriptPromocionesUrl =
  'https://script.google.com/macros/s/AKfycbwQpusvEQTd5UtGRCFf1dRTZbxW2CviL6xUGWtBpbyOv3kgVUfhSTw6aEFWLWhuyyNJrA/exec'
const tiempoMaximoImagen = 10000
const tiempoMaximoSolicitud = 12000

function precargarImagen(url) {
  return new Promise((resolver) => {
    const imagen = new Image()
    const temporizador = window.setTimeout(resolver, tiempoMaximoImagen)
    const finalizar = () => {
      window.clearTimeout(temporizador)
      resolver()
    }

    imagen.onload = finalizar
    imagen.onerror = finalizar
    imagen.src = url
  })
}

function CarruselPromociones({ alCompletarCarga }) {
  const [promociones, setPromociones] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [indiceActual, setIndiceActual] = useState(0)
  const [enPausa, setEnPausa] = useState(false)
  const totalPromociones = promociones.length

  useEffect(() => {
    let cancelada = false
    let solicitudFinalizada = false
    const callbackName = `recibirPromociones_${Date.now()}`
    const script = document.createElement('script')
    const temporizadorSolicitud = window.setTimeout(() => {
      if (cancelada || solicitudFinalizada) return

      solicitudFinalizada = true
      setError('La carga de promociones tardó demasiado tiempo.')
      setCargando(false)
      alCompletarCarga()
    }, tiempoMaximoSolicitud)

    window[callbackName] = async (datos) => {
      if (solicitudFinalizada) return
      solicitudFinalizada = true
      window.clearTimeout(temporizadorSolicitud)

      if (!Array.isArray(datos)) {
        if (cancelada) return
        setError('La información recibida de promociones no es válida.')
        setCargando(false)
        alCompletarCarga()
        return
      }

      const promocionesValidas = datos.filter(
        (promocion) => promocion && typeof promocion.foto === 'string' && promocion.foto.trim(),
      )

      await Promise.all(promocionesValidas.map((promocion) => precargarImagen(promocion.foto)))
      if (cancelada) return

      setPromociones(promocionesValidas)
      setIndiceActual(0)
      setError('')
      setCargando(false)
      alCompletarCarga()
    }

    script.src =
      `${appScriptPromocionesUrl}?api=promociones` +
      `&callback=${encodeURIComponent(callbackName)}` +
      `&t=${Date.now()}`
    script.async = true
    script.onerror = () => {
      if (cancelada || solicitudFinalizada) return
      solicitudFinalizada = true
      window.clearTimeout(temporizadorSolicitud)
      setError('No fue posible cargar las promociones de La Placita.')
      setCargando(false)
      alCompletarCarga()
    }

    document.body.appendChild(script)

    return () => {
      cancelada = true
      window.clearTimeout(temporizadorSolicitud)
      if (script.parentNode) script.parentNode.removeChild(script)
      delete window[callbackName]
    }
  }, [alCompletarCarga])

  const irSiguiente = useCallback(() => {
    if (totalPromociones < 2) return
    setIndiceActual((indiceAnterior) => (indiceAnterior + 1) % totalPromociones)
  }, [totalPromociones])

  const irAnterior = () => {
    if (totalPromociones < 2) return
    setIndiceActual(
      (indiceAnterior) => (indiceAnterior - 1 + totalPromociones) % totalPromociones,
    )
  }

  useEffect(() => {
    if (enPausa || totalPromociones < 2) return undefined

    const temporizador = setInterval(irSiguiente, intervaloAutomatico)
    return () => clearInterval(temporizador)
  }, [enPausa, irSiguiente, totalPromociones])

  if (cargando) {
    return (
      <div className="estadoPromociones">
        <CargadorPlacita etiqueta="Cargando promociones" />
        <p>Cargando promociones...</p>
      </div>
    )
  }

  if (error) {
    return <p className="estadoPromociones estadoPromociones--error">{error}</p>
  }

  if (totalPromociones === 0) {
    return <p className="estadoPromociones">No hay promociones disponibles.</p>
  }

  const promocionActual = promociones[indiceActual]
  const identificadorActual = promocionActual.id || promocionActual.foto

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
      <img
        key={`fondo-${identificadorActual}`}
        src={promocionActual.foto}
        alt=""
        className="carruselPromociones__fondo"
        aria-hidden="true"
        draggable="false"
      />

      <div className="carruselPromociones__pista">
        <img
          key={identificadorActual}
          src={promocionActual.foto}
          alt={promocionActual.nombreFoto || 'Promoción'}
          className="carruselPromociones__imagen"
          draggable="false"
        />

        {totalPromociones > 1 && (
          <div
            className="carruselPromociones__puntos"
            role="tablist"
            aria-label="Seleccionar promoción"
          >
            {promociones.map((promocion, indice) => (
              <button
                key={promocion.id || promocion.foto}
                type="button"
                role="tab"
                aria-selected={indice === indiceActual}
                aria-label={`Ir a la promoción ${indice + 1}`}
                className={`carruselPromociones__punto ${
                  indice === indiceActual ? 'carruselPromociones__punto--activo' : ''
                }`}
                onClick={() => setIndiceActual(indice)}
              />
            ))}
          </div>
        )}
      </div>

      {totalPromociones > 1 && (
        <>
          <button
            type="button"
            className="carruselPromociones__flecha carruselPromociones__flecha--anterior"
            onClick={irAnterior}
            aria-label="Promoción anterior"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <button
            type="button"
            className="carruselPromociones__flecha carruselPromociones__flecha--siguiente"
            onClick={irSiguiente}
            aria-label="Siguiente promoción"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m9 6 6 6-6 6" />
            </svg>
          </button>
        </>
      )}
    </div>
  )
}

export default CarruselPromociones
