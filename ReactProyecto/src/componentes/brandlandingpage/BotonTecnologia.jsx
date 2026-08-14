import MallaDecorativa from './MallaDecorativa'

function BotonTecnologia({ tecnologia, estaActiva, onActivar }) {
  return (
    <button
      type="button"
      className={`proyecto-tech${estaActiva ? ' is-active' : ''}${tecnologia.id === 'arquitectura' ? ' proyecto-tech--wide' : ''}`}
      aria-pressed={estaActiva}
      onClick={onActivar}
    >
      <MallaDecorativa className="proyecto-tech__mesh" />
      <svg className="proyecto-tech__icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14" />
      </svg>
      <span className="proyecto-tech__label">{tecnologia.etiqueta}</span>
    </button>
  )
}

export default BotonTecnologia
