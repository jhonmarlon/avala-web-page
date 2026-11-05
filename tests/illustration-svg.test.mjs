import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { IllustrationSvg } from '../src/components/icons/IllustrationSvg.tsx'
import { replayIllustrationOnEnter } from '../src/components/icons/illustrationHover.ts'

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
  const root = IllustrationSvg({ ref, onPointerLeave, children: child, width: 120, height: 104 })

  assert.equal(root.type, 'svg')
  assert.equal(root.props.ref, ref)
  assert.equal(root.props.onPointerLeave, onPointerLeave)
  assert.equal(root.props.children, child)
  assert.equal(root.props.width, 120)
  assert.equal(root.props.height, 104)
  assert.equal(root.props['aria-hidden'], 'true')
  assert.equal(root.props.focusable, 'false')
  assert.equal(root.props.onPointerEnter, replayIllustrationOnEnter)
})

test('frame uses the existing finite replay policy without adding event state', () => {
  const root = IllustrationSvg({})
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
