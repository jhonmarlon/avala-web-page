import assert from 'node:assert/strict'
import { test } from 'node:test'
import { registerHooks } from 'node:module'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

// A deterministic hook/geometry model, not browser layout or React commit proof.
const b = { width: 1366, height: 720, reduced: false, coreHeight: 620, wholeHeight: 4000, coreOffset: 600, progress: 0 }
globalThis.__processBoundary = b
const equalDeps = (a, c) => a && c && a.length === c.length && a.every((v, i) => Object.is(v, c[i]))
b.memo = (fn, deps) => {
  const i = b.cursor++, old = b.hooks[i]
  if (!old || !equalDeps(old.deps, deps)) b.hooks[i] = { deps, value: fn() }
  return b.hooks[i].value
}
b.effect = (fn, deps) => {
  const i = b.cursor++, old = b.hooks[i]
  if (!old || !equalDeps(old.deps, deps)) {
    b.effects.push(() => { old?.cleanup?.(); b.hooks[i].cleanup = fn() })
    b.hooks[i] = { deps }
  }
}
globalThis.window = {
  matchMedia: () => ({ matches: b.reduced }),
  get scrollY() { return b.scroll ?? 0 },
  scrollTo: options => { b.scrollCalls.push(options) },
  get innerWidth() { return b.width }, get innerHeight() { return b.height },
  addEventListener(name, fn) { (b.events[name] ??= new Set()).add(fn) },
  removeEventListener(name, fn) { b.events[name]?.delete(fn) },
}
globalThis.document = { fonts: { addEventListener: window.addEventListener, removeEventListener: window.removeEventListener } }
globalThis.requestAnimationFrame = fn => { const id = ++b.nextFrame; b.raf.set(id, fn); return id }
globalThis.cancelAnimationFrame = id => b.raf.delete(id)
globalThis.ResizeObserver = class {
  constructor(fn) { this.fn = fn; this.nodes = new Set(); b.observers.push(this) }
  observe(node) { this.nodes.add(node) }
  unobserve(node) { this.nodes.delete(node) }
  disconnect() { this.nodes.clear(); b.disconnected++ }
}
registerHooks({
  resolve(specifier, context, next) {
    if (specifier === 'motion/react' && ['/pages/EsimPage.tsx', '/icons/EsimFlowIllustration.tsx'].some(path => context.parentURL?.endsWith(path))) return { url: 'process:page-motion', shortCircuit: true }
    if (['react', 'motion/react', '@/lib/use-media-query', '@/components/fx/SectionLabel', '@/features/home/data/content'].includes(specifier) && /ProcessSection|NumberedStepSequence|PageScrollPinScope/.test(context.parentURL ?? '')) return { url: `process:${specifier}`, shortCircuit: true }
    if (specifier === '@/config/site' && context.parentURL?.includes('EsimPage')) return { url: 'process:site', shortCircuit: true }
    return next(specifier, context.parentURL?.startsWith('process:') ? { ...context, parentURL: import.meta.url } : context)
  },
  load(url, context, next) {
    const sources = {
      // Page entrances and animated product scenes read the fixture preference without real Motion listeners
      // to this sequence-only geometry model. Keep its rendered elements unchanged.
      'process:page-motion': `export { motion, MotionConfig } from 'motion/react'; export const useReducedMotion = () => globalThis.__processBoundary.reduced;`,
      'process:site': `export const esimExperienceLinks = { buy: 'https://siembradigital.avalashop.com/' };`,
      'process:react': `export * from 'react'; const b = globalThis.__processBoundary;
        export const useRef = initial => { const ref = b.memo(() => ({ current: initial }), []); b.refs.push(ref); return ref };
        export const useState = initial => { const i = b.cursor++; b.hooks[i] ??= { value: initial }; return [b.hooks[i].value, value => { b.hooks[i].value = typeof value === 'function' ? value(b.hooks[i].value) : value }]; };
        export const useMemo = (fn, deps) => b.memo(fn, deps);
        export const useCallback = (fn, deps) => b.memo(() => fn, deps);
        export const useEffect = (fn, deps) => b.effect(fn, deps);
        export const useLayoutEffect = (fn, deps) => b.effect(fn, deps);`,
      'process:@/lib/use-media-query': `export const useMediaQuery = query => query.includes('reduced-motion') ? globalThis.__processBoundary.reduced : globalThis.__processBoundary.width >= 1024;`,
      'process:@/components/fx/SectionLabel': `import { createElement } from 'react'; export const SectionLabel = ({ label }) => createElement('h2', null, label ?? 'Proceso');`,
      'process:@/features/home/data/content': `export const processIntro = { title: 'Así trabajamos' }; export const processSteps = Array.from({ length: 5 }, (_, i) => ({ title: 'Stage ' + (i + 1), description: 'Description', Icon: () => null }));`,
      'process:motion/react': `import { createElement } from 'react'; const b = globalThis.__processBoundary;
        const component = tag => ({ children, initial, animate, transition, ...props }) => createElement(tag, props, children);
        export const motion = { div: component('div'), span: component('span') };
        export const useScroll = options => { b.offsets.push(options.offset); b.targets.push(options.target); return { scrollYProgress: b.progress } };
        export const useTransform = (value, fn) => fn(b.progress);
        export const useMotionValueEvent = (value, event, fn) => { b.callbacks.push(fn) };`,
    }
    if (url in sources) return { format: 'module', source: sources[url], shortCircuit: true }
    return next(url, context)
  },
})
const { ProcessSection } = await import('../src/features/home/sections/ProcessSection.tsx')
const { EsimPage } = await import('../src/pages/EsimPage.tsx')
const { PageScrollPinScope } = await import('../src/components/ui/PageScrollPinScope.tsx')
const { MemoryRouter } = await import('react-router')
const scoped = () => React.createElement(React.Fragment, null,
  React.createElement('header', null, 'Site Header'),
  React.createElement(PageScrollPinScope, null, React.createElement('main', null, React.createElement(EsimPage)), React.createElement('footer', null, 'Site Footer')))
const scopedHome = () => React.createElement(PageScrollPinScope, null,
  React.createElement('main', null, React.createElement('section', { id: 'home-services' }, 'Services'), React.createElement(ProcessSection), React.createElement('section', { id: 'home-cases' }, 'Cases'), React.createElement('section', null, 'Products'), React.createElement('section', null, 'Final CTA')),
  React.createElement('footer', null, 'Site Footer'))
const { scrollToTarget } = await import('../src/lib/smooth-scroll.ts')
const both = () => React.createElement(React.Fragment, null, React.createElement(ProcessSection), React.createElement(scoped))
let subject = ProcessSection
function render() {
  b.cursor = 0; b.refs = []; b.effects = []; b.offsets = []; b.callbacks = []; b.targets = []
  return renderToStaticMarkup(React.createElement(MemoryRouter, null, React.createElement(subject)))
}
function cleanup() { b.hooks?.forEach(h => h.cleanup?.()) }
function mount(component = ProcessSection, overrides = {}) {
  cleanup()
  subject = component
  Object.assign(b, { width: 1366, height: 720, reduced: false, coreHeight: 620, wholeHeight: 4000, coreOffset: 600, progress: 0, hooks: [], events: {}, observers: [], disconnected: 0, raf: new Map(), nextFrame: 0, scroll: 0, scrollCalls: [], owned: new Set() }, overrides)
  render()
  const refs = b.refs
  const attachSequence = start => {
    const root = { getBoundingClientRect: () => ({ top: 700, height: b.coreHeight }) }
    const frame = { dataset: { layout: 'vertical' }, getBoundingClientRect() {
      assert.equal(this.dataset.layout, 'horizontal', 'measure same compact step DOM')
      return { top: 100 + Math.max(0, Math.min(1350, b.scroll - 700)) - b.scroll + b.coreOffset, height: b.coreHeight }
    } }
    const track = { contains: () => false, get scrollWidth() { return b.width + 3000 } }
    refs[start].current = root; refs[start + 1].current = track; refs[start + 2].current = frame
  }
  if (component === scoped || component === both || component === scopedHome) {
    const base = component === both ? 3 : 0
    if (base) attachSequence(0)
    refs[base].current = { getBoundingClientRect: () => ({ top: 100 - b.scroll, height: b.wholeHeight }) }
    refs[base + 1].current = { contains: node => b.owned.has(node), getBoundingClientRect: () => ({ top: 100 + Math.max(0, Math.min(1350, b.scroll - 700)) - b.scroll, height: b.wholeHeight }) }
    attachSequence(base + 5)
  } else attachSequence(0)
  b.effects.toReversed().forEach(fn => fn())
  return settle()
}
function settle() {
  for (const [id, fn] of [...b.raf]) { b.raf.delete(id); fn() }
  render()
  b.effects.forEach(fn => fn())
  return render()
}
function event(name) { for (const fn of b.events[name] ?? []) fn(); return settle() }
function tree(html) {
  const nodes = [], stack = []
  for (const match of html.matchAll(/<\/?([a-z][\w-]*)\b[^>]*>/g)) {
    if (match[0].startsWith('</')) { const node = stack.pop(); if (node) node.end = match.index + match[0].length }
    else {
      const node = { tag: match[1], attrs: match[0], start: match.index, parent: stack.at(-1) }
      nodes.push(node)
      if (!match[0].endsWith('/>') && !['input', 'img', 'br', 'hr', 'meta', 'link'].includes(node.tag)) stack.push(node)
      else node.end = match.index + match[0].length
    }
  }
  return nodes
}
function ancestor(node, predicate) {
  for (let parent = node.parent; parent; parent = parent.parent) if (predicate(parent)) return parent
}
for (const width of [375, 1366]) test(`eSIM ${width}px whole-page pin preserves every downstream boundary during forward, reverse and released document travel`, () => {
  mount(scoped, { width })
  const positions = [620 - 24, 660, 980, 1800, 2900, 3600]
  for (const progress of [0, 0.25, 0.5, 0.75, 1, 0.75, 0.25, 0]) {
    b.progress = progress; b.callbacks[0](progress)
    const html = render(), nodes = tree(html)
    const frame = nodes.find(n => n.attrs.includes('data-page-pin-frame'))
    const hud = nodes.find(n => n.attrs.includes('page-container hud-label flex'))
    const sections = ['Dos entradas, una experiencia segura', 'Elegí tu camino', 'Operación y trazabilidad', 'Para puntos de venta y aliados'].map(label => nodes.filter(n => n.tag === 'section' && html.slice(n.start, n.end).includes(label)).at(-1))
    const footer = nodes.find(n => n.tag === 'footer')
    const boundaries = [hud, ...sections, footer]
    for (const boundary of boundaries) assert.equal(ancestor(boundary, n => n === frame), frame)
    assert.equal(ancestor(nodes.find(n => n.tag === 'header'), n => n === frame), undefined, 'site Header stays outside')
    assert.equal(sections[0].parent, sections[1].parent, '02 and 03 are ordinary ordered siblings')
    assert.match(sections[0].attrs, /pb-12 lg:pb-20/)
    assert.match(html, /mt-12 pb-6 lg:pb-10/)
    assert.match(html, /height:5350px/)
    assert.match(frame.attrs, /position:sticky;top:-600px/)
    assert.deepEqual(b.offsets, [['start -600px', 'end 3400px']], 'one scope timeline; no second local reserve')
    assert.equal(b.targets.length, 1)
    const budget = Number(html.match(/height:(\d+)px/)[1]) - b.wholeHeight
    const start = 100 + b.coreOffset, end = start + budget
    assert.equal(start, 700); assert.equal(end, 2050)
    for (const scroll of [start + progress * budget, end + 100]) {
      const frameTop = Math.min(100 - scroll + budget, Math.max(100 - scroll, -b.coreOffset))
      for (let i = 0; i < boundaries.length; i++) for (let j = i + 1; j < boundaries.length; j++) {
        assert.equal((frameTop + positions[j]) - (frameTop + positions[i]), positions[j] - positions[i])
      }
      if (scroll === end + 100) assert.equal(frameTop, -700, 'entire frame releases after all 1350px')
    }
    if (progress === 1) { assert.match(html, /x:-3000/); assert.match(html, /04 \/ 04/) }
    assert.doesNotMatch(html, /min-height:|frame:flex-1|frame:min-h-\[/)
  }
})
test('scope resize/font changes use core fit, coalesce work, preserve stable registration and clean up', () => {
  mount(scoped)
  const registered = b.refs[2].current
  const root = b.refs[0]
  b.wholeHeight = 4500
  assert.match(event('resize'), /height:5850px/)
  assert.equal(b.refs[0], root)
  assert.equal(b.refs[2].current, registered)
  assert.equal(b.observers.length, 1)
  assert.equal(b.observers[0].nodes.size, 3)
  b.coreHeight = 740
  assert.doesNotMatch(event('loadingdone'), /height:5850px|position:sticky/)
  b.coreHeight = 620; b.coreOffset = 650
  assert.match(event('loadingdone'), /position:sticky;top:-650px/)
  for (const fn of b.events.resize) { fn(); fn(); fn() }
  assert.equal(b.raf.size, 1)
  cleanup()
  assert.equal(b.raf.size, 0)
  assert.equal(b.disconnected, 1)
  assert.ok(Object.values(b.events).every(set => set.size === 0))
  assert.equal(registered.frame.dataset.layout, 'vertical', 'temporary compact layout restored')
  assert.match(mount(ProcessSection), /height:1970px/, 'route exit leaves Home on its own local timeline')
})
test('eSIM reduced-motion and oversized core have no reserve; short core can reenter', () => {
  for (const overrides of [{ reduced: true }, { height: 500 }]) {
    const html = mount(scoped, overrides)
    assert.equal((html.match(/<article\b/g) ?? []).length, 4)
    assert.doesNotMatch(html, /height:5350px|position:sticky/)
    assert.equal((html.match(/Dos entradas, una experiencia segura/g) ?? []).length, 1)
    if (overrides.height) {
      b.height = 720
      assert.match(event('resize'), /height:5350px/)
    }
  }
})
test('Home and scoped eSIM keep separate progress, targets and observer lifetimes', () => {
  mount(both)
  assert.equal(b.targets.length, 2)
  assert.notEqual(b.targets[0], b.targets[1])
  assert.equal(b.callbacks.length, 2)
  const [home, esim] = b.callbacks
  home(1)
  assert.match(render(), /05 \/ 05/)
  assert.match(render(), /01 \/ 04/)
  esim(0.5)
  assert.match(render(), /05 \/ 05/)
  assert.match(render(), /03 \/ 04/)
  cleanup()
  assert.equal(b.disconnected, 2)
})
for (const width of [375, 1366]) test(`scoped Home ${width}px keeps all tail boundaries and five stages during full travel and release`, () => {
  mount(scopedHome, { width })
  const positions = [620, 1200, 2000, 2800, 3600]
  for (const progress of [0, 0.25, 0.5, 0.75, 1, 0.75, 0.25, 0]) {
    b.progress = progress; b.scroll = 700 + 1350 * progress; b.callbacks[0](progress)
    const html = render(), nodes = tree(html)
    const frame = nodes.find(n => n.attrs.includes('data-page-pin-frame'))
    for (const node of nodes.filter(n => n.tag === 'footer' || n.tag === 'section')) assert.equal(ancestor(node, n => n === frame), frame)
    assert.match(html, /id="home-process"[\s\S]*Continuar[\s\S]*Cases[\s\S]*Products[\s\S]*Final CTA[\s\S]*Site Footer/)
    assert.match(html, /height:5350px/)
    assert.match(frame.attrs, /position:sticky;top:-600px/)
    assert.deepEqual(b.offsets, [['start -600px', 'end 3400px']])
    const top = Math.min(100 - b.scroll + 1350, Math.max(100 - b.scroll, -600))
    assert.equal(top, -600)
    for (let i = 1; i < positions.length; i++) assert.equal((top + positions[i]) - (top + positions[i - 1]), positions[i] - positions[i - 1])
    assert.match(html, new RegExp(`x:${-progress * 3000}${progress === 0 ? '' : 'px'}(?:;|")`))
    if (progress === 1) assert.match(html, /05 \/ 05/)
    assert.deepEqual(b.scrollCalls, [], 'document progress never writes document Y')
  }
  b.scroll = 2150
  const releasedTop = Math.min(100 - b.scroll + 1350, Math.max(100 - b.scroll, -600))
  assert.equal(releasedTop, -700, 'all tail boundaries release together')
})
test('scope owns only normal frame anchors and unregisters on fallback, stage exit and unmount', () => {
  const native = []
  const makeTarget = natural => ({
    contains: () => false,
    getBoundingClientRect: () => ({ top: 100 + natural + Math.max(0, Math.min(1350, b.scroll - 700)) - b.scroll }),
    scrollIntoView: options => native.push(options),
  })
  const before = makeTarget(200), stage = makeTarget(600), after = makeTarget(1600), header = makeTarget(-100)
  const targets = new Map([['#home-services', before], ['#home-process', stage], ['#home-cases', after], ['#header', header]])
  document.querySelector = selector => targets.get(selector)
  document.getElementById = id => targets.get('#' + id)
  document.documentElement = {}
  globalThis.getComputedStyle = node => node === document.documentElement ? { scrollPaddingTop: '12px' } : { scrollMarginTop: '96px' }
  const own = () => { for (const node of [before, stage, after]) b.owned.add(node) }
  mount(scopedHome); own()
  for (const scroll of [0, 700, 1037.5, 1375, 1712.5, 2050, 2200, 1712.5, 700]) {
    b.scroll = scroll
    for (const [selector, natural, reserve] of [['#home-services', 200, 0], ['#home-process', 600, 0], ['#home-cases', 1600, 1350]]) {
      scrollToTarget(selector, 88)
      assert.deepEqual(b.scrollCalls.pop(), { top: 100 + natural + reserve - 96 - 12, behavior: 'smooth' })
    }
  }
  scrollToTarget('#header', 88)
  assert.deepEqual(native.pop(), { behavior: 'smooth' })
  b.width = 375; event('resize')
  scrollToTarget('#home-cases', 88)
  assert.equal(b.scrollCalls.pop().top, 2942, 'mobile uses the same full-budget resolver')
  b.coreHeight = 740; event('resize')
  scrollToTarget('#home-cases', 88)
  assert.deepEqual(native.pop(), { behavior: 'smooth' })
  b.coreHeight = 620; event('resize')
  b.scroll = 1375; scrollToTarget('#home-cases', 88)
  assert.equal(b.scrollCalls.pop().top, 2942)
  cleanup(); scrollToTarget('#home-cases')
  assert.deepEqual(native.pop(), { behavior: 'smooth' })
  for (const overrides of [{ reduced: true }, { height: 500 }, { width: 375, coreHeight: 740 }]) {
    mount(scopedHome, overrides); own(); scrollToTarget('#home-cases', 88)
    assert.deepEqual(native.pop(), { behavior: overrides.reduced ? 'instant' : 'smooth' })
  }
  mount(ProcessSection); scrollToTarget('#home-process')
  assert.deepEqual(native.pop(), { behavior: 'smooth' })
})
test('Home keeps original five-step local pin, 620px frame, 1970px root and continue link', () => {
  for (const [width, height] of [[1366, 720], [1440, 768]]) {
    const html = mount(ProcessSection, { width, height })
    assert.equal((html.match(/<article /g) ?? []).length, 5)
    assert.match(html, /height:1970px/)
    assert.match(html, /Continuar/)
    assert.ok(html.includes('group-data-[layout=horizontal]/frame:min-h-[clamp(24rem,50vh,30rem)]'))
    assert.doesNotMatch(html, /data-page-pin|frame:mt-4/)
    assert.deepEqual(b.offsets, [['start start', 'end 620px']])
    b.progress = 1; b.callbacks[0](1)
    assert.match(render(), /05 \/ 05/)
    assert.match(render(), /x:-3000/)
  }
})
test('fitting mobile registers the same whole-page document timeline, never writes page position and crosses desktop threshold both ways', () => {
  for (const [component, count] of [[scopedHome, 5], [scoped, 4]]) {
    for (const width of [320, 375, 390, 768, 1023, 1024]) {
      const html = mount(component, { width })
      assert.equal((html.match(/<article\b/g) ?? []).length, count)
      assert.match(html, /height:5350px/)
      assert.match(html, /position:sticky;top:-600px/)
      assert.match(html, /data-layout="horizontal"/)
      assert.ok(b.refs[2].current, 'same measurable core registered on mobile')
      assert.equal(b.observers[0].nodes.size, 3)
      assert.deepEqual(b.offsets, [['start -600px', 'end 3400px']])
      assert.deepEqual(b.scrollCalls, [])
    }
    for (const width of [375, 1024, 390]) {
      b.width = width
      assert.match(event('resize'), /height:5350px/)
      assert.equal(b.observers.length, 1)
      assert.deepEqual(b.scrollCalls, [])
    }
    cleanup()
    assert.ok(Object.values(b.events).every(set => set.size === 0))
  }
})
test('mobile reduced/oversized fallback retains measurable native row and reenters after fonts, resize and preference changes', () => {
  for (const component of [scopedHome, scoped]) {
    for (const overrides of [{ reduced: true }, { coreHeight: 740 }, { height: 500 }]) {
      let html = mount(component, { width: 375, ...overrides })
      assert.match(html, /data-layout="native"/)
      assert.match(html, /data-lenis-prevent="true"/)
      assert.match(html, /Deslizá horizontalmente/)
      assert.doesNotMatch(html, /height:5350px|position:sticky/)
      const stage = b.refs[7], track = b.refs[6]
      assert.ok(stage.current); assert.ok(track.current)
      b.reduced = false; b.coreHeight = 620; b.height = 720
      event('loadingdone'); html = settle()
      assert.match(html, /height:5350px/)
      assert.equal(b.refs[7], stage); assert.equal(b.refs[6], track)
      b.coreHeight = 720
      assert.match(event('resize'), /height:5350px/, 'exact viewport height still fits')
      b.coreHeight = 721
      assert.match(event('resize'), /data-layout="native"/, 'one pixel oversized must fall back')
      b.coreHeight = 620
      assert.match(event('loadingdone'), /height:5350px/)
      b.reduced = true
      html = event('resize')
      assert.doesNotMatch(html, /height:5350px|position:sticky/)
      assert.equal(b.refs[2].current, null, 'reduced motion unregisters')
      assert.deepEqual(b.scrollCalls, [])
    }
  }
})
test('Home short-height and font fallback can reenter; mobile/reduced retain readable stages', () => {
  assert.doesNotMatch(mount(ProcessSection, { height: 500 }), /height:1970/)
  b.height = 720
  assert.match(event('resize'), /height:1970/)
  b.coreHeight = 740
  assert.doesNotMatch(event('loadingdone'), /height:1970/)
  b.coreHeight = 620
  assert.match(event('loadingdone'), /height:1970/)
  for (const overrides of [{ reduced: true }]) {
    const html = mount(ProcessSection, overrides)
    assert.equal((html.match(/<article /g) ?? []).length, 5)
    assert.doesNotMatch(html, /height:1970/)
  }
})
