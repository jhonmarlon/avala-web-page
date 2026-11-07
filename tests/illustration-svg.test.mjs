import assert from 'node:assert/strict'
import { test } from 'node:test'
import { registerHooks } from 'node:module'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { replayIllustrationOnEnter } from '../src/components/icons/illustrationHover.ts'

// Capture public SVG props during a valid React render, including its ref lifecycle.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'frame:jsx' || (specifier === 'react/jsx-runtime' && context.parentURL?.endsWith('/icons/IllustrationSvg.tsx'))) {
      return { url: new URL('./frame-jsx.mjs', import.meta.url).href, shortCircuit: true }
    }
    return nextResolve(specifier, context)
  },
  load(url, context, nextLoad) {
    if (url.endsWith('/frame-jsx.mjs')) return { format: 'module', shortCircuit: true, source: `
      import * as runtime from ${JSON.stringify(import.meta.resolve('react/jsx-runtime'))};
      export let root;
      export const jsx = (type, props, ...rest) => { root = { type, props }; return runtime.jsx(type, props, ...rest) };
      export const jsxs = jsx;` }
    return nextLoad(url, context)
  },
})
const { IllustrationSvg } = await import('../src/components/icons/IllustrationSvg.tsx')
const captured = await import('frame:jsx')
function renderRoot(props) {
  renderToStaticMarkup(createElement(IllustrationSvg, props))
  return captured.root
}

test('decorative frame preserves SVG prop order, definitions and children without wrappers', () => {
  const html = renderToStaticMarkup(createElement(IllustrationSvg, {
    'data-scene': 'fixture',
    className: 'fixture-art',
    viewBox: '0 0 96 80',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.5',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
  createElement('defs', null,
    createElement('linearGradient', { id: 'fixture-surface' },
      createElement('stop', { stopColor: 'cyan' }),
      createElement('stop', { offset: '1', stopColor: 'black' }))),
  createElement('g', { 'data-scene-part': 'fixture' },
    createElement('path', { d: 'M1 2h3', fill: 'url(#fixture-surface)' }))))

  assert.equal(html, '<svg aria-hidden="true" focusable="false" data-scene="fixture" class="fixture-art" viewBox="0 0 96 80" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><defs><linearGradient id="fixture-surface"><stop stop-color="cyan"></stop><stop offset="1" stop-color="black"></stop></linearGradient></defs><g data-scene-part="fixture"><path d="M1 2h3" fill="url(#fixture-surface)"></path></g></svg>')
})

test('frame forwards SVG refs, children and unrelated event callbacks unchanged', () => {
  const ref = { current: null }
  const onPointerLeave = () => {}
  const child = createElement('path', { d: 'M0 0h1' })
  const root = renderRoot({ ref, onPointerLeave, children: child, width: 120, height: 104 })

  assert.equal(root.type, 'svg')
  assert.equal(typeof root.props.ref, 'function')
  const node = { removeAttribute() {}, removeEventListener() {} }
  const cleanup = root.props.ref(node)
  assert.equal(ref.current, node)
  cleanup()
  assert.equal(ref.current, null)
  assert.equal(root.props.onPointerLeave, onPointerLeave)
  assert.equal(root.props.children, child)
  assert.equal(root.props.width, 120)
  assert.equal(root.props.height, 104)
  assert.equal(root.props['aria-hidden'], 'true')
  assert.equal(root.props.focusable, 'false')
  assert.equal(root.props.onPointerEnter, replayIllustrationOnEnter)
})

test('frame callback refs without cleanup receive null exactly once on detach', () => {
  const calls = []
  const root = renderRoot({ ref: value => { calls.push(value) } })
  const node = { removeAttribute() {}, removeEventListener() {} }
  const cleanup = root.props.ref(node)
  assert.deepEqual(calls, [node])
  cleanup()
  cleanup()
  assert.deepEqual(calls, [node, null])
  assert.equal(root.props.ref(null), undefined)
  assert.deepEqual(calls, [node, null])
})

test('frame preserves the existing finite pointer replay policy', () => {
  const root = renderRoot({})
  const actors = [{ dataset: {} }, { dataset: { illustrationReplay: 'primary' } }]
  let queries = 0
  const currentTarget = {
    querySelectorAll(selector) {
      assert.equal(selector, '.illustration-gesture')
      queries++
      return actors
    },
  }
  const enter = pointerType => root.props.onPointerEnter({ pointerType, currentTarget })
  enter('touch')
  assert.equal(queries, 0)
  assert.deepEqual(actors.map(actor => actor.dataset.illustrationReplay), [undefined, 'primary'])
  enter('mouse')
  assert.deepEqual(actors.map(actor => actor.dataset.illustrationReplay), ['replay', 'replay'])
  enter('pen')
  assert.deepEqual(actors.map(actor => actor.dataset.illustrationReplay), ['primary', 'primary'])
  assert.equal(queries, 2)
})
