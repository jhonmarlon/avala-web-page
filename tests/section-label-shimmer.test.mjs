import assert from 'node:assert/strict'
import { readProjectStyles } from './style-source.mjs'
import { registerHooks } from 'node:module'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

// Capture only the exported component's public Motion props, not internals.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'divider-motion:stub' || (specifier === 'motion/react' && context.parentURL?.endsWith('/fx/SectionLabel.tsx'))) {
      return { url: new URL('./divider-motion-stub.mjs', import.meta.url).href, shortCircuit: true }
    }
    return nextResolve(specifier, context)
  },
  load(url, context, nextLoad) {
    if (url === new URL('./divider-motion-stub.mjs', import.meta.url).href) return {
      format: 'module', shortCircuit: true,
      source: `
        import { createElement } from 'react'
        export const calls = []
        const components = new Map()
        export const motion = new Proxy({}, { get(_, tag) {
          if (!components.has(tag)) components.set(tag, function Motion({ initial, whileInView, viewport, variants, transition, animate, whileHover, ...props }) {
            calls.push({ tag, initial, whileInView, viewport, variants, transition, animate, whileHover, props })
            return createElement(tag, props)
          })
          return components.get(tag)
        } })
      `,
    }
    return nextLoad(url, context)
  },
})
const { calls } = await import('divider-motion:stub')
const { SectionLabel } = await import('../src/components/fx/SectionLabel.tsx')
const css = readProjectStyles()
function render(meta = 'Información adicional') {
  calls.length = 0
  return renderToStaticMarkup(createElement(SectionLabel, {
    index: '02', label: 'Dos entradas, una experiencia segura', meta, className: 'mb-8 custom-label',
  }))
}

test('SectionLabel preserves index, label, optional responsive meta and caller spacing', () => {
  const html = render()
  assert.match(html, /^<div class="relative pb-3 mb-8 custom-label">/)
  assert.match(html, /class="hud-label flex items-baseline justify-between gap-6"/)
  assert.match(html, /<span class="tabular text-sm text-avala-neon sm:text-base">02<\/span>/)
  assert.match(html, /<span class="section-label-title text-avala-paper">Dos entradas, una experiencia segura<\/span>/)
  assert.match(html, /<p class="flex items-baseline gap-4">/)
  const title = css.match(/\.section-label-title\s*\{([^}]+)\}/)?.[1]
  assert.ok(title)
  assert.match(title, /font-size: clamp\(1rem, 1\.5vw, 1\.125rem\);/)
  assert.match(title, /font-family: var\(--font-display\);/)
  assert.match(title, /font-weight: 600;/)
  assert.match(html, /<p class="hidden sm:block">Información adicional<\/p>/)
  calls.length = 0
  assert.doesNotMatch(renderToStaticMarkup(createElement(SectionLabel, { index: '02', label: 'Sin meta' })), /hidden sm:block|undefined/)
  const withoutMeta = render('')
  assert.doesNotMatch(withoutMeta, /hidden sm:block/)
})

test('stationary visible baseline gates continuous shimmer by viewport and clips only shine', () => {
  const html = render()
  assert.equal(calls.length, 2)
  const [baseline, shine] = calls
  assert.equal(baseline.tag, 'span')
  assert.match(baseline.props.className, /absolute inset-x-0 bottom-0 h-px/)
  assert.match(baseline.props.className, /bg-avala-paper\/15/)
  assert.match(baseline.props.className, /overflow-hidden/)
  assert.match(baseline.props.className, /pointer-events-none/)
  assert.equal(baseline.props['aria-hidden'], 'true')
  assert.equal(baseline.initial, 'hidden')
  assert.equal(baseline.whileInView, 'visible')
  assert.deepEqual(baseline.viewport, { once: false, amount: 1 })
  assert.equal(baseline.variants, undefined, 'baseline never collapses or fades')
  assert.equal(baseline.transition, undefined)
  assert.equal(baseline.animate, undefined)
  assert.equal(baseline.whileHover, undefined)
  assert.ok(html.includes(`${baseline.props.className}"><span`), 'shine alone is nested in the mask')
  assert.match(shine.props.className, /section-divider-shine/)
  assert.doesNotMatch(html, /tabindex|role=|<button|<a\b|style=/i)
})

test('shine inherits viewport labels to run or pause the continuous CSS sweep', () => {
  render()
  assert.equal(calls.length, 2)
  const shine = calls[1]
  for (const key of ['initial', 'whileInView', 'viewport', 'animate', 'whileHover', 'transition']) {
    assert.equal(shine[key], undefined, `no child ${key} override or offscreen observer`)
  }
  assert.deepEqual(shine.variants.hidden, { '--divider-play-state': 'paused', transition: { duration: 0 } })
  assert.deepEqual(shine.variants.visible, { '--divider-play-state': 'running', transition: { duration: 0 } })
  assert.match(css, /@media \(prefers-reduced-motion: no-preference\)[\s\S]*animation: section-divider-sweep 2\.4s linear infinite;/)
  assert.match(css, /animation-play-state: var\(--divider-play-state, paused\);/)
  assert.match(css, /@keyframes section-divider-sweep\s*\{\s*from \{ transform: translateX\(-70%\); \}\s*to \{ transform: translateX\(70%\); \}\s*\}/)
  assert.match(css, /\.section-divider-baseline\s*\{[^}]*background-color: color-mix[^}]*box-shadow:/)
  assert.deepEqual(Object.keys(shine.variants).sort(), ['hidden', 'visible'])
})

test('narrow cyan paint stays within 1px mask; only reduced motion hides viewport-driven shine', () => {
  const rule = css.match(/\.section-divider-shine\s*\{([^}]+)\}/)?.[1]
  assert.ok(rule, 'divider-only CSS exists')
  for (const declaration of ['position: absolute', 'inset: 0', 'pointer-events: none']) assert.ok(rule.includes(declaration))
  assert.match(rule, /linear-gradient\(90deg, transparent 30%, color-mix\(in srgb, var\(--color-avala-cyan\) 85%, transparent\) 45%, color-mix\(in srgb, var\(--color-avala-paper\) 95%, transparent\) 50%, color-mix\(in srgb, var\(--color-avala-cyan\) 85%, transparent\) 55%, transparent 70%\)/)
  assert.doesNotMatch(rule, /animation|transition|height|padding|margin/)
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.section-divider-shine\s*\{\s*animation: none;\s*display: none;\s*\}\s*\}/)
  assert.doesNotMatch(css, /@media[^{}]*\(hover: none\)[^{}]*\{\s*\.section-divider-shine/)
  assert.doesNotMatch(css, /\.section-divider-shine[^{}]*:hover/)
})
