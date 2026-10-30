import assert from 'node:assert/strict'
import { test } from 'node:test'
import { scrollToTarget, scrollToTop } from '../src/lib/smooth-scroll.ts'

test('scroll targets honor reduced motion and preserve normal smooth scrolling', () => {
  const calls = []
  let reduced = true
  globalThis.window = {
    matchMedia: () => ({ matches: reduced }),
    scrollTo: (options) => calls.push(options),
  }
  globalThis.document = {
    querySelector: () => ({ scrollIntoView: (options) => calls.push(options) }),
  }
  try {
    scrollToTarget(120)
    scrollToTarget('#contacto')
    assert.deepEqual(calls.splice(0), [{ top: 120, behavior: 'instant' }, { behavior: 'instant' }])
    reduced = false
    scrollToTarget(240)
    scrollToTarget('#contacto')
    assert.deepEqual(calls.splice(0), [{ top: 240, behavior: 'smooth' }, { behavior: 'smooth' }])
    scrollToTop()
    assert.deepEqual(calls, [{ top: 0, left: 0, behavior: 'auto' }])
  } finally {
    delete globalThis.window
    delete globalThis.document
  }
})
