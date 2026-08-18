import { useEffect, useState } from 'react'
import TarjetaPlatillo from './TarjetaPlatillo'
import './GaleriaMenu.css'

const appScriptUrl =
  'https://script.google.com/macros/s/AKfycbwf3NoJXnRCxikGEWfpER4UEjTtmmZvqGvCUvqijC0r-BGjF8_MuIe3IchWwVStT7lqRA/exec'

function GaleriaMenu() {
  const [platillos, setPlatillos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const callbackName = `recibirPlatillos_${Date.now()}`

    const script = document.createElement('script')

    window[callbackName] = (datos) => {
      console.log('Platillos recibidos:', datos)

      if (Array.isArray(datos)) {
        setPlatillos(datos)
        setError('')
      } else {
        setError('La información recibida del menú no es válida.')
      }

      setCargando(false)
    }

    script.src =
      `${appScriptUrl}?api=platillos` +
      `&callback=${encodeURIComponent(callbackName)}` +
      `&t=${Date.now()}`

    script.async = true

    script.onerror = () => {
      console.error(
        'No fue posible cargar la API de platillos:',
        script.src
      )

      setError(
        'No fue posible conectar con el menú de La Placita.'
      )

      setCargando(false)
    }

    document.body.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }

      delete window[callbackName]
    }
  }, [])

  if (cargando) {
    return (
      <div className="estadoMenu">
        <div className="cargadorMenu"></div>

        <p>Cargando platillos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="estadoMenu estadoMenuError">
        <h3>No pudimos cargar el menú</h3>
        <p>{error}</p>
      </div>
    )
  }

  if (platillos.length === 0) {
    return (
      <div className="estadoMenu">
        <p>No hay platillos para mostrar.</p>
      </div>
    )
  }

  return (
    <div className="galeriaMenu">
      {platillos.map((platillo) => (
        <TarjetaPlatillo
          key={platillo.id}
          platillo={platillo}
        />
      ))}
    </div>
  )
}

export default GaleriaMenu