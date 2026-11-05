import assert from 'node:assert/strict'
import { test } from 'node:test'
import { registerHooks } from 'node:module'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router'

registerHooks({
  load(url, context, next) {
    if (url.endsWith('.png')) return {
      format: 'module',
      source: 'export default "fixture.png"',
      shortCircuit: true,
    }
    const result = next(url, context)
    return url.endsWith('/config/site.ts')
      ? {
          ...result,
          source: result.source.replaceAll('import.meta.env', '({})'),
        }
      : result
  },
})

const { ProcessSection } = await import(
  '../src/features/home/sections/ProcessSection.tsx'
)
const { EsimPage } = await import('../src/pages/EsimPage.tsx')
const render = Component => renderToStaticMarkup(
  createElement(MemoryRouter, null, createElement(Component)),
)

test('real Home and eSIM fallback panels share presentation and preserve separate customer semantics', () => {
  const home = render(ProcessSection)
  const esim = render(EsimPage)
  const articles = html => [
    ...html.matchAll(/<article\b[^>]*>[\s\S]*?<\/article>/g),
  ].map(([article]) => article)
  const stages = articles(home)
  const steps = articles(esim)

  assert.equal(stages.length, 5)
  assert.equal(steps.length, 4)

  const classes = article => [
    ...article.matchAll(/class="([^"]*)"/g),
  ].map(match => match[1])

  for (const step of steps) {
    const actual = classes(step)
    const expected = classes(stages[0])
    assert.deepEqual(actual, expected)
    assert.doesNotMatch(step, /<a\b|<button\b|tabindex=|opacity:0/)
  }

  assert.deepEqual(
    [...home.matchAll(/Etapa (\d{2})/g)].map(match => match[1]),
    ['01', '02', '03', '04', '05'],
  )
  assert.match(home, /Continuar/)

  const list = esim.match(/<ol\b[^>]*>[\s\S]*?<\/ol>/)[0]
  assert.equal((list.match(/<li\b/g) ?? []).length, 4)
  assert.doesNotMatch(list, /Flujo protegido|Del ingreso al QR final/)
  assert.deepEqual(
    [...list.matchAll(/Paso (\d)/g)].map(match => match[1]),
    ['1', '2', '3', '4'],
  )
})
