const letras = [
  { letra: 'L', x: 70, rotacion: 2 },
  { letra: 'A', x: 165, rotacion: -1 },
  { letra: 'P', x: 310, rotacion: 0.5 },
  { letra: 'L', x: 405, rotacion: 1.5 },
  { letra: 'A', x: 500, rotacion: -1 },
  { letra: 'C', x: 595, rotacion: 0.5 },
  { letra: 'I', x: 670, rotacion: 0 },
  { letra: 'T', x: 735, rotacion: 0 },
  { letra: 'A', x: 830, rotacion: -1 },
]

function GrupoLetras({ className }) {
  return (
    <g className={className} aria-hidden="true">
      {letras.map(({ letra, x, rotacion }, indice) => (
        <text
          className="logo-placita__letra"
          x={x}
          y="242"
          transform={rotacion ? `rotate(${rotacion} ${x} 242)` : undefined}
          key={`${letra}-${indice}`}
        >
          {letra}
        </text>
      ))}
    </g>
  )
}

function LogoPlacita({ ref, className = '', decorativo = false }) {
  return (
    <svg
      ref={ref}
      className={`logo-placita ${className}`.trim()}
      viewBox="0 0 900 310"
      preserveAspectRatio="xMidYMid meet"
      role={decorativo ? undefined : 'img'}
      aria-hidden={decorativo || undefined}
      aria-labelledby={decorativo ? undefined : 'logo-encabezado-titulo logo-encabezado-descripcion'}
      xmlns="http://www.w3.org/2000/svg"
    >
      {!decorativo && <title id="logo-encabezado-titulo">Comedor La Placita</title>}
      {!decorativo && (
        <desc id="logo-encabezado-descripcion">
          Logotipo oficial de Comedor La Placita con contorno blanco sobre fondo vino.
        </desc>
      )}
      <text className="logo-placita__comedor" x="450" y="112" textAnchor="middle">
        COMEDOR
      </text>
      <GrupoLetras className="logo-placita__contorno" />
      <GrupoLetras className="logo-placita__relleno" />
    </svg>
  )
}

export default LogoPlacita
