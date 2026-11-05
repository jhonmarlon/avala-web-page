import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { readProjectStyles } from './style-source.mjs'
import { registerHooks } from 'node:module'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { SequenceIllustration } from '../src/components/icons/SequenceIllustration.tsx'

registerHooks({
  load(url, context, nextLoad) {
    const result = nextLoad(url, context)
    return url.endsWith('/config/site.ts')
      ? { ...result, source: result.source.replaceAll('import.meta.env', '({})') }
      : result
  },
})
const { EstimatorPage } = await import('../src/features/estimator/pages/EstimatorPage.tsx')
const { ProposalDetailsModal } = await import('../src/features/estimator/components/ProposalDetailsModal.tsx')
const pageSource = readFileSync(new URL('../src/features/estimator/pages/EstimatorPage.tsx', import.meta.url), 'utf8')
const scenes = html => [...html.matchAll(/data-sequence-scene="([^"]+)"/g)].map(match => match[1])
const render = (Component, props) => renderToStaticMarkup(createElement(Component, props))

for (const [kind, main, detail, gesture] of [
  ['timeline', 'clock', 'schedule', 'slide'],
  ['budget', 'calculator', 'coins', 'lift'],
]) {
  test(`${kind} renders two independent material actors with locally unique decorative IDs`, () => {
    const html = renderToStaticMarkup(createElement('div', null,
      createElement(SequenceIllustration, { kind }), createElement(SequenceIllustration, { kind })))
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1])
    assert.equal(new Set(ids).size, ids.length)
    for (const [svg] of html.matchAll(/<svg\b[\s\S]*?<\/svg>/g)) {
      assert.match(svg, /aria-hidden="true" focusable="false"/)
      assert.match(svg, /viewBox="0 0 96 80"/)
      assert.doesNotMatch(svg, /<image|<foreignObject|<button|<a\b|tabindex=|role=|aria-live=|<animate|<text/)
      for (const material of ['surface', 'accent', 'edge']) {
        assert.match(svg, new RegExp('(?:fill|stroke)="url\\(#[^)]+-sequence-' + material + '\\)"'))
      }
      assert.match(svg, /data-material-detail="edge"/)
      assert.match(svg, /<ellipse cx="48" cy="73"/)
      for (const [, ref] of svg.matchAll(/url\(#([^)]+)\)/g)) assert.ok(svg.includes('id="' + ref + '"'))
      const actors = [...svg.matchAll(/<g\b[^>]*class="illustration-gesture"[^>]*>/g)].map(([tag]) => tag)
      assert.equal(actors.length, 2)
      assert.ok(actors.some(tag => tag.includes(`data-scene-part="${main}"`) && tag.includes('data-gesture="main"')))
      assert.ok(actors.some(tag => tag.includes(`data-scene-part="${detail}"`) && tag.includes(`data-gesture="${gesture}"`)))
      const stack = []
      for (const [tag] of svg.matchAll(/<\/?g\b[^>]*>/g)) {
        if (tag.startsWith('</g')) stack.pop()
        else {
          const actor = tag.includes('class="illustration-gesture"')
          if (actor) assert.ok(!stack.includes(true), 'actors must be siblings, not nested')
          stack.push(actor)
        }
      }
    }
  })
}

test('default estimator uses strategy/discover artwork within whole informational hosts', () => {
  const html = render(EstimatorPage)
  assert.deepEqual(scenes(html), ['strategy', 'discover'])
  const css = readProjectStyles()
  assert.match(css, /\.estimator-illustration-inline\s*\{[^}]*width: 48px;[^}]*height: 40px;/)
  assert.match(css, /\.estimator-illustration-inline \.sequence-illustration\s*\{ width: 48px; height: 40px; \}/)
  assert.match(css, /\.estimator-illustration-empty \.sequence-illustration\s*\{ width: 96px; height: 80px; \}/)
  assert.match(html, /sequence-illustration-host[^>]*>[\s\S]*?estimator-illustration-inline[\s\S]*?data-sequence-scene="strategy"[\s\S]*?Estimación preliminar guiada/)
  assert.match(html, /sequence-illustration-host[^>]*>[\s\S]*?estimator-illustration-empty[\s\S]*?data-sequence-scene="discover"[\s\S]*?Completá la configuración/)
  assert.doesNotMatch(html, /lucide-sparkles|lucide-clock|lucide-circle-dollar/)
  assert.doesNotMatch(pageSource, /\bSparkles\b|\bClock3\b|\bCircleDollarSign\b/)
})

test('conditional metric artwork remains bound to existing result metrics and full hosts', () => {
  const conditional = pageSource.slice(pageSource.indexOf('{hasMinimumData && result ? ('), pageSource.indexOf('Módulos detectados', pageSource.indexOf('{hasMinimumData && result ? (')))
  assert.match(conditional, /sequence-illustration-host[^\n]*space-y-3[\s\S]*?estimator-illustration-inline[\s\S]*?<SequenceIllustration kind="timeline" \/>[\s\S]*?Tiempo estimado[\s\S]*?result\.estimatedMonths\.min[\s\S]*?result\.estimatedHours\.max/)
  assert.match(conditional, /className="sequence-illustration-host space-y-3 border[\s\S]*?estimator-illustration-inline[\s\S]*?<SequenceIllustration kind="budget" \/>[\s\S]*?Inversión estimada[\s\S]*?formatCop\(result\.estimatedCostCop\.min\)[\s\S]*?formatCop\(result\.estimatedCostCop\.max\)/)
})

test('navigation, numbered progress and functional selected-state indicator remain intact', () => {
  const html = render(EstimatorPage)
  assert.equal((html.match(/data-step-state=/g) ?? []).length, 5)
  assert.match(html, /<button[^>]*disabled=""[^>]*>Volver<\/button>/)
  assert.match(html, /Siguiente paso<svg[^>]*class="lucide lucide-arrow-right/)
  assert.match(html, /aria-pressed="false"/)
  assert.match(pageSource, /\{isSelected \? \(\s*<CheckCircle2 className="size-4" \/>/)
  assert.match(pageSource, /onClick=\{handleNext\} disabled=\{!canAdvance\(\)\}/)
  assert.match(pageSource, /onClick=\{\(\) => toggleFeature\(option.value\)\}/)
})

const modalProps = {
  lead: { fullName: '', company: '', email: '', phone: '' }, phoneCountry: 'CO', phoneDigits: '',
  leadErrors: { fullName: '', company: '', email: '', phone: '' }, leadTouched: false,
  isLeadValid: false, isLeadSubmitting: false, submitError: null, honeypot: '',
}
test('submitted proposal uses decorative confirmation without changing dialog or live success text', () => {
  const html = render(ProposalDetailsModal, { ...modalProps, isLeadSubmitted: true })
  assert.deepEqual(scenes(html), ['confirmation'])
  assert.match(html, /role="dialog" aria-modal="true" aria-labelledby="proposal-details-title" aria-describedby="proposal-details-description"/)
  assert.match(html, /<section[^>]*sequence-illustration-host[^>]*aria-live="polite"/)
  assert.match(html, /Solicitud enviada/)
  assert.match(html, /Recibimos tu estimación y tus datos\./)
  assert.match(html, /¡Todo listo!/)
  assert.match(html, /menos de 24 h hábiles con una propuesta personalizada\./)
  assert.match(html, /lucide-x/)
  assert.doesNotMatch(html, /lucide-circle-check|lucide-check-circle/)
  const submitting = render(ProposalDetailsModal, { ...modalProps, isLeadSubmitted: false, isLeadSubmitting: true })
  assert.deepEqual(scenes(submitting), [])
  assert.match(submitting, /lucide-loader-circle/)
  assert.match(submitting, /Enviando tu solicitud…/)
})
