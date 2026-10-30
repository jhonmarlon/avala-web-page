import assert from 'node:assert/strict'
import { test } from 'node:test'
import { registerHooks } from 'node:module'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const b = { width: 1366, height: 720, reduced: false, states: [], cursor: 0, effects: [], refs: [], events: {}, frameHeight: 620, progress: 0 }
globalThis.__processBoundary = b
globalThis.window = {
  get innerWidth() { return b.width }, get innerHeight() { return b.height },
  addEventListener(name, fn) { b.events[name] = fn }, removeEventListener() {},
}
globalThis.document = { fonts: { addEventListener(name, fn) { b.events[name] = fn }, removeEventListener() {} } }
globalThis.ResizeObserver = class { observe() {} disconnect() {} }
registerHooks({
  resolve(specifier, context, next) {
    if (['react', 'motion/react', '@/lib/use-media-query', '@/lib/smooth-scroll', '@/components/fx/SectionLabel', '@/features/home/data/content'].includes(specifier) && context.parentURL?.includes('ProcessSection')) return { url: `process:${specifier}`, shortCircuit: true }
    return next(specifier, context.parentURL?.startsWith('process:') ? { ...context, parentURL: import.meta.url } : context)
  },
  load(url, context, next) {
    const sources = {
      'process:react': `const b = globalThis.__processBoundary;
        export const useRef = () => { const ref = { current: null }; b.refs.push(ref); return ref };
        export const useState = initial => { const i = b.cursor++; b.states[i] ??= initial; return [b.states[i], value => { b.states[i] = typeof value === 'function' ? value(b.states[i]) : value }]; };
        export const useEffect = fn => b.effects.push(fn);
        export const useLayoutEffect = fn => b.effects.push(fn);`,
      'process:@/lib/use-media-query': `export const useMediaQuery = query => query.includes('reduced-motion') ? globalThis.__processBoundary.reduced : globalThis.__processBoundary.width >= 1024 && (!query.includes('min-height') || globalThis.__processBoundary.height >= 768);`,
      'process:@/lib/smooth-scroll': 'export const prefersReducedMotion = () => globalThis.__processBoundary.reduced;',
      'process:@/components/fx/SectionLabel': `import { createElement } from 'react'; export const SectionLabel = () => createElement('h2', null, 'Proceso');`,
      'process:@/features/home/data/content': `export const processIntro = { title: 'Así trabajamos' }; export const processSteps = Array.from({ length: 5 }, (_, i) => ({ title: 'Stage ' + (i + 1), description: 'Description', Icon: () => null }));`,
      'process:motion/react': `import { createElement } from 'react'; const b = globalThis.__processBoundary;
        const component = tag => ({ children, initial, animate, transition, ...props }) => createElement(tag, props, children);
        export const motion = { div: component('div'), span: component('span') };
        export const useScroll = options => { b.offset = options.offset; return { scrollYProgress: b.progress } };
        export const useTransform = (value, fn) => fn(b.progress);
        export const useMotionValueEvent = (value, event, fn) => { b.onProgress = fn };`,
    }
    if (url in sources) return { format: 'module', source: sources[url], shortCircuit: true }
    return next(url, context)
  },
})
const { ProcessSection } = await import('../src/features/home/sections/ProcessSection.tsx')
function render() {
  b.cursor = 0; b.effects = []; b.refs = []
  return renderToStaticMarkup(React.createElement(ProcessSection))
}
function mount() {
  render()
  for (const ref of b.refs) ref.current = {
    dataset: { layout: 'horizontal' }, scrollWidth: b.width + 3000,
    getBoundingClientRect: () => ({ height: b.frameHeight }),
  }
  b.effects.forEach(fn => fn())
  return render()
}
function assertStages(markup) {
  assert.equal((markup.match(/<article /g) ?? []).length, 5)
  assert.equal((markup.match(/Así trabajamos/g) ?? []).length, 1)
}
test('compact desktop fits at 1366×720 and 1440×768, traverses through stage 05 with compact budget', () => {
  for (const [width, height] of [[1366, 720], [1440, 768]]) {
    Object.assign(b, { width, height, states: [], progress: 0, reduced: false })
    const markup = mount()
    assertStages(markup)
    assert.match(markup, /height:1970px/)
    assert.equal(b.offset[1], 'end 620px')
    b.progress = 1; b.onProgress(1)
    const end = render()
    assert.match(end, /05 \/ /)
    assert.match(end, /translateX\(-3000px\)|x:-3000/)
  }
})
test('short desktop falls back without zero height and can reenter on resize', () => {
  Object.assign(b, { width: 1366, height: 500, states: [], progress: 0, reduced: false })
  const markup = mount()
  assertStages(markup)
  assert.doesNotMatch(markup, /height:0|height:1970/)
  assert.equal(b.offset[1], 'end end')
  b.height = 720
  b.events.resize()
  const resized = render()
  assert.match(resized, /height:1970px/)
  assert.equal(b.offset[1], 'end 620px')
  b.frameHeight = 740
  b.events.loadingdone()
  assert.doesNotMatch(render(), /height:1970px/)
  assert.equal(b.offset[1], 'end end')
  b.frameHeight = 620
  b.events.loadingdone()
  assert.match(render(), /height:1970px/)
})
test('mobile and reactive reduced-motion retain five readable stages without pinning', () => {
  for (const [width, reduced] of [[800, false], [1366, true], [1366, false]]) {
    Object.assign(b, { width, height: 720, reduced, states: [] })
    const markup = mount()
    assertStages(markup)
    if (width < 1024 || reduced) {
      assert.doesNotMatch(markup, /height:1970/)
      assert.equal(b.offset[1], 'end end')
    } else assert.match(markup, /height:1970px/)
  }
})
