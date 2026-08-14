import { integrantesEquipo } from '../../../data/integrantesEquipo'
import TarjetaContacto from './TarjetaContacto'

function ListaContactos() {
  return integrantesEquipo.map((integrante, indice) => (
    <TarjetaContacto
      key={integrante.id}
      integrante={integrante}
      indice={indice}
    />
  ))
}

export default ListaContactos
