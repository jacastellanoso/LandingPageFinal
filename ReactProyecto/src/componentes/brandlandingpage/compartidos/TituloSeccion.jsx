function TituloSeccion({ id, children }) {
  return (
    <h2 id={id} className="band-title">
      <svg className="band-title__bracket" viewBox="0 0 20 42" aria-hidden="true">
        <path d="M20 0 L0 21 L20 42" />
      </svg>
      <span>{children}</span>
      <svg className="band-title__bracket" viewBox="0 0 20 42" aria-hidden="true">
        <path d="M0 0 L20 21 L0 42" />
      </svg>
    </h2>
  )
}

export default TituloSeccion
