import assert from 'node:assert/strict'
import { readProjectStyles } from './style-source.mjs'
import { registerHooks } from 'node:module'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router'
import { Smartphone } from 'lucide-react'
import { NumberedStepPanel } from '../src/components/ui/NumberedStepPanel.tsx'

registerHooks({
  load(url, context, nextLoad) {
    if (url.endsWith('.png')) return { format: 'module', source: 'export default "fixture.png"', shortCircuit: true }
    const result = nextLoad(url, context)
    return url.endsWith('/config/site.ts')
      ? { ...result, source: result.source.replaceAll('import.meta.env', '({})') }
      : result
  },
})
const { ProcessSection } = await import('../src/features/home/sections/ProcessSection.tsx')
const { EsimPage } = await import('../src/pages/EsimPage.tsx')
const { ServicesPage } = await import('../src/pages/ServicesPage.tsx')
const { processSteps } = await import('../src/features/home/data/content.ts')
const { services } = await import('../src/config/services.ts')
const render = Component => renderToStaticMarkup(createElement(MemoryRouter, null, createElement(Component)))
const articles = html => [...html.matchAll(/<article\b[^>]*>[\s\S]*?<\/article>/g)].map(([article]) => article)
const kinds = html => [...html.matchAll(/data-sequence-scene="([^"]+)"/g)].map(match => match[1])

test('both sliders use feature-specific compact scenes alongside the original stage numbers', () => {
  const home = render(ProcessSection)
  const esim = render(EsimPage)
  assert.deepEqual(kinds(home), ['discover', 'design', 'build', 'launch', 'optimize'])
  const esimIntro = esim.match(/<section\b[^>]*>[\s\S]*?<\/section>/)[0]
  assert.deepEqual(kinds(esimIntro), ['protected', 'entry', 'identity', 'reserve', 'qr'])
  for (const [html, count] of [[home, 5], [esim, 4]]) {
    const panels = articles(html)
    assert.equal(panels.length, count)
    for (const [index, panel] of panels.entries()) {
      assert.match(panel, /sequence-illustration-host/)
      assert.match(panel, /sequence-number-visual/)
      assert.ok(panel.includes('>' + String(index + 1).padStart(2, '0') + '</p>'))
      assert.equal(kinds(panel).length, 1)
      assert.doesNotMatch(panel, /lucide-|<a\b|<button\b|tabindex=|role="button"/)
    }
  }
  for (const step of processSteps) for (const text of [step.title, step.description]) assert.ok(home.includes(text))
  assert.match(home, /Continuar/)
  const ordered = esim.match(/<ol\b[^>]*>[\s\S]*?<\/ol>/)[0]
  assert.equal((ordered.match(/<li\b/g) ?? []).length, 4)
  assert.doesNotMatch(ordered, /Flujo protegido|Del ingreso al QR final/)
})

test('optional illustrated panel preserves default fallback and all public text', async () => {
  const { SequenceIllustration } = await import('../src/components/icons/SequenceIllustration.tsx')
  const props = { label: 'Paso 1', number: 1, title: 'Own title', description: 'Own description', Icon: Smartphone }
  const plain = renderToStaticMarkup(createElement(NumberedStepPanel, props))
  assert.match(plain, /lucide-smartphone size-5 text-avala-paper\/60/)
  assert.doesNotMatch(plain, /sequence-illustration-host|sequence-number-visual/)
  const illustrated = renderToStaticMarkup(createElement(NumberedStepPanel, {
    ...props, illustration: createElement(SequenceIllustration, { kind: 'entry' }),
  }))
  for (const text of ['Paso 1', '>01</p>', 'Own title', 'Own description']) assert.ok(illustrated.includes(text))
  assert.doesNotMatch(illustrated, /lucide-smartphone|<button|tabindex=/)
})

test('S4 Solutions uses ten service-specific miniillustrations in unchanged catalog order without framed fallback', () => {
  const html = render(ServicesPage)
  const expected = ['automate', 'build', 'appspace', 'neuralmesh', 'integrate', 'cloudstack', 'strategy', 'campaign', 'delivery', 'signalnet']
  assert.deepEqual(kinds(html), expected)
  assert.doesNotMatch(html, /data-process-icon=|process-stage-icon/)
  const rows = [...html.matchAll(/<li\b[\s\S]*?<\/li>/g)].map(([row]) => row)
  assert.equal(rows.length, services.length)
  for (const [index, row] of rows.entries()) {
    assert.ok(row.includes('>' + services[index].title + '</h2>'))
    assert.ok(row.includes(services[index].description))
    assert.deepEqual(kinds(row), [expected[index]])
    assert.match(row, /sequence-illustration-host/)
    assert.doesNotMatch(row, /lucide-|<a\b|<button\b|tabindex=|role="button"/)
  }
  for (const service of services) for (const text of [service.title, service.description]) assert.ok(html.includes(text))
  assert.match(html, /href="\/contacto"/)
  assert.match(html, /href="\/estimar-proyecto"/)
})

const scenes = {
  discover: ['document', 'magnifier'], design: ['blueprint', 'pen'], build: ['browser', 'code'],
  launch: ['server', 'deploy'], optimize: ['chart', 'insight'], entry: ['phone', 'voucher'],
  identity: ['profile', 'shield'], reserve: ['inventory', 'lock'], qr: ['phone', 'qr'],
  protected: ['shield', 'route'], automate: ['workflow', 'gear'], integrate: ['systems', 'connection'],
  stock: ['catalog', 'sim-card'], batches: ['stack', 'voucher'], print: ['printer', 'paper'],
  confirmation: ['printer', 'confirmation'], otp: ['otp', 'scratch', 'shield'], trace: ['voucher', 'route', 'qr'],
  retail: ['storefront', 'terminal', 'voucher'],
  appspace: ['handset', 'app-window'], neuralmesh: ['network', 'processor'],
  cloudstack: ['server-rack', 'cloud'], strategy: ['roadmap', 'conversation'],
  campaign: ['analytics', 'megaphone'], delivery: ['pipeline', 'release-loop'],
  signalnet: ['tower', 'signal-waves'], timeline: ['clock', 'schedule'], budget: ['calculator', 'coins'],
}
for (const [kind, parts] of Object.entries(scenes)) {
  test('compact ' + kind + ' scene has distinct details, unique gradients and no interactive content', async () => {
    const { SequenceIllustration } = await import('../src/components/icons/SequenceIllustration.tsx')
    const html = renderToStaticMarkup(createElement('div', null,
      createElement(SequenceIllustration, { kind }), createElement(SequenceIllustration, { kind })))
    assert.equal((html.match(/aria-hidden="true"/g) ?? []).length, 2)
    assert.equal((html.match(/focusable="false"/g) ?? []).length, 2)
    assert.equal((html.match(/viewBox="0 0 96 80"/g) ?? []).length, 2)
    for (const part of parts) assert.ok(html.includes('data-scene-part="' + part + '"'), part)
    assert.doesNotMatch(html, /<image|<foreignObject|<button|tabindex=|<text|aria-live=/)
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1])
    assert.ok(ids.length >= 4)
    assert.equal(new Set(ids).size, ids.length)
    for (const [, ref] of html.matchAll(/url\(#([^)]+)\)/g)) assert.ok(ids.includes(ref))
  })
}

test('all compact scenes render layered materials, local edge highlights and contact depth', async () => {
  const { SequenceIllustration } = await import('../src/components/icons/SequenceIllustration.tsx')
  for (const kind of Object.keys(scenes)) {
    const html = renderToStaticMarkup(createElement('div', null,
      createElement(SequenceIllustration, { kind }), createElement(SequenceIllustration, { kind })))
    const svgs = [...html.matchAll(/<svg\b[\s\S]*?<\/svg>/g)].map(([svg]) => svg)
    for (const svg of svgs) {
      for (const material of ['surface', 'accent']) {
        const gradient = svg.match(new RegExp('<linearGradient id="[^"]+-sequence-' + material + '"[^>]*>([\\s\\S]*?)</linearGradient>'))?.[1]
        assert.ok(gradient, kind + ' ' + material)
        assert.ok((gradient.match(/<stop\b/g) ?? []).length >= 4, kind + ' needs richer ' + material)
      }
      assert.match(svg, /<linearGradient id="[^"]+-sequence-edge"[^>]*gradientUnits="userSpaceOnUse"/)
      assert.match(svg, /data-material-detail="edge"[^>]*stroke="url\(#[^)]+-sequence-edge\)"/)
      const ids = [...svg.matchAll(/\bid="([^"]+)"/g)].map(match => match[1])
      for (const [, ref] of svg.matchAll(/url\(#([^)]+)\)/g)) assert.ok(ids.includes(ref), 'reference must resolve inside its own SVG')
      if (kind === 'reserve') {
        assert.match(svg, /data-material-detail="stack-seams"/)
        assert.match(svg, /data-material-detail="lock-bevel"/)
      }
    }
  }
  const css = readProjectStyles()
  const parts = css.match(/\.sequence-illustration__art > \[data-scene-part\]\s*\{([^}]+)\}/)?.[1]
  assert.ok(parts)
  assert.match(parts, /drop-shadow\(0 2px 1px color-mix\(in srgb, var\(--color-avala-ink\) 65%, transparent\)\)/)
  assert.doesNotMatch(parts, /animation:|transform:|transition:/)
  assert.match(css, /\.service-scene \.sequence-illustration \{ width: 64px; height: 54px; \}/)
  assert.match(css, /@media \(min-width: 64rem\)\s*\{\s*\.service-scene \.sequence-illustration \{ width: 96px; height: 80px; \}/)
})

test('compact illustration CSS stays static until hover and respects reduced motion', () => {
  const css = readProjectStyles()
  const root = css.match(/\.sequence-illustration\s*\{([^}]+)\}/)?.[1]
  assert.ok(root)
  assert.match(root, /width: 96px;\s*height: 80px;/)
  assert.doesNotMatch(root, /animation:|transform:/)
  assert.match(css, /@media \(hover: hover\) and \(prefers-reduced-motion: no-preference\)/)
  for (const host of ['sequence-illustration-host', 'esim-capability', 'esim-flow', 'sequence-illustration', 'esim-flow-illustration']) {
    assert.ok(css.includes('.' + host + ':hover'), host)
  }
  assert.match(css, /animation: var\(--illustration-gesture\) 550ms ease-in-out;/)
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.illustration-gesture \{ animation: none; transform: none; \}/)
  assert.doesNotMatch(css, /sequence-scene-hover|__art\s*\{[^}]*animation:/)
  const gestures = css.match(/@keyframes illustration-[\s\S]*?(?=@media \(hover: hover\) and)/)?.[0]
  assert.ok(gestures)
  assert.doesNotMatch(gestures, /infinite|repeat|bounce/)
  assert.match(gestures, /translateX\(5px\)/)
  assert.match(gestures, /rotate\(10deg\)/)
  assert.match(gestures, /scaleY\(1\.12\)/)
  const light = css.match(/@keyframes illustration-light\s*\{[\s\S]*?\n\}/)?.[0]
  assert.ok(light)
  assert.match(light, /translateY\(-5px\)/)
  assert.doesNotMatch(light, /filter:|brightness/)
  assert.doesNotMatch(light, /opacity:/)
  const part = css.match(/\.sequence-illustration__art > \[data-scene-part\]\s*\{([^}]+)\}/)?.[1]
  assert.ok(part)
  assert.match(part, /--illustration-contact-shadow: drop-shadow/)
  assert.match(part, /filter: var\(--illustration-contact-shadow\);/)
})


test('S2 each compact scene has two separate meaningful spatial actors, never the art wrapper or floor', async () => {
  const { SequenceIllustration } = await import('../src/components/icons/SequenceIllustration.tsx')
  const targets = {
    discover: ['magnifier', 'lift'], design: ['pen', 'tilt'], build: ['code', 'light'],
    launch: ['deploy', 'lift'], optimize: ['bars', 'grow'], entry: ['voucher', 'slide'],
    identity: ['shield', 'lift'], reserve: ['lock', 'tilt'], qr: ['qr', 'light'],
    protected: ['shield', 'light'], automate: ['gear', 'tilt'], integrate: ['connection', 'light'],
    stock: ['sim-card', 'lift'], batches: ['voucher', 'slide'], print: ['paper', 'lift'],
    confirmation: ['confirmation', 'tilt'], otp: ['scratch', 'light'], trace: ['route', 'light'],
    retail: ['voucher', 'slide'],
    appspace: ['app-window', 'slide'], neuralmesh: ['processor', 'light'],
    cloudstack: ['cloud', 'lift'], strategy: ['conversation', 'lift'],
    campaign: ['megaphone', 'tilt'], delivery: ['release-loop', 'light'],
    signalnet: ['signal-waves', 'grow'],
  }
  const mains = {
    discover: 'document', design: 'blueprint', build: 'browser', launch: 'server', optimize: 'insight',
    entry: 'phone', identity: 'profile', reserve: 'inventory', qr: 'phone', protected: 'route',
    automate: 'workflow', integrate: 'systems', stock: 'catalog', batches: 'stack', print: 'printer',
    confirmation: 'printer', otp: 'otp', trace: 'voucher', retail: 'storefront',
    appspace: 'handset', neuralmesh: 'network', cloudstack: 'server-rack',
    strategy: 'roadmap', campaign: 'analytics', delivery: 'pipeline', signalnet: 'tower',
  }
  for (const [kind, [part, effect]] of Object.entries(targets)) {
    const html = renderToStaticMarkup(createElement(SequenceIllustration, { kind }))
    const tags = [...html.matchAll(/<g\b[^>]*class="illustration-gesture"[^>]*>/g)]
    assert.equal(tags.length, 2, kind)
    assert.ok(tags.some(([tag]) => tag.includes('data-scene-part="' + part + '"') && tag.includes('data-gesture="' + effect + '"')), kind)
    assert.ok(tags.some(([tag]) => tag.includes('data-scene-part="' + mains[kind] + '"') && tag.includes('data-gesture="main"')), kind)
    const stack = []
    for (const [tag] of html.matchAll(/<\/?g\b[^>]*>/g)) {
      if (tag.startsWith('</g')) stack.pop()
      else {
        const actor = tag.includes('class="illustration-gesture"')
        if (actor) assert.ok(!stack.includes(true), kind + ' actors must not inherit each other’s displacement')
        stack.push(actor)
      }
    }
    assert.match(html, /<ellipse cx="48" cy="73"[^>]*>/)
    assert.doesNotMatch(html, /<g class="sequence-illustration__art"[^>]*data-gesture=/)
  }
})

test('Solutions catalog indices are legible, zero-padded and locally styled without decoration', () => {
  const html = render(ServicesPage)
  const indices = [...html.matchAll(/<span class="([^"]*service-index[^"]*)">(\d{2})<\/span>/g)]
  assert.deepEqual(indices.map(match => match[2]), Array.from({ length: 10 }, (_, i) => String(i + 1).padStart(2, '0')))
  for (const [, classes] of indices) {
    assert.ok(classes.includes('tabular'))
    assert.doesNotMatch(classes, /hud-label|shadow|animate|border/)
  }
  assert.match(html, /lg:grid-cols-\[2\.5rem_minmax\(0,1fr\)_minmax\(0,1fr\)_6rem\]/)
  assert.match(html, /grid-cols-\[4rem_minmax\(0,1fr\)\]/)
  const css = readProjectStyles()
  const rule = css.match(/\.solutions-page \.service-index\s*\{([^}]+)\}/)?.[1]
  assert.ok(rule)
  assert.match(rule, /font-family: var\(--font-mono\);/)
  assert.match(rule, /font-size: 1\.25rem;/)
  assert.match(rule, /font-weight: 600;/)
  assert.match(rule, /letter-spacing: 0\.04em;/)
  assert.match(rule, /color: var\(--color-avala-cyan\);/)
  assert.match(rule, /text-shadow: 0 0 8px/)
  assert.doesNotMatch(rule, /animation:|border:|box-shadow:/)
})


test('compact scenes add local ambient light and edge glow without layout or continuous motion', async () => {
  const { SequenceIllustration } = await import('../src/components/icons/SequenceIllustration.tsx')
  const html = renderToStaticMarkup(createElement(SequenceIllustration, { kind: 'reserve' }))
  assert.match(html, /<radialGradient id="[^"]+-sequence-glow"/)
  assert.match(html, /<ellipse class="sequence-illustration__glow"[^>]*stroke="none"/)
  const css = readProjectStyles()
  const glow = css.match(/\.sequence-illustration__glow\s*\{([^}]+)\}/)?.[1]
  assert.ok(glow)
  assert.match(glow, /pointer-events: none;/)
  assert.match(glow, /transition: opacity 180ms ease-out;/)
  const art = css.match(/\.sequence-illustration__art\s*\{([^}]+)\}/)?.[1]
  assert.ok(art)
  assert.match(art, /filter: drop-shadow/)
  assert.doesNotMatch(art, /animation:|transform:|transition:/)
  assert.match(css, /\.sequence-illustration:hover \.sequence-illustration__glow/)
  assert.match(css, /\.esim-capability:hover \.sequence-illustration__glow/)
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)\s*\{[^}]*\}[\s\S]*?\.sequence-illustration__glow \{ transition: none; \}/)
})
