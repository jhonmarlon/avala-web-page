import assert from 'node:assert/strict'
import { test } from 'node:test'
import { registerHooks } from 'node:module'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const calls = []
globalThis.__continueCalls = calls
registerHooks({
  resolve(specifier, context, next) {
    if (specifier === '@/lib/smooth-scroll' && context.parentURL?.includes('SectionContinue')) {
      return { url: 'continue:scroll', shortCircuit: true }
    }
    return next(specifier, context)
  },
  load(url, context, next) {
    if (url === 'continue:scroll') return { format: 'module', source: 'export const scrollToTarget = (...args) => globalThis.__continueCalls.push(args)', shortCircuit: true }
    return next(url, context)
  },
})
const { SectionContinue } = await import('../src/components/ui/SectionContinue.tsx')

function button() {
  const root = SectionContinue({ targetId: 'home-services' })
  return root.props.children
}

test('Continuar is a native keyboard button with a quiet indicator, visible focus and 44px minimum target', () => {
  const element = button()
  assert.equal(element.type, 'button')
  assert.equal(element.props.type, 'button')
  assert.equal(element.props.tabIndex, undefined)
  assert.match(element.props.className, /min-h-11/)
  assert.match(element.props.className, /min-w-11/)
  assert.match(element.props.className, /focus-visible:outline/)
  const markup = renderToStaticMarkup(React.createElement(SectionContinue, { targetId: 'home-services' }))
  assert.match(markup, />Continuar</)
  assert.match(markup, /aria-hidden="true"/)
  assert.doesNotMatch(markup, /Scroll|animate-/)
})

test('activation uses the explicit target and current measured header offset through the existing scroll boundary', () => {
  const target = { style: {} }
  let height = 80
  globalThis.document = {
    getElementById(id) { assert.equal(id, 'home-services'); return target },
    querySelector(selector) { assert.equal(selector, 'header'); return { getBoundingClientRect: () => ({ height }) } },
  }
  calls.length = 0
  button().props.onClick()
  assert.deepEqual(calls, [['#home-services', 88]])
  assert.equal(target.style.scrollMarginTop, '88px')
  height = 72
  button().props.onClick()
  assert.deepEqual(calls[1], ['#home-services', 80])
  assert.equal(target.style.scrollMarginTop, '80px')
  delete globalThis.document
})

test('missing target is a no-op; missing header still scrolls with a small clearance', () => {
  calls.length = 0
  globalThis.document = { getElementById: () => null }
  button().props.onClick()
  assert.deepEqual(calls, [])
  const target = { style: {} }
  globalThis.document = { getElementById: () => target, querySelector: () => null }
  button().props.onClick()
  assert.deepEqual(calls, [['#home-services', 8]])
  assert.equal(target.style.scrollMarginTop, '8px')
  delete globalThis.document
})
