import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router'

registerHooks({
  load(url, context, nextLoad) {
    if (url.endsWith('.png')) return { format: 'module', source: `export default ${JSON.stringify(url)}`, shortCircuit: true }
    const result = nextLoad(url, context)
    return url.endsWith('/config/site.ts')
      ? { ...result, source: result.source.replaceAll('import.meta.env', '({})') }
      : result
  },
})
const { SuccessCasesSection } = await import('../src/features/home/sections/SuccessCasesSection.tsx')
const render = () => renderToStaticMarkup(createElement(MemoryRouter, null, createElement(SuccessCasesSection)))
const cases = [
  ['commercial_automation.png', 'Automatización comercial', '+65%', 'Tiempo operativo optimizado'],
  ['company_platform.png', 'Plataforma empresarial', '+80%', 'Eficiencia operativa'],
  ['technological_integration.png', 'Integración tecnológica', '100%', 'Sistemas conectados'],
]

test('all Home case images fade at a static transparent viewport with captions outside the mask', () => {
  const figures = [...render().matchAll(/<figure\b([^>]*)>([\s\S]*?)<\/figure>/g)]
  assert.equal(figures.length, cases.length)
  for (const [index, [, frame, content]] of figures.entries()) {
    assert.match(frame, /relative aspect-\[16\/10\] overflow-hidden/)
    assert.doesNotMatch(frame, /\bbg-|image-edge-fade/)
    // Only the moving image belongs inside the stationary mask, never its label.
    const viewport = content.match(/^<div class="absolute inset-0 image-edge-fade">(<img\b[^>]*\/>)<\/div>/)
    assert.ok(viewport, `Missing static masked viewport for case ${index + 1}`)
    assert.doesNotMatch(viewport[0].split('>')[0], /style=/)
    assert.doesNotMatch(viewport[0], /figcaption/)
    assert.match(content.slice(viewport[0].length), new RegExp(`^<figcaption class="hud-label absolute left-4 top-4 bg-avala-ink px-2 py-1 text-avala-paper">Caso 0${index + 1}</figcaption>$`))
  }
})

test('Home cases retain image geometry, entrance, alternating layout, metrics and destinations', () => {
  const html = render()
  const rows = [...html.matchAll(/<article\b[^>]*>([\s\S]*?)<\/article>/g)]
  assert.equal(rows.length, cases.length)
  for (const [index, [, row]] of rows.entries()) {
    const [file, title, metric, label] = cases[index]
    const img = row.match(/<img\b[^>]*>/)[0]
    assert.ok(img.includes(file))
    assert.ok(img.includes(`alt="${title}" loading="lazy"`))
    for (const token of ['absolute', 'inset-x-0', '-top-[12%]', 'h-[124%]', 'w-full', 'object-cover',
      'grayscale-[35%]', 'transition-[filter]', 'duration-700', 'hover:grayscale-0']) assert.ok(img.includes(token))
    assert.doesNotMatch(img, /image-edge-fade/)
    assert.match(row, /<figure[^>]*style="opacity:0;transform:translateY\(16px\)"/)
    assert.match(row, /<p class="display-tight tabular [^"]*text-avala-neon"[^>]*style="opacity:0;transform:translateY\(24px\)"/)
    assert.ok(row.includes(`>${metric}</p>`))
    assert.ok(row.includes(`<p class="hud-label">${label}</p>`))
    assert.ok(row.includes(`>${title}</h3>`))
    assert.equal(row.includes('lg:order-2 lg:col-start-6'), index % 2 === 1)
  }
  assert.match(html, /href="\/casos-de-exito"/)
  assert.match(html, /Ver todos los casos/)
  assert.match(html, /id="home-cases"/)
})
