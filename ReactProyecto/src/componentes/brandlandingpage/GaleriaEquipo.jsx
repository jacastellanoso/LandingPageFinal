import { useEffect, useState } from 'react'
import { integrantesEquipo } from '../../data/integrantesEquipo'
import TarjetaEquipo from './TarjetaEquipo'

function GaleriaEquipo() {
  const [integranteActivo, setIntegranteActivo] = useState(null)

  useEffect(() => {
    const cerrarConEscape = (evento) => {
      if (evento.key === 'Escape') setIntegranteActivo(null)
    }
    document.addEventListener('keydown', cerrarConEscape)
    return () => document.removeEventListener('keydown', cerrarConEscape)
  }, [])

  return integrantesEquipo.map((integrante) => (
    <TarjetaEquipo
      key={integrante.id}
      integrante={integrante}
      estaVolteada={integranteActivo === integrante.id}
      onCambiarEstado={() => setIntegranteActivo((idActual) => (
        idActual === integrante.id ? null : integrante.id
      ))}
    />
  ))
}

export default GaleriaEquipo
