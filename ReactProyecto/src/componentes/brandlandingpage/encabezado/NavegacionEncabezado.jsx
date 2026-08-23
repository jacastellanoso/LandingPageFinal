import BotonEncabezado from './BotonEncabezado'

const enlacesEncabezado = [
  {
    destino: '#equipo',
    etiqueta: 'NUESTRO EQUIPO',
    rutaIcono: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  },
  {
    destino: '#proyecto',
    etiqueta: 'NUESTRO PROYECTO',
    rutaIcono: 'm8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14',
  },
  {
    destino: '#contacto',
    etiqueta: 'CONTACTO',
    rutaIcono: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2ZM22 6l-10 7L2 6',
  },
]

function NavegacionEncabezado() {
  return (
    <ul className="site-nav__list">
      {enlacesEncabezado.map((enlace) => (
        <BotonEncabezado key={enlace.destino} {...enlace} />
      ))}
    </ul>
  )
}

export default NavegacionEncabezado
