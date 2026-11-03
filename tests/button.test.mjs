import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router'
import { Button } from '../src/components/ui/Button.tsx'

for (const destination of [{}, { href: '/contacto' }, { to: '/contacto' }]) {
  test(`Button merges styles and forwards attributes: ${JSON.stringify(destination)}`, () => {
    const onClick = () => {}
    const element = Button({ ...destination, children: 'Contactar', className: 'custom', variant: 'secondary', size: 'lg', fullWidth: true, 'aria-label': 'Contacto', onClick })
    assert.match(element.props.className, /inline-flex/)
    assert.match(element.props.className, /custom/)
    assert.match(element.props.className, /w-full/)
    assert.match(element.props.className, /min-h-\[3\.3rem\]/)
    assert.equal(element.props.onClick, onClick)
    assert.equal(element.props['aria-label'], 'Contacto')
    for (const prop of ['variant', 'size', 'fullWidth']) assert.equal(element.props[prop], undefined)
  })
}

test('Button retains defaults, disabled state and explicit submit type', () => {
  assert.equal(Button({ children: 'Enviar' }).props.type, 'button')
  const element = Button({ children: 'Enviar', type: 'submit', disabled: true })
  assert.equal(element.props.type, 'submit')
  assert.equal(element.props.disabled, true)
  assert.match(element.props.className, /min-h-11/)
})

for (const destination of [{}, { href: '/contacto' }, { to: '/contacto' }]) {
  test(`Button renders the opt-in outline family: ${JSON.stringify(destination)}`, () => {
    const html = renderToStaticMarkup(createElement(MemoryRouter, null,
      createElement(Button, { ...destination, variant: 'outline' }, 'Contactar')))
    const tag = html.match(/^<(?:button|a)\b[^>]*>/)[0]
    for (const token of [
      'rounded-sm', 'border-avala-paper/25', 'bg-avala-ink', 'text-avala-paper',
      'px-4', 'py-3', 'min-h-11', 'transition-colors',
      'hover:border-avala-neon/50', 'hover:bg-avala-neon/10',
      'focus-visible:outline-none', 'focus-visible:ring-2', 'focus-visible:ring-avala-neon/60',
      'motion-reduce:transition-none',
    ]) assert.ok(tag.includes(token), `Missing ${token} on ${tag}`)
    assert.doesNotMatch(tag, /rounded-\[|transition-all|gradient|shadow-/)
    assert.match(html, />Contactar<\//)
    if ('href' in destination || 'to' in destination) assert.match(tag, /^<a\b[^>]*href="\/contacto"/)
    else assert.match(tag, /^<button\b[^>]*type="button"/)
  })
}

test('Button keeps the existing primary, secondary and ghost families opt-in behavior', () => {
  const defaults = Button({ children: 'Enviar' }).props.className
  assert.match(defaults, /rounded-\[1\.05rem\]/)
  assert.match(defaults, /bg-\[linear-gradient/)
  assert.match(defaults, /focus-visible:ring-brand-400\/60/)
  const secondary = Button({ variant: 'secondary', children: 'Enviar' }).props.className
  assert.match(secondary, /bg-white\/4/)
  assert.match(secondary, /hover:border-brand-400\/50/)
  const ghost = Button({ variant: 'ghost', children: 'Enviar' }).props.className
  assert.match(ghost, /bg-transparent/)
  assert.match(ghost, /px-0 py-0 text-brand-700/)
  for (const classes of [defaults, secondary, ghost]) assert.doesNotMatch(classes, /bg-avala-ink|rounded-sm/)
})

for (const destination of [{}, { href: '/contacto' }, { to: '/contacto' }]) {
  test(`Button renders a square outline icon size: ${JSON.stringify(destination)}`, () => {
    const html = renderToStaticMarkup(createElement(MemoryRouter, null,
      createElement(Button, { ...destination, variant: 'outline', size: 'icon', 'aria-label': 'Contacto' },
        createElement('svg', { 'aria-hidden': true }))))
    const tag = html.match(/^<(?:button|a)\b[^>]*>/)[0]
    for (const token of ['size-11', 'p-0', 'shrink-0', 'rounded-sm', 'border-avala-paper/25',
      'bg-avala-ink', 'text-avala-paper', 'focus-visible:ring-avala-neon/60']) {
      assert.ok(tag.includes(token), `Missing ${token} on ${tag}`)
    }
    assert.doesNotMatch(tag, /\bpx-|\bpy-|min-h-|rounded-full/)
    assert.match(tag, /aria-label="Contacto"/)
    assert.match(html, /<svg aria-hidden="true"><\/svg>/)
    if ('href' in destination || 'to' in destination) assert.match(tag, /^<a\b[^>]*href="\/contacto"/)
    else assert.match(tag, /^<button\b[^>]*type="button"/)
  })
}

test('Button passes object and callback refs to the native button in React 19', () => {
  for (const ref of [{ current: null }, () => {}]) {
    const element = Button({ children: 'Cerrar', ref, type: 'button' })
    assert.equal(element.type, 'button')
    assert.equal(element.props.ref, ref)
  }
})

for (const destination of [{}, { href: '/contacto' }, { to: '/contacto' }]) {
  for (const [variant, tokens] of [
    ['neon', ['rounded-none', 'border-avala-neon', 'bg-[var(--color-avala-neon)]', 'bg-none', 'text-avala-ink', 'shadow-none', 'hover:bg-avala-paper', 'disabled:opacity-40']],
    ['neonSecondary', ['rounded-none', 'border-avala-paper/25', 'bg-transparent', 'text-avala-paper', 'hover:text-avala-neon', 'disabled:opacity-40']],
    ['editorialSolid', ['h-14', 'justify-between', 'gap-8', 'bg-avala-neon', 'text-avala-ink', 'disabled:cursor-wait', 'disabled:opacity-70']],
    ['editorialLine', ['h-12', 'border', 'border-avala-paper/25', 'text-avala-paper', 'hover:border-avala-paper']],
    ['editorialBare', ['h-12', 'text-avala-mute', 'hover:text-avala-paper']],
  ]) {
    test(`Button supports ${variant} actions: ${JSON.stringify(destination)}`, () => {
      const onClick = (event) => event
      const children = createElement('span', null, 'Enviando…')
      const editorial = variant.startsWith('editorial')
      const element = Button({ ...destination, variant, size: editorial ? null : 'md', children, onClick,
        ...(!('href' in destination || 'to' in destination) ? { type: 'submit', disabled: true } : { target: '_blank' }) })
      assert.equal(element.props.children, children)
      assert.equal(element.props.onClick, onClick)
      const event = { type: 'click' }
      assert.equal(element.props.onClick(event), event)
      assert.equal(element.props.variant, undefined)
      for (const token of tokens) assert.ok(element.props.className.split(' ').includes(token), `${variant}: missing ${token}`)
      if (editorial) {
        for (const token of ['font-mono', 'uppercase', 'tracking-[0.14em]', 'transition-colors', 'duration-300']) {
          assert.ok(element.props.className.split(' ').includes(token), `${variant}: missing ${token}`)
        }
        assert.doesNotMatch(element.props.className, /rounded-|min-h-|shadow-|focus-visible:ring|disabled:pointer-events/)
      } else {
        assert.match(element.props.className, /min-h-11/)
        assert.match(element.props.className, /focus-visible:ring-avala-neon/)
      }
      if ('href' in destination) {
        assert.equal(element.type, 'a')
        assert.equal(element.props.rel, 'noreferrer noopener')
        assert.equal(Button({ ...destination, variant, target: '_blank', rel: 'external', children }).props.rel, 'external')
      } else if (!('to' in destination)) {
        assert.equal(element.type, 'button')
        assert.equal(element.props.type, 'submit')
        assert.equal(element.props.disabled, true)
      }
    })
  }
}

test('Button preserves external link protection and explicit rel', () => {
  assert.equal(Button({ href: 'https://example.com', target: '_blank', children: 'Link' }).props.rel, 'noreferrer noopener')
  assert.equal(Button({ href: 'https://example.com', target: '_blank', rel: 'external', children: 'Link' }).props.rel, 'external')
})
