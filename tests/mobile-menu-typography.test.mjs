import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router'

// SSR cannot render portals; only this component receives an identity portal.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'react-dom' && context.parentURL?.endsWith('/layout/MobileMenu.tsx')) {
      return { url: 'data:text/javascript,export const createPortal = (children) => children', shortCircuit: true }
    }
    return nextResolve(specifier, context)
  },
  load(url, context, nextLoad) {
    const result = nextLoad(url, context)
    return url.endsWith('/config/site.ts')
      ? { ...result, source: result.source.replaceAll('import.meta.env', '({})') }
      : result
  },
})
const { MobileMenu } = await import('../src/components/layout/MobileMenu.tsx')
function render(open = true) {
  const previous = globalThis.document
  globalThis.document = { body: {} }
  try {
    return renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: ['/nosotros'] },
      createElement(MobileMenu, { open, onClose() { assert.fail('render closed menu') } })))
  } finally {
    if (previous === undefined) delete globalThis.document
    else globalThis.document = previous
  }
}

test('all five mobile main labels share the compact display role and existing leading', () => {
  const html = render()
  for (const label of ['Inicio', 'Nosotros', 'Soluciones', 'Casos de éxito', 'Contacto']) {
    const span = html.match(new RegExp(`<span class="([^"]*)">${label}</span>`))
    assert.ok(span, `Missing ${label}`)
    for (const token of ['display-tight', 'flex-1', 'text-nav-mobile-item', 'leading-none']) {
      assert.ok(span[1].split(' ').includes(token), `${label} missing ${token}`)
    }
  }
  assert.doesNotMatch(html, /text-\[2\.4rem\]/)
})

test('mobile menu retains routes, numbering, active state, controls and padded targets', () => {
  const html = render()
  assert.match(html, /<dialog[^>]*id="mobile-navigation"[^>]*aria-label="Menú principal"/)
  assert.match(html, /<button[^>]*aria-label="Cerrar menú"[^>]*class="[^"]*h-11 w-11/)
  assert.match(html, /<button[^>]*aria-expanded="false"[^>]*class="flex w-full items-start py-4 text-left"/)
  for (const href of ['/', '/nosotros', '/casos-de-exito', '/contacto']) {
    assert.ok(html.includes(`href="${href}"`))
  }
  assert.equal((html.match(/class="group flex items-start py-4(?: active)?"/g) ?? []).length, 4)
  for (const number of ['01', '02', '03', '04', '05']) assert.ok(html.includes(`>${number}</span>`))
  assert.match(html, /aria-current="page"/)
  assert.match(html, /text-avala-neon">Nosotros<\/span>/)
  assert.match(html, /Agendá una reunión/)
  assert.doesNotMatch(html, /Catálogo de soluciones|Estimar proyecto/)
  assert.doesNotMatch(render(false), />Inicio<|>Soluciones</)
})
