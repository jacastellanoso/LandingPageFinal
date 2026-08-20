import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import TituloSeccionPlacita from '../compartidos/TituloSeccionPlacita'
import './ContactoPlacita.css'

const apiContacto = 'https://script.google.com/macros/s/AKfycbwQpusvEQTd5UtGRCFf1dRTZbxW2CviL6xUGWtBpbyOv3kgVUfhSTw6aEFWLWhuyyNJrA/exec'
const correoValido = (correo) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)

function IconoCorreo() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v12H4z" /><path d="m4 7 8 6 8-6" /></svg>
}

function ChenteTazaContacto() {
  const [chenteSvg, setChenteSvg] = useState('')
  const [visible, setVisible] = useState(false)
  const contenedorRef = useRef(null)

  useEffect(() => {
    const controlador = new AbortController()

    const cargarChente = async () => {
      try {
        const respuesta = await fetch('/chente.html', { signal: controlador.signal })
        if (!respuesta.ok) return

        const documento = new DOMParser().parseFromString(await respuesta.text(), 'text/html')
        const chenteTaza = documento.querySelector('#chente-taza')
        if (!chenteTaza) return

        chenteTaza.removeAttribute('id')
        chenteTaza.removeAttribute('role')
        chenteTaza.removeAttribute('aria-label')
        chenteTaza.setAttribute('aria-hidden', 'true')
        chenteTaza.setAttribute('focusable', 'false')
        setChenteSvg(chenteTaza.outerHTML)
      } catch (errorCarga) {
        if (errorCarga.name !== 'AbortError') setChenteSvg('')
      }
    }

    cargarChente()
    return () => controlador.abort()
  }, [])

  useEffect(() => {
    const contenedor = contenedorRef.current
    if (!contenedor) return undefined

    const observador = new IntersectionObserver(([entrada]) => {
      if (!entrada.isIntersecting) return
      setVisible(true)
      observador.disconnect()
    }, { threshold: 0.15 })

    observador.observe(contenedor)
    return () => observador.disconnect()
  }, [])

  return (
    <div
      ref={contenedorRef}
      className="contactoPlacita__chenteMarco"
      aria-hidden="true"
    >
      <div
        className={`contactoPlacita__chente${visible ? ' contactoPlacita__chente--visible' : ''}`}
        dangerouslySetInnerHTML={{ __html: chenteSvg }}
      />
    </div>
  )
}

function ContactoPlacita() {
  const idBase = useId().replaceAll(':', '')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [paso, setPaso] = useState('correo')
  const [correo, setCorreo] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const botonCerrarRef = useRef(null)
  const elementoOrigenRef = useRef(null)
  const scriptRef = useRef(null)
  const temporizadorRef = useRef(null)

  const abrirModal = (origen) => {
    elementoOrigenRef.current = origen?.currentTarget ?? document.activeElement
    setCorreo('')
    setPaso('correo')
    setEnviado(false)
    setError('')
    setModalAbierto(true)
  }

  useEffect(() => {
    const abrirDesdeNavegacion = () => abrirModal()
    window.addEventListener('abrir-contacto-placita', abrirDesdeNavegacion)
    return () => window.removeEventListener('abrir-contacto-placita', abrirDesdeNavegacion)
  }, [])

  useEffect(() => {
    if (!modalAbierto) return undefined
    const desplazamientoAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    botonCerrarRef.current?.focus()
    const cerrarConEscape = (evento) => {
      if (evento.key === 'Escape' && !enviando) setModalAbierto(false)
    }
    document.addEventListener('keydown', cerrarConEscape)
    return () => {
      document.body.style.overflow = desplazamientoAnterior
      document.removeEventListener('keydown', cerrarConEscape)
      elementoOrigenRef.current?.focus?.()
    }
  }, [modalAbierto, enviando])

  useEffect(() => () => {
    if (temporizadorRef.current) window.clearTimeout(temporizadorRef.current)
    scriptRef.current?.remove()
  }, [])

  const continuarConCorreo = (evento) => {
    evento.preventDefault()
    const correoLimpio = correo.trim()
    if (!correoValido(correoLimpio)) {
      setError('Ingresa un correo electrónico válido.')
      return
    }
    setCorreo(correoLimpio)
    setError('')
    setPaso('formulario')
    setModalAbierto(true)
  }

  const enviarFormulario = (evento) => {
    evento.preventDefault()
    const datos = new FormData(evento.currentTarget)
    const nombre = String(datos.get('nombre') ?? '').trim()
    const telefono = String(datos.get('telefono') ?? '').trim()
    const motivo = String(datos.get('motivo') ?? '').trim()
    const asunto = String(datos.get('asunto') ?? '').trim()
    const mensaje = String(datos.get('mensaje') ?? '').trim()
    const sitioWeb = String(datos.get('sitioWeb') ?? '').trim()
    if (sitioWeb || !motivo || nombre.length < 2 || asunto.length < 4 || mensaje.length < 15) {
      setError('Revisa los campos obligatorios y las longitudes indicadas.')
      return
    }

    setError('')
    setEnviando(true)
    const callback = `contactoPlacita_${Date.now()}`
    const limpiar = () => {
      if (temporizadorRef.current) window.clearTimeout(temporizadorRef.current)
      temporizadorRef.current = null
      scriptRef.current?.remove()
      scriptRef.current = null
      delete window[callback]
      setEnviando(false)
    }
    window[callback] = (respuesta) => {
      limpiar()
      if (respuesta?.ok === true) setEnviado(true)
      else setError(respuesta?.mensaje || 'No fue posible enviar el mensaje.')
    }
    const parametros = new URLSearchParams({ api: 'contacto', callback, nombre, correo, telefono, asunto: `[${motivo}] ${asunto}`, mensaje, t: Date.now().toString() })
    const script = document.createElement('script')
    script.src = `${apiContacto}?${parametros}`
    script.onerror = () => {
      limpiar()
      setError('No fue posible conectar con el servicio. Inténtalo nuevamente.')
    }
    scriptRef.current = script
    document.body.appendChild(script)
    temporizadorRef.current = window.setTimeout(() => {
      limpiar()
      setError('El envío está tardando demasiado. Inténtalo nuevamente.')
    }, 20000)
  }

  const reiniciar = () => {
    setPaso('correo')
    setEnviado(false)
    setError('')
  }

  const escribirOtroMensaje = () => {
    setEnviado(false)
    setError('')
    setPaso('formulario')
  }

  const formularioCorreo = <form className="contactoPlacita__ingreso" onSubmit={continuarConCorreo}>
    <label className="soloLectoresPlacita" htmlFor={`${idBase}-correo-inicial`}>Correo electrónico</label>
    <span className="contactoPlacita__icono" aria-hidden="true"><IconoCorreo /></span>
    <input id={`${idBase}-correo-inicial`} type="email" value={correo} onChange={(evento) => setCorreo(evento.target.value)} placeholder="Ingresa tu correo" autoComplete="email" maxLength="180" required />
    <button type="submit">Continuar</button>
  </form>

  const modal = modalAbierto && createPortal(<div className="contactoModal" role="presentation" onMouseDown={(evento) => {
    if (evento.target === evento.currentTarget && !enviando) setModalAbierto(false)
  }}><section className="contactoModal__ventana" role="dialog" aria-modal="true" aria-labelledby={`${idBase}-titulo-modal`}>
    <button ref={botonCerrarRef} className="contactoModal__cerrar" type="button" aria-label="Cerrar formulario" disabled={enviando} onClick={() => setModalAbierto(false)}>×</button>
    {paso === 'correo' && !enviado ? <div className="contactoModal__inicio"><h2 id={`${idBase}-titulo-modal`}>Escríbenos</h2><p>Ingresa tu correo para comenzar.</p>{formularioCorreo}</div> : enviado ? <div className="contactoModal__resultado"><span aria-hidden="true">✓</span><h2 id={`${idBase}-titulo-modal`}>Mensaje enviado</h2><p>Recibimos tu solicitud. Utilizaremos tu correo para responderte.</p><div className="contactoModal__resultadoAcciones"><button type="button" onClick={escribirOtroMensaje}>Enviar otro mensaje</button><button type="button" className="contactoModal__secundario" onClick={() => setModalAbierto(false)}>Cerrar</button></div></div> : <>
      <header className="contactoModal__encabezado"><span>Contacto</span><h2 id={`${idBase}-titulo-modal`}>Envíanos tu mensaje</h2><p>Completa los campos marcados con *.</p></header>
      <form className="contactoModal__formulario" onSubmit={enviarFormulario}>
        <div className="contactoModal__trampa" aria-hidden="true"><label htmlFor={`${idBase}-sitio`}>Sitio web</label><input id={`${idBase}-sitio`} name="sitioWeb" tabIndex="-1" autoComplete="off" /></div>
        <fieldset className="contactoModal__motivos"><legend>¿En qué podemos ayudarte? *</legend>{['Reserva', 'Consulta', 'Otro'].map((motivo) => <label key={motivo}><input type="radio" name="motivo" value={motivo} required /><span>{motivo === 'Reserva' ? 'Quiero reservar' : motivo === 'Consulta' ? 'Quiero preguntar' : 'Otro mensaje'}</span></label>)}</fieldset>
        <label>Nombre *<input name="nombre" minLength="2" maxLength="100" autoComplete="name" required /></label>
        <label>Teléfono <small>(Opcional)</small><input name="telefono" type="tel" maxLength="40" autoComplete="tel" /></label>
        <label className="contactoModal__ancho">Correo electrónico *<input type="email" value={correo} readOnly /></label>
        <label className="contactoModal__ancho">Asunto *<input name="asunto" minLength="4" maxLength="120" required /></label>
        <label className="contactoModal__ancho">Mensaje *<textarea name="mensaje" minLength="15" maxLength="3000" required /></label>
        {error && <p className="contactoModal__error" role="alert">{error}</p>}
        <div className="contactoModal__acciones"><button type="submit" disabled={enviando}>{enviando ? 'Enviando…' : 'Enviar mensaje'}</button><button type="button" className="contactoModal__secundario" disabled={enviando} onClick={reiniciar}>Cambiar correo</button></div>
      </form>
    </>}
    {paso === 'correo' && error && <p className="contactoModal__error" role="alert">{error}</p>}
  </section></div>, document.body)

  return <><section id="contactoPlacita" className="contactoPlacita" aria-labelledby={`${idBase}-titulo`}><div className="contactoPlacita__presentacion"><div className="contactoPlacita__textos"><TituloSeccionPlacita id={`${idBase}-titulo`} variante="claro">Contacto</TituloSeccionPlacita><p className="contactoPlacita__instruccion">¿Tienes alguna pregunta o quieres reservar? Escríbenos.</p></div><ChenteTazaContacto /></div>{formularioCorreo}</section><button className="contactoPlacita__flotante" type="button" aria-label="Abrir formulario de contacto" onClick={abrirModal}><IconoCorreo /></button>{modal}</>
}

export default ContactoPlacita
