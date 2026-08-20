import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

function TarjetaPlatillo({ platillo }) {
  const [errorImagen, setErrorImagen] =
    useState(false)

  const [modalAbierto, setModalAbierto] = useState(false)

  useEffect(() => {
    if (!modalAbierto) return undefined

    const cerrarConEscape = (evento) => {
      if (evento.key === 'Escape') {
        setModalAbierto(false)
      }
    }

    document.addEventListener('keydown', cerrarConEscape)
    return () => document.removeEventListener('keydown', cerrarConEscape)
  }, [modalAbierto])

  const precio = Number(
    String(platillo.precio || '0')
      .replace('Q', '')
      .replace(',', '')
      .trim()
  )

  const descuento = Number(
    String(platillo.descuento || '0')
      .replace('%', '')
      .trim()
  )

  const tieneDescuento =
    descuento > 0 && descuento <= 100

  const precioFinal = tieneDescuento
    ? precio - (precio * descuento) / 100
    : precio

  return (
    <article className="tarjetaPlatillo">
      <div className="contenedorFotoPlatillo">
        {platillo.foto && !errorImagen ? (
          <img
            className="fotoPlatillo"
            src={platillo.foto}
            alt={
              platillo.nombrePlatillo ||
              'Platillo'
            }
            draggable="false"
            onError={() => setErrorImagen(true)}
          />
        ) : (
          <div className="sinFotoPlatillo">
            Imagen no disponible
          </div>
        )}

        {platillo.categoria && (
          <span className="categoriaPlatillo">
            {platillo.categoria}
          </span>
        )}

        {tieneDescuento && (
          <span className="descuentoPlatillo">
            -{descuento}%
          </span>
        )}
      </div>

      <div className="contenidoPlatillo contenidoPlatilloResumen">
        <div className="cabeceraPlatillo">
          <h3 className="nombrePlatillo">
            {platillo.nombrePlatillo ||
              'Sin nombre'}
          </h3>

          <div className="contenedorPrecio">
            {tieneDescuento && (
              <span className="precioAnterior">
                Q{precio.toFixed(2)}
              </span>
            )}

            <span className="precioPlatillo">
              Q{precioFinal.toFixed(2)}
            </span>
          </div>
        </div>

        {platillo.estadoActual && (
          <p className="estadoPlatillo">
            {platillo.estadoActual}
          </p>
        )}

        <button
          type="button"
          className="botonPlatillo"
          onClick={() => setModalAbierto(true)}
        >
          Ver platillo
        </button>
      </div>
      {modalAbierto && createPortal(
        <div
          className="modalDetalleOverlay"
          role="presentation"
          onClick={() => setModalAbierto(false)}
        >
          <div
            className="modalDetalleContenido"
            role="dialog"
            aria-modal="true"
            aria-label={`Detalle de ${platillo.nombrePlatillo || 'platillo'}`}
            onClick={(evento) => evento.stopPropagation()}
          >
            <button
              type="button"
              className="modalDetalleCerrar"
              onClick={() => setModalAbierto(false)}
              aria-label="Cerrar detalle del platillo"
            >
              ×
            </button>

            <div className="modalDetalleFoto">
              {platillo.foto && !errorImagen ? (
                <img
                  src={platillo.foto}
                  alt={platillo.nombrePlatillo || 'Platillo'}
                  draggable="false"
                />
              ) : (
                <div className="sinFotoPlatillo">Imagen no disponible</div>
              )}
              {platillo.categoria && (
                <span className="categoriaPlatillo">{platillo.categoria}</span>
              )}
            </div>

            <div className="modalDetalleTexto">
              <h2>{platillo.nombrePlatillo || 'Sin nombre'}</h2>
              {platillo.subcategoria && <p className="modalDetalleSub">{platillo.subcategoria}</p>}

              <div className="contenedorPrecio">
                {tieneDescuento && (
                  <span className="precioAnterior">Q{precio.toFixed(2)}</span>
                )}
                <span className="precioPlatillo">Q{precioFinal.toFixed(2)}</span>
              </div>

              {platillo.estadoActual && (
                <p className="estadoPlatillo">{platillo.estadoActual}</p>
              )}

              {platillo.descripcion && (
                <section>
                  <h3>Descripción</h3>
                  <p>{platillo.descripcion}</p>
                </section>
              )}

              {platillo.ingredientes && (
                <section>
                  <h3>Ingredientes</h3>
                  <p>{platillo.ingredientes}</p>
                </section>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}                       
    </article>
  )
}

export default TarjetaPlatillo
