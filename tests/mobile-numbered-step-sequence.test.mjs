import assert from 'node:assert/strict'
import { test } from 'node:test'
import { registerHooks } from 'node:module'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Smartphone } from 'lucide-react'

// Media policy / rendered CSS intent only; actual fit/travel is modeled in process-scroll.
const viewport = { width: 375, reduced: false }
globalThis.__mobileSequenceViewport = viewport
registerHooks({
  resolve(specifier, context, next) {
    if (specifier === '@/lib/use-media-query' && context.parentURL?.endsWith('/NumberedStepSequence.tsx')) {
      return { url: 'mobile:media', shortCircuit: true }
    }
    return next(specifier, context)
  },
  load(url, context, next) {
    if (url === 'mobile:media') return {
      format: 'module', shortCircuit: true,
      source: `export const useMediaQuery = query => query.includes('reduced-motion') ? globalThis.__mobileSequenceViewport.reduced : globalThis.__mobileSequenceViewport.width >= 1024;`,
    }
    return next(url, context)
  },
})
const { NumberedStepSequence } = await import('../src/components/ui/NumberedStepSequence.tsx')
const render = ordered => renderToStaticMarkup(createElement(NumberedStepSequence, {
  ordered,
  header: createElement('h2', null, 'Feature header'),
  intro: createElement('p', null, 'Feature intro'),
  footer: createElement('a', { href: '#next' }, 'Continue'),
  steps: Array.from({ length: ordered ? 4 : 5 }, (_, i) => ({
    title: `Title ${i + 1}`, description: `Description ${i + 1}`, Icon: Smartphone, label: `Paso ${i + 1}`,
  })),
}))

for (const ordered of [false, true]) test(`mobile ${ordered ? 'customer steps' : 'Home stages'} starts readable with the same measurable horizontal tree`, () => {
  for (const width of [320, 375, 390, 768, 1023]) for (const reduced of [false, true]) {
    Object.assign(viewport, { width, reduced })
    const html = render(ordered)
    assert.match(html, /data-layout="native"/)
    const scroller = html.match(/<div\b[^>]*role="region"[^>]*>/)?.[0]
    assert.ok(scroller)
    assert.match(scroller, /aria-label="Pasos: desplazamiento horizontal"/)
    assert.match(scroller, /tabindex="0"/)
    assert.match(scroller, /overflow-x-auto/)
    assert.match(scroller, /touch-auto/)
    assert.match(scroller, /focus-visible:outline/)
    assert.match(scroller, /data-lenis-prevent="true"/)
    assert.match(html, /Deslizá horizontalmente para ver todos los pasos →/)
    assert.equal((html.match(/<article\b/g) ?? []).length, ordered ? 4 : 5)
    assert.equal((html.match(/w-\[min\(82vw,32rem\)\]/g) ?? []).length, (ordered ? 4 : 5) + 1, 'bounded intro and panels')
    assert.doesNotMatch(html, /min-h-\[|height:|touch-pan-x|scroll-smooth|aria-roledescription/)
    for (const text of ['Feature header', 'Feature intro', 'Continue']) assert.equal(html.split(text).length - 1, 1)
    for (let i = 1; i <= (ordered ? 4 : 5); i++) {
      assert.equal(html.split(`Title ${i}</h3>`).length - 1, 1)
      assert.equal(html.split(`Description ${i}</p>`).length - 1, 1)
    }
    assert.match(html, /Feature header[\s\S]*Feature intro[\s\S]*<article[\s\S]*href="#next"/)
    if (ordered) {
      const list = html.match(/<ol\b[^>]*>[\s\S]*?<\/ol>/)[0]
      assert.equal((list.match(/<li\b/g) ?? []).length, 4)
      assert.doesNotMatch(list, /Feature intro|Feature header|Continue/)
    }
  }
})

test('desktop reduced-motion fallback keeps its original vertical presentation', () => {
  Object.assign(viewport, { width: 1366, reduced: true })
  const html = render(true)
  assert.match(html, /<ol class="divide-y divide-avala-paper\/15 border-t/)
  assert.doesNotMatch(html, /overflow-x-auto|role="region"|w-\[min\(82vw/)
  assert.equal((html.match(/<li\b/g) ?? []).length, 4)
})
