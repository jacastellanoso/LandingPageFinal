import { integrantesEquipo } from '../../data/integrantesEquipo'
import TarjetaContacto from './TarjetaContacto'
import TituloSeccion from './TituloSeccion'

function PiePagina() {
  return (
    <>
      <footer id="contacto" className="work-band work-band--dark contact-footer" aria-labelledby="titulo-contacto">
        <div className="footer-logo-column">
          <img
            className="footer-logo-image"
            src="https://drive.google.com/thumbnail?id=1GVDQMKxwGHzPDw_g10Z_96_-UYtqpn2a&sz=w4000"
            alt="BASDELWEB"
          />
          <nav className="footer-nav" aria-label="Navegación del pie de página">
            <a href="#equipo">NUESTRO EQUIPO</a>
            <a href="#proyecto">NUESTRO PROYECTO</a>
            <a href="#contacto">CONTACTO</a>
          </nav>
        </div>
        <div className="contact-workspace">
          <div className="contact-content">
            <TituloSeccion id="titulo-contacto">Contacto</TituloSeccion>
            <ul className="contact-grid" aria-label="Contacto de cada integrante del equipo">
              {integrantesEquipo.map((integrante, indice) => (
                <TarjetaContacto
                  key={integrante.id}
                  integrante={integrante}
                  indice={indice}
                />
              ))}
            </ul>
          </div>
        </div>
      </footer>
      <div className="copyright-bar">
        <span className="copyright-bar__text">
          <span>Todos los derechos reservados</span>
          <span className="copyright-bar__group">© 2026</span>
          <span className="copyright-bar__group">- BASDELWEB®</span>
        </span>
      </div>
    </>
  )
}

export default PiePagina
