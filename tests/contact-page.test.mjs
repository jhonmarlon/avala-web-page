import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router'

registerHooks({
  load(url, context, nextLoad) {
    if (url.endsWith('.png')) return { format: 'module', source: 'export default "fixture.png"', shortCircuit: true }
    const result = nextLoad(url, context)
    return url.endsWith('/config/site.ts')
      ? { ...result, source: result.source.replaceAll('import.meta.env', '({})') }
      : result
  },
})
const { ContactPage } = await import('../src/pages/ContactPage.tsx')
const { companyInfo } = await import('../src/config/site.ts')
const render = () => renderToStaticMarkup(createElement(MemoryRouter, null, createElement(ContactPage)))

test('Contact welcomes general inquiries and describes neutral next steps', () => {
  const html = render()
  const heading = html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/)[0]
  assert.deepEqual([...heading.matchAll(/aria-label="([^"]*)"/g)].map((match) => match[1]),
    ['Hablemos.', '¿En qué podemos ayudarte?'])
  assert.match(heading, /text-avala-neon/)
  assert.ok(html.includes('Contanos qué necesitás: conocer nuestros servicios, consultar sobre tu eSIM, trabajar con nosotros o conversar sobre una idea.'))
  const steps = html.match(/<ol\b[^>]*>[\s\S]*?<\/ol>/)[0]
  assert.deepEqual([...steps.matchAll(/<p class="display-tight[^\"]*">([^<]*)<\/p>/g)].map((match) => match[1]), [
    'Recibimos tu mensaje.', 'Lo acercamos al equipo indicado.', 'Te respondemos para ayudarte con el siguiente paso.',
  ])
  assert.doesNotMatch(steps, /descubrimiento|Propuesta|costos|30 minutos/)
  assert.ok(html.includes('¿Querés estimar un proyecto de software?'))
  assert.ok(html.includes('Obtené un rango de inversión para tu proyecto de software con el estimador.'))
  assert.match(html, /href="\/estimar-proyecto"/)
})

test('Contact retains hours, response statement, clock and direct channels', () => {
  const html = render()
  for (const text of [companyInfo.hours, companyInfo.address, companyInfo.email, 'Respuesta en menos de 24 h hábiles', 'Canales directos', 'MDE', 'UTC−5']) {
    assert.ok(html.includes(text), text)
  }
  assert.ok(html.includes(`href="mailto:${companyInfo.email}"`))
  assert.ok(html.includes(`href="tel:${companyInfo.phone.replace(/\s/g, '')}"`))
  assert.equal((html.match(/<form\b/g) ?? []).length, 1)
})
