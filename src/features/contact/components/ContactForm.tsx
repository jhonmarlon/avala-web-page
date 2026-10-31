import { ArrowUpRight, Check, LoaderCircle, MessageCircle } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router'
import { Honeypot } from '@/components/ui/Honeypot'
import { formStyles } from '@/components/ui/form-styles'
import { companyInfo } from '@/config/site'
import { whatsappLink } from '@/features/contact/data/channels'
import { services } from '@/config/services'
import { PhoneField } from '@/components/ui/phone/PhoneField'
import { composePhone, DEFAULT_PHONE_COUNTRY, type PhoneCountryId } from '@/lib/phone'
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
    <div>
      <label htmlFor={id} className={cn(formStyles.label, 'flex items-baseline gap-3')}>
        <span className="tabular text-avala-neon">{index}</span>
        <span className="text-avala-paper/80">{label}</span>
        {optional && <span className="text-avala-mute/70">(opcional)</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn(formStyles.error, 'mt-2')}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

const inputClass = cn(formStyles.input, 'mt-3')

export function ContactForm() {
  const uid = useId()
  const [fields, setFields] = useState<Fields>(emptyFields)
  const [phoneCountry, setPhoneCountry] = useState<PhoneCountryId>(DEFAULT_PHONE_COUNTRY)
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

  // Keep validation on the national draft; add the prefix only at delivery boundaries.
  const deliveryFields = { ...fields, phone: composePhone(phoneCountry, fields.phone) }

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
      { ...deliveryFields, interests },
      { startedAt: startedAt.current ?? Date.now(), honeypot },
    )
    setSending(false)
    if (result.ok) setSentVia('form')
    else setSendError(result.error)
  }

  const sendWhatsapp = () => {
    if (!isValid()) return
    openWhatsapp(composeMessage(deliveryFields, interests))
    setSentVia('whatsapp')
  }

  const reset = () => {
    setFields(emptyFields)
    setPhoneCountry(DEFAULT_PHONE_COUNTRY)
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
                onClick={() => openWhatsapp(composeMessage(deliveryFields, interests))}
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
              className={cn(inputClass, errors.name && formStyles.inputError)}
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
              className={cn(inputClass, errors.email && formStyles.inputError)}
            />
          </Field>
          <PhoneField
            id={`${uid}-phone`}
            name="phone"
            className="space-y-2"
            label={
              <span className="flex items-baseline gap-3">
                <span className="tabular text-avala-neon">04</span>
                <span className="text-avala-paper/80">Teléfono</span>
                <span className="text-avala-mute/70">(opcional)</span>
              </span>
            }
            country={phoneCountry}
            nationalDigits={fields.phone}
            disabled={false}
            error={errors.phone ?? ''}
            errorRole="alert"
            onCountryChange={setPhoneCountry}
            onDigitsChange={(value) => update('phone')({ target: { value } })}
            onBlur={() => {}}
          />

          <fieldset className="sm:col-span-2">
            <legend className={cn(formStyles.label, 'flex items-baseline gap-3')}>
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
                className={cn(inputClass, 'resize-none', errors.message && formStyles.inputError)}
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
            <p role="alert" className={cn(formStyles.error, '-mt-6 sm:col-span-2')}>
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
