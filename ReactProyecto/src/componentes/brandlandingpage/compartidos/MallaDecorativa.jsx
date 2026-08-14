function MallaDecorativa({ className, tipo = 'boton' }) {
  const configuraciones = {
    boton: {
      viewBox: '0 0 180 54',
      ruta: 'M-8 8 L25 1 L49 19 L79 -5 L109 15 L145 3 L188 24 M-5 43 L25 1 M-5 43 L49 19 L75 50 L109 15 L137 46 L188 24 M49 19 L109 15 M75 50 L137 46 M145 3 L137 46',
    },
    contacto: {
      viewBox: '0 0 260 140',
      ruta: 'M-10 20 L60 5 L110 40 L170 10 L270 35 M-10 110 L60 90 L120 125 L190 85 L270 115 M60 5 L60 90 M170 10 L190 85',
    },
    equipo: {
      viewBox: '0 0 260 360',
      ruta: 'M-10 35 L55 0 L118 62 L196 8 L270 55 M-20 310 L55 238 L130 365 L196 260 L275 325 M55 0 L55 238 M118 62 L196 260 M196 8 L270 55 L196 260 L275 325',
    },
  }
  const configuracion = configuraciones[tipo] ?? configuraciones.boton

  return (
    <svg
      className={className}
      viewBox={configuracion.viewBox}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d={configuracion.ruta} />
    </svg>
  )
}

export default MallaDecorativa
