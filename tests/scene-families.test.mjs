import assert from 'node:assert/strict'
import { test } from 'node:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { processScenes } from '../src/components/icons/scenes/processScenes.tsx'
import { estimatorScenes } from '../src/components/icons/scenes/estimatorScenes.tsx'
import { serviceScenes } from '../src/components/icons/scenes/serviceScenes.tsx'

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
}

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

for (const [kind, factory] of Object.entries({ ...processScenes, ...estimatorScenes, ...serviceScenes })) {
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
    if (kind === 'delivery') assert.match(html, /stroke="url\(#first-accent\)"/)
    else if (kind !== 'optimize') assert.match(html, /fill="url\(#first-accent\)"/)
    if (kind === 'optimize') assert.match(html, /data-scene-part="chart"/)
    const actors = [...html.matchAll(/<g\b[^>]*class="illustration-gesture"[^>]*>/g)].map(([tag]) => [
      tag.match(/data-scene-part="([^"]+)"/)[1], tag.match(/data-gesture="([^"]+)"/)[1],
    ])
    assert.deepEqual(actors, expected[kind])
    const stack = []
    for (const [tag] of html.matchAll(/<\/?g\b[^>]*>/g)) {
      if (tag.startsWith('</g')) stack.pop()
      else {
        const actor = tag.includes('class="illustration-gesture"')
        if (actor) assert.ok(!stack.includes(true), 'actors must not inherit each other’s displacement')
        if (actor && Object.hasOwn(serviceScenes, kind)) assert.equal(stack.length, 0, 'service actors must be root siblings')
        stack.push(actor)
      }
    }
    assert.equal(stack.length, 0)
    assert.doesNotMatch(html, /<(?:svg|defs|image|foreignObject|a|button|input|text)\b|\bid=|tabindex=|role=|aria-live=/i)
    assert.doesNotMatch(render('second'), /first-/)
    assert.equal(render('second'), html.replaceAll('first-', 'second-'))
  })
}
