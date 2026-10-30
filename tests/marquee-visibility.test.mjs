import assert from 'node:assert/strict'
import { test } from 'node:test'
import { registerHooks } from 'node:module'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const boundary = { visible: false, reduced: false, paused: false, frames: [], values: [], cursor: 0, scrolls: 0 }
globalThis.__marqueeBoundary = boundary
registerHooks({
  resolve(specifier, context, next) {
    if (['motion/react', 'react', '@/features/home/data/content', '@/lib/utils'].includes(specifier) && context.parentURL?.includes('MarqueeSection')) {
      return { url: `marquee:${specifier}`, shortCircuit: true }
    }
    return next(specifier, context.parentURL?.startsWith('marquee:') ? { ...context, parentURL: import.meta.url } : context)
  },
  load(url, context, next) {
    const sources = {
      'marquee:react': `export { useRef } from 'react';
        export const useState = () => [globalThis.__marqueeBoundary.paused, fn => {
          globalThis.__marqueeBoundary.paused = fn(globalThis.__marqueeBoundary.paused)
        }];`,
      'marquee:@/lib/utils': 'export const cn = (...parts) => parts.filter(Boolean).join(" ");',
      'marquee:@/features/home/data/content': 'export const services = [{ title: "Servicio" }];',
      'marquee:motion/react': `import { createElement } from 'react';
        const b = globalThis.__marqueeBoundary;
        export const motion = { div: ({ children, ...props }) => createElement('div', props, children) };
        export const useInView = () => b.visible;
        export const useReducedMotion = () => b.reduced;
        export const useAnimationFrame = fn => b.frames.push(fn);
        const value = initial => ({ current: initial, writes: 0, get() { return this.current }, set(v) { this.current = v; this.writes++ } });
        export const useMotionValue = initial => b.values[b.cursor++] ??= value(initial);
        export const useScroll = () => { b.scrolls++; return { scrollY: value(0) } };
        export const useVelocity = () => value(0);
        export const useSpring = v => v;
        export const useTransform = () => value(0);
        export const useMotionValueEvent = () => {};`,
    }
    if (url in sources) return { format: 'module', source: sources[url], shortCircuit: true }
    return next(url, context)
  },
})
const { MarqueeSection } = await import('../src/features/home/sections/MarqueeSection.tsx')
function render() {
  boundary.cursor = 0
  boundary.frames = []
  boundary.scrolls = 0
  return renderToStaticMarkup(React.createElement(MarqueeSection))
}
function tick(delta = 16) { boundary.frames.forEach(fn => fn(1000, delta)) }
function writes() { return boundary.values.reduce((sum, v) => sum + v.writes, 0) }

test('both bands suspend offscreen, resume bounded motion, and preserve manual pause and static layout', () => {
  render()
  const initial = writes()
  tick()
  assert.equal(writes(), initial, 'offscreen frames must not update motion values')
  assert.equal(boundary.scrolls, 0, 'offscreen bands must not subscribe to scroll velocity')

  boundary.visible = true
  const visible = render()
  assert.match(visible, /Pausar animación/)
  tick()
  assert.equal(writes(), initial + 2, 'both visible bands advance')
  assert.equal(boundary.values[0].get(), -2.2 * 0.016)
  assert.equal(boundary.values[2].get(), 1.6 * 0.016)
  boundary.visible = false
  render()
  const offscreen = writes()
  tick(60000)
  assert.equal(writes(), offscreen)
  assert.equal(boundary.scrolls, 0)
  boundary.visible = true
  render()
  const before = boundary.values.map(v => v.get())
  tick(60000)
  assert.ok(boundary.values.every((v, i) => Math.abs(v.get() - before[i]) < 1), 'long resume delta is bounded')

  boundary.paused = true
  assert.match(render(), /Reanudar animación/)
  const paused = writes()
  tick()
  boundary.visible = false
  render()
  tick()
  boundary.visible = true
  assert.match(render(), /Reanudar animación/)
  tick()
  assert.equal(writes(), paused, 'manual pause survives exit and reentry')
  assert.equal(boundary.scrolls, 0, 'paused bands need no velocity subscriptions')

  boundary.paused = false
  render()
  tick()
  assert.equal(writes(), paused + 2)
  boundary.reduced = true
  const staticMarkup = render()
  const reduced = writes()
  tick()
  assert.equal(writes(), reduced)
  assert.equal(boundary.scrolls, 0)
  assert.doesNotMatch(staticMarkup, /Pausar animación|Reanudar animación/)
  assert.match(staticMarkup, /flex-wrap/)
  assert.equal((staticMarkup.match(/Servicio/g) ?? []).length, 1)
  assert.equal((staticMarkup.match(/Medellín/g) ?? []).length, 1)
})
