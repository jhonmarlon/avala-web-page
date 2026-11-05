import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { registerHooks } from 'node:module'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router'

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'react-dom' && context.parentURL?.endsWith('/layout/MobileMenu.tsx')) {
      return { url: 'data:text/javascript,export const createPortal = children => children', shortCircuit: true }
    }
    return nextResolve(specifier, context)
  },
  load(url, context, nextLoad) {
    if (url.endsWith('.png')) return { format: 'module', source: 'export default "fixture.png"', shortCircuit: true }
    const result = nextLoad(url, context)
    return url.endsWith('/config/site.ts') ? { ...result, source: result.source.replaceAll('import.meta.env', '({})') } : result
  },
})
const { ServicesSection } = await import('../src/features/home/sections/ServicesSection.tsx')
const { ManifestoSection } = await import('../src/features/home/sections/ManifestoSection.tsx')
const { AboutPage } = await import('../src/pages/AboutPage.tsx')
const { ServicesPage } = await import('../src/pages/ServicesPage.tsx')
const { EsimPage } = await import('../src/pages/EsimPage.tsx')
const { ContactPage } = await import('../src/pages/ContactPage.tsx')
const { ContactChannelList } = await import('../src/features/contact/components/ContactChannelList.tsx')
const { LegalDocumentView } = await import('../src/features/legal/components/LegalDocumentView.tsx')
const { MobileMenu } = await import('../src/components/layout/MobileMenu.tsx')
const render = (Component, props) => renderToStaticMarkup(createElement(MemoryRouter, null, createElement(Component, props)))
const ordinals = html => [...html.matchAll(/<span class="([^"]*ordinal-index[^"]*)">(\d{2})<\/span>/g)].map(match => match[2])
const expected = count => Array.from({ length: count }, (_, i) => String(i + 1).padStart(2, '0'))

test('plain row indices use one cyan ordinal treatment without changing values or large numerals', () => {
  for (const [Component, count] of [[ServicesSection, 10], [ServicesPage, 10], [EsimPage, 2]]) {
    assert.deepEqual(ordinals(render(Component)), expected(count))
  }
  for (const Component of [AboutPage, ManifestoSection, ContactPage, ContactChannelList]) {
    const html = render(Component)
    const numbers = ordinals(html)
    assert.ok(numbers.length > 0, Component.name)
    for (const number of numbers) assert.match(number, /^\d{2}$/)
  }
  const about = render(AboutPage)
  assert.equal((about.match(/about-method-index/g) ?? []).length, 5)
  assert.doesNotMatch(about, /about-method-index[^\"]*ordinal-index/)
  const esim = render(EsimPage)
  assert.equal((esim.match(/esim-capability-index/g) ?? []).length, 6)
  assert.doesNotMatch(esim, /esim-capability-index[^\"]*ordinal-index/)
  assert.match(render(ServicesSection), /ordinal-index[^\"]*group-hover:text-avala-ink/)
  assert.match(render(ContactChannelList), /ordinal-index[^\"]*group-active:text-avala-ink/)
})

test('menu and legal ordinals keep native routes, headings and controls', () => {
  const previous = globalThis.document
  globalThis.document = { body: {} }
  let menu
  try { menu = render(MobileMenu, { open: true, onClose() {} }) }
  finally { if (previous === undefined) delete globalThis.document; else globalThis.document = previous }
  assert.deepEqual(ordinals(menu), expected(5))
  assert.match(menu, /aria-label="Menú principal"/)
  assert.match(menu, /aria-label="Cerrar menú"/)
  for (const href of ['/', '/nosotros', '/contacto']) assert.ok(menu.includes(`href="${href}"`))
  const document = { label: 'Legal', title: 'Test document', updated: '2026', intro: 'Introduction', sections: [
    { title: 'First section', paragraphs: ['First paragraph'] },
    { title: 'Second section', paragraphs: ['Second paragraph'] },
  ] }
  const legal = render(LegalDocumentView, { document, related: { to: '/privacidad', label: 'Privacy' } })
  assert.deepEqual(ordinals(legal), ['01', '02', '01', '02'])
  for (const text of ['First section', 'First paragraph', 'Second paragraph']) assert.ok(legal.includes(text))
  assert.match(legal, /href="#seccion-1"/)
  assert.match(legal, /id="seccion-2"/)
})

test('ordinal type and glow are utility-layer scoped, leaving contextual hover colors available', () => {
  const css = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8')
  const rule = css.match(/@layer utilities\s*\{\s*\.ordinal-index\s*\{([^}]+)\}/)?.[1]
  assert.ok(rule)
  assert.match(rule, /font-size: 1\.25rem;/)
  assert.match(rule, /color: var\(--color-avala-cyan\);/)
  assert.match(rule, /text-shadow: 0 0 8px/)
  assert.doesNotMatch(rule, /animation|transform|position|!important/)
})
