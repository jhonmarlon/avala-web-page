import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router'

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'stage-motion:stub' || (specifier === 'motion/react' && ['/icons/ProcessStageIcon.tsx', '/pages/AboutPage.tsx', '/pages/ServicesPage.tsx'].some(path => context.parentURL?.endsWith(path)))) {
      return { url: new URL('./stage-motion-stub.mjs', import.meta.url).href, shortCircuit: true }
    }
    return nextResolve(specifier, context)
  },
  load(url, context, nextLoad) {
    if (url.endsWith('.png')) return { format: 'module', source: 'export default "fixture.png"', shortCircuit: true }
    if (url === new URL('./stage-motion-stub.mjs', import.meta.url).href) return {
      format: 'module', shortCircuit: true,
      source: `import { createElement } from 'react';
        export const calls = [];
        export const rows = [];
        let reduced = false;
        export const useReducedMotion = () => reduced;
        export function setReduced(value) { reduced = value; calls.length = 0; rows.length = 0; }
        const components = new Map();
        export const motion = new Proxy({}, { get(_, tag) {
          if (!components.has(tag)) components.set(tag, function Motion({ initial, animate, variants, whileInView, whileHover, viewport, transition, ...props }) {
            const call = { initial, animate, variants, whileInView, whileHover, viewport, transition };
            if (props.className === 'process-stage-icon__glyph') calls.push(call);
            if (props.className?.split(' ').some(name => ['process-stage-card', 'sequence-illustration-host'].includes(name))) rows.push(call);
            return createElement(tag, props);
          });
          return components.get(tag);
        } });`,
    }
    return nextLoad(url, context)
  },
})

const { AboutPage } = await import('../src/pages/AboutPage.tsx')
const { ServicesPage } = await import('../src/pages/ServicesPage.tsx')
const { services } = await import('../src/config/services.ts')
const { ProcessStageIcon } = await import('../src/components/icons/ProcessStageIcon.tsx')
const { processSteps } = await import('../src/features/home/data/content.ts')
const { calls, rows, setReduced } = await import('stage-motion:stub')

for (const reduced of [false, true]) {
  test(`About method has five decorative icons with hover-only gestures (reduced=${reduced})`, () => {
    setReduced(reduced)
    const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(AboutPage)))
    const method = html.match(/<ol\b[^>]*>[\s\S]*?<\/ol>/)[0]
    assert.equal((method.match(/data-process-icon=/g) ?? []).length, 5)
    assert.equal((method.match(/process-stage-card/g) ?? []).length, 5)
    assert.equal((method.match(/<li\b/g) ?? []).length, 6)
    assert.equal((method.match(/process-stage-icon__halo/g) ?? []).length, 5)
    assert.doesNotMatch(method, /tabindex=|role="button"/)
    assert.match(method, /href="\/casos-de-exito"/)
    for (const step of processSteps) {
      assert.ok(method.includes(step.title))
      assert.ok(method.includes(step.description))
      assert.ok(method.includes(`data-process-icon="${step.step}"`))
    }
    assert.equal(calls.length, 5)
    assert.equal(rows.length, 5)
    for (const row of rows) assert.equal(row.whileHover, reduced ? undefined : 'icon-hover')
    for (const call of calls) {
      assert.equal(call.initial, false, 'icon starts fully readable before JS or intersection')
      assert.equal(call.animate, undefined, 'do not override the parent hover variant')
      assert.equal(call.whileHover, undefined, 'the entire item owns hover, including its icon')
      assert.equal(call.transition.repeat, undefined)
      assert.equal(call.whileInView, undefined)
      const hover = call.variants['icon-hover']
      if (reduced) {
        assert.deepEqual(hover, { x: 0, y: 0, rotate: 0, scaleX: 1, scaleY: 1 })
      } else {
        assert.equal(hover.transition.duration, 0.8)
        assert.equal(hover.transition.repeat, undefined)
      }
    }
    if (!reduced) {
      assert.equal(new Set(calls.map(call => JSON.stringify(call.variants['icon-hover']))).size, 5)
    }
  })
}

test('Solutions keeps all catalog entries with ten scenes and no obsolete glyph hover wiring', () => {
  setReduced(false)
  const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(ServicesPage)))
  const catalog = html.match(/<ul\b[^>]*>[\s\S]*?<\/ul>/)[0]
  assert.doesNotMatch(catalog, /process-stage-icon|data-process-icon=/)
  assert.equal(calls.length, 0)
  assert.equal((html.match(/data-sequence-scene=/g) ?? []).length, services.length)
  assert.equal(rows.length, services.length)
  for (const row of rows) assert.equal(row.whileHover, undefined)
  for (const service of services) {
    assert.ok(catalog.includes(service.title))
    assert.ok(catalog.includes(service.description))
  }
  assert.doesNotMatch(catalog, /class="[^"]*\bhidden\b|tabindex=|role="button"/)
  assert.match(html, /href="\/contacto"/)
  assert.match(html, /href="\/estimar-proyecto"/)
  for (const call of calls) {
    assert.equal(call.animate, undefined)
    assert.equal(call.whileHover, undefined)
    assert.equal(call.transition.repeat, undefined)
    assert.equal(call.variants['icon-hover'].transition.duration, 0.8)
    assert.equal(call.variants['icon-hover'].transition.repeat, undefined)
  }
})

test('glyph never autoplays and hover respects reduced or unresolved motion preferences', () => {
  const step = processSteps[3]
  for (const reduced of [false, true, null]) {
    setReduced(reduced)
    renderToStaticMarkup(createElement(ProcessStageIcon, { stage: step.step, Icon: step.Icon }))
    const call = calls.at(-1)
    assert.equal(call.animate, undefined)
    assert.equal(call.whileInView, undefined)
    assert.equal(call.transition.repeat, undefined)
    assert.equal(call.whileHover, undefined)
    if (reduced === false) assert.equal(call.variants['icon-hover'].transition.duration, 0.8)
    else assert.deepEqual(call.variants['icon-hover'], { x: 0, y: 0, rotate: 0, scaleX: 1, scaleY: 1 })
  }
})

test('frames use 12px corners and restrained 200ms lift, tilt, contrast and glow on item hover', () => {
  for (const reduced of [false, true, null]) {
    setReduced(reduced)
    const html = renderToStaticMarkup(createElement(ProcessStageIcon, { stage: '2', Icon: processSteps[1].Icon }))
    assert.doesNotMatch(html, /data-motion-active=/)
    assert.equal((html.match(/class="process-stage-icon__frame"/g) ?? []).length, 1)
    assert.match(html, /class="process-stage-icon__frame"><span class="process-stage-icon__orbit"><\/span><\/span><span class="process-stage-icon__glyph"/)
    assert.doesNotMatch(html, /process-stage-icon__border|tabindex=|role="button"/)
  }
  const css = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8')
  assert.doesNotMatch(css, /stage-border-angle|stage-border-trace|conic-gradient/)
  assert.match(css, /\.process-stage-icon__frame\s*\{[^}]*border: 1px solid[^}]*background:[^}]*box-shadow:/)
  assert.doesNotMatch(css, /stage-frame-jelly|--stage-frame-phase|data-motion-active/)
  const frameRule = css.match(/\.process-stage-icon__frame\s*\{([^}]+)\}/)?.[1]
  assert.ok(frameRule)
  assert.doesNotMatch(frameRule, /animation:|transform:/)
  assert.match(frameRule, /border-radius: 12px;/)
  assert.match(frameRule, /transition: border-color 200ms ease-out, background-color 200ms ease-out, box-shadow 200ms ease-out;/)
  assert.match(css, /\.process-stage-icon\s*\{[^}]*transition: transform 200ms ease-out;/)
  const hoverTransform = css.match(/@media \(hover: hover\)\s*\{\s*\.process-stage-card:hover \.process-stage-icon\s*\{([^}]+)\}/)?.[1]
  assert.ok(hoverTransform)
  assert.equal(hoverTransform.trim(), 'transform: translateY(-2px) rotate(-2deg);')
  assert.match(css, /\.process-stage-card:hover \.process-stage-icon__frame\s*\{[^}]*border-color:[^}]*background-color:[^}]*box-shadow:/)
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)\s*\{[\s\S]*?\.process-stage-card:hover \.process-stage-icon\s*\{ transform: none; \}/)
  assert.match(css, /\.process-stage-icon__orbit\s*\{[^}]*border-radius: 6px;/)
})

test('each badge is decorative and exposes no extra interaction or accessible name', () => {
  const css = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8')
  assert.match(css, /\.process-stage-icon\s*\{[^}]*width: 64px;[^}]*height: 64px;/)
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.process-stage-icon,\s*\.process-stage-icon__frame,\s*\.process-stage-icon__halo\s*\{ transition: none;/)
  setReduced(true)
  for (const step of processSteps) {
    const html = renderToStaticMarkup(createElement(ProcessStageIcon, { stage: step.step, Icon: step.Icon }))
    assert.match(html, /^<span[^>]*aria-hidden="true"/)
    assert.match(html, /stroke="currentColor"/)
    assert.match(html, /stroke-width="1.65"/)
    assert.doesNotMatch(html, /tabindex=|role=|aria-label=/)
  }
})


test('Solutions has no framed glyphs while About retains all five method frames', () => {
  setReduced(false)
  const solutions = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(ServicesPage)))
  const about = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(AboutPage)))
  assert.match(solutions, /^<div class="solutions-page /)
  assert.doesNotMatch(about, /solutions-page/)
  const css = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8')
  assert.doesNotMatch(solutions, /process-stage-icon|data-process-icon=/)
  assert.equal((about.match(/class="process-stage-icon__frame"/g) ?? []).length, 5)
  assert.match(css, /\.process-stage-card:hover \.process-stage-icon\s*\{\s*transform: translateY\(-2px\) rotate\(-2deg\);/)
  assert.doesNotMatch(css, /\.solutions-page \.process-stage-(?:card|icon)/)
})
