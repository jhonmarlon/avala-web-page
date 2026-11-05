import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { registerHooks } from 'node:module'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

registerHooks({
  load(url, context, nextLoad) {
    const result = nextLoad(url, context)
    return url.endsWith('/config/site.ts') ? { ...result, source: result.source.replaceAll('import.meta.env', '({})') } : result
  },
})
const { EstimatorPage } = await import('../src/features/estimator/pages/EstimatorPage.tsx')

test('five passive estimator step cards retain state, small cyan numbers and existing controls', () => {
  const html = renderToStaticMarkup(createElement(EstimatorPage))
  const cards = [...html.matchAll(/<div\b[^>]*data-step-state="([^"]+)"[^>]*class="([^"]*estimator-step-card[^"]*)"[^>]*>/g)]
  assert.deepEqual(cards.map(match => match[1]), ['active', 'upcoming', 'upcoming', 'upcoming', 'upcoming'])
  for (const [tag] of cards) assert.doesNotMatch(tag, /role=|tabindex=|onclick=|cursor-pointer/)
  const numbers = [...html.matchAll(/<span class="([^"]*estimator-step-index[^"]*)">(\d)<\/span>/g)]
  assert.deepEqual(numbers.map(match => match[2]), ['1', '2', '3', '4', '5'])
  for (const [, classes] of numbers) {
    assert.match(classes, /text-xs/)
    assert.doesNotMatch(classes, /ordinal-index|text-outline|text-[2-9]xl/)
  }
  assert.match(html, /style="width:20%"/)
  assert.match(html, /<button[^>]*disabled=""[^>]*>Volver<\/button>/)
  assert.match(html, /¿Qué quieres construir\?/)
})

test('estimator surfaces keep depth and enlarge only the active step, never hover', () => {
  const css = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8')
  const surface = css.match(/\.estimator-step-card\s*\{([^}]+)\}/)?.[1]
  assert.ok(surface)
  assert.match(surface, /radial-gradient[\s\S]*linear-gradient/)
  assert.match(surface, /box-shadow: inset/)
  assert.match(css, /\.estimator-step-card\[data-step-state="active"\]\s*\{[^}]*border-color: var\(--color-avala-cyan\)/)
  assert.match(css, /\.estimator-step-card\[data-step-state="complete"\]/)
  assert.match(css, /\.estimator-step-index\s*\{[^}]*color: var\(--color-avala-cyan\);[^}]*text-shadow:/)
  const active = css.match(/\.estimator-step-card\[data-step-state="active"\]\s*\{([^}]+)\}/)?.[1]
  assert.match(active, /scale: 1\.03;/)
  assert.match(surface, /scale: 1;/)
  assert.doesNotMatch(css, /\.estimator-step-card:hover\b/)
  const reduced = css.match(/@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.estimator-step-card\s*\{([^}]+)\}/)?.[1]
  assert.match(reduced, /transition: none;/)
  assert.doesNotMatch(reduced, /scale:|transform:/, 'reduced motion keeps static active emphasis without a size transition')
  assert.doesNotMatch(surface, /position:|height:|cursor:|animation:/)
})
