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
    assert.match(card, /size-6 text-avala-neon/)
    assert.ok(card.includes(`<span aria-hidden="true" class="hud-label tabular">0${index + 1}</span>`))
    icons.push(card.match(/lucide-([a-z0-9-]+)\s/)[1])
    assert.match(card, /\[@media\(any-hover:hover\)\]:hover:border-avala-neon\/45/)
    assert.match(card, /\[@media\(any-hover:hover\)\]:hover:bg-avala-neon\/10/)
    assert.match(card, /motion-safe:\[@media\(any-hover:hover\)\]:hover:-translate-y-1/)
    const cardClasses = card.match(/<div class="([^"]*)"/)[1].split(/\s+/)
    const transitionClass = cardClasses.find(value => value.startsWith('motion-safe:transition-['))
    assert.ok(transitionClass, 'Card has a motion-safe explicit transition list')
    const transitionProperties = transitionClass.match(/\[([^\]]+)\]/)[1].split(',')
    assert.deepEqual(transitionProperties, ['transform', 'translate', 'background-color', 'border-color'])
    assert.ok(cardClasses.includes('motion-safe:duration-300'))
    assert.match(card, /motion-reduce:transform-none motion-reduce:transition-none/)
    assert.doesNotMatch(card, /<a\b|<button\b|tabindex=|role="button"|cursor-pointer|onclick=|line-clamp|truncate|(?:^|\s)hidden(?:\s|$)|opacity-0|(?:^|\s)h-\d/)
  })
  assert.equal(new Set(icons).size, 6)
})
