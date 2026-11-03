import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router'

globalThis.__esimReducedMotion = false
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === '@/lib/use-media-query' && context.parentURL?.endsWith('/ui/NumberedStepSequence.tsx')) {
      return { url: 'esim:media', shortCircuit: true }
    }
    return nextResolve(specifier, context)
  },
  load(url, context, nextLoad) {
    if (url === 'esim:media') return {
      format: 'module', shortCircuit: true,
      source: "export const useMediaQuery = query => query.includes('reduced-motion') ? globalThis.__esimReducedMotion : false;",
    }
    if (url.endsWith('.png')) return { format: 'module', source: 'export default "fixture.png"', shortCircuit: true }
    const result = nextLoad(url, context)
    return url.endsWith('/config/site.ts')
      ? { ...result, source: result.source.replaceAll('import.meta.env', '({ VITE_ESIM_PWA_URL: "https://esim.example.invalid/" })') }
      : result
  },
})
const { EsimPage } = await import('../src/pages/EsimPage.tsx')
const { ServicesSection } = await import('../src/features/home/sections/ServicesSection.tsx')
const render = () => renderToStaticMarkup(createElement(MemoryRouter, null, createElement(EsimPage)))
const copy = [
  'SIEMBRA eSIM · Activación digital segura',
  'Comprá o activá tu eSIM en pocos pasos, sin complicaciones.',
  'SIEMBRA conecta compra web, voucher físico, validación OTP y entrega del QR final de instalación en una experiencia simple, segura y trazable.',
  'Compra web sin voucher', 'Activación con voucher físico', 'QR final de instalación',
  'Flujo protegido', 'Del ingreso al QR final',
  'Elegí cómo empezar', 'Comprá una eSIM online o activá un voucher físico adquirido en punto de venta.',
  'Validamos tu identidad', 'Tus datos se verifican paso a paso con OTP por WhatsApp o correo.',
  'Protegemos la disponibilidad', 'En compra web, reservamos inventario antes del pago para evitar sobreventa.',
  'Recibís tu QR final', 'Al finalizar, te entregamos el QR de instalación de la eSIM listo para usar.',
  'Dos entradas, una experiencia segura',
  'SIEMBRA separa compra web y activación por voucher para que cada flujo valide lo que corresponde.',
  'No mezclamos reglas de negocio: el usuario que compra online no necesita voucher, y quien ya tiene voucher no pasa por pago. Cada camino tiene sus validaciones, estados y controles.',
  'Elegí tu camino', 'Dos acciones distintas, una misma experiencia segura.',
  'Comprá online si todavía no tenés voucher, o activá tu voucher físico si ya lo adquiriste en un punto de venta. Cada botón inicia el flujo correcto sin mezclar validaciones.',
  'Operación y trazabilidad', 'Una línea de negocio preparada para usuarios, tiendas y operación interna.',
  'SIEMBRA no es solo una pantalla de activación. La plataforma soporta inventario, lotes de vouchers, impresión controlada, validaciones parciales y entrega final de eSIM.',
  'Inventario interno de eSIMs con consecutivos controlados.', 'Lotes administrativos de vouchers físicos.',
  'Impresión diferida e individual de vouchers.', 'Confirmación operativa de impresión.',
  'Validaciones por OTP y código raspable.', 'Trazabilidad desde voucher o compra web hasta QR final.',
  'Para puntos de venta y aliados', 'Voucher físico con control digital de punta a punta.',
  'Los vouchers pueden generarse por lote, imprimirse después y confirmarse de forma administrativa. El cliente escanea el QR del voucher, valida identidad y solo después ingresa el código raspable.',
  '¿Sos empresa o punto de venta?',
  'Hablemos para activar operación con inventario, vouchers físicos y trazabilidad comercial.',
]
const actions = [
  ['https://siembradigital.avalashop.com/', 'Compra web segura', 'Comprar eSIM', 'Para usuarios que llegan desde la web, sin voucher físico. El sistema valida datos, reserva inventario antes del pago y entrega el QR de instalación.'],
  ['/contacto', 'Contactar a AvalaGroup'],
]

test('eSIM preserves all copy, steps, heading hierarchy and same-tab native destinations', () => {
  const html = render()
  const headline = copy[1]
  const h1 = html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/)[0]
  assert.equal([...h1.matchAll(/aria-label="([^"]*)"/g)].map((match) => match[1]).join(' '), headline)
  for (const text of copy.filter((text) => text !== headline)) assert.ok(html.includes(text), text)
  assert.equal((html.match(/<section\b/g) ?? []).length, 5)
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1)
  assert.equal((html.match(/<h2\b/g) ?? []).length, 5)
  for (const title of ['Comprar eSIM online', 'Activar voucher físico', '¿Sos empresa o punto de venta?']) {
    assert.ok([...html.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/g)].some((match) => match[1] === title), title)
  }
  assert.deepEqual([...html.matchAll(/Paso (\d)/g)].map((match) => match[1]), ['1', '2', '3', '4'])
  const anchors = [...html.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g)].map((match) => match[0])
  assert.ok(anchors[0].includes('href="https://siembradigital.avalashop.com/"'))
  assert.equal(anchors.length, 2)
  actions.forEach(([href, ...labels], index) => {
    assert.ok(anchors[index].includes(`href="${href}"`))
    const cta = index === 0 ? labels[1] : labels[0]
    assert.ok(anchors[index].includes(cta), cta)
    for (const label of labels) assert.ok(html.includes(label), label)
    assert.doesNotMatch(anchors[index], /target=|role="button"|<button\b|<a\b[^>]*>[\s\S]*<a\b/)
  })
  assert.match(anchors[1], /data-discover="true"/)
  assert.doesNotMatch(anchors[0], /data-discover=/)
})

test('Home services preserve their normal hover paint, title movement and links', () => {
  const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(ServicesSection)))
  const links = [...html.matchAll(/<a\b[^>]*href="\/soluciones"[^>]*>[\s\S]*?<\/a>/g)].map(([link]) => link)
  assert.equal(links.length, 10)
  for (const link of links) {
    assert.match(link, /group relative isolate grid/)
    assert.match(link, /overflow-hidden border-b border-avala-paper\/15 px-4 py-4/)
    assert.match(link, /pointer-events-none absolute inset-0 -z-10 origin-bottom scale-y-0 bg-avala-neon transition-transform duration-500 ease-\[cubic-bezier\(0\.76,0,0\.24,1\)\] group-hover:scale-y-100/)
    assert.match(link, /group-hover:translate-x-3 group-hover:text-avala-ink/)
    assert.match(link, /group-hover:text-avala-ink\/80 lg:block/)
    assert.match(link, /group-hover:rotate-45 group-hover:text-avala-ink/)
  }
})

test('protected steps use Home-style outlined panels without becoming interactive', () => {
  const html = render()
  const list = html.match(/<ol\b[^>]*>([\s\S]*?)<\/ol>/)[1]
  const rows = [...list.matchAll(/<li\b[^>]*>[\s\S]*?<\/li>/g)].map(([row]) => row)
  assert.equal(rows.length, 4)
  assert.equal(list.replace(/<li\b[^>]*>[\s\S]*?<\/li>/g, '').trim(), '')
  rows.forEach((row, index) => {
    assert.ok(row.includes(`Paso ${index + 1}`))
    assert.match(row, /<article class="relative flex shrink-0 flex-col gap-4 border-avala-paper\/15 py-8 lg:w-\[min\(64vw,56rem\)\] lg:border-l lg:px-8 lg:py-6">/)
    assert.doesNotMatch(row, /opacity:0|translateY/)
    assert.match(row, /<div class="hud-label flex justify-between"><span class="tabular text-avala-neon">Paso /)
    assert.match(row, /stroke-width="1.25"[^>]*class="[^"]*size-5 text-avala-paper\/60/)
    assert.match(row, /<p aria-hidden="true" class="display-tight text-outline tabular [^"]*\[--stroke-w:2px\][^"]*\[--stroke-c:rgba\(238,242,255,0.85\)\][^"]*drop-shadow[^>]*>/)
    assert.ok(row.includes(`>${String(index + 1).padStart(2, '0')}</p>`))
    assert.match(row, /<h3 class="display-tight text-\[clamp\(1.75rem,3vw,2.5rem\)\] leading-\[1.15\] text-avala-paper">/)
    assert.match(row, /<p class="text-base leading-7 text-avala-paper\/65 sm:text-lg sm:leading-8">/)
    assert.ok(row.includes(`lucide-${['smartphone', 'shield-check', 'lock-keyhole', 'qr-code'][index]}`))
    assert.doesNotMatch(row, /group-hover:|origin-bottom|sticky|pinning/)
    assert.doesNotMatch(row, /<a\b|<button\b|tabindex=|role="button"|cursor-pointer|group-hover:opacity|group-hover:block/)
  })
})

test('protected panels remain visible and stationary for reduced motion', () => {
  globalThis.__esimReducedMotion = true
  try {
    const html = render()
    const list = html.match(/<ol\b[^>]*>([\s\S]*?)<\/ol>/)[1]
    assert.equal((list.match(/<article\b/g) ?? []).length, 4)
    assert.deepEqual([...list.matchAll(/Paso (\d)/g)].map((match) => match[1]), ['1', '2', '3', '4'])
    assert.doesNotMatch(list, /style="[^"]*(?:opacity|transform)/)
    assert.doesNotMatch(list, /opacity:0|translateY|group-hover:|sticky/)
  } finally {
    globalThis.__esimReducedMotion = false
  }
})

test('eSIM previews the physical voucher with a native disabled coming-soon control', () => {
  const html = render()
  assert.ok(html.includes('Activar voucher físico'))
  assert.ok(html.includes('Ya tengo voucher'))
  assert.ok(html.includes('Para clientes que ya tienen un voucher. El flujo valida el voucher, confirma identidad con OTP y luego solicita el código raspable.'))
  const buttons = [...html.matchAll(/<button\b[^>]*>[\s\S]*?<\/button>/g)].map(([button]) => button)
  assert.equal(buttons.length, 1)
  assert.match(buttons[0], /type="button"/)
  assert.match(buttons[0], /\sdisabled=""/)
  assert.match(buttons[0], />Disponible próximamente<\/button>$/)
  assert.match(buttons[0], /border-avala-paper\/25 bg-avala-ink/)
  assert.doesNotMatch(buttons[0], /href=|tabindex=|<a\b|onclick=/i)
  assert.doesNotMatch(html, /href="[^"]*\/activar"/)
  for (const [anchor] of html.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g)) {
    assert.doesNotMatch(anchor, /<button\b|<a\b[^>]*>[\s\S]*<a\b/)
  }
})

test('eSIM uses an editorial split header, flat numbered rows and shared CTA families', () => {
  const html = render()
  assert.match(html, /relative isolate bg-avala-ink text-avala-paper/)
  assert.match(html, /mask-image:linear-gradient/)
  const header = html.match(/<header\b[^>]*>[\s\S]*?<\/header>/)[0]
  assert.match(header, /<h1[^>]*class="[^"]*display-tight[^\"]*text-title-hero/)
  assert.match(header, /aria-label="Comprá o activá tu eSIM"/)
  assert.match(header, /class="[^"]*text-avala-neon" aria-label="en pocos pasos, sin complicaciones\."/)
  assert.doesNotMatch(header, /lg:grid-cols|<ol\b/)
  assert.match(html, /<ol[^>]*>[\s\S]*Paso 1[\s\S]*Paso 4[\s\S]*<\/ol>/)
  assert.equal((html.match(/origin-left bg-avala-paper\/15/g) ?? []).length, 5)
  const anchors = [...html.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g)].map(([anchor]) => anchor)
  assert.match(anchors[0], /bg-avala-neon text-avala-ink/)
  assert.match(anchors[1], /border-avala-paper\/25/)
  for (const anchor of anchors) {
    assert.match(anchor, /group inline-flex h-12/)
    for (const [svg] of anchor.matchAll(/<svg\b[^>]*>/g)) assert.match(svg, /aria-hidden="true"/)
  }
  // Section 04 now intentionally uses the approved compact ink Card family.
  const unchangedSections = html.replace(/<section\b[^>]*>(?:(?!<section\b)[\s\S])*?Operación y trazabilidad[\s\S]*?<\/section>/, '')
  assert.doesNotMatch(unchangedSections, /bg-gradient|radial-gradient|shadow-|blur-|rounded-full|rounded-\[|text-slate-|text-white|text-brand-|bg-white|bg-amber|bg-cyan/)
  assert.doesNotMatch(html, /<main\b/)
})
