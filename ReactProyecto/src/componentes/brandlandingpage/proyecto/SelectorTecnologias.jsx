import { useState } from 'react'
import { tecnologiasProyecto } from '../../../data/tecnologiasProyecto'
import BotonTecnologia from './BotonTecnologia'

function SelectorTecnologias() {
  const [tecnologiaActiva, setTecnologiaActiva] = useState(tecnologiasProyecto[0].id)
  const detalleTecnologia = tecnologiasProyecto.find(({ id }) => id === tecnologiaActiva)

  return (
    <>
      <div className="proyecto-minimalista__tecnologias" aria-label="Tecnologías del proyecto">
        {tecnologiasProyecto.map((tecnologia) => (
          <BotonTecnologia
            key={tecnologia.id}
            tecnologia={tecnologia}
            estaActiva={tecnologiaActiva === tecnologia.id}
            onActivar={() => setTecnologiaActiva(tecnologia.id)}
          />
        ))}
      </div>
      <div className="proyecto-minimalista__detalle" aria-live="polite">
        <div className="proyecto-minimalista__detalle-contenido">
          <h3 className="proyecto-minimalista__detalle-titulo">{detalleTecnologia.titulo}</h3>
          <p className="proyecto-minimalista__detalle-texto">{detalleTecnologia.texto}</p>
        </div>
      </div>
    </>
  )
}

export default SelectorTecnologias
