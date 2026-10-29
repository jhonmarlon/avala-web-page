import { ArrowUpRight, Check, LoaderCircle, MessageCircle } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router'
import { Honeypot } from '@/components/ui/Honeypot'
import { companyInfo } from '@/config/site'
import { whatsappLink } from '@/features/contact/data/channels'
import { services } from '@/features/home/data/content'
import { submitForm } from '@/lib/forms'
import { cn } from '@/lib/utils'

type Fields = {
  name: string
  email: string
  company: string
  phone: string
  message: string
}

// 'form': enviado por la API a info@avalagroup.net · 'whatsapp': abre WhatsApp con el mensaje armado
type Channel = 'form' | 'whatsapp'

const ease = [0.76, 0, 0.24, 1] as const
const emptyFields: Fields = { name: '', email: '', company: '', phone: '', message: '' }
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(fields: Fields) {
  const errors: Partial<Record<keyof Fields, string>> = {}
  if (fields.name.trim().length < 2) errors.name = 'Contanos tu nombre.'
  if (!EMAIL_PATTERN.test(fields.email.trim())) errors.email = 'Ingresá un email válido.'
  if (fields.phone.trim() && fields.phone.replace(/\D/g, '').length < 7) errors.phone = 'Revisá el número.'
  if (fields.message.trim().length < 10) errors.message = 'Contanos un poco más (mínimo 10 caracteres).'
  return errors
}

function composeMessage(fields: Fields, interests: string[]) {
  const optional = (label: string, value: string) => (value.trim() ? [`${label}: ${value.trim()}`] : [])
  return [
    `Hola ${companyInfo.name}, quiero hablar de un proyecto.`,
    '',
    `Nombre: ${fields.name.trim()}`,
    ...optional('Empresa', fields.company),
    `Email: ${fields.email.trim()}`,
    ...optional('Teléfono', fields.phone),
    ...optional('Interés', interests.join(', ')),
    '',
    fields.message.trim(),
  ].join('\n')
}

function openWhatsapp(text: string) {
  if (!whatsappLink) return
  const url = new URL(whatsappLink.href)
  url.searchParams.set('text', text)
  window.open(url.toString(), '_blank', 'noopener')
}

type FieldProps = {
  id: string
  label: string
  index: string
  error?: string
  optional?: boolean
  children: ReactNode
}

function Field({ id, label, index, error, optional, children }: FieldProps) {
  return (
    <div className="group/field relative">
      <label htmlFor={id} className="hud-label flex items-baseline gap-3">
        <span className="tabular text-avala-neon">{index}</span>
        <span className="text-avala-paper/80">{label}</span>
        {optional && <span className="text-avala-mute/70">(opcional)</span>}
      </label>
      {children}
      {/* Línea base + línea neón que se dibuja al enfocar */}
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-avala-paper/15" />
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-avala-neon transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-focus-within/field:scale-x-100',
          error && 'scale-x-100 bg-[#ff6b8a]',
        )}
      />
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute -bottom-6 left-0 font-mono text-[0.68rem] tracking-[0.04em] text-[#ff8aa3]"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

const inputClass =
  'display-tight mt-3 w-full bg-transparent pb-4 text-[clamp(1.3rem,2.4vw,1.9rem)] tracking-[-0.03em] text-avala-paper placeholder:text-avala-paper/20 focus:outline-none'

export function ContactForm() {
  const uid = useId()
  const [fields, setFields] = useState<Fields>(emptyFields)
  const [interests, setInterests] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [sentVia, setSentVia] = useState<Channel | null>(null)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const [honeypot, setHoneypot] = useState('')
  // Momento del primer tecleo: la API rechaza formularios completados en segundos (bots)
  const startedAt = useRef<number | null>(null)

  const errors = submitted ? validate(fields) : {}

  const update = (key: keyof Fields) => (event: { target: { value: string } }) => {
    startedAt.current ??= Date.now()
    setFields((current) => ({ ...current, [key]: event.target.value }))
  }

  const toggleInterest = (title: string) =>
    setInterests((current) => (current.includes(title) ? current.filter((item) => item !== title) : [...current, title]))

  const isValid = () => {
    setSubmitted(true)
    const found = validate(fields)
    if (Object.keys(found).length > 0) {
      document.getElementById(`${uid}-${Object.keys(found)[0]}`)?.focus()
      return false
    }
    return true
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (sending || !isValid()) return
    setSending(true)
    setSendError(null)
    const result = await submitForm(
      '/api/contact',
      { ...fields, interests },
      { startedAt: startedAt.current ?? Date.now(), honeypot },
    )
    setSending(false)
    if (result.ok) setSentVia('form')
    else setSendError(result.error)
  }

  const sendWhatsapp = () => {
    if (!isValid()) return
    openWhatsapp(composeMessage(fields, interests))
    setSentVia('whatsapp')
  }

  const reset = () => {
    setFields(emptyFields)
    setInterests([])
    setSubmitted(false)
    setSentVia(null)
    setSendError(null)
    startedAt.current = null
  }

  const describedBy = (key: keyof Fields) => (errors[key] ? `${uid}-${key}-error` : undefined)

  return (
    <AnimatePresence mode="wait" initial={false}>
      {sentVia ? (
        <motion.div
          key="done"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.7, ease }}
          className="flex min-h-[28rem] flex-col justify-center border border-avala-paper/15 p-8 sm:p-12"
          role="status"
        >
          <span className="flex size-14 items-center justify-center bg-avala-neon text-avala-ink">
            <Check className="size-6" strokeWidth={2} />
          </span>
          <h2 className="display-tight mt-8 text-[clamp(2rem,4vw,3.2rem)] leading-none text-avala-paper">
            ¡Gracias, {fields.name.trim().split(' ')[0]}!
          </h2>
          <p className="mt-4 max-w-md text-base leading-7 text-avala-paper/70">
            {sentVia === 'whatsapp'
              ? 'Abrimos WhatsApp con tu mensaje listo. Solo tenés que presionar enviar y te respondemos en menos de 24 h hábiles.'
              : `Recibimos tu mensaje. Te respondemos a ${fields.email.trim()} en menos de 24 h hábiles.`}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            {sentVia === 'whatsapp' && (
              <button
                type="button"
                onClick={() => openWhatsapp(composeMessage(fields, interests))}
                data-cursor="Reintentar"
                className="h-12 border border-avala-paper/25 px-5 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-avala-paper transition-colors duration-300 hover:border-avala-paper"
              >
                ¿No se abrió? Reintentar
              </button>
            )}
            <button
              type="button"
              onClick={reset}
              data-cursor="Nuevo"
              className="h-12 px-5 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-avala-mute transition-colors duration-300 hover:text-avala-paper"
            >
              Enviar otro mensaje
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          noValidate
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.7, ease }}
          className="relative grid gap-x-10 gap-y-12 sm:grid-cols-2"
        >
          <Honeypot value={honeypot} onChange={setHoneypot} />
          <Field id={`${uid}-name`} index="01" label="Nombre" error={errors.name}>
            <input
              id={`${uid}-name`}
              name="name"
              autoComplete="name"
              placeholder="Tu nombre"
              value={fields.name}
              onChange={update('name')}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={describedBy('name')}
              className={inputClass}
            />
          </Field>
          <Field id={`${uid}-company`} index="02" label="Empresa" optional>
            <input
              id={`${uid}-company`}
              name="company"
              autoComplete="organization"
              placeholder="Nombre de la empresa"
              value={fields.company}
              onChange={update('company')}
              className={inputClass}
            />
          </Field>
          <Field id={`${uid}-email`} index="03" label="Email" error={errors.email}>
            <input
              id={`${uid}-email`}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="vos@empresa.com"
              value={fields.email}
              onChange={update('email')}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={describedBy('email')}
              className={inputClass}
            />
          </Field>
          <Field id={`${uid}-phone`} index="04" label="Teléfono" optional error={errors.phone}>
            <input
              id={`${uid}-phone`}
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+57 300 000 0000"
              value={fields.phone}
              onChange={update('phone')}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={describedBy('phone')}
              className={inputClass}
            />
          </Field>

          <fieldset className="sm:col-span-2">
            <legend className="hud-label flex items-baseline gap-3">
              <span className="tabular text-avala-neon">05</span>
              <span className="text-avala-paper/80">¿Qué te interesa?</span>
              <span className="text-avala-mute/70">(podés elegir varias)</span>
            </legend>
            <div className="mt-5 flex flex-wrap gap-2">
              {services.map((service) => {
                const active = interests.includes(service.title)
                return (
                  <button
                    key={service.title}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleInterest(service.title)}
                    data-cursor={active ? 'Quitar' : 'Elegir'}
                    className={cn(
                      'h-10 border px-4 font-mono text-[0.7rem] uppercase tracking-[0.1em] transition-all duration-300',
                      active
                        ? 'border-avala-neon bg-avala-neon text-avala-ink'
                        : 'border-avala-paper/20 text-avala-paper/70 hover:border-avala-neon hover:text-avala-paper',
                    )}
                  >
                    {service.title}
                  </button>
                )
              })}
            </div>
          </fieldset>

          <div className="sm:col-span-2">
            <Field id={`${uid}-message`} index="06" label="Tu proyecto" error={errors.message}>
              <textarea
                id={`${uid}-message`}
                name="message"
                rows={4}
                placeholder="Contanos qué necesitás, plazos y cualquier detalle útil."
                value={fields.message}
                onChange={update('message')}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={describedBy('message')}
                className={cn(inputClass, 'resize-none text-[clamp(1.1rem,1.8vw,1.4rem)] leading-snug')}
              />
            </Field>
          </div>

          <div className="flex flex-col gap-4 pt-2 sm:col-span-2 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={sending}
              data-cursor="Enviar"
              className="group inline-flex h-14 items-center justify-between gap-8 bg-avala-neon px-6 font-mono text-[0.75rem] font-medium uppercase tracking-[0.14em] text-avala-ink transition-colors duration-300 hover:bg-avala-paper disabled:cursor-wait disabled:opacity-70 sm:min-w-72"
            >
              {sending ? 'Enviando…' : 'Enviar mensaje'}
              {sending ? (
                <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" strokeWidth={1.5} />
              ) : (
                <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" strokeWidth={1.5} />
              )}
            </button>
            {whatsappLink && (
              <button
                type="button"
                onClick={sendWhatsapp}
                disabled={sending}
                data-cursor="WhatsApp"
                className="inline-flex h-14 items-center justify-center gap-3 border border-avala-paper/25 px-6 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-avala-paper transition-colors duration-300 hover:border-avala-paper disabled:opacity-50"
              >
                <MessageCircle className="size-4" strokeWidth={1.5} />
                Prefiero WhatsApp
              </button>
            )}
          </div>
          <p className="-mt-6 text-xs leading-5 text-avala-paper/50 sm:col-span-2">
            Al enviar autorizás el tratamiento de tus datos para responder tu solicitud, según nuestra{' '}
            <Link to="/privacidad" className="underline underline-offset-4 hover:text-avala-paper">
              política de privacidad
            </Link>
            .
          </p>
          {sendError && (
            <p role="alert" className="-mt-6 font-mono text-[0.72rem] leading-5 tracking-[0.04em] text-[#ff8aa3] sm:col-span-2">
              {sendError} Podés escribirnos a{' '}
              <a href={`mailto:${companyInfo.email}`} className="underline underline-offset-4">
                {companyInfo.email}
              </a>
              {whatsappLink && ' o usar WhatsApp'}.
            </p>
          )}
        </motion.form>
      )}
    </AnimatePresence>
  )
}
