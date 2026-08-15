function TituloSeccionPlacita({ children, id, variante = '' }) {
  const claseVariante = variante ? ` tituloSeccionPlacita--${variante}` : ''

  return (
    <h2 id={id} className={`tituloSeccionPlacita${claseVariante}`}>
      {children}
    </h2>
  )
}

export default TituloSeccionPlacita
