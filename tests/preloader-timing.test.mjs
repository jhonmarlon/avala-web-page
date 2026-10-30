import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'
import { test } from 'node:test'

const key = Symbol.for('avala.preloader-test')
const hooks = registerHooks({
  load(url, context, next) {
    return url.startsWith('data:text/javascript,') ? { format: 'module', source: decodeURIComponent(url.split(',')[1]), shortCircuit: true } : next(url, context)
  },
  resolve(specifier, context, next) {
    const sources = {
      'react/jsx-runtime': 'export const jsx = (type, props) => ({ type, props }); export const jsxs = jsx;',
      react: `const h = () => globalThis[Symbol.for('avala.preloader-test')]; export const useState = v => h().state(v); export const useRef = v => h().ref(v); export const useEffect = (f,d) => h().effect(f,d);`,
      'motion/react': 'export const motion = { div: "motion.div" }; export const useReducedMotion = () => window.matchMedia().matches;',
      '@/assets/avala_logo.png': 'export default "logo.png";',
      '@/config/site': 'export const companyInfo = { address: "Address" };',
      '@/lib/smooth-scroll': `export const setScrollLocked = v => globalThis[Symbol.for('avala.preloader-test')].locks.push(v);`,
    }
    return specifier in sources ? { url: `data:text/javascript,${encodeURIComponent(sources[specifier])}`, shortCircuit: true } : next(specifier, context)
  },
})
const { Preloader } = await import('../src/components/fx/Preloader.tsx')

for (const mode of ['ready', 'absent', 'rejected', 'hanging', 'reduced', 'unmount', 'unmount-exit']) {
  test(`Preloader lifecycle: ${mode}`, async () => {
    const saved = new Map(['window', 'document', 'navigator', 'requestAnimationFrame', 'cancelAnimationFrame'].map(k => [k, Object.getOwnPropertyDescriptor(globalThis, k)]))
    let cursor = 0, now = 0, id = 0, calls = 0, writes = 0, resolveFonts, reduced = mode === 'reduced'
    const slots = [], pending = [], timers = new Map(), frames = new Map()
    const h = globalThis[key] = {
      locks: [],
      state(value) { const i = cursor++; slots[i] ??= { value }; return [slots[i].value, v => { writes++; slots[i].value = typeof v === 'function' ? v(slots[i].value) : v }] },
      ref(value) { const i = cursor++; return slots[i] ??= { current: value } },
      effect(fn, deps) { const i = cursor++; if (!slots[i] || deps.some((v,j) => v !== slots[i].deps[j])) { const old = slots[i]; slots[i] = { deps, cleanup: old?.cleanup }; pending.push(() => { old?.cleanup?.(); slots[i].cleanup = fn() }) } },
    }
    const fonts = { size: 2, ready: mode === 'rejected' ? Promise.reject(Error('font failure')) : ['hanging', 'unmount'].includes(mode) ? new Promise(resolve => { resolveFonts = resolve }) : Promise.resolve() }
    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { language: 'es', hardwareConcurrency: 4 } })
    globalThis.document = { fonts: mode === 'absent' ? undefined : fonts }
    globalThis.window = { innerWidth: 1200, innerHeight: 800, devicePixelRatio: 1, matchMedia: () => ({ matches: reduced }), setTimeout: (fn, ms) => { timers.set(++id, { fn, at: now + ms }); return id }, clearTimeout: n => timers.delete(n) }
    globalThis.requestAnimationFrame = fn => { frames.set(++id, fn); return id }
    globalThis.cancelAnimationFrame = n => frames.delete(n)
    const render = () => { cursor = 0; const tree = Preloader({ onDone: () => calls++ }); pending.splice(0).forEach(fn => fn()); return tree }
    const flush = async () => { await Promise.resolve(); await Promise.resolve(); return render() }
    const advance = async ms => {
      const end = now + ms
      while ([...timers.values()].some(t => t.at <= end)) {
        const [n,t] = [...timers].sort((a,b) => a[1].at - b[1].at)[0]; now = t.at; timers.delete(n); t.fn(); await flush()
      }
      now = end; return flush()
    }
    const unmount = () => slots.forEach(s => s?.cleanup?.())
    try {
      render(); const tree = await flush()
      assert.equal(h.locks[0], true)
      if (!['hanging', 'unmount'].includes(mode)) {
        const curtain = tree.props.children[0].props
        assert.deepEqual(curtain.animate, reduced ? { opacity: 0 } : { y: '-100%' })
        assert.equal(curtain.transition.duration, reduced ? 0.05 : 0.4)
        assert.equal(curtain.transition.delay ?? 0, 0)
      }
      if (mode.startsWith('unmount')) {
        unmount(); const before = writes; resolveFonts?.(); await advance(5000)
        assert.equal(writes, before); assert.equal(calls, 0)
      } else {
        const total = mode === 'reduced' ? 50 : ['hanging'].includes(mode) ? 650 : 400
        await advance(total - 1); assert.equal(calls, 0)
        assert.equal(await advance(1), null); assert.equal(calls, 1)
        reduced = !reduced; await flush()
        await advance(5000); assert.equal(calls, 1)
        if (resolveFonts) { const before = writes; resolveFonts(); await Promise.resolve(); await Promise.resolve(); assert.equal(writes, before) }
        unmount()
      }
      assert.equal(h.locks.at(-1), false)
      assert.equal(timers.size, 0); assert.equal(frames.size, 0)
    } finally {
      unmount(); delete globalThis[key]
      for (const [k,d] of saved) { if (d) Object.defineProperty(globalThis,k,d); else delete globalThis[k] }
    }
  })
}

test.after(() => hooks.deregister())
