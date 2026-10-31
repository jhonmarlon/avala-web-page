import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router'
import {
  BrainCircuit, Cloud, Code2, Infinity as InfinityIcon, Megaphone,
  MessagesSquare, Puzzle, RadioTower, Settings, Smartphone,
} from 'lucide-react'

registerHooks({
  load(url, context, nextLoad) {
    // Keep catalog images inert and configuration independent of local Vite env files.
    if (url.endsWith('.png')) return { format: 'module', source: `export default ${JSON.stringify(url)}`, shortCircuit: true }
    const result = nextLoad(url, context)
    return url.endsWith('/config/site.ts')
      ? { ...result, source: result.source.replaceAll('import.meta.env', '({})') }
      : result
  },
})
const { services } = await import('../src/config/services.ts')
const { LocalClock } = await import('../src/components/ui/LocalClock.tsx')
const { ContactForm } = await import('../src/features/contact/components/ContactForm.tsx')
const { AboutPage } = await import('../src/pages/AboutPage.tsx')
const { SuccessCasesPage } = await import('../src/pages/SuccessCasesPage.tsx')
const { ServicesPage } = await import('../src/pages/ServicesPage.tsx')
const { EsimComingSoonPage } = await import('../src/pages/EsimComingSoonPage.tsx')
const render = (Component, route) => renderToStaticMarkup(
  createElement(MemoryRouter, { initialEntries: [route] }, createElement(Component)),
)
const anchors = (html) => [...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)]

// Titles are also Contact's interest values; preserve exact copy and order, not just count.
const catalog = [
  ['Automatización de procesos', 'Eliminamos tareas repetitivas y optimizamos flujos de trabajo con automatización inteligente.', Settings],
  ['Desarrollo web', 'Creamos plataformas modernas, escalables y enfocadas en resultados medibles.', Code2],
  ['Aplicaciones móviles', 'Desarrollamos experiencias móviles conectadas con tu negocio y tus operaciones.', Smartphone],
  ['Inteligencia artificial', 'Integramos IA para analizar datos, asistir decisiones y automatizar acciones.', BrainCircuit],
  ['Integraciones', 'Conectamos sistemas, APIs y plataformas para que tu operación funcione en armonía.', Puzzle],
  ['Cloud', 'Implementamos soluciones seguras y escalables en la nube para sostener crecimiento.', Cloud],
  ['Consultoría', 'Acompañamiento estratégico para definir soluciones tecnológicas a la medida.', MessagesSquare],
  ['Marketing digital', 'Estrategias medibles para generar visibilidad, leads y crecimiento comercial.', Megaphone],
  ['DevOps', 'Automatizamos despliegues y operaciones para acelerar entrega y confiabilidad.', InfinityIcon],
  ['Telecomunicaciones', 'Soluciones de voz, red y conectividad para potenciar la operación del negocio.', RadioTower],
]

test('service catalog preserves its ten ordered titles, descriptions, icons and CTA data', () => {
  assert.deepEqual(services.map(({ title, description, Icon }) => [title, description, Icon]), catalog)
  assert.deepEqual(services.map(({ ctaLabel }) => ctaLabel), Array(10).fill('Ver más'))
  assert.deepEqual(services.map(({ featured }) => featured), [true, ...Array(9).fill(undefined)])
})

test('Contact exposes every catalog title as an initially unselected interest in catalog order', () => {
  const html = render(ContactForm, '/contacto')
  const interests = [...html.matchAll(/<button\b[^>]*aria-pressed="false"[^>]*>([\s\S]*?)<\/button>/g)]
  assert.deepEqual(interests.map(([, text]) => text), catalog.map(([title]) => title))
  for (const [button] of interests) assert.match(button, /type="button"/)
})

test('clock SSR preserves the ISO instant and two-digit Bogotá time across the UTC date boundary', (t) => {
  // SSR executes the state initializer, not effects: this does not prove interval ticking or cleanup.
  t.mock.timers.enable({ apis: ['Date'], now: new Date('2026-01-02T02:04:09.000Z') })
  assert.equal(
    renderToStaticMarkup(createElement(LocalClock)),
    '<time class="tabular" dateTime="2026-01-02T02:04:09.000Z">MDE 21:04:09 UTC−5</time>',
  )
})

const legacyRoutes = [
  [AboutPage, '/nosotros', 'Nosotros', 'Página preparada para contenido institucional.'],
  [SuccessCasesPage, '/casos-de-exito', 'Casos de éxito', 'Estructura preparada para mostrar resultados y testimonios.'],
  [ServicesPage, '/soluciones', 'Soluciones', 'Ruta lista para desarrollar el catálogo de servicios.'],
]

for (const [Component, route, eyebrow, title] of legacyRoutes) {
  test(`${route} preserves the legacy placeholder shell and route-specific copy`, () => {
    const html = render(Component, route)
    assert.match(html, /^<section class="page-container section-spacing">/)
    assert.equal((html.match(/<section\b/g) ?? []).length, 1)
    assert.match(html, /<div class="rounded-5xl border border-slate-200 bg-white p-10 shadow-soft">/)
    assert.ok(html.includes(`<p class="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">${eyebrow}</p>`))
    assert.ok(html.includes(`<h1 class="mt-4 text-4xl font-semibold tracking-tight text-slate-950">${title}</h1>`))
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1)
    assert.doesNotMatch(html, /<main\b|<button\b/)
    if (route !== '/soluciones') {
      assert.equal(anchors(html).length, 0)
      assert.doesNotMatch(html, /<h2\b/)
    }
  })
}

test('Services retains its estimator promotion and single native internal CTA', () => {
  const html = render(ServicesPage, '/soluciones')
  assert.match(html, /<div class="space-y-6">/)
  assert.match(html, /overflow-hidden rounded-\[1\.75rem\] border border-brand-200/)
  for (const text of [
    'Configurador inteligente',
    '¿Todavía no tenés claro el alcance de tu solución?',
    'Configurá tu proyecto y obtené una estimación preliminar de complejidad, tiempo e inversión.',
  ]) assert.ok(html.includes(text), text)
  assert.equal((html.match(/<h2\b/g) ?? []).length, 1)
  const links = anchors(html)
  assert.equal(links.length, 1)
  assert.equal(links[0][1], '/estimar-proyecto')
  assert.match(links[0][2], /^Estimar mi proyecto<svg\b/)
  assert.match(links[0][0], /data-discover="true"/)
  assert.doesNotMatch(links[0][0], /target=|<button\b|role="button"/)
})

const comingSoonRoutes = [
  ['/comprar', 'Compra web SIEMBRA', 'La compra online de eSIM estará disponible próximamente.',
    'Estamos preparando una experiencia segura para comprar, validar tus datos, reservar inventario y recibir el QR final de instalación sin fricción.'],
  ['/activar', 'Activación por voucher', 'La activación de voucher estará disponible próximamente.',
    'Muy pronto vas a poder escanear tu voucher físico, validar tu identidad con OTP y completar la activación hasta recibir el QR final.'],
]

for (const [route, eyebrow, title, description] of comingSoonRoutes) {
  test(`${route} preserves its distinct coming-soon copy and return destinations`, () => {
    const html = render(EsimComingSoonPage, route)
    assert.match(html, /^<section\b/)
    assert.match(html, /relative min-h-\[calc\(100svh-5rem\)\] overflow-hidden text-white/)
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1)
    assert.ok(html.includes(`>${title}</h1>`))
    for (const text of [eyebrow, description, 'Vista en construcción', 'Validación segura', 'QR final de instalación']) {
      assert.ok(html.includes(text), text)
    }
    const links = anchors(html)
    assert.deepEqual(links.map(([, href]) => href), ['/esim', '/contacto'])
    assert.match(links[0][2], /^Volver a SIEMBRA eSIM<svg\b/)
    assert.equal(links[1][2], 'Quiero que me avisen')
    for (const [link] of links) assert.doesNotMatch(link, /target=|<button\b|role="button"/)
    assert.doesNotMatch(html, /<form\b|<button\b/)
    const otherTitle = comingSoonRoutes.find(([otherRoute]) => otherRoute !== route)[2]
    assert.ok(!html.includes(otherTitle))
  })
}
