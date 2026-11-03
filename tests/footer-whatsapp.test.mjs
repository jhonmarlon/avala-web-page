import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

registerHooks({
  load(url, context, nextLoad) {
    if (url.endsWith('.png')) return { format: 'module', source: `export default ${JSON.stringify(url)}`, shortCircuit: true }
    const result = nextLoad(url, context)
    return url.endsWith('/config/site.ts')
      ? { ...result, source: result.source.replaceAll('import.meta.env', '({})') }
      : result
  },
})
const { Footer } = await import('../src/components/layout/Footer.tsx')
const { companyInfo, footerLinkGroups, legalLinks, socialLinks } = await import('../src/config/site.ts')

test('Footer social links share square outline controls with accessible names', () => {
  const html = renderToStaticMarkup(createElement(Footer))
  const socials = [...html.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g)]
    .map(([anchor]) => anchor).filter((anchor) => !anchor.includes('Hablemos por WhatsApp') && anchor.includes('target="_blank"'))
  assert.equal(socials.length, 3)
  for (const [index, link] of socialLinks.entries()) {
    const anchor = socials[index]
    assert.ok(anchor.includes(`href="${link.href}"`))
    assert.ok(anchor.includes(`aria-label="${link.label}"`))
    assert.match(anchor, /target="_blank"/)
    assert.match(anchor, /rel="noreferrer"/)
    for (const token of ['size-11', 'p-0', 'shrink-0', 'rounded-sm', 'border-avala-paper/25',
      'bg-avala-ink', 'text-avala-paper', 'focus-visible:ring-avala-neon/60']) {
      assert.ok(anchor.includes(token), `Missing ${token} on ${anchor}`)
    }
    assert.match(anchor, /<svg\b[^>]*aria-hidden="true"[^>]*class="size-4"/)
    assert.doesNotMatch(anchor, /rounded-full|size-10|\bpx-|\bpy-|bg-white/)
  }
})

test('Footer softens only its retained image background and preserves content and destinations', () => {
  const html = renderToStaticMarkup(createElement(Footer))
  const footer = html.match(/<footer\b[^>]*>/)[0]
  assert.match(footer, /background-image:linear-gradient\(180deg, rgba\(4, 11, 30, 0\.92\) 0%, rgba\(5, 13, 34, 0\.95\) 100%\), url\([^)]*background_3\.png\)/)
  assert.match(footer, /background-size:cover;background-position:center bottom;background-repeat:no-repeat/)
  assert.doesNotMatch(footer, /opacity/)
  assert.match(html, /<img[^>]*avala_logo\.png[^>]*alt="Avala Group"/)
  for (const value of Object.values(companyInfo)) assert.ok(html.includes(value), `Missing ${value}`)
  for (const group of [...footerLinkGroups, { links: legalLinks }]) {
    if (group.title) assert.ok(html.includes(group.title))
    for (const link of group.links) assert.ok(html.includes(`href="${link.href}" class="transition-colors hover:text-brand-300">${link.label}</a>`))
  }
})

test('Footer WhatsApp CTA uses the reusable outline family with an unwrapped green icon', () => {
  const html = renderToStaticMarkup(createElement(Footer))
  const anchors = [...html.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g)].map(([anchor]) => anchor)
  const ctas = anchors.filter((anchor) => anchor.includes('Hablemos por WhatsApp'))
  assert.equal(ctas.length, 1)
  const cta = ctas[0]
  assert.match(cta, /href="https:\/\/wa.me\/573126573502"/)
  assert.match(cta, /target="_blank"/)
  assert.match(cta, /rel="noreferrer"/)
  for (const token of [
    'rounded-sm', 'border-avala-paper/25', 'bg-avala-ink', 'text-avala-paper',
    'px-4', 'py-3', 'min-h-11', 'transition-colors',
    'hover:border-avala-neon/50', 'hover:bg-avala-neon/10',
    'focus-visible:ring-2', 'focus-visible:ring-avala-neon/60', 'motion-reduce:transition-none',
  ]) assert.ok(cta.includes(token), `Missing ${token} on ${cta}`)
  assert.match(cta, /><svg\b[^>]*aria-hidden="true"[^>]*class="size-5 shrink-0 text-green-400"/)
  assert.match(cta, /<\/svg>Hablemos por WhatsApp<\/a>$/)
  assert.doesNotMatch(cta, /<span|rounded-full|rounded-\[|bg-green|bg-\[|gradient|shadow-|brightness|transition-all|min-h-\[/)
  assert.doesNotMatch(html, /Chatear ahora/)
})
