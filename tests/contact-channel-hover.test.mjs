import assert from 'node:assert/strict'
import { test } from 'node:test'
import { registerHooks } from 'node:module'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
registerHooks({
  load(url, context, nextLoad) {
    const result = nextLoad(url, context)
    // Supply an empty Vite environment without reading local environment files.
    return url.endsWith('/config/site.ts')
      ? { ...result, source: result.source.replaceAll('import.meta.env', '({})') }
      : result
  },
})
const { ContactChannelList } = await import('../src/features/contact/components/ContactChannelList.tsx')
const { contactChannels } = await import('../src/features/contact/data/channels.ts')

test('contact values alone use the smaller reusable typography role and retain all channel details', () => {
  const html = renderToStaticMarkup(React.createElement(ContactChannelList))
  const anchors = [...html.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g)].map(([anchor]) => anchor)
  assert.equal(anchors.length, 4)
  for (const [index, channel] of contactChannels.entries()) {
    const anchor = anchors[index]
    assert.ok(anchor.includes(`href="${channel.href.replaceAll('&', '&amp;')}"`))
    assert.ok(anchor.includes(`data-cursor="${channel.cursor}"`))
    assert.equal(anchor.includes('target="_blank" rel="noreferrer"'), channel.external)
    const spans = [...anchor.matchAll(/<span class="([^"]*)">([^<]*)<\/span>/g)]
    const value = spans.find(([, , text]) => text === channel.value)
    assert.ok(value, `Missing ${channel.value}`)
    for (const token of ['text-contact-value', 'display-tight', 'leading-tight', 'min-w-0',
      '[overflow-wrap:anywhere]', 'group-hover:text-avala-ink', 'group-active:text-avala-ink']) {
      assert.ok(value[1].split(' ').includes(token), `Missing ${token}`)
    }
    const label = spans.find(([, , text]) => text === channel.label)
    assert.ok(label[1].split(' ').includes('hud-label'))
    assert.ok(!label[1].includes('text-contact-value'))
    assert.ok(spans.some(([, classes, text]) => text === String(index + 1).padStart(2, '0') && classes.includes('hud-label')))
  }
})

test('contact arrows match the dark diamond reference with larger neon hover icons', () => {
  const html = renderToStaticMarkup(React.createElement(ContactChannelList))
  const arrows = [...html.matchAll(/<span class="([^"]*group-hover:rotate-45[^"]*)">/g)]
  const links = [...html.matchAll(/<a\b/g)]
  assert.ok(arrows.length > 0)
  assert.equal(arrows.length, links.length)
  for (const [, classes] of arrows) {
    assert.ok(classes.split(' ').includes('bg-avala-ink'))
    assert.ok(classes.split(' ').includes('border-avala-paper/20'))
    assert.ok(classes.split(' ').includes('text-avala-paper'))
    assert.ok(classes.split(' ').includes('sm:size-14'))
    assert.ok(classes.split(' ').includes('group-hover:text-avala-neon'))
    assert.ok(classes.split(' ').includes('group-active:text-avala-neon'))
    assert.doesNotMatch(classes, /group-(?:hover|active):(?:bg-|border-)/)
  }
  assert.equal([...html.matchAll(/<svg\b[^>]*class="[^"]*\bsm:size-7\b[^"]*"/g)].length, arrows.length)
  assert.match(html, /bg-avala-neon[^"<]*group-hover:scale-y-100/)
})
