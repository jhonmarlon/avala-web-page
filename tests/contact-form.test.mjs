import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router'

registerHooks({
  load(url, context, nextLoad) {
    // Vite image URLs from the real service catalog are inert during SSR.
    if (url.endsWith('.png')) return { format: 'module', source: `export default ${JSON.stringify(url)}`, shortCircuit: true }
    const result = nextLoad(url, context)
    return url.endsWith('/config/site.ts')
      ? { ...result, source: result.source.replaceAll('import.meta.env', '({})') }
      : result
  },
})
const { ContactForm } = await import('../src/features/contact/components/ContactForm.tsx')
const render = () => renderToStaticMarkup(createElement(MemoryRouter, null, createElement(ContactForm)))
const controls = (html) => [...html.matchAll(/<(?:input|textarea)\b[^>]*name="(name|company|email|phone|message)"[^>]*>/g)]

// Assert the public markup, not the shared implementation or private Field helper.
test('Contact uses boxed ink body controls with neon focus and protected autofill', () => {
  const fields = controls(render())
  assert.equal(fields.length, 5)
  for (const [tag] of fields) {
    for (const token of [
      'rounded-none', 'border', 'border-avala-paper/25', 'bg-avala-ink',
      'px-4', 'py-3', 'text-base', 'text-avala-paper',
      'focus:border-avala-neon', 'focus-visible:ring-2', 'focus-visible:ring-avala-neon/60',
      'not-forced-colors:autofill:bg-avala-ink', 'not-forced-colors:autofill:text-avala-paper',
      'not-forced-colors:autofill:caret-avala-paper',
      'not-forced-colors:autofill:border',
      'not-forced-colors:autofill:not-focus:border-avala-paper/25',
      'not-forced-colors:autofill:focus:border-avala-neon',
      'not-forced-colors:autofill:[-webkit-text-fill-color:var(--color-avala-paper)]',
      'not-forced-colors:autofill:inset-shadow-[0_0_0_1000px_var(--color-avala-ink)]',
    ]) assert.ok(tag.includes(token), `Missing ${token} on ${tag}`)
    assert.doesNotMatch(tag, /bg-transparent|display-tight|text-\[clamp/)
  }
})

test('Contact preserves native semantics, labels, optional fields and interest controls', () => {
  const html = render()
  assert.match(html, /<form\b[^>]*noValidate=""/)
  const fields = controls(html)
  assert.equal(fields.length, 5)
  const byName = Object.fromEntries(fields.map(([tag, name]) => [name, tag]))
  for (const [name, autocomplete] of Object.entries({ name: 'name', company: 'organization', email: 'email', phone: 'tel-national' })) {
    assert.ok(byName[name].includes(`autoComplete="${autocomplete}"`))
  }
  for (const [tag] of fields) {
    const id = tag.match(/\bid="([^"]+)"/)[1]
    assert.ok(html.includes(`<label for="${id}"`))
    assert.doesNotMatch(tag, /\brequired=|aria-describedby=/)
  }
  assert.match(byName.email, /type="email"[^>]*inputMode="email"/)
  assert.match(byName.phone, /type="tel"[^>]*inputMode="numeric"/)
  assert.match(byName.phone, /pattern="\[0-9\]\*"/)
  assert.match(byName.phone, /maxLength="36"/)
  assert.match(html, /aria-label="Código de país: Colombia \(\+57\)"/)
  assert.match(html, />CO \+57</)
  const phoneId = byName.phone.match(/\bid="([^"]+)"/)[1]
  assert.ok(html.includes(`id="${phoneId}-country"`))
  assert.ok(html.includes(`aria-controls="${phoneId}-country-list"`))
  assert.match(byName.message, /^<textarea\b[^>]*rows="4"/)
  assert.match(html, /Empresa<\/span><span[^>]*>\(opcional\)/)
  assert.match(html, /Teléfono<\/span><span[^>]*>\(opcional\)/)
  assert.doesNotMatch(html, /<select\b|role="alert"/)
  assert.match(html, /href="\/privacidad"/)
  assert.match(html, /<legend\b[^>]*>.*¿Qué te interesa\?/)
  const interests = [...html.matchAll(/<button\b[^>]*aria-pressed="false"[^>]*>/g)]
  assert.ok(interests.length > 0)
  for (const [button] of interests) assert.match(button, /type="button"/)
  assert.match(html, /<button\b[^>]*type="submit"[^>]*>Enviar mensaje/)
})
