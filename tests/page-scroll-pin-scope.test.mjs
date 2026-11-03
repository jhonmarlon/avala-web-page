import assert from 'node:assert/strict'
import { test } from 'node:test'
import { registerHooks } from 'node:module'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const state = { enabled: true }
globalThis.__pagePinLayout = state
registerHooks({
  resolve(specifier, context, next) {
    if (context.parentURL?.endsWith('/PublicLayout.tsx') && (specifier === 'react-router' || specifier.startsWith('@/components/') || specifier === '@/lib/smooth-scroll')) {
      if (specifier.endsWith('/PageScrollPinScope')) return next(specifier, context)
      return { url: `layout:${specifier}`, shortCircuit: true }
    }
    return next(specifier, context.parentURL?.startsWith('layout:') ? { ...context, parentURL: import.meta.url } : context)
  },
  load(url, context, next) {
    if (!url.startsWith('layout:')) return next(url, context)
    const name = url.split('/').at(-1)
    const source = url === 'layout:react-router'
      ? `import { createElement } from 'react'; export const useMatches = () => [{ handle: { pageScrollPin: globalThis.__pagePinLayout.enabled } }]; export const Outlet = () => createElement('article', null, 'route content');`
      : name === 'smooth-scroll' ? 'export const startSmoothScroll = () => {}; export const stopSmoothScroll = () => {};'
      : `import { createElement } from 'react'; export const ${name} = () => ${name === 'Header' || name === 'Footer' ? `createElement('${name.toLowerCase()}', null, '${name}')` : 'null'};`
    return { format: 'module', source, shortCircuit: true }
  },
})
registerHooks({
  resolve(specifier, context, next) {
    if (context.parentURL?.endsWith('/router/index.tsx')) {
      if (specifier === 'react-router') return { url: 'route:router', shortCircuit: true }
      return { url: 'route:component', shortCircuit: true }
    }
    return next(specifier, context)
  },
  load(url, context, next) {
    if (url === 'route:router') return { format: 'module', shortCircuit: true, source: 'export const createBrowserRouter = routes => routes;' }
    if (url === 'route:component') return { format: 'module', shortCircuit: true, source: 'const C = () => null; export { C as PublicLayout, C as AboutPage, C as ContactPage, C as EstimatorPage, C as EsimComingSoonPage, C as EsimPage, C as HomePage, C as PrivacyPage, C as ServicesPage, C as SuccessCasesPage, C as TermsPage };' }
    return next(url, context)
  },
})
const { router } = await import('../src/app/router/index.tsx')
test('only Home and eSIM opt into the shared full-page pin', () => {
  assert.deepEqual(router[0].children.filter(route => route.handle?.pageScrollPin).map(route => route.index ? '/' : route.path), ['/', 'esim'])
})
const { PublicLayout } = await import('../src/app/layouts/PublicLayout.tsx')
const render = () => renderToStaticMarkup(React.createElement(PublicLayout))
test('opted-in route keeps main and Footer in one stable pin frame after Header, even before registration', () => {
  state.enabled = true
  const html = render()
  assert.match(html, /<header>Header<\/header><div[^>]*data-page-pin-scope=""[^>]*><div[^>]*data-page-pin-frame=""[^>]*><main><article>route content<\/article><\/main><footer>Footer<\/footer><\/div><\/div>/)
  assert.equal((html.match(/<main>/g) ?? []).length, 1)
  assert.equal((html.match(/<footer>/g) ?? []).length, 1)
  assert.doesNotMatch(html, /height:|position:sticky|transform:/, 'no registered fitting core means normal flow, no reserve')
})
test('other routes retain original Header/main/Footer DOM without a pin wrapper', () => {
  state.enabled = false
  assert.match(render(), /<header>Header<\/header><main><article>route content<\/article><\/main><footer>Footer<\/footer>/)
  assert.doesNotMatch(render(), /data-page-pin/)
})
