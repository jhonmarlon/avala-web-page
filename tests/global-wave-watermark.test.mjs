import assert from 'node:assert/strict'
import { test } from 'node:test'
import { registerHooks } from 'node:module'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { readProjectStyles } from './style-source.mjs'

const state = { pinned: false }
globalThis.__watermarkLayout = state
registerHooks({
  resolve(specifier, context, next) {
    if (context.parentURL?.endsWith('/PublicLayout.tsx')) {
      if (specifier.endsWith('/GlobalWaveWatermark') || specifier.endsWith('/PageScrollPinScope')) return next(specifier, context)
      if (specifier === 'react-router' || specifier.startsWith('@/components/') || specifier === '@/lib/smooth-scroll') return { url: `watermark:${specifier}`, shortCircuit: true }
    }
    return next(specifier, context.parentURL?.startsWith('watermark:') ? { ...context, parentURL: import.meta.url } : context)
  },
  load(url, context, next) {
    if (!url.startsWith('watermark:')) return next(url, context)
    const name = url.split('/').at(-1)
    const source = url === 'watermark:react-router'
      ? `import { createElement } from 'react'; export const useMatches = () => [{ handle: { pageScrollPin: globalThis.__watermarkLayout.pinned } }]; export const Outlet = () => createElement('article', null, 'route content');`
      : name === 'smooth-scroll' ? 'export const startSmoothScroll = () => {}; export const stopSmoothScroll = () => {};'
      : `import { createElement } from 'react'; export const ${name} = () => createElement('div', { 'data-existing-layer': '${name}' });`
    return { format: 'module', source, shortCircuit: true }
  },
})
const { PublicLayout } = await import('../src/app/layouts/PublicLayout.tsx')
const { GlobalWaveWatermark } = await import('../src/components/fx/GlobalWaveWatermark.tsx')
const render = element => renderToStaticMarkup(element)

test('global watermark appears once on normal and pinned routes without replacing existing layers or route content', () => {
  for (const pinned of [false, true]) {
    state.pinned = pinned
    const html = render(React.createElement(PublicLayout))
    assert.equal((html.match(/class="app-watermark"/g) ?? []).length, 1)
    for (const name of ['Header', 'Footer', 'Cursor', 'Grain']) assert.equal((html.match(new RegExp(`data-existing-layer="${name}"`, 'g')) ?? []).length, 1)
    assert.match(html, /<main><article>route content<\/article><\/main>/)
    assert.equal(html.includes('data-page-pin-scope'), pinned)
    assert.ok(html.indexOf('data-existing-layer="Grain"') < html.indexOf('class="app-watermark"'), 'append without shifting existing sibling identities')
  }
})

test('watermark is transparent static decorative SVG with two edge bands and instance-safe materials', () => {
  const html = render(React.createElement(React.Fragment, null, React.createElement(GlobalWaveWatermark), React.createElement(GlobalWaveWatermark)))
  assert.equal((html.match(/aria-hidden="true"/g) ?? []).length, 2)
  assert.equal((html.match(/focusable="false"/g) ?? []).length, 2)
  assert.equal((html.match(/preserveAspectRatio="none"/g) ?? []).length, 2)
  assert.equal((html.match(/data-watermark-band="top"/g) ?? []).length, 2)
  assert.equal((html.match(/data-watermark-band="bottom"/g) ?? []).length, 2)
  assert.doesNotMatch(html, /<(?:rect|image|foreignObject|text|animate|animateTransform|script)\b|tabindex|onpointer|onclick/i)
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1])
  assert.equal(new Set(ids).size, ids.length)
  for (const match of html.matchAll(/url\(#([^)]*)\)/g)) assert.ok(ids.includes(match[1]))
  assert.match(html, /vector-effect="non-scaling-stroke"/)
})

test('each edge has five distinct blue contours while gold stays restrained and the center stays clear', () => {
  const html = render(React.createElement(GlobalWaveWatermark))
  for (const [band, direction] of [['top', 1], ['bottom', -1]]) {
    const group = html.match(new RegExp(`<g data-watermark-band="${band}">([\\s\\S]*?)<\\/g>`))?.[1] ?? ''
    const curves = [...group.matchAll(/<path[^>]*data-watermark-contour="blue"[^>]*>/g)].map(match => match[0])
    assert.equal(curves.length, 5)
    assert.equal(new Set(curves).size, 5)
    for (const offset of [0, 18, 38, 62, 88]) assert.ok(curves.some(curve => curve.includes(`transform="translate(0 ${offset * direction})"`)))
    for (const curve of curves) assert.match(curve, /fill="none"/)
    assert.equal((group.match(/stroke-opacity="0\.5"/g) ?? []).length, 1, 'keep gold brightness unchanged when doubling overall alpha')
  }
})

test('mobile broadens the curves inside the clipped viewport without changing desktop geometry or opacity', () => {
  const css = readProjectStyles()
  const mobile = css.match(/@media\s*\(max-width:\s*640px\)\s*\{([\s\S]*?)\r?\n\}/)?.[1] ?? ''
  const bands = mobile.match(/\.app-watermark\s*>\s*g\s*\{([^}]+)\}/)?.[1] ?? ''
  assert.match(bands, /transform-box:\s*view-box/)
  assert.match(bands, /transform-origin:\s*center/)
  assert.match(bands, /transform:\s*scaleX\(1\.6\)/)
  assert.match(mobile, /opacity:\s*0\.24/)
  const desktop = css.replace(/@media\s*\(max-width:\s*640px\)\s*\{[\s\S]*?\r?\n\}/, '')
  assert.doesNotMatch(desktop, /\.app-watermark\s*>\s*g\s*\{/)
  const root = desktop.match(/\.app-watermark\s*\{([^}]+)\}/)?.[1] ?? ''
  assert.match(root, /overflow:\s*hidden/)
  assert.match(root, /width:\s*100%/)
  assert.match(root, /opacity:\s*0\.32/)
  assert.doesNotMatch(root, /transform:/)
})

test('watermark stays low-alpha and noninteractive over opaque page backgrounds, with unchanged grids', () => {
  const css = readProjectStyles()
  const rule = css.match(/\.app-watermark\s*\{([^}]+)\}/)?.[1] ?? ''
  assert.match(rule, /position:\s*fixed/)
  assert.match(rule, /pointer-events:\s*none/)
  assert.match(rule, /z-index:\s*1\s*;/)
  assert.match(rule, /mix-blend-mode:\s*screen/)
  assert.match(rule, /opacity:\s*0\.32/)
  assert.match(css, /@media\s*\(max-width:\s*640px\)\s*\{\s*\.app-watermark\s*\{\s*opacity:\s*0\.24/)
  assert.doesNotMatch(rule, /animation|transition|filter|backdrop-filter/)
  assert.match(css, /@media\s*\(forced-colors:\s*active\)\s*\{\s*\.app-watermark\s*\{\s*display:\s*none/)
  assert.match(css, /\.grid-lines\s*\{[^}]*background-size:\s*64px 64px/s)
  assert.match(css, /\.hero-grid-bg\s*\{[^}]*linear-gradient/s)
  assert.match(css, /@keyframes grain-shift\s*\{/)
})
