import { useEffect, useState } from 'react'
import { integrantesEquipo } from '../../data/integrantesEquipo'
import TarjetaEquipo from './TarjetaEquipo'
import TituloSeccion from './TituloSeccion'

function SeccionEquipo() {
  const [integranteActivo, setIntegranteActivo] = useState(null)

  useEffect(() => {
    const cerrarConEscape = (evento) => {
      if (evento.key === 'Escape') setIntegranteActivo(null)
    }
    document.addEventListener('keydown', cerrarConEscape)
    return () => document.removeEventListener('keydown', cerrarConEscape)
  }, [])

  return (
    <section id="equipo" className="work-band work-band--dark" aria-labelledby="titulo-equipo">
      <TituloSeccion id="titulo-equipo">Nuestro Equipo</TituloSeccion>
      <div className="equipo-layout">
        <div className="equipo-grid" aria-label="Integrantes del equipo">
          {integrantesEquipo.map((integrante) => (
            <TarjetaEquipo
              key={integrante.id}
              integrante={integrante}
              estaVolteada={integranteActivo === integrante.id}
              onCambiarEstado={() => setIntegranteActivo((idActual) => (
                idActual === integrante.id ? null : integrante.id
              ))}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default SeccionEquipo
