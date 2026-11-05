import assert from 'node:assert/strict'
import { readProjectStyles } from './style-source.mjs'
import { registerHooks } from 'node:module'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router'

registerHooks({
  load(url, context, nextLoad) {
    if (url.endsWith('.png')) return { format: 'module', source: 'export default "fixture.png"', shortCircuit: true }
    const result = nextLoad(url, context)
    return url.endsWith('/config/site.ts')
      ? { ...result, source: result.source.replaceAll('import.meta.env', '({})') }
      : result
  },
})
const { EsimPage } = await import('../src/pages/EsimPage.tsx')
const { AboutPage } = await import('../src/pages/AboutPage.tsx')
const css = readProjectStyles()
const render = Page => renderToStaticMarkup(createElement(MemoryRouter, null, createElement(Page)))
const prominence = () => css.match(/\.esim-capability-index,\s*\.about-method-index\s*\{([^}]+)\}/)?.[1] ?? ''

function assertProminence() {
  const rule = prominence()
  assert.match(rule, /font-size: clamp\(2\.75rem, 5vw, 3\.5rem\);/)
  assert.match(rule, /line-height: 1;/)
  assert.match(rule, /--stroke-w: 1\.5px;/)
  assert.match(rule, /--stroke-c: color-mix\(in srgb, var\(--color-avala-paper\) 85%, var\(--color-avala-neon\)\);/)
  assert.doesNotMatch(rule, /animation|transition|transform|(?:^|\s)height:|position:/)
}

test('eSIM operational indices are six prominent local editorial numerals, still decorative and right-aligned', () => {
  const html = render(EsimPage)
  const list = html.match(/<ul aria-label="Capacidades operativas"[^>]*>[\s\S]*?<\/ul>/)[0]
  const indices = [...list.matchAll(/<span aria-hidden="true" class="display-tight text-outline tabular esim-capability-index">(\d{2})<\/span>/g)]
  assert.deepEqual(indices.map(match => match[1]), ['01', '02', '03', '04', '05', '06'])
  assert.equal((html.match(/esim-capability-index/g) ?? []).length, 6)
  assert.match(list, /mb-5 flex items-center justify-between/)
  assert.match(list, /<\/svg><span aria-hidden="true" class="display-tight text-outline tabular esim-capability-index"/)
  assertProminence()
})

test('About method alone gets five prominent editorial numerals, preserving visible semantics and left placement', () => {
  const html = render(AboutPage)
  const method = html.match(/<ol\b[^>]*>[\s\S]*?<\/ol>/)[0]
  const indices = [...method.matchAll(/<span class="display-tight text-outline tabular about-method-index">(\d{2})<\/span>/g)]
  assert.deepEqual(indices.map(match => match[1]), ['01', '02', '03', '04', '05'])
  assert.equal((html.match(/about-method-index/g) ?? []).length, 5)
  assert.match(method, /flex items-center justify-between"><span class="display-tight text-outline tabular about-method-index">01<\/span><span[^>]*class="process-stage-icon"/)
  const highlights = html.match(/<ul\b[^>]*>[\s\S]*?<\/ul>/)[0]
  assert.doesNotMatch(highlights, /about-method-index|text-outline/)
  assert.match(highlights, /hud-label tabular ordinal-index pt-1 text-avala-neon/)
  assert.doesNotMatch(method, /esim-operational-card/)
  assertProminence()
})

test('only six eSIM operational cards gain layered depth and guarded two-percent hover scale', () => {
  const html = render(EsimPage)
  assert.equal((html.match(/esim-operational-card/g) ?? []).length, 6)
  const rule = css.match(/\.esim-capability \.esim-operational-card\s*\{([^}]+)\}/)?.[1] ?? ''
  assert.match(rule, /background-color: var\(--color-avala-ink\);/)
  assert.match(rule, /background-image:[\s\S]*radial-gradient\([\s\S]*linear-gradient\(/)
  assert.match(rule, /border-color: color-mix/)
  assert.match(rule, /box-shadow: inset 0 1px 0[\s\S]*0 12px 28px/)
  assert.match(rule, /transition: border-color 300ms ease-out, background-color 300ms ease-out, box-shadow 300ms ease-out, transform 200ms ease-out;/)
  const hover = css.match(/@media \(hover: hover\)\s*\{\s*\.esim-capability:hover \.esim-operational-card\s*\{([^}]+)\}/)?.[1] ?? ''
  assert.match(hover, /border-color:[\s\S]*background-color:[\s\S]*box-shadow: inset/)
  assert.match(hover, /0 16px 36px/)
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.esim-capability \.esim-operational-card \{ transition: none; transform: none; \}/)
  for (const block of [rule, hover]) {
    assert.doesNotMatch(block, /translate|rotate|animation|cursor|height:|overflow|mask|padding|radius/)
    assert.doesNotMatch(block, /(?:^|;)\s*transform:/)
    assert.doesNotMatch(block, /transition: all/)
  }
  assert.match(css, /@media \(hover: hover\) and \(prefers-reduced-motion: no-preference\)\s*\{\s*\.esim-capability:hover \.esim-operational-card \{ transform: scale\(1\.02\); \}/)
  assert.doesNotMatch(render(AboutPage), /esim-operational-card/)
})
