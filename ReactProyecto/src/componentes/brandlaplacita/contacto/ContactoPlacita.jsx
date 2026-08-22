import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import TituloSeccionPlacita from '../compartidos/TituloSeccionPlacita'
import './ContactoPlacita.css'

const apiContacto = 'https://script.google.com/macros/s/AKfycbwQpusvEQTd5UtGRCFf1dRTZbxW2CviL6xUGWtBpbyOv3kgVUfhSTw6aEFWLWhuyyNJrA/exec'
const longitudMaximaCorreo = 180
const minimoDigitosTelefono = 8
const maximoDigitosTelefono = 15
const dominiosGmailIncorrectos = new Set(['gmial.com', 'gmal.com', 'gmai.com', 'gmail.con'])
const valoresIniciales = { motivo: '', nombre: '', telefono: '', asunto: '', mensaje: '' }

const validarCorreo = (correo) => {
  const correoLimpio = correo.trim()
  if (!correoLimpio) return 'Por favor, ingresa tu correo.'
  if (correoLimpio.length > longitudMaximaCorreo || /\s/.test(correoLimpio)) return 'Por favor, ingresa un correo válido.'

  const partesCorreo = correoLimpio.split('@')
  if (partesCorreo.length !== 2 || !partesCorreo[0] || !partesCorreo[1]) return 'Por favor, ingresa un correo válido.'

  const dominio = partesCorreo[1].toLowerCase()
  if (dominiosGmailIncorrectos.has(dominio)) {
    return `El dominio ${dominio} parece incorrecto. ¿Quisiste escribir gmail.com?`
  }

  const etiquetasDominio = dominio.split('.')
  const terminacion = etiquetasDominio.at(-1)
  const dominioValido = etiquetasDominio.length > 1
    && !correoLimpio.includes('..')
    && etiquetasDominio.every((etiqueta) => /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(etiqueta))
    && /^[a-z]{2,}$/i.test(terminacion)

  return dominioValido ? '' : 'Por favor, ingresa un correo válido.'
}

const validarTelefono = (telefono) => {
  const telefonoLimpio = telefono.trim()
  if (!telefonoLimpio) return ''
  if (!/^\+?\d+$/.test(telefonoLimpio)) return 'El teléfono solo puede contener números y un signo + al inicio.'

  const cantidadDigitos = telefonoLimpio.startsWith('+') ? telefonoLimpio.length - 1 : telefonoLimpio.length
  if (cantidadDigitos < minimoDigitosTelefono || cantidadDigitos > maximoDigitosTelefono) {
    return `Ingresa un teléfono válido de entre ${minimoDigitosTelefono} y ${maximoDigitosTelefono} dígitos.`
  }

  return ''
}

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
  const [valoresFormulario, setValoresFormulario] = useState(valoresIniciales)
  const [erroresFormulario, setErroresFormulario] = useState({})
  const [errorEnvio, setErrorEnvio] = useState('')
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
    setErroresFormulario({})
    setErrorEnvio('')
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
    const errorCorreo = validarCorreo(correoLimpio)
    if (errorCorreo) {
      setErroresFormulario({ correo: errorCorreo })
      window.requestAnimationFrame(() => document.getElementById(`${idBase}-correo-inicial`)?.focus())
      return
    }
    setCorreo(correoLimpio)
    setErroresFormulario({})
    setErrorEnvio('')
    setPaso('formulario')
    setModalAbierto(true)
  }

  const validarFormulario = () => {
    const errores = {}
    if (!valoresFormulario.motivo) errores.motivo = 'Selecciona una opción para continuar.'
    if (!valoresFormulario.nombre.trim()) errores.nombre = 'Este campo es obligatorio.'
    else if (valoresFormulario.nombre.trim().length < 2) errores.nombre = 'El nombre debe contener al menos 2 caracteres.'
    const errorTelefono = validarTelefono(valoresFormulario.telefono)
    if (errorTelefono) errores.telefono = errorTelefono
    if (!valoresFormulario.asunto.trim()) errores.asunto = 'Este campo es obligatorio.'
    else if (valoresFormulario.asunto.trim().length < 4) errores.asunto = 'El asunto debe contener al menos 4 caracteres.'
    if (!valoresFormulario.mensaje.trim()) errores.mensaje = 'Este campo es obligatorio.'
    else if (valoresFormulario.mensaje.trim().length < 15) errores.mensaje = 'El mensaje debe contener al menos 15 caracteres.'
    return errores
  }

  const cambiarCampo = (evento) => {
    const { name, value } = evento.target
    setValoresFormulario((valoresAnteriores) => ({ ...valoresAnteriores, [name]: value }))
    setErroresFormulario((erroresAnteriores) => {
      if (!erroresAnteriores[name]) return erroresAnteriores
      const erroresActualizados = { ...erroresAnteriores }
      delete erroresActualizados[name]
      return erroresActualizados
    })
  }

  const cambiarTelefono = (evento) => {
    const valorIngresado = evento.target.value
    const valorFiltrado = valorIngresado
      .split('')
      .filter((caracter, indice) => /\d/.test(caracter) || (caracter === '+' && indice === 0))
      .join('')
      .slice(0, maximoDigitosTelefono + 1)

    setValoresFormulario((valoresAnteriores) => ({ ...valoresAnteriores, telefono: valorFiltrado }))
    setErroresFormulario((erroresAnteriores) => {
      const erroresActualizados = { ...erroresAnteriores }
      if (valorIngresado !== valorFiltrado) erroresActualizados.telefono = 'El teléfono solo puede contener números y un signo + al inicio.'
      else {
        const errorTelefono = validarTelefono(valorFiltrado)
        if (errorTelefono) erroresActualizados.telefono = errorTelefono
        else delete erroresActualizados.telefono
      }
      return erroresActualizados
    })
  }

  const validarTelefonoAlSalir = () => {
    const errorTelefono = validarTelefono(valoresFormulario.telefono)
    setErroresFormulario((erroresAnteriores) => {
      const erroresActualizados = { ...erroresAnteriores }
      if (errorTelefono) erroresActualizados.telefono = errorTelefono
      else delete erroresActualizados.telefono
      return erroresActualizados
    })
  }

  const enviarFormulario = (evento) => {
    evento.preventDefault()
    const datos = new FormData(evento.currentTarget)
    const nombre = valoresFormulario.nombre.trim()
    const telefono = valoresFormulario.telefono.trim()
    const motivo = valoresFormulario.motivo
    const asunto = valoresFormulario.asunto.trim()
    const mensaje = valoresFormulario.mensaje.trim()
    const sitioWeb = String(datos.get('sitioWeb') ?? '').trim()
    const errores = validarFormulario()
    if (sitioWeb || Object.keys(errores).length > 0) {
      setErroresFormulario(errores)
      const primerCampo = Object.keys(errores)[0]
      window.requestAnimationFrame(() => document.getElementById(`${idBase}-${primerCampo}`)?.focus())
      return
    }

    setErroresFormulario({})
    setErrorEnvio('')
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
      else setErrorEnvio(respuesta?.mensaje || 'No fue posible enviar el mensaje.')
    }
    const parametros = new URLSearchParams({ api: 'contacto', callback, nombre, correo, telefono, asunto: `[${motivo}] ${asunto}`, mensaje, t: Date.now().toString() })
    const script = document.createElement('script')
    script.src = `${apiContacto}?${parametros}`
    script.onerror = () => {
      limpiar()
      setErrorEnvio('No fue posible conectar con el servicio. Inténtalo nuevamente.')
    }
    scriptRef.current = script
    document.body.appendChild(script)
    temporizadorRef.current = window.setTimeout(() => {
      limpiar()
      setErrorEnvio('El envío está tardando demasiado. Inténtalo nuevamente.')
    }, 20000)
  }

  const reiniciar = () => {
    setPaso('correo')
    setEnviado(false)
    setErroresFormulario({})
    setErrorEnvio('')
  }

  const escribirOtroMensaje = () => {
    setEnviado(false)
    setErroresFormulario({})
    setErrorEnvio('')
    setPaso('formulario')
  }

  const formularioCorreo = <form className="contactoPlacita__ingreso" onSubmit={continuarConCorreo} noValidate>
    <label className="soloLectoresPlacita" htmlFor={`${idBase}-correo-inicial`}>Correo electrónico</label>
    <span className="contactoPlacita__icono" aria-hidden="true"><IconoCorreo /></span>
    <input id={`${idBase}-correo-inicial`} type="email" value={correo} onChange={(evento) => { setCorreo(evento.target.value); setErroresFormulario((errores) => ({ ...errores, correo: '' })) }} placeholder="Ingresa tu correo" autoComplete="email" maxLength={longitudMaximaCorreo} aria-invalid={Boolean(erroresFormulario.correo)} aria-describedby={erroresFormulario.correo ? `${idBase}-correo-error` : undefined} />
    <button type="submit">Continuar</button>
    {erroresFormulario.correo && <p id={`${idBase}-correo-error`} className="contactoCampoError" role="alert">{erroresFormulario.correo}</p>}
  </form>

  const modal = modalAbierto && createPortal(<div className="contactoModal" role="presentation" onMouseDown={(evento) => {
    if (evento.target === evento.currentTarget && !enviando) setModalAbierto(false)
  }}><section className="contactoModal__ventana" role="dialog" aria-modal="true" aria-labelledby={`${idBase}-titulo-modal`}>
    <button ref={botonCerrarRef} className="contactoModal__cerrar" type="button" aria-label="Cerrar formulario" disabled={enviando} onClick={() => setModalAbierto(false)}>×</button>
    {paso === 'correo' && !enviado ? <div className="contactoModal__inicio"><h2 id={`${idBase}-titulo-modal`}>Escríbenos</h2><p>Ingresa tu correo para comenzar.</p>{formularioCorreo}</div> : enviado ? <div className="contactoModal__resultado"><span aria-hidden="true">✓</span><h2 id={`${idBase}-titulo-modal`}>Mensaje enviado</h2><p>Recibimos tu solicitud. Utilizaremos tu correo para responderte.</p><div className="contactoModal__resultadoAcciones"><button type="button" onClick={escribirOtroMensaje}>Enviar otro mensaje</button><button type="button" className="contactoModal__secundario" onClick={() => setModalAbierto(false)}>Cerrar</button></div></div> : <>
      <header className="contactoModal__encabezado"><span>Contacto</span><h2 id={`${idBase}-titulo-modal`}>Envíanos tu mensaje</h2><p>Completa los campos marcados con *.</p></header>
      <form className="contactoModal__formulario" onSubmit={enviarFormulario} noValidate>
        <div className="contactoModal__trampa" aria-hidden="true"><label htmlFor={`${idBase}-sitio`}>Sitio web</label><input id={`${idBase}-sitio`} name="sitioWeb" tabIndex="-1" autoComplete="off" /></div>
        <fieldset className="contactoModal__motivos" aria-invalid={Boolean(erroresFormulario.motivo)} aria-describedby={erroresFormulario.motivo ? `${idBase}-motivo-error` : undefined}><legend>¿En qué podemos ayudarte? *</legend>{['Reserva', 'Consulta', 'Otro'].map((motivo) => <label key={motivo}><input id={motivo === 'Reserva' ? `${idBase}-motivo` : undefined} type="radio" name="motivo" value={motivo} checked={valoresFormulario.motivo === motivo} onChange={cambiarCampo} /><span>{motivo === 'Reserva' ? 'Quiero reservar' : motivo === 'Consulta' ? 'Quiero preguntar' : 'Otro mensaje'}</span></label>)}{erroresFormulario.motivo && <p id={`${idBase}-motivo-error`} className="contactoCampoError" role="alert">{erroresFormulario.motivo}</p>}</fieldset>
        <label>Nombre *<input id={`${idBase}-nombre`} name="nombre" value={valoresFormulario.nombre} onChange={cambiarCampo} minLength="2" maxLength="100" autoComplete="name" aria-invalid={Boolean(erroresFormulario.nombre)} aria-describedby={erroresFormulario.nombre ? `${idBase}-nombre-error` : undefined} />{erroresFormulario.nombre && <span id={`${idBase}-nombre-error`} className="contactoCampoError" role="alert">{erroresFormulario.nombre}</span>}</label>
        <label>Teléfono <small>(Opcional)</small><input id={`${idBase}-telefono`} name="telefono" type="tel" inputMode="tel" value={valoresFormulario.telefono} onChange={cambiarTelefono} onBlur={validarTelefonoAlSalir} maxLength={maximoDigitosTelefono + 1} autoComplete="tel" aria-invalid={Boolean(erroresFormulario.telefono)} aria-describedby={erroresFormulario.telefono ? `${idBase}-telefono-error` : undefined} />{erroresFormulario.telefono && <span id={`${idBase}-telefono-error`} className="contactoCampoError" role="alert">{erroresFormulario.telefono}</span>}</label>
        <label className="contactoModal__ancho">Correo electrónico *<input type="email" value={correo} readOnly /></label>
        <label className="contactoModal__ancho">Asunto *<input id={`${idBase}-asunto`} name="asunto" value={valoresFormulario.asunto} onChange={cambiarCampo} minLength="4" maxLength="120" aria-invalid={Boolean(erroresFormulario.asunto)} aria-describedby={erroresFormulario.asunto ? `${idBase}-asunto-error` : undefined} />{erroresFormulario.asunto && <span id={`${idBase}-asunto-error`} className="contactoCampoError" role="alert">{erroresFormulario.asunto}</span>}</label>
        <label className="contactoModal__ancho">Mensaje *<textarea id={`${idBase}-mensaje`} name="mensaje" value={valoresFormulario.mensaje} onChange={cambiarCampo} minLength="15" maxLength="3000" aria-invalid={Boolean(erroresFormulario.mensaje)} aria-describedby={erroresFormulario.mensaje ? `${idBase}-mensaje-error` : undefined} />{erroresFormulario.mensaje && <span id={`${idBase}-mensaje-error`} className="contactoCampoError" role="alert">{erroresFormulario.mensaje}</span>}</label>
        {errorEnvio && <p className="contactoModal__error" role="alert">{errorEnvio}</p>}
        <div className="contactoModal__acciones"><button type="submit" disabled={enviando}>{enviando ? 'Enviando…' : 'Enviar mensaje'}</button><button type="button" className="contactoModal__secundario" disabled={enviando} onClick={reiniciar}>Cambiar correo</button></div>
      </form>
    </>}
  </section></div>, document.body)

  return <><section id="contactoPlacita" className="contactoPlacita" aria-labelledby={`${idBase}-titulo`}><div className="contactoPlacita__presentacion"><div className="contactoPlacita__textos"><TituloSeccionPlacita id={`${idBase}-titulo`} variante="claro">Contacto</TituloSeccionPlacita><p className="contactoPlacita__instruccion">¿Tienes alguna pregunta o quieres reservar? Escríbenos.</p></div><ChenteTazaContacto /></div>{formularioCorreo}</section><button className="contactoPlacita__flotante" type="button" aria-label="Abrir formulario de contacto" onClick={abrirModal}><IconoCorreo /></button>{modal}</>
}

export default ContactoPlacita
