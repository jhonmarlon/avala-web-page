import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

registerHooks({
  load(url, context, nextLoad) {
    const result = nextLoad(url, context)
    return url.endsWith('/config/site.ts')
      ? { ...result, source: result.source.replaceAll('import.meta.env', '({})') }
      : result
  },
})
const { EstimatorPage } = await import('../src/features/estimator/pages/EstimatorPage.tsx')
const { companyInfo } = await import('../src/config/site.ts')

test('estimator intro uses shared section label, company hours and accessible split title', () => {
  const html = renderToStaticMarkup(createElement(EstimatorPage))
  const intro = html.slice(0, html.indexOf('</section>'))
  assert.match(intro, />\(E\)<\/span>/)
  assert.match(intro, />Estimador<\/span>/)
  assert.ok(intro.includes(companyInfo.hours))
  assert.match(intro, /h-px overflow-hidden bg-avala-paper\/15/)
  assert.equal((intro.match(/class="section-divider-shine"/g) ?? []).length, 1)
  const heading = intro.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/)?.[0] ?? ''
  assert.match(heading, /max-w-\[20ch\] text-title-page text-avala-paper/)
  assert.match(heading, /aria-label="Configura tu proyecto" role="text"/)
  assert.match(heading, /class="inline-block text-avala-neon" aria-label="y recibe una estimación inicial" role="text"/)
  assert.equal((heading.match(/role="text"/g) ?? []).length, 2)
  assert.match(intro, /Responde algunas preguntas y obtén una visión preliminar/)
  assert.match(intro, /Paso actual:/)
})
