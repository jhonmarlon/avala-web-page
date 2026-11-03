// API de formularios de la landing: valida, filtra spam y reenvía por correo.
//   POST /api/contact → CONTACT_TO (info@avalagroup.net)
//   POST /api/lead    → LEAD_TO    (ventas@avalagroup.net)
//   GET  /api/health
// Detrás del nginx del contenedor web, que ya aplica rate limit por IP (ver docker/nginx.conf).
import { createServer } from 'node:http'
import nodemailer from 'nodemailer'

const env = (name, fallback = '') => process.env[name]?.trim() || fallback

const config = {
  port: Number(env('PORT', '3000')),
  smtpHost: env('SMTP_HOST', 'smtp.gmail.com'),
  smtpPort: Number(env('SMTP_PORT', '465')),
  smtpUser: env('SMTP_USER'),
  smtpPass: env('SMTP_PASS'),
  from: env('MAIL_FROM', 'Web Avala Group <gerencia@avalagroup.net>'),
  contactTo: env('CONTACT_TO', 'info@avalagroup.net'),
  leadTo: env('LEAD_TO', 'ventas@avalagroup.net'),
  // Gmail no entrega a la bandeja la copia del grupo cuando el remitente es miembro (queda solo en Enviados):
  // la copia oculta directa a la cuenta remitente hace que aparezca en Recibidos. MAIL_BCC=none la desactiva.
  bcc: env('MAIL_BCC', env('SMTP_USER')),
}

const mailEnabled = Boolean(config.smtpUser && config.smtpPass)
const transport = mailEnabled
  ? nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.smtpPort === 465,
      auth: { user: config.smtpUser, pass: config.smtpPass },
    })
  : null

if (!mailEnabled) console.warn('[api] SMTP_USER/SMTP_PASS no configurados: los formularios responderán 503.')

// ---------- Anti-spam ----------

const MAX_BODY_BYTES = 16 * 1024
const MIN_FILL_MS = 3000 // un humano no completa el formulario en menos de 3 s
const RATE_WINDOW_MS = 60 * 60 * 1000
const RATE_MAX_PER_IP = 5 // envíos aceptados por IP por hora
const RATE_MAX_GLOBAL = 120 // tope total por hora, por si llega una botnet

const hits = new Map()
let globalHits = []

function allow(ip) {
  const now = Date.now()
  globalHits = globalHits.filter((t) => now - t < RATE_WINDOW_MS)
  const mine = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS)
  if (mine.length >= RATE_MAX_PER_IP || globalHits.length >= RATE_MAX_GLOBAL) return false
  mine.push(now)
  globalHits.push(now)
  hits.set(ip, mine)
  return true
}

setInterval(() => {
  const now = Date.now()
  for (const [ip, list] of hits) if (list.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(ip)
}, RATE_WINDOW_MS).unref()

// Bots: honeypot lleno o envío instantáneo. Se les responde "ok" para no darles pistas.
const looksLikeBot = (body) => Boolean(body.website) || !(Number(body.elapsedMs) >= MIN_FILL_MS)

// ---------- Validación ----------

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const URL_PATTERN = /https?:\/\/|www\./gi

const text = (value, max) => (typeof value === 'string' ? value.trim().slice(0, max) : '')
const oneLine = (value, max) => text(value, max).replace(/[\r\n]+/g, ' ')

function validateContact(body) {
  const data = {
    name: oneLine(body.name, 120),
    email: oneLine(body.email, 160),
    company: oneLine(body.company, 160),
    phone: oneLine(body.phone, 40),
    interests: Array.isArray(body.interests) ? body.interests.slice(0, 12).map((i) => oneLine(i, 80)).filter(Boolean) : [],
    message: text(body.message, 4000),
  }
  if (data.name.length < 2) return { error: 'Nombre inválido.' }
  if (!EMAIL_PATTERN.test(data.email)) return { error: 'Email inválido.' }
  if (data.message.length < 10) return { error: 'Mensaje demasiado corto.' }
  // Spam típico: mensajes llenos de enlaces
  if ((data.message.match(URL_PATTERN) ?? []).length > 3) return { error: 'El mensaje tiene demasiados enlaces.' }
  return { data }
}

function validateLead(body) {
  const data = {
    name: oneLine(body.fullName, 120),
    email: oneLine(body.email, 160),
    company: oneLine(body.company, 160),
    phone: oneLine(body.phone, 40),
    details: Array.isArray(body.details)
      ? body.details
          .slice(0, 30)
          .filter((row) => Array.isArray(row) && row.length === 2)
          .map(([label, value]) => [oneLine(label, 80), text(value, 1500)])
          .filter(([label, value]) => label && value)
      : [],
  }
  if (data.name.length < 3) return { error: 'Nombre inválido.' }
  if (!EMAIL_PATTERN.test(data.email)) return { error: 'Email inválido.' }
  return { data }
}

// ---------- Correos (solo texto plano: nada del visitante se interpreta como HTML) ----------

const optional = (label, value) => (value ? [`${label}: ${value}`] : [])

function contactMail(d) {
  return {
    to: config.contactTo,
    subject: `Contacto web · ${d.name}${d.company ? ` (${d.company})` : ''}`,
    text: [
      'Nuevo mensaje desde el formulario de contacto de avalagroup.net',
      '',
      `Nombre: ${d.name}`,
      ...optional('Empresa', d.company),
      `Email: ${d.email}`,
      ...optional('Teléfono', d.phone),
      ...optional('Interés', d.interests.join(', ')),
      '',
      'Mensaje:',
      d.message,
    ].join('\n'),
  }
}

function leadMail(d) {
  return {
    to: config.leadTo,
    subject: `Cotización web · ${d.name}${d.company ? ` (${d.company})` : ''}`,
    text: [
      'Nueva solicitud de propuesta desde el cotizador de avalagroup.net',
      '',
      `Nombre: ${d.name}`,
      ...optional('Empresa', d.company),
      `Email: ${d.email}`,
      ...optional('Teléfono', d.phone),
      '',
      'Estimación:',
      ...d.details.map(([label, value]) => `- ${label}: ${value}`),
    ].join('\n'),
  }
}

const routes = {
  '/api/contact': { validate: validateContact, mail: contactMail },
  '/api/lead': { validate: validateLead, mail: leadMail },
}

// ---------- HTTP ----------

function send(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
  res.end(JSON.stringify(payload))
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks = []
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > MAX_BODY_BYTES) {
        // Dejar de acumular pero seguir drenando, para poder responder 413
        req.removeAllListeners('data')
        req.resume()
        reject(new Error('too-large'))
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')))
      } catch {
        reject(new Error('bad-json'))
      }
    })
    req.on('error', reject)
  })
}

const server = createServer(async (req, res) => {
  const path = req.url?.split('?')[0]

  if (req.method === 'GET' && path === '/api/health') return send(res, 200, { ok: true, mail: mailEnabled })

  const route = routes[path]
  if (!route) return send(res, 404, { ok: false, error: 'No encontrado.' })
  if (req.method !== 'POST') return send(res, 405, { ok: false, error: 'Método no permitido.' })
  if (!req.headers['content-type']?.includes('application/json')) return send(res, 415, { ok: false, error: 'Se esperaba JSON.' })

  let body
  try {
    body = await readJson(req)
  } catch (error) {
    return send(res, error.message === 'too-large' ? 413 : 400, { ok: false, error: 'Solicitud inválida.' })
  }
  if (!body || typeof body !== 'object') return send(res, 400, { ok: false, error: 'Solicitud inválida.' })

  const ip = req.headers['x-real-ip'] || req.socket.remoteAddress || 'unknown'

  if (looksLikeBot(body)) {
    console.info(`[api] ${path} descartado por anti-spam (ip ${ip})`)
    return send(res, 200, { ok: true })
  }

  const { data, error } = route.validate(body)
  if (error) return send(res, 422, { ok: false, error })

  if (!allow(ip)) return send(res, 429, { ok: false, error: 'Demasiados envíos. Intentá de nuevo más tarde.' })
  if (!transport) return send(res, 503, { ok: false, error: 'El envío no está disponible en este momento.' })

  try {
    const bcc = config.bcc && config.bcc !== 'none' ? config.bcc : undefined
    await transport.sendMail({ from: config.from, bcc, replyTo: `"${data.name.replace(/"/g, '')}" <${data.email}>`, ...route.mail(data) })
    console.info(`[api] ${path} enviado (ip ${ip})`)
    return send(res, 200, { ok: true })
  } catch (err) {
    console.error(`[api] ${path} error SMTP:`, err.message)
    return send(res, 502, { ok: false, error: 'No pudimos enviar el mensaje.' })
  }
})

server.listen(config.port, () => console.info(`[api] escuchando en :${config.port} · correo ${mailEnabled ? 'activo' : 'INACTIVO'}`))
