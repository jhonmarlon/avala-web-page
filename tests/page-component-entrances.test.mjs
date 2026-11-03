import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router'

const pages = ['ServicesPage', 'SuccessCasesPage', 'EsimPage', 'ContactPage']
// Only page-owned entrances are stubbed; SplitReveal, CTAs and the pinned sequence stay real.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'page-motion:stub' || (specifier === 'motion/react' && pages.some(page => context.parentURL?.endsWith(`/pages/${page}.tsx`)))) {
      return { url: new URL('./page-motion-stub.mjs', import.meta.url).href, shortCircuit: true }
    }
    return nextResolve(specifier, context)
  },
  load(url, context, nextLoad) {
    if (url === new URL('./page-motion-stub.mjs', import.meta.url).href) return {
      format: 'module', shortCircuit: true,
      source: `
        import { createElement, Children } from 'react'
        export { MotionConfig } from 'motion/react'
        export const calls = []
        let reduced = false
        export function setReduced(value) { reduced = value; calls.length = 0 }
        export function useReducedMotion() { return reduced }
        function containsSequence(children) {
          return Children.toArray(children).some(child => child?.type?.name === 'NumberedStepSequence' || (child?.props && containsSequence(child.props.children)))
        }
        const components = new Map()
        export const motion = new Proxy({}, { get(_, tag) {
          if (!components.has(tag)) components.set(tag, function Motion({ initial, whileInView, viewport, transition, animate, ...props }) {
            calls.push({ tag, initial, whileInView, viewport, transition, animate, className: props.className, containsSequence: containsSequence(props.children) })
            return createElement(tag, props)
          })
          return components.get(tag)
        } })
      `,
    }
    if (url.endsWith('.png')) return { format: 'module', source: 'export default "fixture.png"', shortCircuit: true }
    const result = nextLoad(url, context)
    return url.endsWith('/config/site.ts')
      ? { ...result, source: result.source.replaceAll('import.meta.env', '({})') }
      : result
  },
})
const { calls, setReduced } = await import('page-motion:stub')
const { services } = await import('../src/config/services.ts')
const { successCases } = await import('../src/features/home/data/content.ts')
const { companyInfo } = await import('../src/config/site.ts')
const configurations = [
  ['ServicesPage', ['div', ...services.map(() => 'li'), 'div'], [0, ...services.map((_, i) => Math.min(i, 4) * 0.08), 0], ['Tu próximo paso.', 'Nuestra tecnología.']],
  ['SuccessCasesPage', ['p', ...successCases.map(() => 'article'), 'div'], [0, ...successCases.map((_, i) => Math.min(i, 4) * 0.08), 0], ['Tecnología aplicada.', 'Impacto real.']],
  ['EsimPage', ['div', 'div', 'div', 'li', 'li', 'div', ...Array(6).fill('li'), 'div'], [0, 0, 0, 0, 0.08, 0, ...Array.from({ length: 6 }, (_, i) => Math.min(i, 4) * 0.08), 0], ['Comprá o activá tu eSIM', 'en pocos pasos, sin complicaciones.']],
  ['ContactPage', ['div', 'div', 'li', 'li', 'li', 'div'], [0, 0, 0, 0.08, 0.16, 0], ['Hablemos.', '¿En qué podemos ayudarte?']],
]

function assertContent(name, html) {
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1)
  if (name === 'ServicesPage') {
    const list = html.match(/<ul\b[^>]*>[\s\S]*?<\/ul>/)[0]
    assert.equal((list.match(/<li\b/g) ?? []).length, services.length)
    for (const service of services) for (const text of [service.title, service.description]) assert.ok(list.includes(text), text)
    assert.match(html, /href="\/contacto"/)
    assert.match(html, /href="\/estimar-proyecto"/)
  } else if (name === 'SuccessCasesPage') {
    assert.equal((html.match(/<article\b/g) ?? []).length, successCases.length)
    for (const item of successCases) {
      for (const text of [item.title, item.description, item.metric, item.metricLabel]) assert.ok(html.includes(text), text)
      assert.ok(html.includes(`alt="${item.title}" loading="lazy"`))
    }
    assert.match(html, /href="\/contacto"/)
  } else if (name === 'EsimPage') {
    const sequence = html.match(/<ol\b[^>]*>[\s\S]*?<\/ol>/)[0]
    assert.deepEqual([...sequence.matchAll(/Paso (\d)/g)].map(match => match[1]), ['1', '2', '3', '4'])
    assert.doesNotMatch(sequence, /opacity:0|translateY/)
    assert.equal((html.match(/<section\b/g) ?? []).length, 5)
    assert.match(html, /href="https:\/\/siembradigital.avalashop.com\/"/)
    assert.match(html, /<button\b[^>]*type="button"[^>]*disabled=""[^>]*>Disponible próximamente<\/button>/)
    assert.match(html, /href="\/contacto"/)
    assert.match(html, /<ul aria-label="Capacidades operativas"/)
  } else {
    assert.equal((html.match(/<form\b/g) ?? []).length, 1)
    for (const name of ['name', 'company', 'email', 'phone', 'message']) assert.ok(html.includes(`name="${name}"`))
    assert.match(html, /type="submit"/)
    const steps = html.match(/<ol\b[^>]*>[\s\S]*?<\/ol>/)[0]
    assert.equal((steps.match(/<li\b/g) ?? []).length, 3)
    for (const text of ['Recibimos tu mensaje.', 'Lo acercamos al equipo indicado.', 'Te respondemos para ayudarte con el siguiente paso.']) assert.ok(steps.includes(text))
    assert.match(html, /href="\/estimar-proyecto"/)
    assert.ok(html.includes(`href="mailto:${companyInfo.email}"`))
    assert.ok(html.includes(`href="tel:${companyInfo.phone.replace(/\s/g, '')}"`))
    const channels = html.slice(html.indexOf('Canales directos'))
    assert.match(channels, /<li[^>]*style="opacity:0;transform:translateY\(24px\)"/, 'existing shared channel entrances stay real, without a nested page entrance')
  }
}

for (const [name, tags, delays, headingLines] of configurations) {
  const { [name]: Page } = await import(`../src/pages/${name}.tsx`)
  for (const reduced of [false, true]) {
    test(`${name} groups enter once in viewport, preserving public content (reduced=${reduced})`, () => {
      setReduced(reduced)
      const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(Page)))
      assertContent(name, html)
      const heading = html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/)[0]
      assert.deepEqual([...heading.matchAll(/aria-label="([^"]*)"/g)].map(match => match[1]), headingLines)
      assert.match(heading, /translateY\(140%\)/, 'shared SplitReveal stays real')
      assert.deepEqual(calls.map(call => call.tag), tags)
      for (const [index, call] of calls.entries()) {
        assert.equal(call.containsSequence, false, 'no entrance on sequence ancestors or track')
        assert.deepEqual(call.initial, reduced ? false : { opacity: 0, y: 16 })
        assert.deepEqual(call.whileInView, { opacity: 1, y: 0 })
        assert.deepEqual(call.viewport, { once: true, amount: 0.3 })
        assert.equal(call.animate, undefined, 'waits for viewport, not mount')
        assert.equal(call.transition.duration, reduced ? 0 : 0.7)
        assert.equal(call.transition.delay, reduced ? 0 : delays[index])
        assert.deepEqual(call.transition.ease, [0.76, 0, 0.24, 1])
      }
    })
  }
}
