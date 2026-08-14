import MallaDecorativa from '../compartidos/MallaDecorativa'

function BotonEncabezado({ destino, etiqueta, rutaIcono }) {
  return (
    <li className="nav-button">
      <a href={destino}>
        <MallaDecorativa className="nav-button__mesh" />
        <svg className="nav-button__icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d={rutaIcono} />
        </svg>
        <span className="nav-button__label">{etiqueta}</span>
      </a>
    </li>
  )
}

export default BotonEncabezado
