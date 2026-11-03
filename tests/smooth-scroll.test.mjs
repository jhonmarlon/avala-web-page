import assert from 'node:assert/strict'
import { test } from 'node:test'
import { registerHooks } from 'node:module'

const calls = []
let reduced = false
let scroll = 0
const nodes = new Map()
globalThis.__lenisAnchor = { calls, get scroll() { return scroll } }
registerHooks({
  resolve(specifier, context, next) {
    if (specifier === 'lenis' && context.parentURL?.endsWith('/smooth-scroll.ts')) return { url: 'anchor:lenis', shortCircuit: true }
    return next(specifier, context)
  },
  load(url, context, next) {
    if (url !== 'anchor:lenis') return next(url, context)
    // Installed Lenis 1.3.27: selector rect + animatedScroll - CSS margin/padding + offset.
    return { format: 'module', shortCircuit: true, source: `export default class {
      raf() {} destroy() {} stop() {} start() {}
      scrollTo(target, options) {
        const original = target;
        if (typeof target === 'string') {
          const node = target.startsWith('#') ? document.getElementById(target.slice(1)) : document.querySelector(target);
          const margin = parseFloat(getComputedStyle(node).scrollMarginTop);
          const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
          target = node.getBoundingClientRect().top + globalThis.__lenisAnchor.scroll - (Number.isNaN(margin) ? 0 : margin) - (Number.isNaN(padding) ? 0 : padding);
        }
        globalThis.__lenisAnchor.calls.push({ original, options, destination: target + (options.offset ?? 0) });
      }
    }` }
  },
})
const api = await import('../src/lib/smooth-scroll.ts')
function setup() {
  calls.length = 0; nodes.clear(); reduced = false; scroll = 0
  globalThis.window = { matchMedia: () => ({ matches: reduced }), get scrollY() { return scroll }, scrollTo: value => calls.push(value) }
  globalThis.document = { documentElement: {}, getElementById: id => nodes.get('#' + id), querySelector: selector => nodes.get(selector) }
  globalThis.getComputedStyle = node => node === document.documentElement ? { scrollPaddingTop: '12px' } : { scrollMarginTop: '96px' }
  globalThis.requestAnimationFrame = () => 1
  globalThis.cancelAnimationFrame = () => {}
}
function node(selector, natural) {
  const value = { natural, getBoundingClientRect: () => ({ top: natural + translation - scroll }), scrollIntoView: options => calls.push(options) }
  nodes.set(selector, value)
  return value
}
let translation = 0

test('public scoped anchors preserve Lenis CSS and caller offsets across pin travel and stale cleanup', () => {
  setup(); api.startSmoothScroll()
  const before = node('#before', 300), stage = node('#home-process', 700), after = node('#home-cases', 2400)
  const outside = node('#header', 20)
  const budget = 1350
  const release = api.registerScrollTargetResolver(target => target === outside ? undefined : (target === after ? budget : 0) - translation)
  try {
    for (const progress of [0, .25, .5, .75, 1, 1, .75, 0]) {
      translation = progress * budget; scroll = 700 + translation
      for (const target of [before, stage, after]) {
        const selector = [...nodes].find(([, n]) => n === target)[0]
        api.scrollToTarget(selector, 88)
        assert.deepEqual(calls.pop(), { original: selector, options: { duration: 1.6, offset: (target === after ? budget : 0) - translation - 88 }, destination: target.natural + (target === after ? budget : 0) - 96 - 12 - 88 })
      }
    }
    api.scrollToTarget('#header', 88)
    assert.equal(calls.pop().options.offset, -88)
    api.scrollToTarget(1234, 88)
    assert.deepEqual(calls.pop(), { original: 1234, options: { duration: 1.6, offset: -88 }, destination: 1146 })
    const newer = api.registerScrollTargetResolver(() => 42)
    release(); api.scrollToTarget('#home-process', 8)
    assert.equal(calls.pop().options.offset, 34, 'old cleanup cannot remove newer registration')
    newer(); api.scrollToTarget('#home-process', 8)
    assert.equal(calls.pop().options.offset, -8)
    const same = () => 21
    const oldSame = api.registerScrollTargetResolver(same)
    const newSame = api.registerScrollTargetResolver(same)
    oldSame(); api.scrollToTarget('#home-process', 8)
    assert.equal(calls.pop().options.offset, 13)
    newSame()
  } finally { release(); api.stopSmoothScroll() }
})

test('active native anchors retain CSS margin/padding but ignore caller offset, as legacy native does', () => {
  setup(); translation = 675; scroll = 1375
  node('#home-cases', 2400)
  const release = api.registerScrollTargetResolver(() => 675)
  try {
    api.scrollToTarget('#home-cases', 88)
    assert.deepEqual(calls.pop(), { top: 2400 + 1350 - 96 - 12, behavior: 'smooth' })
  } finally { release() }
  api.scrollToTarget('#home-cases', 88)
  assert.deepEqual(calls.pop(), { behavior: 'smooth' })
})

test('unscoped native targets retain reduced motion, numeric and scroll-to-top behavior', () => {
  setup(); node('#contacto', 100)
  reduced = true
  api.scrollToTarget(120); api.scrollToTarget('#contacto')
  assert.deepEqual(calls.splice(0), [{ top: 120, behavior: 'instant' }, { behavior: 'instant' }])
  reduced = false
  api.scrollToTarget(240); api.scrollToTarget('#contacto')
  assert.deepEqual(calls.splice(0), [{ top: 240, behavior: 'smooth' }, { behavior: 'smooth' }])
  api.scrollToTop()
  assert.deepEqual(calls, [{ top: 0, left: 0, behavior: 'auto' }])
})
