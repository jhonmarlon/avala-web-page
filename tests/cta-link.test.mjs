import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router'
import { CtaLink } from '../src/components/fx/CtaLink.tsx'

const render = (props) => renderToStaticMarkup(createElement(MemoryRouter, null,
  createElement(CtaLink, props, 'Continuar')))

function assertReadableLink(html) {
  assert.equal((html.match(/<a\b/g) ?? []).length, 1)
  assert.doesNotMatch(html, /<button\b|target=/)
  assert.match(html, /<span class="block [^"]*">Continuar<\/span>/)
  assert.match(html, /aria-hidden="true"[^>]*>Continuar<\/span>/)
}

test('CtaLink preserves router discovery, default solid, cursor and custom classes', () => {
  const html = render({ to: '/contacto', cursor: 'Hablemos', className: 'mt-6' })
  assertReadableLink(html)
  for (const token of ['href="/contacto"', 'data-discover="true"', 'data-cursor="Hablemos"',
    'bg-avala-neon text-avala-ink hover:bg-avala-paper', 'mt-6']) assert.ok(html.includes(token), token)
})

test('CtaLink preserves line and bare variants and forwards the click callback', () => {
  for (const [variant, family] of [['line', 'border border-avala-paper/25'], ['bare', 'px-0 text-avala-paper']]) {
    assert.ok(render({ to: '/estimar-proyecto', variant }).includes(family))
  }
  const onClick = () => {}
  // The returned public React element exposes the forwarded event prop; SSR cannot click.
  assert.equal(CtaLink({ to: '/contacto', children: 'Continuar', onClick }).props.onClick, onClick)
})

test('CtaLink hover transforms apply only when motion is allowed', () => {
  for (const props of [{ to: '/contacto' }, { to: '/contacto', variant: 'line' }, { href: 'https://esim.example.invalid/comprar' }]) {
    const html = render(props)
    const hoverTransforms = [...html.matchAll(/class="([^"]+)"/g)]
      .flatMap(([, classes]) => classes.split(' '))
      .filter((token) => /group-hover:.*(?:translate|rotate)/.test(token))
    assert.equal(hoverTransforms.length, 3)
    for (const token of hoverTransforms) assert.ok(token.startsWith('motion-safe:'), token)
    assert.match(html, /motion-reduce:hidden/)
  }
})

test('CtaLink href is native, unchanged, same-tab and shares readable solid content', () => {
  const href = 'https://esim.example.invalid/comprar?canal=web'
  const html = render({ href, cursor: 'Comprar' })
  assertReadableLink(html)
  assert.ok(html.includes(`href="${href}"`))
  assert.match(html, /bg-avala-neon text-avala-ink/)
  assert.match(html, /data-cursor="Comprar"/)
  assert.doesNotMatch(html, /data-discover=/)
  assert.ok(render({ href, variant: 'line' }).includes('border border-avala-paper/25'))
  const onClick = () => {}
  assert.equal(CtaLink({ href, children: 'Continuar', onClick }).props.onClick, onClick)
})
