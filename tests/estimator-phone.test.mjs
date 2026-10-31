import assert from 'node:assert/strict'
import { test } from 'node:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { Children } from 'react'
import { phoneCountries, DEFAULT_PHONE_COUNTRY, MAX_NATIONAL_DIGITS, sanitizePhoneDigits, composePhone, isValidNationalPhone } from '../src/features/estimator/utils/phone.ts'
import { PhoneField } from '../src/features/estimator/components/PhoneField.tsx'

const country = (id) => phoneCountries.find((entry) => entry.id === id)
const controls = (element) => {
  const result = []
  function visit(node) {
    Children.forEach(node, (child) => {
      if (!child || typeof child !== 'object') return
      if (['input', 'select', 'label', 'p'].includes(child.type)) result.push(child)
      visit(child.props.children)
    })
  }
  visit(element)
  return result
}
const props = {
  country: DEFAULT_PHONE_COUNTRY, nationalDigits: '001234567', disabled: false,
  error: '', onCountryChange() {}, onDigitsChange() {}, onBlur() {},
}

test('phone sanitizes typing and formatted paste to ASCII digits, retaining zeros', () => {
  for (const [input, expected] of [['abc', ''], ['00 12-3.(4)+5abc', '0012345'], ['\t0\n1 😀٢３', '01'], ['', '']]) {
    assert.equal(sanitizePhoneDigits(input), expected)
  }
  assert.equal(sanitizePhoneDigits('9'.repeat(60)), '9'.repeat(MAX_NATIONAL_DIGITS))
})

test('regional catalog has correct ISO identities and dialing codes', () => {
  assert.equal(DEFAULT_PHONE_COUNTRY, 'CO')
  assert.deepEqual(Object.fromEntries(phoneCountries.map(({ id, dial }) => [id, dial])), {
    AR: '54', BZ: '501', BO: '591', BR: '55', CL: '56', CO: '57', CR: '506', CU: '53',
    EC: '593', SV: '503', US: '1', GT: '502', HT: '509', HN: '504', MX: '52', NI: '505',
    PA: '507', PY: '595', PE: '51', PR: '1', DO: '1', UY: '598', VE: '58', ES: '34',
  })
  assert.equal(new Set(phoneCountries.map(({ id }) => id)).size, phoneCountries.length)
})

test('country selection changes only the canonical prefix, never the national draft', () => {
  for (const id of ['CO', 'US', 'DO', 'PR', 'ES', 'BR']) {
    assert.equal(composePhone(id, '001234567'), `+${country(id).dial}001234567`)
  }
  for (const { id } of phoneCountries) {
    assert.ok(composePhone(id, '0'.repeat(MAX_NATIONAL_DIGITS)).length <= 40)
    assert.equal(composePhone(id, ''), '')
    assert.equal(composePhone(id, 'junk +()-'), '')
  }
})

test('optional phone requires at least seven NATIONAL digits, not prefix length', () => {
  assert.equal(isValidNationalPhone(''), true)
  assert.equal(isValidNationalPhone('123456'), false)
  assert.equal(isValidNationalPhone('0012345'), true)
  assert.equal(isValidNationalPhone('abc1234567'), false)
  assert.equal(isValidNationalPhone('1'.repeat(MAX_NATIONAL_DIGITS + 1)), false)
})

test('compact field preserves numeric national input, autocomplete and controlled values', () => {
  const nodes = controls(PhoneField(props))
  const input = nodes.find(({ type }) => type === 'input').props
  const selector = PhoneField(props).props.children[0]
  assert.equal(selector.props.country, 'CO')
  assert.equal(input.value, '001234567')
  assert.equal(input.id, 'proposal-phone')
  assert.equal(input.name, undefined)
  assert.equal(selector.props.id, 'proposal-phone-country')
  assert.equal(nodes.find(({ type }) => type === 'label').props.children, 'Teléfono')
  assert.equal(input.type, 'tel')
  assert.equal(input.inputMode, 'numeric')
  assert.equal(input.pattern, '[0-9]*')
  assert.equal(input.autoComplete, 'tel-national')
  assert.equal(input.maxLength, MAX_NATIONAL_DIGITS)
  assert.equal(input.required, undefined)
  assert.equal(input['aria-invalid'], false)
  assert.equal(input['aria-describedby'], undefined)
  assert.deepEqual(nodes.filter(({ type }) => type === 'label').map(({ props }) => props.htmlFor), [input.id])
  const html = renderToStaticMarkup(PhoneField(props))
  assert.match(html, /aria-label="Código de país: Colombia \(\+57\)"/)
  assert.match(html, />CO \+57</)
  assert.match(html, /grid-cols-\[7rem_minmax\(0,1fr\)\]/)
  const row = html.match(/<div class="([^"]*grid-cols-\[7rem_minmax\(0,1fr\)\][^"]*)">/)[1].split(' ')
  assert.ok(row.includes('items-end'), 'Default Estimator columns share bottom alignment')
  for (const [tag] of html.matchAll(/<(?:button|input)\b[^>]*>/g)) {
    const classes = tag.match(/class="([^"]*)"/)[1].split(' ')
    for (const token of ['min-h-11', 'py-3', 'text-base', 'border']) assert.ok(classes.includes(token), token)
  }
  assert.doesNotMatch(html, /<select/)
  assert.match(html, /Teléfono/)
})

test('callbacks filter paste, retain zeros, forward ISO identity, and preserve blur and errors', () => {
  const calls = []
  const field = PhoneField({ ...props, disabled: true, error: 'Ingresa un número de teléfono válido.',
    onCountryChange: (value) => calls.push(value), onDigitsChange: (value) => calls.push(value), onBlur: () => calls.push('blur'),
  })
  const nodes = controls(field)
  const input = nodes.find(({ type }) => type === 'input').props
  const select = field.props.children[0].props
  assert.equal(input.disabled, true)
  assert.equal(select.disabled, true)
  assert.equal(input['aria-invalid'], true)
  for (const token of ['border-red-300', 'not-forced-colors:autofill:not-focus:border-red-300', 'not-forced-colors:autofill:focus:border-red-300', 'focus-visible:ring-2']) {
    assert.ok(input.className.split(' ').includes(token), token)
  }
  assert.ok(!input.className.includes('not-focus:border-avala-paper/25'))
  assert.ok(!input.className.includes('autofill:focus:border-avala-neon'))
  assert.equal(nodes.find(({ type }) => type === 'p').props.id, input['aria-describedby'])
  assert.equal(nodes.find(({ type }) => type === 'p').props.children, 'Ingresa un número de teléfono válido.')
  input.onChange({ target: { value: '00a 123-4567' } })
  select.onCountryChange('PR')
  input.onBlur()
  select.onBlur()
  assert.deepEqual(calls, ['001234567', 'PR', 'blur', 'blur'])
})
