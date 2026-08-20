import ChenteDesdeHtml from './ChenteDesdeHtml'
import './ErroresChente.css'

function ErrorImagenChente() {
  return (
    <div className="ph11ErrorImagen">
      <ChenteDesdeHtml
        id="chente-error"
        className="ph11ErrorImagenPersonaje"
        descripcion="Chente indicando que la imagen no está disponible"
      />

      <p className="ph11ErrorImagenTexto">
        Imagen no disponible
      </p>
    </div>
  )
}

export default ErrorImagenChente