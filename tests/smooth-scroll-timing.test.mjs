import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'
import { test } from 'node:test'

const key = Symbol.for('avala.scroll-timing-test')
const instances = globalThis[key] = []
const mock = `export default class Lenis {
  constructor(options) { this.options = options; this.calls = []; globalThis[Symbol.for('avala.scroll-timing-test')].push(this) }
  raf(time) { this.calls.push(['raf', time]) }
  stop() { this.calls.push(['stop']) }
  start() { this.calls.push(['start']) }
  destroy() { this.calls.push(['destroy']) }
  scrollTo(...args) { this.calls.push(['scrollTo', ...args]) }
}`
const hooks = registerHooks({
  resolve(specifier, context, next) {
    return specifier === 'lenis'
      ? { url: `data:text/javascript,${encodeURIComponent(mock)}`, shortCircuit: true }
      : next(specifier, context)
  },
})
const { startSmoothScroll, stopSmoothScroll, setScrollLocked, scrollToTarget, scrollToTop } =
  await import('../src/lib/smooth-scroll.ts')

test('quicker wheel smoothing preserves distance, lifecycle, locks and target timing', () => {
  let reduced = false
  let frame = 0
  const frames = new Map()
  const classes = []
  globalThis.window = { matchMedia: () => ({ matches: reduced }) }
  globalThis.document = { documentElement: { classList: { toggle: (...args) => classes.push(args) } } }
  globalThis.requestAnimationFrame = (callback) => { frames.set(++frame, callback); return frame }
  globalThis.cancelAnimationFrame = (id) => frames.delete(id)
  try {
    startSmoothScroll()
    startSmoothScroll()
    assert.equal(instances.length, 1)
    const instance = instances[0]
    assert.deepEqual(instance.options, { duration: 0.65, smoothWheel: true })
    assert.equal(instance.options.wheelMultiplier ?? 1, 1)
    assert.equal(instance.options.touchMultiplier ?? 1, 1)
    assert.equal(frames.size, 1)
    const callback = frames.get(frame)
    frames.delete(frame)
    callback(16)
    assert.deepEqual(instance.calls.splice(0), [['raf', 16]])
    assert.equal(frames.size, 1)
    setScrollLocked(true)
    setScrollLocked(false)
    assert.deepEqual(classes.splice(0), [['is-loading', true], ['is-loading', false]])
    assert.deepEqual(instance.calls.splice(0), [['stop'], ['start']])
    scrollToTarget('#contacto', 80)
    scrollToTarget(240)
    scrollToTop()
    assert.deepEqual(instance.calls.splice(0), [
      ['scrollTo', '#contacto', { duration: 1.6, offset: -80 }],
      ['scrollTo', 240, { duration: 1.6, offset: -0 }],
      ['scrollTo', 0, { immediate: true }],
    ])
    stopSmoothScroll()
    assert.equal(frames.size, 0)
    assert.deepEqual(instance.calls, [['destroy']])
    setScrollLocked(true)
    startSmoothScroll()
    assert.equal(instances.length, 2)
    assert.deepEqual(instances[1].calls, [['stop']])
    stopSmoothScroll()
    setScrollLocked(false)
    reduced = true
    startSmoothScroll()
    assert.equal(instances.length, 2)
    assert.equal(frames.size, 0)
  } finally {
    stopSmoothScroll()
    setScrollLocked(false)
    for (const name of ['window', 'document', 'requestAnimationFrame', 'cancelAnimationFrame']) delete globalThis[name]
    delete globalThis[key]
    hooks.deregister()
  }
})
