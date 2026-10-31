import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

// Supply only Vite's unavailable environment object; render real components.
registerHooks({
  load(url, context, nextLoad) {
    const result = nextLoad(url, context)
    return url.endsWith('/config/site.ts')
      ? { ...result, source: result.source.replaceAll('import.meta.env', '({})') }
      : result
  },
})
const { ProposalDetailsModal } = await import('../src/features/estimator/components/ProposalDetailsModal.tsx')
const noop = () => {}
const error = 'Ingresa un correo electrónico válido.'
const props = {
  lead: { fullName: 'Ana González', company: '', email: 'correo-invalido', phone: '' },
  phoneCountry: 'CO', phoneDigits: '', onPhoneCountryChange: noop,
  leadErrors: { fullName: '', company: '', email: error, phone: '' },
  leadTouched: true, isLeadValid: false, isLeadSubmitted: false, isLeadSubmitting: false,
  submitError: null, honeypot: '', onHoneypotChange: noop, onClose: noop,
  onLeadChange: noop, onLeadBlur: noop, onSubmit: noop,
}
const render = (overrides = {}) => renderToStaticMarkup(createElement(ProposalDetailsModal, { ...props, ...overrides }))
const emailInput = (html) => html.match(/<input\b[^>]*autoComplete="email"[^>]*>/)?.[0] ?? ''

test('email uses text validation with email keyboard, autocomplete and no native constraints', () => {
  const html = render()
  const input = emailInput(html)
  assert.match(input, /type="text"/)
  assert.match(input, /inputMode="email"/)
  assert.match(input, /value="correo-invalido"/)
  assert.doesNotMatch(input, /\b(?:required|pattern)=/)
  assert.doesNotMatch(html, /<form\b/)
})

test('custom email error preserves red presentation, ARIA and submission gating', () => {
  const html = render()
  assert.match(emailInput(html), /aria-invalid="true"/)
  assert.match(emailInput(html), /aria-describedby="proposal-email-error"/)
  assert.match(emailInput(html), /border-red-300/)
  assert.match(html, /<p id="proposal-email-error" class="text-sm leading-5 text-red-300">Ingresa un correo electrónico válido\.<\/p>/)
  assert.match(html, /<button[^>]*disabled=""[^>]*>Quiero una propuesta personalizada<\/button>/)
})

test('untouched draft hides errors; valid email preserves draft and enables submission', () => {
  const untouched = render({ leadTouched: false })
  assert.doesNotMatch(untouched, /id="proposal-email-error"/)
  assert.match(emailInput(untouched), /aria-invalid="false"/)
  const valid = render({ lead: { ...props.lead, email: 'ana@example.com' }, leadErrors: { ...props.leadErrors, email: '' }, isLeadValid: true })
  assert.match(emailInput(valid), /value="ana@example.com"/)
  assert.doesNotMatch(emailInput(valid), /aria-describedby=/)
  assert.match(valid, /<button(?![^>]*disabled=)[^>]*>Quiero una propuesta personalizada<\/button>/)
  assert.match(valid, /autoComplete="name"/)
  assert.match(valid, /autoComplete="organization"/)
})
