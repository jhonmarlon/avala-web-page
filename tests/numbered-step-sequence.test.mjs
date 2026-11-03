import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Smartphone } from 'lucide-react'
import { NumberedStepSequence } from '../src/components/ui/NumberedStepSequence.tsx'

test('sequence keeps feature slots outside the customer ordered list in its readable server fallback', () => {
  const html = renderToStaticMarkup(createElement(NumberedStepSequence, {
    ordered: true,
    header: createElement('h2', null, 'Feature header'),
    intro: createElement('p', null, 'Feature intro'),
    footer: createElement('a', { href: '#next' }, 'Continue'),
    steps: [{ title: 'Own title', description: 'Own description', Icon: Smartphone, label: 'Paso 1' }],
  }))
  const list = html.match(/<ol\b[^>]*>[\s\S]*?<\/ol>/)[0]
  assert.equal((list.match(/<li\b/g) ?? []).length, 1)
  assert.match(list, /Paso 1[\s\S]*Own title[\s\S]*Own description/)
  assert.doesNotMatch(list, /Feature header|Feature intro|Continue/)
  assert.match(html, /Feature header[\s\S]*Feature intro[\s\S]*<ol[\s\S]*href="#next"/)
  assert.doesNotMatch(html, /opacity:0|translateX|position:sticky|height:0/)
})
