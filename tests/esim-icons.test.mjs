import assert from 'node:assert/strict'
import { readProjectStyles } from './style-source.mjs'
import { registerHooks } from 'node:module'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router'

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'esim-icons:motion' || (specifier === 'motion/react' && ['/pages/EsimPage.tsx', '/icons/EsimFlowIllustration.tsx'].some(path => context.parentURL?.endsWith(path)))) {
      return { url: new URL('./esim-icons-motion.mjs', import.meta.url).href, shortCircuit: true }
    }
    return nextResolve(specifier, context)
  },
  load(url, context, nextLoad) {
    if (url.endsWith('.png')) return { format: 'module', source: 'export default "fixture.png"', shortCircuit: true }
    if (url === new URL('./esim-icons-motion.mjs', import.meta.url).href) return {
      format: 'module', shortCircuit: true,
      source: `import { createElement } from 'react';
        export { MotionConfig } from ${JSON.stringify(import.meta.resolve('motion/react'))};
        export const rows = [], flowRows = [], illustrationLayers = [];
        let reduced = false;
        export const useReducedMotion = () => reduced;
        export function setReduced(value) { reduced = value; rows.length = 0; flowRows.length = 0; illustrationLayers.length = 0; }
        const cache = new Map();
        export const motion = new Proxy({}, { get(_, tag) {
          if (!cache.has(tag)) cache.set(tag, function Motion({ initial, animate, whileInView, whileHover, variants, viewport, transition, ...props }) {
            const call = { initial, animate, whileInView, whileHover, variants, transition };
            if (props['data-illustration-layer']) illustrationLayers.push(call);
            if (props.className?.split(' ').includes('esim-capability')) rows.push(call);
            if (props.className?.split(' ').includes('esim-flow')) flowRows.push(call);
            return createElement(tag, props);
          });
          return cache.get(tag);
        } });`,
    }
    const result = nextLoad(url, context)
    return url.endsWith('/config/site.ts')
      ? { ...result, source: result.source.replaceAll('import.meta.env', '({})') }
      : result
  },
})

const { EsimPage } = await import('../src/pages/EsimPage.tsx')
const { rows, flowRows, illustrationLayers, setReduced } = await import('esim-icons:motion')
const render = () => renderToStaticMarkup(createElement(MemoryRouter, null, createElement(EsimPage)))
const sections = html => [...html.matchAll(/<section\b[^>]*>[\s\S]*?<\/section>/g)].map(([section]) => section)

for (const reduced of [false, true, null]) {
  test(`eSIM operations use six product scenes with paired CSS actors and no imperative card lift (reduced=${reduced})`, () => {
    setReduced(reduced)
    const html = render()
    const operations = sections(html).find(section => section.includes('Operación y trazabilidad'))
    assert.deepEqual([...operations.matchAll(/data-sequence-scene="([^"]+)"/g)].map(match => match[1]), ['stock', 'batches', 'print', 'confirmation', 'otp', 'trace'])
    assert.doesNotMatch(operations, /esim-icon-badge|sequence-illustration-host/)
    assert.equal(rows.length, 6)
    assert.equal((operations.match(/class="illustration-gesture"/g) ?? []).length, 12)
    assert.doesNotMatch(html, /esim-icon-badge/)
    assert.equal(illustrationLayers.length, 0, 'no imperative moving flow layers')
    assert.equal(flowRows.length, 2)
    for (const flow of flowRows) assert.equal(flow.whileHover, undefined)
    for (const row of rows) assert.equal(row.whileHover, undefined)
    assert.doesNotMatch(operations, /hover:-translate|transition-\[transform/)
    assert.doesNotMatch(operations, /process-stage-card|data-process-icon|rotate-|tabindex=|role="button"|<a\b|<button\b/)
    const css = readProjectStyles()
    assert.doesNotMatch(css, /\.esim-icon-badge/)
  })
}

test('eSIM hierarchy gives both flows product illustrations without crowding mobile text', () => {
  setReduced(false)
  const html = render()
  const groups = sections(html)
  assert.match(groups[0], /esim-customer-steps/)
  assert.equal((groups[0].match(/Paso \d/g) ?? []).length, 4)
  assert.doesNotMatch(groups[0], /esim-icon-badge/)
  assert.equal((groups[2].match(/class="esim-flow-illustration"/g) ?? []).length, 2)
  assert.equal((groups[2].match(/class="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start"/g) ?? []).length, 2)
  assert.match(groups[2], /data-flow-illustration="purchase"/)
  assert.match(groups[2], /data-flow-illustration="voucher"/)
  assert.doesNotMatch(groups[2], /esim-icon-badge|lucide-credit-card|lucide-ticket-check/)
  assert.match(groups[2], /disabled=""[^>]*>Disponible próximamente/)
  assert.equal((groups[4].match(/data-sequence-scene="retail"/g) ?? []).length, 1)
  assert.doesNotMatch(groups[4], /esim-icon-badge|lucide-store/)
  assert.match(groups[4], /class="sequence-illustration-host border-t/)
  assert.match(groups[0], /class="sequence-illustration-host flex shrink-0/)
  assert.match(groups[4], /¿Sos empresa o punto de venta\?/)
  assert.match(groups[4], /href="\/contacto"/)
  const css = readProjectStyles()
  assert.match(css, /\.esim-flow-illustration\s*\{[^}]*width: 120px;[^}]*height: 104px;/)
  assert.deepEqual([...groups[0].matchAll(/data-sequence-scene="([^"]+)"/g)].map(match => match[1]), ['protected', 'entry', 'identity', 'reserve', 'qr'])
})


for (const [kind, parts] of [
  ['purchase', ['phone', 'esim-chip', 'payment-card']],
  ['voucher', ['voucher', 'qr', 'scratch-panel']],
]) {
  test(kind + ' illustration has distinct vector product details and safe local gradient references', async () => {
    const { EsimFlowIllustration } = await import('../src/components/icons/EsimFlowIllustration.tsx')
    setReduced(false)
    const html = renderToStaticMarkup(createElement(EsimFlowIllustration, { kind }))
    assert.match(html, /^<svg[^>]*aria-hidden="true"[^>]*focusable="false"/)
    assert.ok(html.includes('data-flow-illustration="' + kind + '"'))
    assert.match(html, /viewBox="0 0 120 104"/)
    for (const part of parts) assert.ok(html.includes('data-illustration-part="' + part + '"'), part)
    const targets = [...html.matchAll(/<g\b[^>]*class="illustration-gesture"[^>]*>/g)]
    assert.equal(targets.length, 2)
    for (const [index, part] of (kind === 'purchase' ? ['phone', 'payment-card'] : ['voucher', 'scratch-panel']).entries()) {
      assert.ok(targets[index][0].includes('data-illustration-part="' + part + '"'))
      assert.ok(targets[index][0].includes('data-gesture="flow-' + (index === 0 ? 'main' : 'detail') + '"'))
    }
    assert.doesNotMatch(html, /data-illustration-layer|style="[^"]*transform/)
    assert.doesNotMatch(html, /<image|<foreignObject|<button|tabindex=|role="button"/)
    const combined = renderToStaticMarkup(createElement('div', null,
      createElement(EsimFlowIllustration, { kind }),
      createElement(EsimFlowIllustration, { kind })))
    const ids = [...combined.matchAll(/\bid="([^"]+)"/g)].map(match => match[1])
    assert.ok(ids.length >= 4)
    assert.equal(new Set(ids).size, ids.length, 'multiple instances cannot share gradient IDs')
    for (const [, ref] of combined.matchAll(/url\(#([^)]+)\)/g)) assert.ok(ids.includes(ref), ref)
  })
}
