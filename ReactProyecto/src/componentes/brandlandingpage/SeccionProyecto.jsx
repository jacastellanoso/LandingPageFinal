import { useState } from 'react'
import { tecnologiasProyecto } from '../../data/tecnologiasProyecto'
import BotonTecnologia from './BotonTecnologia'
import TituloSeccion from './TituloSeccion'

function SeccionProyecto() {
  const [tecnologiaActiva, setTecnologiaActiva] = useState(tecnologiasProyecto[0].id)
  const detalleTecnologia = tecnologiasProyecto.find(({ id }) => id === tecnologiaActiva)

  return (
    <section id="proyecto" className="work-band work-band--light" aria-labelledby="titulo-proyecto">
      <TituloSeccion id="titulo-proyecto">Nuestro Proyecto</TituloSeccion>
      <div className="proyecto-minimalista">
        <div className="proyecto-minimalista__visual">
          <img
            src="https://drive.google.com/thumbnail?id=1GVDQMKxwGHzPDw_g10Z_96_-UYtqpn2a&sz=w4000"
            alt="Logo BASDELWEB"
            className="proyecto-minimalista__icon"
            draggable="false"
          />
        </div>
        <div className="proyecto-minimalista__contenido">
          <p className="proyecto-minimalista__descripcion">
            Como estudiantes de Ingeniería en Informática y Sistemas de la Universidad Rafael Landívar,
            construimos esta plataforma con código semántico, estructurado y de alto rendimiento.
          </p>
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
        </div>
      </div>
    </section>
  )
}

export default SeccionProyecto
