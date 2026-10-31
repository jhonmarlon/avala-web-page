import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { RowHoverFill } from '../src/components/fx/RowHoverFill.tsx'

test('shared row fill preserves Home bottom-up paint and is inert with reduced-motion support', () => {
  const html = renderToStaticMarkup(createElement(RowHoverFill))
  assert.match(html, /^<span aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 origin-bottom scale-y-0 bg-avala-neon transition-transform duration-500 ease-\[cubic-bezier\(0\.76,0,0\.24,1\)\] group-hover:scale-y-100 motion-reduce:transition-none"><\/span>$/)
  assert.doesNotMatch(html, /tabindex=|role=|onclick=|motion-safe:group-hover:scale/)
})
