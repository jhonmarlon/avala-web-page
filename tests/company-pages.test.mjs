import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router'

registerHooks({
  load(url, context, nextLoad) {
    if (url.endsWith('.png')) return { format: 'module', source: 'export default "fixture.png"', shortCircuit: true }
    return nextLoad(url, context)
  },
})
const { AboutPage } = await import('../src/pages/AboutPage.tsx')
const { SuccessCasesPage } = await import('../src/pages/SuccessCasesPage.tsx')
const { ServicesPage } = await import('../src/pages/ServicesPage.tsx')
const { aboutSectionContent, processSteps, successCases } = await import('../src/features/home/data/content.ts')
const { services } = await import('../src/config/services.ts')
const render = (Page) => renderToStaticMarkup(createElement(MemoryRouter, null, createElement(Page)))

for (const [name, Page] of [['Nosotros', AboutPage], ['Casos de éxito', SuccessCasesPage], ['Soluciones', ServicesPage]]) {
  test(`${name} uses the current dark editorial style with one page heading and a contact action`, () => {
    const html = render(Page)
    assert.match(html, /bg-avala-ink text-avala-paper/)
    assert.match(html, /display-tight[^\"]*text-title-page/)
    assert.match(html, /text-avala-neon/)
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1)
    assert.match(html, /href="\/contacto"/)
    assert.doesNotMatch(html, /Página preparada|Estructura preparada|Ruta lista|panel-light-elevated/)
  })
}

test('company page headings use the same masked character reveal as Contact without changing their copy', () => {
  for (const [Page, lines] of [
    [AboutPage, ['Visión técnica.', 'Criterio de negocio.']],
    [SuccessCasesPage, ['Tecnología aplicada.', 'Impacto real.']],
    [ServicesPage, ['Tu próximo paso.', 'Nuestra tecnología.']],
  ]) {
    const heading = render(Page).match(/<h1\b[^>]*>[\s\S]*?<\/h1>/)[0]
    assert.deepEqual([...heading.matchAll(/aria-label="([^"]*)"/g)].map((match) => match[1]), lines)
    assert.equal((heading.match(/role="text"/g) ?? []).length, 2)
    assert.match(heading, /overflow-y-clip/)
    assert.match(heading, /translateY\(140%\)/)
    assert.match(heading, /class="inline-block text-avala-neon"/)
    assert.match(heading, /<br\s*\/>/)
  }
})

test('Nosotros presents existing company positioning and the complete working method', () => {
  const html = render(AboutPage)
  assert.ok(html.includes(aboutSectionContent.description))
  for (const text of aboutSectionContent.highlights) assert.ok(html.includes(text), text)
  for (const step of processSteps) {
    assert.ok(html.includes(step.title), step.title)
    assert.ok(html.includes(step.description), step.description)
  }
  assert.match(html, /href="\/casos-de-exito"/)
})

test('Casos de éxito preserves every published project, image and outcome without fake detail links', () => {
  const html = render(SuccessCasesPage)
  assert.equal((html.match(/<article\b/g) ?? []).length, successCases.length)
  for (const item of successCases) {
    for (const value of [item.title, item.description, item.metric, item.metricLabel]) assert.ok(html.includes(value), value)
    assert.ok(html.includes(`alt="${item.title}"`))
  }
  assert.equal((html.match(/loading="lazy"/g) ?? []).length, successCases.length)
  assert.doesNotMatch(html, /href="#"|Ver caso/)
})

test('Soluciones exposes the complete existing catalog and retains the project estimator', () => {
  const html = render(ServicesPage)
  for (const service of services) {
    assert.ok(html.includes(service.title), service.title)
    assert.ok(html.includes(service.description), service.description)
  }
  assert.match(html, /href="\/estimar-proyecto"/)
  assert.ok(html.includes('Estimar mi proyecto'))
  assert.ok(html.includes('Configurá tu proyecto y obtené una estimación preliminar de complejidad, tiempo e inversión.'))
})
