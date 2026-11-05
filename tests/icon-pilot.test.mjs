import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { registerHooks } from 'node:module'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router'
import { CtaLink } from '../src/components/fx/CtaLink.tsx'
import { SubtleCtaLink } from '../src/components/fx/SubtleCtaLink.tsx'

registerHooks({
  // Match the existing menu tests: SSR cannot render a browser portal.
  resolve(specifier, context, nextResolve) {
    if (specifier === 'react-dom' && context.parentURL?.endsWith('/layout/MobileMenu.tsx')) {
      return { url: 'data:text/javascript,export const createPortal = (children) => children', shortCircuit: true }
    }
    return nextResolve(specifier, context)
  },
  load(url, context, nextLoad) {
    if (url.endsWith('.png')) return { format: 'module', source: 'export default "fixture.png"', shortCircuit: true }
    const result = nextLoad(url, context)
    return url.endsWith('/config/site.ts')
      ? { ...result, source: result.source.replaceAll('import.meta.env', '({})') }
      : result
  },
})

const render = (props) => renderToStaticMarkup(createElement(MemoryRouter, null,
  createElement(CtaLink, props, 'Continuar')))

test('header CTA keeps its pilot while Home service rows remain uniform and preserve catalog links', async () => {
  const { Header } = await import('../src/components/layout/Header.tsx')
  const { ServicesSection } = await import('../src/features/home/sections/ServicesSection.tsx')
  const { services } = await import('../src/config/services.ts')
  const previousDocument = globalThis.document
  let header
  globalThis.document = { body: {} }
  try {
    header = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(Header)))
  } finally {
    if (previousDocument === undefined) delete globalThis.document
    else globalThis.document = previousDocument
  }
  const cta = header.match(/<a[^>]*data-cursor="Agendar"[^>]*>[\s\S]*?<\/a>/)[0]
  assert.match(cta, /Agendá una reunión/)
  assert.match(cta, /href="\/contacto"/)
  assert.doesNotMatch(cta, /translate-y-full|rotate-45/)
  const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(ServicesSection)))
  assert.doesNotMatch(html, /data-icon-pilot=|icon-terminal-cursor/)
  assert.equal((html.match(/href="\/soluciones"/g) ?? []).length, services.length)
  for (const service of services) {
    assert.ok(html.includes(service.title), service.title)
    assert.ok(html.includes(service.description), service.description)
  }
})

// Keep the existing treatment available next to the opt-in pilot.
test('subtle CTA keeps one readable label, native navigation and keyboard-safe directional feedback', () => {
  {
    const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(SubtleCtaLink)))
    assert.equal((html.match(/Agendá una reunión/g) ?? []).length, 1)
    assert.equal((html.match(/<a\b/g) ?? []).length, 1)
    assert.match(html, /href="\/contacto"/)
    assert.match(html, /motion-safe:group-hover:translate-x-0\.5/)
    assert.match(html, /motion-safe:group-focus-visible:-translate-y-0\.5/)
    assert.match(html, /motion-reduce:transition-none/)
    assert.doesNotMatch(html, /rotate-45|translate-y-full|<button|target=/)
  }
  assert.match(render({ to: '/contacto' }), /group-hover:rotate-45/)
})

test('terminal pilot is decorative, static by default and responds to its parent link without a loop', async () => {
  const { TerminalIcon } = await import('../src/components/icons/TerminalIcon.tsx')
  const html = renderToStaticMarkup(createElement(TerminalIcon, { className: 'size-5' }))
  assert.match(html, /<svg[^>]*aria-hidden="true"[^>]*focusable="false"/)
  assert.match(html, /stroke="currentColor"/)
  assert.match(html, /class="icon-terminal-cursor"/)
  assert.doesNotMatch(html, /tabindex|role="button"/)
  const css = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8')
  assert.match(css, /\[data-icon-pilot="terminal"\]:focus-visible \.icon-terminal-cursor/)
  assert.match(css, /@media \(hover: hover\)[\s\S]*\[data-icon-pilot="terminal"\]:hover \.icon-terminal-cursor/)
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.icon-terminal-cursor,[\s\S]*?animation: none/)
  const terminalAnimations = [...css.matchAll(/animation:\s*icon-terminal-cursor[^;]*;/g)]
  assert.equal(terminalAnimations.length, 2, 'only parent hover and keyboard focus animate the terminal')
  for (const [declaration] of terminalAnimations) {
    assert.match(declaration, /^animation:\s*icon-terminal-cursor 360ms ease-out;$/)
    assert.doesNotMatch(declaration, /infinite/)
  }
})

test('confirmation draws once on mount and retains a visible static reduced-motion fallback', async () => {
  const { ConfirmationIcon } = await import('../src/components/icons/ConfirmationIcon.tsx')
  const html = renderToStaticMarkup(createElement(ConfirmationIcon, { className: 'size-6' }))
  assert.match(html, /aria-hidden="true"/)
  assert.match(html, /class="icon-confirmation-stroke"/)
  assert.match(html, /pathLength="1"/)
  assert.match(html, /stroke-dashoffset="0"/)
  const css = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8')
  assert.match(css, /\.icon-confirmation-stroke\s*\{\s*animation: icon-confirmation-draw 400ms ease-out/)
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.icon-terminal-cursor,\s*\.icon-confirmation-stroke\s*\{\s*animation: none/)
})
