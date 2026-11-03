import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Card } from '../src/components/ui/Card.tsx'

const render = (props = {}) => renderToStaticMarkup(createElement(Card, props, createElement('span', null, 'Readable child')))

test('Card preserves its exact default surface, native props and children', () => {
  assert.equal(render({ id: 'legacy', 'aria-label': 'Legacy panel', title: 'Details' }), '<div class="panel-surface p-8 transition-transform duration-200" id="legacy" aria-label="Legacy panel" title="Details"><span>Readable child</span></div>')
  assert.equal(render({ className: 'h-full p-0', 'data-panel': 'legacy' }), '<div class="panel-surface transition-transform duration-200 h-full p-0" data-panel="legacy"><span>Readable child</span></div>')
})

test('Card offers an opt-in ink surface without light panel styling or leaking its option', () => {
  const html = render({ surface: 'ink', className: 'h-full', id: 'ink' })
  assert.match(html, /bg-avala-ink-2/)
  assert.match(html, /text-avala-paper/)
  assert.match(html, /border border-avala-paper\/15/)
  assert.match(html, /rounded-lg/)
  assert.doesNotMatch(html, /rounded-\[/)
  assert.match(html, / p-5 /)
  assert.match(html, / sm:p-6 /)
  assert.match(html, /h-full/)
  assert.match(html, /id="ink"/)
  assert.match(html, /<span>Readable child<\/span>/)
  assert.doesNotMatch(html, /panel-surface|bg-card|text-card-foreground|surface=|shadow-soft/)
})
