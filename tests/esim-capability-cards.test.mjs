import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'
import { readFileSync } from 'node:fs'
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
const { EsimPage } = await import('../src/pages/EsimPage.tsx')
const sentences = [
  'Inventario interno de eSIMs con consecutivos controlados.',
  'Lotes administrativos de vouchers físicos.',
  'Impresión diferida e individual de vouchers.',
  'Confirmación operativa de impresión.',
  'Validaciones por OTP y código raspable.',
  'Trazabilidad desde voucher o compra web hasta QR final.',
]

test('operation capabilities are six readable, equally weighted semantic cards in original order', () => {
  const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(EsimPage)))
  const section = [...html.matchAll(/<section\b[^>]*>[\s\S]*?<\/section>/g)].map(([value]) => value).find(value => value.includes('Operación y trazabilidad'))
  assert.match(section, /<h2[^>]*>Una línea de negocio preparada para usuarios, tiendas y operación interna\.<\/h2>/)
  const list = section.match(/<ul\b[^>]*aria-label="Capacidades operativas"[^>]*>[\s\S]*?<\/ul>/)?.[0]
  assert.ok(list, 'capabilities use a labelled semantic list')
  assert.match(list, /grid grid-cols-1 gap-4 sm:grid-cols-2/)
  const cards = [...list.matchAll(/<li\b[^>]*>[\s\S]*?<\/li>/g)].map(([value]) => value)
  assert.equal(cards.length, 6)
  assert.deepEqual(cards.map(card => card.match(/<h3[^>]*>([^<]*)<\/h3>/)?.[1]), sentences)
  assert.equal(new Set(cards.map(card => card.match(/<div class="([^"]*)"/)[1])).size, 1)
  const icons = []
  cards.forEach((card, index) => {
    assert.match(card, /h-full min-w-0/)
    assert.match(card, /bg-avala-ink-2/)
    assert.match(card, /text-avala-paper/)
    assert.match(card, /border-avala-paper\/15/)
    assert.match(card, /rounded-lg/)
    assert.match(card, /<h3 class="text-sm font-medium leading-7/)
    assert.match(card, /<svg\b[^>]*aria-hidden="true"/)
    assert.match(card, /class="sequence-illustration"/)
    assert.ok(card.includes(`<span aria-hidden="true" class="display-tight text-outline tabular esim-capability-index">0${index + 1}</span>`))
    const scene = card.match(/data-sequence-scene="([^"]+)"/)[1]
    assert.equal(scene, ['stock', 'batches', 'print', 'confirmation', 'otp', 'trace'][index])
    icons.push(scene)
    assert.match(card, /esim-operational-card/)
    assert.doesNotMatch(card, /hover:-translate|transition-\[transform/)
    assert.equal((card.match(/class="illustration-gesture"/g) ?? []).length, 2)
    assert.match(card, /p-5[^\"]*sm:p-6/)
    const css = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8')
    const paint = css.match(/\.esim-capability \.esim-operational-card\s*\{([^}]+)\}/)[1]
    assert.match(paint, /radial-gradient\([\s\S]*linear-gradient\(/)
    assert.match(paint, /box-shadow: inset/)
    assert.match(paint, /transition: border-color 300ms ease-out, background-color 300ms ease-out, box-shadow 300ms ease-out, transform 200ms ease-out;/)
    assert.match(css, /@media \(hover: hover\)\s*\{\s*\.esim-capability:hover \.esim-operational-card\s*\{[^}]*border-color:[^}]*background-color:[^}]*box-shadow:/)
    assert.match(css, /@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.esim-capability \.esim-operational-card \{ transition: none; transform: none; \}/)
    assert.doesNotMatch(card, /<a\b|<button\b|tabindex=|role="button"|cursor-pointer|onclick=|line-clamp|truncate|(?:^|\s)hidden(?:\s|$)|opacity-0|(?:^|\s)h-\d/)
  })
  assert.equal(new Set(icons).size, 6)
})
