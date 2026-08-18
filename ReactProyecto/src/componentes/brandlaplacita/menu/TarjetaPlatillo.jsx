import { useState } from 'react'

function TarjetaPlatillo({ platillo }) {
  const [errorImagen, setErrorImagen] = useState(false)

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
            alt={platillo.nombrePlatillo || 'Platillo'}
            loading="lazy"
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

      <div className="contenidoPlatillo">
        <div className="cabeceraPlatillo">
          <h3 className="nombrePlatillo">
            {platillo.nombrePlatillo || 'Sin nombre'}
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

        <p className="descripcionPlatillo">
          {platillo.descripcion}
        </p>

        <div className="etiquetasPlatillo">
          {platillo.subcategoria && (
            <span>
              {platillo.subcategoria}
            </span>
          )}

          {platillo.horarioDeComida && (
            <span>
              {platillo.horarioDeComida}
            </span>
          )}
        </div>

        {platillo.estadoActual && (
          <p className="estadoPlatillo">
            {platillo.estadoActual}
          </p>
        )}

        <button
          type="button"
          className="botonPlatillo"
        >
          Ver platillo
        </button>
      </div>
    </article>
  )
}

export default TarjetaPlatillo