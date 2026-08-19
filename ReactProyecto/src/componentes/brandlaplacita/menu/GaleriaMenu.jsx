import {
  useEffect,
  useRef,
  useState,
} from 'react'

import TarjetaPlatillo from './TarjetaPlatillo'
import './GaleriaMenu.css'

const appScriptUrl =
  'https://script.google.com/macros/s/AKfycbwf3NoJXnRCxikGEWfpER4UEjTtmmZvqGvCUvqijC0r-BGjF8_MuIe3IchWwVStT7lqRA/exec'

function SelectorCategoria({
  categorias,
  categoriaSeleccionada,
  alSeleccionar,
}) {
  const [listaAbierta, setListaAbierta] =
    useState(false)

  const selectorRef = useRef(null)

  useEffect(() => {
    const cerrarAlHacerClicAfuera = (evento) => {
      if (
        selectorRef.current &&
        !selectorRef.current.contains(evento.target)
      ) {
        setListaAbierta(false)
      }
    }

    const cerrarConEscape = (evento) => {
      if (evento.key === 'Escape') {
        setListaAbierta(false)
      }
    }

    document.addEventListener(
      'mousedown',
      cerrarAlHacerClicAfuera
    )

    document.addEventListener(
      'keydown',
      cerrarConEscape
    )

    return () => {
      document.removeEventListener(
        'mousedown',
        cerrarAlHacerClicAfuera
      )

      document.removeEventListener(
        'keydown',
        cerrarConEscape
      )
    }
  }, [])

  const seleccionarOpcion = (categoria) => {
    alSeleccionar(categoria)
    setListaAbierta(false)
  }

  const nombreCategoria =
    categoriaSeleccionada === 'Todas'
      ? 'Todas las categorías'
      : categoriaSeleccionada

  return (
    <div
      className="selectorCategoriaPersonalizado"
      ref={selectorRef}
    >
      <span className="tituloFiltro">
        Categoría
      </span>

      <button
        type="button"
        className={`botonSelectorCategoria ${
          listaAbierta
            ? 'botonSelectorCategoriaAbierto'
            : ''
        }`}
        aria-haspopup="listbox"
        aria-expanded={listaAbierta}
        onClick={() =>
          setListaAbierta(
            (estadoAnterior) => !estadoAnterior
          )
        }
      >
        <span>{nombreCategoria}</span>

        <span
          className={`flechaSelectorCategoria ${
            listaAbierta
              ? 'flechaSelectorCategoriaAbierta'
              : ''
          }`}
          aria-hidden="true"
        >
          ▼
        </span>
      </button>

      {listaAbierta && (
        <div
          className="listaCategorias"
          role="listbox"
          aria-label="Categorías disponibles"
        >
          <button
            type="button"
            role="option"
            aria-selected={
              categoriaSeleccionada === 'Todas'
            }
            className={`opcionCategoria ${
              categoriaSeleccionada === 'Todas'
                ? 'opcionCategoriaSeleccionada'
                : ''
            }`}
            onClick={() =>
              seleccionarOpcion('Todas')
            }
          >
            <span>Todas las categorías</span>

            {categoriaSeleccionada === 'Todas' && (
              <span aria-hidden="true">✓</span>
            )}
          </button>

          {categorias.map((categoria) => {
            const estaSeleccionada =
              categoriaSeleccionada === categoria

            return (
              <button
                type="button"
                role="option"
                aria-selected={estaSeleccionada}
                className={`opcionCategoria ${
                  estaSeleccionada
                    ? 'opcionCategoriaSeleccionada'
                    : ''
                }`}
                key={categoria}
                onClick={() =>
                  seleccionarOpcion(categoria)
                }
              >
                <span>{categoria}</span>

                {estaSeleccionada && (
                  <span aria-hidden="true">✓</span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function GaleriaMenu() {
  const [platillos, setPlatillos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const [filtros, setFiltros] = useState({
    horarioDeComida: 'Todos',
    categoria: 'Todas',
  })

  useEffect(() => {
    const callbackName =
      `recibirPlatillos_${Date.now()}`

    const script = document.createElement('script')

    window[callbackName] = (datos) => {
      console.log('Platillos recibidos:', datos)

      if (Array.isArray(datos)) {
        setPlatillos(datos)
        setError('')
      } else {
        setError(
          'La información recibida del menú no es válida.'
        )
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

  const seleccionarHorario = (
    horarioDeComida
  ) => {
    setFiltros({
      horarioDeComida,
      categoria: 'Todas',
    })
  }

  const seleccionarCategoria = (categoria) => {
    setFiltros((filtrosAnteriores) => ({
      ...filtrosAnteriores,
      categoria,
    }))
  }

  const platillosDelHorario =
    filtros.horarioDeComida === 'Todos'
      ? platillos
      : platillos.filter(
          (platillo) =>
            platillo.horarioDeComida ===
            filtros.horarioDeComida
        )

  const categoriasDisponibles = [
    ...new Set(
      platillosDelHorario
        .map((platillo) => platillo.categoria)
        .filter(Boolean)
    ),
  ].sort((a, b) => a.localeCompare(b))

  const platillosFiltrados =
    filtros.categoria === 'Todas'
      ? platillosDelHorario
      : platillosDelHorario.filter(
          (platillo) =>
            platillo.categoria ===
            filtros.categoria
        )

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
    <div className="contenedorMenu">
      <div
        className="filtrosMenu"
        aria-label="Filtros del menú"
      >
        <div className="grupoHorarios">
          <span className="tituloFiltro">
            Horario
          </span>

          <div className="botonesHorarios">
            <button
              type="button"
              className={`botonFiltroHorario ${
                filtros.horarioDeComida === 'Todos'
                  ? 'botonFiltroHorarioActivo'
                  : ''
              }`}
              onClick={() =>
                seleccionarHorario('Todos')
              }
            >
              Ver todo
            </button>

            <button
              type="button"
              className={`botonFiltroHorario ${
                filtros.horarioDeComida ===
                'Desayuno'
                  ? 'botonFiltroHorarioActivo'
                  : ''
              }`}
              onClick={() =>
                seleccionarHorario('Desayuno')
              }
            >
              Desayuno
            </button>

            <button
              type="button"
              className={`botonFiltroHorario ${
                filtros.horarioDeComida ===
                'Almuerzo'
                  ? 'botonFiltroHorarioActivo'
                  : ''
              }`}
              onClick={() =>
                seleccionarHorario('Almuerzo')
              }
            >
              Almuerzo
            </button>

            <button
              type="button"
              className={`botonFiltroHorario ${
                filtros.horarioDeComida === 'Cena'
                  ? 'botonFiltroHorarioActivo'
                  : ''
              }`}
              onClick={() =>
                seleccionarHorario('Cena')
              }
            >
              Cena
            </button>
          </div>
        </div>

        <SelectorCategoria
          categorias={categoriasDisponibles}
          categoriaSeleccionada={
            filtros.categoria
          }
          alSeleccionar={
            seleccionarCategoria
          }
        />
      </div>

      <p className="resultadoFiltros">
        Mostrando {platillosFiltrados.length} de{' '}
        {platillos.length} platillos
      </p>

      {platillosFiltrados.length > 0 ? (
        <div className="galeriaMenu">
          {platillosFiltrados.map((platillo) => (
            <TarjetaPlatillo
              key={platillo.id}
              platillo={platillo}
            />
          ))}
        </div>
      ) : (
        <div className="estadoMenu">
          <p>
            No hay platillos que coincidan con los
            filtros seleccionados.
          </p>

          <button
            type="button"
            className="botonFiltroHorario botonFiltroHorarioActivo"
            onClick={() =>
              seleccionarHorario('Todos')
            }
          >
            Ver todo
          </button>
        </div>
      )}
    </div>
  )
}

export default GaleriaMenu