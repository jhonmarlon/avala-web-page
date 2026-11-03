import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'
import { test } from 'node:test'

// Only ContactForm's hooks are controlled; its public element props and handlers stay real.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'react' && context.parentURL?.endsWith('/contact/components/ContactForm.tsx')) {
      return { url: 'contact:hooks', shortCircuit: true }
    }
    return nextResolve(specifier, context)
  },
  load(url, context, nextLoad) {
    if (url === 'contact:hooks') return {
      format: 'module', shortCircuit: true,
      source: `export const useId = () => 'contact-test';
        export const useRef = value => globalThis.__contactHooks.ref ??= { current: value };
        export const useState = initial => {
          const state = globalThis.__contactHooks;
          const index = state.cursor++;
          if (!(index in state.values)) state.values[index] = initial;
          return [state.values[index], value => {
            state.values[index] = typeof value === 'function' ? value(state.values[index]) : value;
          }];
        };`,
    }
    if (url.endsWith('.png')) return { format: 'module', source: 'export default "fixture.png"', shortCircuit: true }
    const result = nextLoad(url, context)
    return url.endsWith('/config/site.ts')
      ? { ...result, source: result.source.replaceAll('import.meta.env', '({})') }
      : result
  },
})
const { ContactForm } = await import('../src/features/contact/components/ContactForm.tsx')
const { companyInfo } = await import('../src/config/site.ts')
const { whatsappLink } = await import('../src/features/contact/data/channels.ts')
const { services } = await import('../src/config/services.ts')

function elements(node) {
  if (Array.isArray(node)) return node.flatMap(elements)
  if (!node || typeof node !== 'object' || !node.props) return []
  return [node, ...elements(node.props.children)]
}
function render() {
  globalThis.__contactHooks.cursor = 0
  return elements(ContactForm())
}

for (const withOptional of [false, true]) {
  test(`WhatsApp sends a neutral inquiry with ${withOptional ? 'included' : 'omitted'} optional fields`, () => {
    const previousWindow = globalThis.window
    const calls = []
    globalThis.window = { open: (...args) => calls.push(args) }
    globalThis.__contactHooks = { cursor: 0, values: [] }
    try {
      let tree = render()
      const change = (name, value) => tree.find((node) => node.props.name === name).props.onChange({ target: { value } })
      change('name', '  Ana Pérez  ')
      change('email', '  ana@example.com  ')
      change('message', '  Necesito ayuda con mi eSIM.  ')
      if (withOptional) {
        change('company', '  Ejemplo  ')
        const phone = tree.find((node) => node.props.nationalDigits !== undefined)
        phone.props.onCountryChange('BZ')
        phone.props.onDigitsChange('0012345')
        const chips = tree.filter((node) => node.props['aria-pressed'] !== undefined)
        assert.deepEqual(chips.map((node) => node.props.children), services.map((service) => service.title))
        chips[0].props.onClick()
        chips[1].props.onClick()
      }
      tree = render()
      tree.find((node) => node.props['data-cursor'] === 'WhatsApp').props.onClick()
      assert.equal(calls.length, 1)
      const [href, target, features] = calls[0]
      assert.equal(target, '_blank')
      assert.equal(features, 'noopener')
      const actual = new URL(href)
      const destination = new URL(whatsappLink.href)
      assert.equal(actual.origin, destination.origin)
      assert.equal(actual.pathname, destination.pathname)
      assert.deepEqual([...actual.searchParams.keys()], ['text'])
      assert.equal(actual.searchParams.get('text'), [
        `Hola ${companyInfo.name}, quiero hacer una consulta.`, '', 'Nombre: Ana Pérez',
        ...(withOptional ? ['Empresa: Ejemplo'] : []), 'Email: ana@example.com',
        ...(withOptional ? ['Teléfono: +5010012345', `Interés: ${services[0].title}, ${services[1].title}`] : []),
        '', 'Necesito ayuda con mi eSIM.',
      ].join('\n'))
      tree = render()
      assert.ok(tree.some((node) => node.props.role === 'status'))
      tree.find((node) => node.props['data-cursor'] === 'Reintentar').props.onClick()
      assert.deepEqual(calls[1], calls[0])
      tree.find((node) => node.props['data-cursor'] === 'Nuevo').props.onClick()
      tree = render()
      for (const name of ['name', 'email', 'company', 'message']) {
        assert.equal(tree.find((node) => node.props.name === name).props.value, '')
      }
      const phone = tree.find((node) => node.props.nationalDigits !== undefined)
      assert.equal(phone.props.country, 'CO')
      assert.equal(phone.props.nationalDigits, '')
      assert.ok(tree.filter((node) => node.props['aria-pressed'] !== undefined).every((node) => node.props['aria-pressed'] === false))
      assert.equal(calls.length, 2)
    } finally {
      if (previousWindow === undefined) delete globalThis.window
      else globalThis.window = previousWindow
      delete globalThis.__contactHooks
    }
  })
}
