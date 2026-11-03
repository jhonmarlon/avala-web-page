import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Children, createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { PhoneField } from '../src/components/ui/phone/PhoneField.tsx'
import { composePhone, isValidNationalPhone, MAX_NATIONAL_DIGITS } from '../src/lib/phone.ts'

test('Contact country and national controls share an end-aligned row even with a wrapping caption', () => {
  const field = PhoneField({
    id: 'contact-phone', name: 'phone',
    label: createElement('span', { className: 'flex items-baseline gap-3' },
      createElement('span', null, '04'), createElement('span', null, 'Teléfono'),
      createElement('span', null, '(opcional)')),
    country: 'CO', nationalDigits: '', disabled: false, error: 'Revisá el número.',
    onDigitsChange() {}, onCountryChange() {}, onBlur() {},
  })
  const html = renderToStaticMarkup(field)
  const row = html.match(/<div class="([^"]*grid-cols-\[7rem_minmax\(0,1fr\)\][^"]*)">/)[1].split(' ')
  assert.ok(row.includes('items-end'), 'Both label/control columns must align at the bottom')
  const controls = [...html.matchAll(/<(?:button|input)\b[^>]*>/g)]
  assert.equal(controls.length, 2)
  for (const [tag] of controls) {
    const classes = tag.match(/class="([^"]*)"/)[1].split(' ')
    for (const token of ['min-h-11', 'py-3', 'text-base', 'border']) assert.ok(classes.includes(token), token)
  }
  // Validation remains outside the paired columns so it cannot move one control.
  assert.equal(field.props.children[1].type, 'p')
  assert.equal(field.props.children[1].props.children, 'Revisá el número.')
})

// The reused control's public callback boundary, without mocking React state.
test('Contact identity and error overrides preserve national-only callbacks and country independence', () => {
  const calls = []
  const field = PhoneField({
    id: 'contact-phone', name: 'phone', label: '04 Teléfono (opcional)',
    errorId: 'contact-phone-error', errorRole: 'alert', className: 'space-y-2',
    country: 'CO', nationalDigits: '0012345', disabled: false, error: 'Revisá el número.',
    onDigitsChange: (value) => calls.push(['digits', value]),
    onCountryChange: (value) => calls.push(['country', value]), onBlur() {},
  })
  const selector = field.props.children[0]
  const input = Children.toArray(selector.props.children.props.children).find((child) => child.type === 'input').props
  assert.equal(input.id, 'contact-phone')
  assert.equal(input.name, 'phone')
  assert.equal(input.value, '0012345')
  assert.equal(input.maxLength, MAX_NATIONAL_DIGITS)
  assert.equal(input['aria-describedby'], 'contact-phone-error')
  assert.equal(input['aria-invalid'], true)
  input.onChange({ target: { value: '00 123-45abc٢' } })
  selector.props.onCountryChange('BZ')
  assert.deepEqual(calls, [['digits', '0012345'], ['country', 'BZ']])
  assert.equal(input.value, '0012345')
  const html = renderToStaticMarkup(field)
  assert.match(html, /<label for="contact-phone"[^>]*>04 Teléfono \(opcional\)/)
  assert.match(html, /id="contact-phone-country"/)
  assert.match(html, /aria-controls="contact-phone-country-list"/)
  assert.match(html, /<p id="contact-phone-error" role="alert"[^>]*>Revisá el número\./)
  assert.doesNotMatch(html, /proposal-phone|\brequired=/)
})

test('delivery helper composes optional bounded national drafts without counting prefixes toward validation', () => {
  for (const country of ['CO', 'BZ', 'US']) {
    assert.equal(composePhone(country, ''), '')
    assert.equal(isValidNationalPhone(''), true)
    assert.equal(isValidNationalPhone('001234'), false)
    assert.equal(isValidNationalPhone('0012345'), true)
    assert.ok(composePhone(country, '0'.repeat(MAX_NATIONAL_DIGITS)).length <= 40)
  }
  assert.equal(composePhone('CO', '0012345'), '+570012345')
  assert.equal(composePhone('BZ', '0012345'), '+5010012345')
})
