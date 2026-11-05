import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router'

// Stub only this page's motion boundary; shared heading effects stay real.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'about-motion:stub' || (specifier === 'motion/react' && context.parentURL?.endsWith('/pages/AboutPage.tsx'))) {
      return { url: new URL('./about-motion-stub.mjs', import.meta.url).href, shortCircuit: true }
    }
    return nextResolve(specifier, context)
  },
  load(url, context, nextLoad) {
    if (url.endsWith('.png')) return { format: 'module', source: 'export default "fixture.png"', shortCircuit: true }
    if (url === new URL('./about-motion-stub.mjs', import.meta.url).href) return {
      format: 'module', shortCircuit: true,
      source: `
        import { createElement } from 'react'
        export const calls = []
        let reduced = false
        export function setReduced(value) { reduced = value; calls.length = 0 }
        export function useReducedMotion() { return reduced }
        const components = new Map()
        export const motion = new Proxy({}, { get(_, tag) {
          if (!components.has(tag)) components.set(tag, function Motion({ initial, whileInView, viewport, transition, animate, whileHover, ...props }) {
            calls.push({ tag, initial, whileInView, viewport, transition, animate, whileHover, className: props.className })
            return createElement(tag, props)
          })
          return components.get(tag)
        } })
      `,
    }
    return nextLoad(url, context)
  },
})
const { AboutPage } = await import('../src/pages/AboutPage.tsx')
const { calls, setReduced } = await import('about-motion:stub')
const { aboutSectionContent, processSteps } = await import('../src/features/home/data/content.ts')
const render = () => renderToStaticMarkup(createElement(MemoryRouter, null, createElement(AboutPage)))

function assertContent(html) {
  assert.ok(html.includes(aboutSectionContent.description))
  assert.ok(html.includes('Construimos soluciones que acompañan tu evolución.'))
  const highlights = html.match(/<ul\b[^>]*>([\s\S]*?)<\/ul>/)?.[1]
  const process = html.match(/<ol\b[^>]*>([\s\S]*?)<\/ol>/)?.[1]
  assert.ok(highlights, 'highlights remain an unordered list')
  assert.ok(process, 'process remains an ordered list')
  assert.equal((highlights.match(/<li\b/g) ?? []).length, aboutSectionContent.highlights.length)
  assert.equal((process.match(/<li\b/g) ?? []).length, processSteps.length + 1)
  for (const text of aboutSectionContent.highlights) assert.ok(highlights.includes(text), text)
  for (const step of processSteps) {
    assert.ok(process.includes(step.title), step.title)
    assert.ok(process.includes(step.description), step.description)
  }
  assert.match(html, /href="\/contacto"/)
  assert.match(process, /href="\/casos-de-exito"/)
  assert.ok(process.includes('De la idea a la práctica.'))
  const heading = html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/)[0]
  assert.deepEqual([...heading.matchAll(/aria-label="([^"]*)"/g)].map((match) => match[1]), ['Visión técnica.', 'Criterio de negocio.'])
  assert.match(heading, /translateY\(140%\)/)
}

for (const reduced of [false, true]) {
  test(`About entrances preserve content and semantics with reduced motion ${reduced}`, () => {
    setReduced(reduced)
    assertContent(render())
    assert.deepEqual(calls.map(({ tag }) => tag), ['div', ...Array(aboutSectionContent.highlights.length + processSteps.length + 1).fill('li')])
    const delays = [0, ...aboutSectionContent.highlights.map((_, i) => i * 0.08), ...processSteps.map((_, i) => i * 0.08), processSteps.length * 0.08]
    for (const [index, call] of calls.entries()) {
      assert.deepEqual(call.initial, reduced ? false : { opacity: 0, y: 16 })
      assert.deepEqual(call.whileInView, { opacity: 1, y: 0 })
      assert.deepEqual(call.viewport, { once: true, amount: 0.3 })
      assert.equal(call.animate, undefined, 'entrance waits for viewport entry')
      assert.equal(call.whileHover, !reduced && call.className?.split(' ').includes('process-stage-card') ? 'icon-hover' : undefined)
      assert.equal(call.transition.duration, reduced ? 0 : 0.7)
      assert.equal(call.transition.delay, reduced ? 0 : delays[index])
    }
  })
}
