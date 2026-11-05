import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createElement } from 'react'
import { SequenceIllustration } from '../src/components/icons/SequenceIllustration.tsx'
import { renderToStaticMarkup } from 'react-dom/server'
import { processScenes } from '../src/components/icons/scenes/processScenes.tsx'
import { estimatorScenes } from '../src/components/icons/scenes/estimatorScenes.tsx'
import { serviceScenes } from '../src/components/icons/scenes/serviceScenes.tsx'
import { esimScenes } from '../src/components/icons/scenes/esimScenes.tsx'

test('unrecognized runtime kinds retain the original empty artwork fallback', () => {
  for (const kind of ['toString', ['discover']]) {
    const html = renderToStaticMarkup(createElement(SequenceIllustration, { kind }))
    assert.match(html, /aria-hidden="true" focusable="false"/)
    assert.match(html, /<g class="sequence-illustration__art"><\/g>/)
    assert.doesNotMatch(html, /\[object |class="illustration-gesture"/)
  }
})

test('OTP retains the original lower reflection arc sweep', () => {
  const html = renderToStaticMarkup(createElement(SequenceIllustration, { kind: 'otp' }))
  assert.match(html, /data-material-detail="edge" d="M12 29V17a5 5 0 0 1 5-5h13M12 53v7a5 5 0 0 0 5 5"/)
})

const expected = {
  discover: [['document', 'main'], ['magnifier', 'lift']],
  design: [['blueprint', 'main'], ['pen', 'tilt']],
  build: [['browser', 'main'], ['code', 'light']],
  launch: [['server', 'main'], ['deploy', 'lift']],
  optimize: [['bars', 'grow'], ['insight', 'main']],
  timeline: [['clock', 'main'], ['schedule', 'slide']],
  budget: [['calculator', 'main'], ['coins', 'lift']],
  appspace: [['handset', 'main'], ['app-window', 'slide']],
  neuralmesh: [['network', 'main'], ['processor', 'light']],
  cloudstack: [['server-rack', 'main'], ['cloud', 'lift']],
  strategy: [['roadmap', 'main'], ['conversation', 'lift']],
  campaign: [['analytics', 'main'], ['megaphone', 'tilt']],
  delivery: [['pipeline', 'main'], ['release-loop', 'light']],
  signalnet: [['tower', 'main'], ['signal-waves', 'grow']],
  automate: [['workflow', 'main'], ['gear', 'tilt']],
  integrate: [['systems', 'main'], ['connection', 'light']],
  entry: [['phone', 'main'], ['voucher', 'slide']],
  identity: [['profile', 'main'], ['shield', 'lift']],
  reserve: [['inventory', 'main'], ['lock', 'tilt']],
  qr: [['phone', 'main'], ['qr', 'light']],
  protected: [['route', 'main'], ['shield', 'light']],
  stock: [['catalog', 'main'], ['sim-card', 'lift']],
  batches: [['stack', 'main'], ['voucher', 'slide']],
  print: [['printer', 'main'], ['paper', 'lift']],
  confirmation: [['printer', 'main'], ['confirmation', 'tilt']],
  otp: [['otp', 'main'], ['scratch', 'light']],
  trace: [['voucher', 'main'], ['route', 'light']],
  retail: [['storefront', 'main'], ['voucher', 'slide']],
}

const extraSceneParts = { otp: ['shield'], trace: ['qr'], retail: ['terminal'] }

test('process and estimator families own exactly five and two scene factories', () => {
  assert.deepEqual(Object.keys(processScenes), ['discover', 'design', 'build', 'launch', 'optimize'])
  assert.deepEqual(Object.keys(estimatorScenes), ['timeline', 'budget'])
})

test('service family owns exactly nine factories without duplicating process build', () => {
  assert.deepEqual(Object.keys(serviceScenes), [
    'appspace', 'neuralmesh', 'cloudstack', 'strategy', 'campaign', 'delivery', 'signalnet', 'automate', 'integrate',
  ])
  assert.equal(Object.hasOwn(serviceScenes, 'build'), false)
})

test('eSIM family owns exactly the twelve remaining factories without overlapping other families', () => {
  assert.deepEqual(Object.keys(esimScenes), [
    'entry', 'identity', 'reserve', 'qr', 'protected', 'stock', 'batches', 'print', 'confirmation', 'otp', 'trace', 'retail',
  ])
  const keys = [processScenes, estimatorScenes, serviceScenes, esimScenes].flatMap(Object.keys)
  assert.equal(keys.length, 28)
  assert.equal(new Set(keys).size, 28)
})

for (const [kind, factory] of Object.entries({ ...processScenes, ...estimatorScenes, ...serviceScenes, ...esimScenes })) {
  test(kind + ' factory preserves meaningful independent actors and caller-owned materials', () => {
    const render = prefix => renderToStaticMarkup(factory({
      surface: `url(#${prefix}-surface)`, accent: `url(#${prefix}-accent)`, edge: `url(#${prefix}-edge)`,
    }))
    const html = render('first')
    assert.equal(html, render('first'), 'factory must be deterministic without local IDs or state')
    assert.match(html, /^<g\b/)
    assert.match(html, /fill="url\(#first-surface\)"/)
    assert.match(html, /data-material-detail="edge"[^>]*stroke="url\(#first-edge\)"/)
    // Optimize intentionally uses fixed cyan bars, not the accent material.
    // Delivery uses the caller's accent exclusively for pipeline and loop strokes.
    // QR intentionally retains its fixed paper/ink palette instead of accent.
    if (kind === 'delivery') assert.match(html, /stroke="url\(#first-accent\)"/)
    else if (kind === 'qr') {
      assert.doesNotMatch(html, /first-accent/)
      assert.match(html, /fill="var\(--color-avala-paper\)"/)
    } else if (kind !== 'optimize') assert.match(html, /fill="url\(#first-accent\)"/)
    if (kind === 'optimize') assert.match(html, /data-scene-part="chart"/)
    const actors = [...html.matchAll(/<g\b[^>]*class="illustration-gesture"[^>]*>/g)].map(([tag]) => [
      tag.match(/data-scene-part="([^"]+)"/)[1], tag.match(/data-gesture="([^"]+)"/)[1],
    ])
    assert.deepEqual(actors, expected[kind])
    if (Object.hasOwn(esimScenes, kind)) {
      assert.equal(actors.length, 2, 'static extra parts must not become animated actors')
      const parts = [...html.matchAll(/data-scene-part="([^"]+)"/g)].map(([, part]) => part)
      const orderedParts = kind === 'retail'
        ? ['storefront', 'terminal', 'voucher']
        : [...expected[kind].map(([part]) => part), ...(extraSceneParts[kind] ?? [])]
      assert.deepEqual(parts, orderedParts, 'preserve every part and its paint order')
      const staticParts = [...html.matchAll(/<g\b[^>]*>/g)]
        .map(([tag]) => tag).filter(tag => !tag.includes('class="illustration-gesture"'))
      assert.deepEqual(staticParts.map(tag => tag.match(/data-scene-part="([^"]+)"/)[1]), extraSceneParts[kind] ?? [])
      for (const tag of staticParts) assert.doesNotMatch(tag, /data-gesture=|class=/)
    }
    const stack = []
    for (const [tag] of html.matchAll(/<\/?g\b[^>]*>/g)) {
      if (tag.startsWith('</g')) stack.pop()
      else {
        const actor = tag.includes('class="illustration-gesture"')
        if (actor) assert.ok(!stack.includes(true), 'actors must not inherit each other’s displacement')
        if (actor && Object.hasOwn(serviceScenes, kind)) assert.equal(stack.length, 0, 'service actors must be root siblings')
        if (actor && Object.hasOwn(esimScenes, kind)) assert.equal(stack.length, 0, 'eSIM actors must be root siblings')
        stack.push(actor)
      }
    }
    assert.equal(stack.length, 0)
    assert.doesNotMatch(html, /<(?:svg|defs|image|foreignObject|a|button|input|text)\b|\bid=|tabindex=|role=|aria-live=/i)
    assert.doesNotMatch(render('second'), /first-/)
    assert.equal(render('second'), html.replaceAll('first-', 'second-'))
  })
}
