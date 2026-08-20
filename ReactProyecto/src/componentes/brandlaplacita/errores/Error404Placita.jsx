import ChenteDesdeHtml from './ChenteDesdeHtml'
import './Error404Placita.css'

function Error404Placita() {
  const volverAPlacita = () => {
    window.location.href = '/laplacita.html'
  }

  return (
    <main className="ph11Pagina404">
      <section className="ph11Contenido404">

        <div className="ph11Ilustracion404">
          <ChenteDesdeHtml
            id="chente-buscando"
            descripcion="Chente buscando la página"
          />
        </div>

        <div className="ph11Texto404">

          <span className="ph11Codigo404">
            404
          </span>

          <h1>
            Página no encontrada
          </h1>

          <p>
            Parece que la página que estás buscando
            no existe o ya no se encuentra disponible.
          </p>

          <button
            type="button"
            className="ph11Boton404"
            onClick={volverAPlacita}
          >
            Volver a La Placita
          </button>

        </div>

      </section>
    </main>
  )
}

export default Error404Placita