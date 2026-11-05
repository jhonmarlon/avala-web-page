import assert from 'node:assert/strict'
import { readProjectStyles } from './style-source.mjs'
import { registerHooks } from 'node:module'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

// Capture only the public SVG props; keep React's real rendering and useId.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'illustration-hover:jsx' || (specifier === 'react/jsx-runtime' &&
      /\/icons\/(SequenceIllustration|EsimFlowIllustration|IllustrationSvg)\.tsx$/.test(context.parentURL ?? ''))) {
      return { url: new URL('./illustration-hover-jsx.mjs', import.meta.url).href, shortCircuit: true }
    }
    return nextResolve(specifier, context)
  },
  load(url, context, nextLoad) {
    if (url === new URL('./illustration-hover-jsx.mjs', import.meta.url).href) return {
      format: 'module', shortCircuit: true,
      source: `import * as runtime from ${JSON.stringify(import.meta.resolve('react/jsx-runtime'))};
        export const roots = [];
        export const Fragment = runtime.Fragment;
        const capture = fn => (tag, props, ...rest) => {
          if (tag === 'svg') roots.push(props);
          return fn(tag, props, ...rest);
        };
        export const jsx = capture(runtime.jsx), jsxs = capture(runtime.jsxs);`,
    }
    return nextLoad(url, context)
  },
})
const { SequenceIllustration } = await import('../src/components/icons/SequenceIllustration.tsx')
const { EsimFlowIllustration } = await import('../src/components/icons/EsimFlowIllustration.tsx')
const { roots } = await import('illustration-hover:jsx')
const css = readProjectStyles()
const compact = ['discover', 'design', 'build', 'launch', 'optimize', 'entry', 'identity', 'reserve', 'qr',
  'protected', 'automate', 'integrate', 'stock', 'batches', 'print', 'confirmation', 'otp', 'trace', 'retail',
  'appspace', 'neuralmesh', 'cloudstack', 'strategy', 'campaign', 'delivery', 'signalnet', 'timeline', 'budget']
const scenes = [...compact.map(kind => [SequenceIllustration, kind]),
  ...['purchase', 'voucher'].map(kind => [EsimFlowIllustration, kind])]
const render = (Component, kind) => renderToStaticMarkup(createElement(Component, { kind }))
const keyframe = name => css.match(new RegExp('@keyframes ' + name + '\\s*\\{([\\s\\S]*?)\\n\\}'))?.[1]

test('large voucher restores sibling main and scratch layers; QR and text follow main, backing stays still', () => {
  const html = render(EsimFlowIllustration, 'voucher')
  const stack = [], ancestry = new Map()
  let voucherArtwork = 0
  for (const [tag] of html.matchAll(/<\/?g\b[^>]*>|<(?:path|rect)\b[^>]*>/g)) {
    if (tag.startsWith('</g')) stack.pop()
    else if (tag.startsWith('<g')) {
      const part = tag.match(/data-illustration-part="([^"]+)"/)?.[1]
      if (part) ancestry.set(part, [...stack])
      stack.push(part ?? '')
      if (part === 'voucher') assert.match(tag, /class="illustration-gesture" data-gesture="flow-main"/)
    } else if (stack.includes('voucher')) voucherArtwork++
    else assert.doesNotMatch(tag, /illustration-gesture/)
  }
  assert.ok(ancestry.get('qr').includes('voucher'))
  assert.deepEqual(ancestry.get('scratch-panel'), ancestry.get('voucher'), 'scratch and main must be siblings')
  assert.ok(voucherArtwork >= 7, 'main carries its face, QR and text artwork')
  assert.match(html, /<rect x="32" y="12"[^>]*transform="rotate\(8 64 50\)"/)
  assert.equal((html.match(/class="illustration-gesture"/g) ?? []).length, 2)
})

for (const [Component, kind] of scenes) {
  test(kind + ' public SVG entry alternates finite animation names without exit replay', () => {
    roots.length = 0
    const html = render(Component, kind)
    const props = roots[0]
    assert.equal(typeof props.onPointerEnter, 'function')
    for (const exit of ['onPointerLeave', 'onPointerOut', 'onMouseLeave', 'onMouseOut', 'onAnimationEnd']) {
      assert.equal(props[exit], undefined, exit + ' must not restart motion')
    }
    const gestures = [...html.matchAll(/class="illustration-gesture" data-gesture="([^"]+)"/g)].map(match => match[1])
    assert.equal(gestures.length, 2)
    const targets = gestures.map(() => ({ dataset: {} }))
    const event = pointerType => ({ pointerType, currentTarget: { querySelectorAll(selector) {
      assert.equal(selector, '.illustration-gesture')
      return targets
    } } })
    const names = gestures.map(gesture => ['illustration-' + gesture]) // row animation already finished
    for (let entry = 0; entry < 4; entry++) {
      props.onPointerEnter(event(entry === 1 ? 'pen' : 'mouse'))
      targets.forEach((target, index) => {
        const phase = target.dataset.illustrationReplay
        assert.equal(phase, entry % 2 === 0 ? 'replay' : 'primary')
        const primary = 'illustration-' + gestures[index]
        const rule = new RegExp('\\.illustration-gesture\\[data-gesture="' + gestures[index] + '"\\]\\[data-illustration-replay="replay"\\]\\s*\\{\\s*--illustration-gesture: ([\\w-]+);')
        const replay = css.match(rule)?.[1]
        assert.equal(replay, primary + '-replay')
        names[index].push(phase === 'replay' ? replay : primary)
        assert.notEqual(names[index].at(-1), names[index].at(-2), 'every layer replays after completion')
      })
    }
    props.onPointerEnter(event('touch'))
    props.onPointerEnter({ pointerType: 'mouse', currentTarget: { querySelectorAll: () => [] } })
    for (const target of targets) assert.equal(target.dataset.illustrationReplay, 'primary')
    assert.match(html, /aria-hidden="true" focusable="false"/)
    assert.match(html, Component === SequenceIllustration ? /viewBox="0 0 96 80"/ : /viewBox="0 0 120 104"/)
    assert.doesNotMatch(html, /data-illustration-replay=|style=|tabindex=/)
  })
}

test('replay aliases have identical bounded spatial shapes for both layers', () => {
  for (const gesture of ['main', 'slide', 'lift', 'tilt', 'grow', 'light', 'flow-main', 'flow-detail']) {
    const primary = keyframe('illustration-' + gesture)
    assert.ok(primary)
    assert.equal(keyframe('illustration-' + gesture + '-replay'), primary)
    assert.doesNotMatch(primary, /infinite|bounce|opacity:/)
  }
  const light = keyframe('illustration-light')
  assert.match(light, /35%, 65% \{ transform: translateY\(-5px\); \}/)
  assert.doesNotMatch(light, /filter:|brightness/)
  assert.match(keyframe('illustration-main'), /35%, 65% \{ transform: translateY\(-2px\); \}/)
  assert.match(css, /\.illustration-gesture \{\s*transform-box: fill-box;\s*transform-origin: center;/)
  assert.match(css, /\.sequence-illustration \.illustration-gesture\[data-gesture="main"\] \{ animation-duration: 650ms; \}/)
  const guarded = css.match(/@media \(hover: hover\) and \(prefers-reduced-motion: no-preference\) \{([\s\S]*?)\n\}/)?.[1]
  assert.ok(guarded)
  for (const host of ['sequence-illustration-host', 'esim-capability', 'esim-flow', 'sequence-illustration', 'esim-flow-illustration']) {
    assert.ok(guarded.includes('.' + host + ':hover .illustration-gesture'))
  }
  assert.match(guarded, /animation: var\(--illustration-gesture\) 550ms ease-in-out;/)
  assert.doesNotMatch(guarded, /infinite|forwards|animation-iteration-count/)
  assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{\s*\.illustration-gesture \{ animation: none; transform: none; \}/)
})

test('S3 whole-SVG edge glow covers both sizes and every host, independently of spatial motion', () => {
  assert.match(keyframe('illustration-flow-main'), /0%, 100% \{ transform: translateY\(0\); \}\s*35%, 65% \{ transform: translateY\(-4px\); \}/)
  assert.match(keyframe('illustration-flow-detail'), /0%, 100% \{ transform: translateX\(0\); \}\s*35%, 65% \{ transform: translateX\(5px\); \}/)
  const idle = css.match(/\.esim-flow-illustration\s*\{([^}]+)\}/)?.[1]
  assert.match(idle, /filter: drop-shadow\(0 8px 14px/)
  assert.doesNotMatch(idle, /0 0 3px|animation:|transition:/)
  const guarded = css.match(/@media \(hover: hover\) and \(prefers-reduced-motion: no-preference\) \{([\s\S]*?)\n\}/)?.[1]
  assert.match(guarded, /\.esim-flow-illustration \.illustration-gesture\[data-gesture="flow-main"\] \{ animation-duration: 650ms; \}/)
  const paint = css.slice(css.indexOf('/* Whole-scene hover light'))
  assert.match(paint, /^\/\* Whole-scene hover light[^]*?@media \(hover: hover\) \{/)
  for (const root of ['sequence-illustration', 'esim-flow-illustration']) {
    for (const host of ['sequence-illustration-host', 'esim-capability', 'esim-flow']) {
      assert.ok(paint.includes('.' + host + ':hover .' + root), host + ' / ' + root)
    }
    assert.ok(paint.includes('.' + root + ':hover'))
  }
  assert.match(paint, /transition: filter 200ms ease-out;/)
  assert.equal((paint.match(/drop-shadow\(0 0 8px color-mix\(in srgb, var\(--color-avala-cyan\) 55%, transparent\)\)/g) ?? []).length, 2)
  assert.match(paint, /filter: drop-shadow\(0 8px 14px[^;]+drop-shadow\(0 0 8px/)
  assert.match(css, /\.sequence-illustration,\s*\.esim-flow-illustration \{ transition: none; \}/)
  assert.doesNotMatch(paint.split('@media (prefers-reduced-motion: reduce)')[0], /animation:|transform:|no-preference/)
})
