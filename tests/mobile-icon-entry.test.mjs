import assert from 'node:assert/strict'
import { test } from 'node:test'
import { registerHooks } from 'node:module'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { readProjectStyles } from './style-source.mjs'

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'entry:jsx' || (specifier === 'react/jsx-runtime' && /\/icons\/(IllustrationSvg|ProcessStageIcon)\.tsx$/.test(context.parentURL ?? ''))) {
      return { url: new URL('./entry-jsx.mjs', import.meta.url).href, shortCircuit: true }
    }
    if (specifier === 'entry:motion' || (specifier === 'motion/react' && context.parentURL?.endsWith('/icons/ProcessStageIcon.tsx'))) {
      return { url: new URL('./entry-motion.mjs', import.meta.url).href, shortCircuit: true }
    }
    return nextResolve(specifier, context)
  },
  load(url, context, nextLoad) {
    if (url.endsWith('/entry-jsx.mjs')) return { format: 'module', shortCircuit: true, source: `
      import * as runtime from ${JSON.stringify(import.meta.resolve('react/jsx-runtime'))};
      export const roots = [];
      export const Fragment = runtime.Fragment;
      const capture = fn => (tag, props, ...rest) => {
        if (tag === 'svg' || props?.className === 'process-stage-icon') roots.push(props);
        return fn(tag, props, ...rest);
      };
      export const jsx = capture(runtime.jsx), jsxs = capture(runtime.jsxs);` }
    if (url.endsWith('/entry-motion.mjs')) return { format: 'module', shortCircuit: true, source: `
      import { createElement } from 'react';
      export const animations = [];
      export const glyphs = [];
      export const useReducedMotion = () => false;
      export function animate(node, gesture, options) {
        const call = { node, gesture, options, stopped: false };
        animations.push(call);
        return { stop() { call.stopped = true }, then(complete) { call.complete = complete; return Promise.resolve() } };
      }
      export const motion = { span: ({ initial, variants, transition, ...props }) => { glyphs.push(variants); return createElement('span', props) } };` }
    return nextLoad(url, context)
  },
})
const { IllustrationSvg } = await import('../src/components/icons/IllustrationSvg.tsx')
const { ProcessStageIcon } = await import('../src/components/icons/ProcessStageIcon.tsx')
const { roots } = await import('entry:jsx')
const { animations, glyphs } = await import('entry:motion')

function environment({ mobile = true, reduced = false, observer = true } = {}) {
  const previousWindow = globalThis.window
  const previousObserver = globalThis.IntersectionObserver
  const previousMutation = globalThis.MutationObserver
  const previousDocument = globalThis.document
  const root = { loading: false, classList: { contains(name) { assert.equal(name, 'is-loading'); return root.loading } } }
  globalThis.document = { documentElement: root }
  const mutations = []
  globalThis.MutationObserver = class {
    constructor(callback) { this.callback = callback; this.disconnected = false; mutations.push(this) }
    observe() {}
    disconnect() { this.disconnected = true }
  }
  const lists = new Map()
  const observers = []
  globalThis.window = { getComputedStyle(node) { return { opacity: node.opacity ?? '1', display: 'block', visibility: 'visible' } }, matchMedia(query) {
    if (!lists.has(query)) lists.set(query, {
      matches: query.includes('prefers-reduced-motion') ? !reduced : mobile,
      listeners: new Set(),
      addEventListener(_, listener) { this.listeners.add(listener) },
      removeEventListener(_, listener) { this.listeners.delete(listener) },
      change(value) { this.matches = value; for (const listener of this.listeners) listener() },
    })
    return lists.get(query)
  } }
  globalThis.IntersectionObserver = observer ? class {
    constructor(callback, options) { this.callback = callback; this.options = options; this.disconnected = false; observers.push(this) }
    observe(node) { this.node = node }
    disconnect() { this.disconnected = true }
    enter(ratio = 0.5, overrides = {}) { this.callback([{ target: this.node, isIntersecting: true, intersectionRatio: ratio, ...overrides }]) }
  } : undefined
  return { lists, observers, mutations, root, restore() {
    globalThis.window = previousWindow; globalThis.IntersectionObserver = previousObserver
    globalThis.MutationObserver = previousMutation; globalThis.document = previousDocument
  } }
}
function render(Component = IllustrationSvg, props = {}) {
  roots.length = 0
  renderToStaticMarkup(createElement(Component, props))
  return roots[0]
}
function node() {
  const glyph = {}
  return { dataset: {}, isConnected: true, visible: true, listeners: new Map(),
    addEventListener(name, listener) { this.listeners.set(name, listener) },
    removeEventListener(name) { this.listeners.delete(name) },
    setAttribute(name, value) { assert.equal(name, 'data-mobile-icon-entry'); this.dataset.mobileIconEntry = value },
    removeAttribute(name) { assert.equal(name, 'data-mobile-icon-entry'); delete this.dataset.mobileIconEntry },
    checkVisibility() { return this.visible }, querySelector() { return glyph } }
}

test('public illustration ref consumes each visit at half visibility and retains it across ref reattachment', () => {
  const env = environment()
  try {
    const forwarded = { current: null }
    const props = render(IllustrationSvg, { ref: forwarded })
    const target = node()
    const cleanup = props.ref(target)
    assert.equal(forwarded.current, target)
    const io = env.observers[0]
    assert.deepEqual(io.options, { threshold: [0, 0.5] })
    io.enter(0.49)
    io.enter(0.9, { isIntersecting: false })
    assert.equal(target.dataset.mobileIconEntry, undefined)
    target.visible = false
    io.enter()
    assert.equal(target.dataset.mobileIconEntry, undefined)
    target.visible = true
    io.enter()
    assert.equal(target.dataset.mobileIconEntry, 'active')
    assert.equal(io.disconnected, false, 'keep watching for a genuine exit')
    target.listeners.get('animationend')({ animationName: 'illustration-main' })
    for (const ratio of [1, 0.49, 0.5, 0.1, 0.5]) io.enter(ratio)
    assert.equal(target.dataset.mobileIconEntry, undefined, 'continuous visibility and threshold jitter cannot replay')
    cleanup()
    assert.equal(forwarded.current, null)
    const cleanupAgain = props.ref(target)
    assert.equal(env.observers.length, 2, 'reattachment resumes observation without inventing a viewport exit')
    io.enter(0, { isIntersecting: false })
    env.observers.at(-1).enter()
    assert.deepEqual(target.dataset, {}, 'ref churn is not a new viewport visit; detached IO callbacks are ignored')
    env.observers.at(-1).enter(0)
    env.observers.at(-1).enter()
    assert.equal(target.dataset.mobileIconEntry, 'active')
    cleanupAgain()
  } finally { env.restore() }
})

for (const options of [{ mobile: false }, { reduced: true }, { observer: false }]) {
  test(`public illustration ref has no autoplay for ${JSON.stringify(options)}`, () => {
    const env = environment(options)
    try {
      const target = node()
      const cleanup = render().ref(target)
      assert.equal(env.observers.length, 0)
      assert.deepEqual(target.dataset, {})
      cleanup()
      assert.ok([...env.lists.values()].every(list => list.listeners.size === 0))
    } finally { env.restore() }
  })
}

test('preference changes cancel motion; cleanup and detached callbacks cannot start or replay it', () => {
  const env = environment()
  try {
    const target = node()
    const cleanup = render().ref(target)
    const io = env.observers[0]
    target.isConnected = false
    io.enter()
    assert.deepEqual(target.dataset, {})
    target.isConnected = true
    io.enter()
    assert.equal(target.dataset.mobileIconEntry, 'active')
    const preference = [...env.lists.entries()].find(([query]) => query.includes('prefers-reduced-motion'))[1]
    preference.change(false)
    assert.deepEqual(target.dataset, {})
    preference.change(true)
    io.enter()
    assert.deepEqual(target.dataset, {})
    cleanup()
    io.enter()
    assert.deepEqual(target.dataset, {})
    assert.ok([...env.lists.values()].every(list => list.listeners.size === 0))
    const other = node()
    const dispose = render().ref(other)
    const late = env.observers.at(-1)
    dispose()
    late.enter()
    assert.deepEqual(other.dataset, {})
  } finally { env.restore() }
})

test('pre-entry device and preference changes gate observation without consuming unseen artwork', () => {
  const env = environment({ mobile: false })
  try {
    const target = node()
    const dispose = render().ref(target)
    const device = [...env.lists.entries()].find(([query]) => !query.includes('prefers-reduced-motion'))[1]
    device.change(true)
    assert.equal(env.observers.length, 1)
    device.change(false)
    env.observers[0].enter()
    assert.deepEqual(target.dataset, {})
    device.change(true)
    env.observers.at(-1).enter()
    assert.equal(target.dataset.mobileIconEntry, 'active')
    dispose()
  } finally { env.restore() }
})

test('SSR and absent matchMedia are safe no-ops through the public ref', () => {
  const previous = globalThis.window
  try {
    for (const value of [undefined, {}]) {
      globalThis.window = value
      const target = node()
      const dispose = render().ref(target)
      assert.deepEqual(target.dataset, {})
      dispose()
    }
  } finally { globalThis.window = previous }
})

test('all five About glyphs reuse finite hover curves on entry, with still frames and bounded stagger', () => {
  const env = environment()
  try {
    animations.length = 0
    const cleanups = []
    for (let stage = 1; stage <= 5; stage++) {
      const props = render(ProcessStageIcon, { stage: String(stage), Icon: () => null })
      const target = node()
      cleanups.push(props.ref(target))
      assert.equal(animations.length, stage - 1, 'no mount autoplay')
      env.observers.at(-1).enter()
      const call = animations.at(-1)
      assert.equal(call.node, target.querySelector())
      assert.equal(call.options.duration, 0.8)
      assert.ok(call.options.delay >= 0 && call.options.delay <= 0.12)
      assert.equal(call.options.repeat, undefined)
      const { transition, ...hoverGesture } = glyphs.at(-1)['icon-hover']
      assert.equal(transition.duration, call.options.duration)
      assert.deepEqual(call.gesture, hoverGesture, 'entry uses the exact existing hover preset')
      for (const values of Object.values(call.gesture)) {
        assert.ok(Array.isArray(values))
        assert.equal(values[0], values.at(-1), 'finite glyph returns to rest')
      }
      env.observers.at(-1).enter()
      assert.equal(animations.length, stage)
    }
    assert.equal(new Set(animations.map(call => JSON.stringify(call.gesture))).size, 5)
    const preference = [...env.lists.entries()].find(([query]) => query.includes('prefers-reduced-motion'))[1]
    preference.change(false)
    assert.ok(animations.slice(0, 5).every(call => call.stopped))
    for (const call of animations.slice(5)) {
      assert.deepEqual(call.gesture, { x: 0, y: 0, rotate: 0, scaleX: 1, scaleY: 1 })
      assert.equal(call.options.duration, 0)
    }
    for (const cleanup of cleanups) cleanup()
  } finally { env.restore() }
})

test('finite completion leaves idle but retains visit observation until unmount', () => {
  const env = environment()
  try {
    for (const Component of [IllustrationSvg, ProcessStageIcon]) {
      const target = node()
      const dispose = render(Component, Component === ProcessStageIcon ? { stage: '1', Icon: () => null } : {}).ref(target)
      assert.equal(env.mutations.length, 0, 'visible artwork needs no mutation observer')
      env.observers.at(-1).enter()
      if (Component === IllustrationSvg) {
        target.listeners.get('animationend')({ animationName: 'illustration-lift' })
        assert.equal(target.dataset.mobileIconEntry, 'active', 'detail completion cannot cut the longer main gesture short')
        assert.ok([...env.lists.values()].some(list => list.listeners.size > 0), 'mid-main preference cancellation remains available')
        target.listeners.get('animationend')({ animationName: 'illustration-main' })
      } else animations.at(-1).complete()
      assert.deepEqual(target.dataset, {})
      assert.equal(target.listeners.size, 0)
      assert.ok([...env.lists.values()].every(list => list.listeners.size === 1), 'mounted visits still follow eligibility changes')
      assert.equal(env.observers.at(-1).disconnected, false)
      dispose()
      dispose()
      if (Component === ProcessStageIcon) animations.at(-1).complete()
      assert.ok([...env.lists.values()].every(list => list.listeners.size === 0))
    }
  } finally { env.restore() }
})

test('callback refs retain their cleanup contract', () => {
  const env = environment()
  try {
    let calls = 0
    let cleaned = 0
    const dispose = render(IllustrationSvg, { ref: target => { assert.ok(target); calls++; return () => { cleaned++ } } }).ref(node())
    assert.equal(calls, 1)
    dispose()
    dispose()
    assert.equal(calls, 1, 'callback cleanup replaces a null ref callback')
    assert.equal(cleaned, 1)
  } finally { env.restore() }
})

test('preloader readiness and ancestor opacity defer consumption until artwork is meaningfully visible', () => {
  const env = environment()
  try {
    env.root.loading = true
    const target = node()
    target.parentElement = { opacity: '0', parentElement: null }
    const dispose = render().ref(target)
    const io = env.observers[0]
    io.enter()
    assert.deepEqual(target.dataset, {}, 'preloader geometry is not a visible entry')
    env.root.loading = false
    for (const mutation of env.mutations) mutation.callback()
    assert.deepEqual(target.dataset, {}, 'transparent entrance is not consumed')
    target.parentElement.opacity = '0.5'
    for (const mutation of env.mutations) mutation.callback()
    assert.deepEqual(target.dataset, {})
    target.parentElement.opacity = '1'
    for (const mutation of env.mutations) mutation.callback()
    assert.equal(target.dataset.mobileIconEntry, 'active', 'retry existing entry after readiness, without scrolling again')
    assert.ok(env.mutations.every(mutation => mutation.disconnected))
    dispose()
    delete target.dataset.mobileIconEntry
    for (const mutation of env.mutations) mutation.callback()
    assert.deepEqual(target.dataset, {})
  } finally { env.restore() }
})

test('mobile gestures replay after multiple full exits, never on duplicates or threshold jitter', () => {
  const env = environment()
  try {
    const target = node()
    const dispose = render().ref(target)
    const io = env.observers.at(-1)
    for (let visit = 0; visit < 3; visit++) {
      io.enter(0.49)
      assert.deepEqual(target.dataset, {})
      io.enter()
      assert.equal(target.dataset.mobileIconEntry, 'active', `visit ${visit + 1}`)
      target.listeners.get('animationend')({ animationName: 'illustration-main' })
      for (const ratio of [1, 0.49, 0.5, 0.01, 0.5]) io.enter(ratio)
      assert.deepEqual(target.dataset, {})
      io.enter(0, { isIntersecting: visit % 2 === 0 })
    }
    dispose()
    io.enter()
    assert.deepEqual(target.dataset, {})
  } finally { env.restore() }
})

test('exit mid-glyph resets the gesture and stale completion cannot terminate the next visit', () => {
  const env = environment()
  try {
    animations.length = 0
    const target = node()
    const dispose = render(ProcessStageIcon, { stage: '4', Icon: () => null }).ref(target)
    const io = env.observers.at(-1)
    io.enter()
    const first = animations.at(-1)
    io.enter(0, { isIntersecting: false })
    assert.equal(first.stopped, true)
    assert.deepEqual(animations.at(-1).gesture, { x: 0, y: 0, rotate: 0, scaleX: 1, scaleY: 1 })
    assert.equal(animations.at(-1).options.duration, 0)
    io.enter()
    const second = animations.at(-1)
    assert.deepEqual(second.gesture, first.gesture)
    assert.notEqual(second, first)
    first.complete()
    const preference = [...env.lists.entries()].find(([query]) => query.includes('prefers-reduced-motion'))[1]
    preference.change(false)
    assert.equal(second.stopped, true, 'old completion must not erase current cancellation')
    preference.change(true)
    const count = animations.length
    io.enter()
    assert.equal(animations.length, count, 'preference changes alone cannot re-arm a consumed visit')
    io.enter(0)
    io.enter()
    assert.equal(animations.length, count + 1)
    dispose()
    const afterCleanup = animations.length
    second.complete()
    io.enter(0)
    io.enter()
    assert.equal(animations.length, afterCleanup)
  } finally { env.restore() }
})

test('each returning visit waits for preloader and ancestor visibility, and exiting cancels its pending retry', () => {
  const env = environment()
  try {
    const target = node()
    target.parentElement = { opacity: '1', parentElement: null }
    const dispose = render().ref(target)
    const io = env.observers.at(-1)
    io.enter()
    const oldEnd = target.listeners.get('animationend')
    io.enter(0)
    assert.deepEqual(target.dataset, {}, 'CSS gesture cancels on full exit')
    env.root.loading = true
    target.parentElement.opacity = '0'
    io.enter()
    assert.deepEqual(target.dataset, {})
    const pending = env.mutations.at(-1)
    env.root.loading = false
    pending.callback()
    assert.deepEqual(target.dataset, {})
    io.enter(0)
    assert.equal(pending.disconnected, true)
    target.parentElement.opacity = '1'
    pending.callback()
    assert.deepEqual(target.dataset, {}, 'a late visibility retry cannot play offscreen')
    io.enter()
    assert.equal(target.dataset.mobileIconEntry, 'active')
    oldEnd({ animationName: 'illustration-main' })
    assert.equal(target.dataset.mobileIconEntry, 'active', 'stale CSS completion cannot finish a later visit')
    dispose()
    assert.equal(io.disconnected, true)
    pending.callback()
    assert.deepEqual(target.dataset, {})
    assert.ok([...env.lists.values()].every(list => list.listeners.size === 0))
  } finally { env.restore() }
})

test('desktop pointer changes cancel motion, never replay onscreen, and permit a later mobile visit', () => {
  const env = environment()
  try {
    const target = node()
    const dispose = render().ref(target)
    const io = env.observers.at(-1)
    const device = [...env.lists.entries()].find(([query]) => !query.includes('prefers-reduced-motion'))[1]
    io.enter()
    device.change(false)
    assert.deepEqual(target.dataset, {})
    io.enter(0)
    io.enter()
    assert.deepEqual(target.dataset, {}, 'desktop cannot autoplay even after an exit')
    device.change(true)
    assert.equal(target.dataset.mobileIconEntry, 'active', 'an unconsumed mobile visit can start when eligible')
    device.change(false)
    device.change(true)
    assert.deepEqual(target.dataset, {}, 'changing pointer eligibility does not reset a consumed visit')
    io.enter(0)
    io.enter()
    assert.equal(target.dataset.mobileIconEntry, 'active')
    dispose()
  } finally { env.restore() }
})

test('mobile CSS reuses the finite curves, independent of desktop hover and with no fill or loop', () => {
  const css = readProjectStyles()
  const mobile = css.match(/@media \(hover: none\) and \(pointer: coarse\) and \(prefers-reduced-motion: no-preference\) \{([\s\S]*?)\n\}/)?.[1]
  assert.ok(mobile)
  assert.match(mobile, /\[data-mobile-icon-entry="active"\] \.illustration-gesture/)
  assert.match(mobile, /animation: var\(--illustration-gesture\) 550ms ease-in-out/)
  assert.match(mobile, /animation-duration: 650ms/)
  assert.match(mobile, /animation-delay: 60ms/)
  assert.doesNotMatch(mobile, /infinite|forwards|:hover/)
})
