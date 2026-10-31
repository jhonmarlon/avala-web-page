import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import * as phone from '../src/features/estimator/utils/phone.ts'
import { PhoneField } from '../src/features/estimator/components/PhoneField.tsx'

const ids = (query) => phone.searchPhoneCountries(query).map(({ id }) => id)
test('search matches names, accents, ISO and dial codes without merging shared prefixes', () => {
  assert.deepEqual(ids('  méXICO '), ['MX'])
  assert.deepEqual(ids('haiti'), ['HT'])
  assert.deepEqual(ids('PERÚ'), ['PE'])
  assert.deepEqual(ids('co'), ['CO', 'CR', 'MX', 'PR'])
  assert.deepEqual(ids(' +57 '), ['CO'])
  assert.deepEqual(ids('57'), ['CO'])
  assert.deepEqual(ids('+1'), ['US', 'PR', 'DO'])
  assert.deepEqual(ids('zzzz'), [])
  assert.deepEqual(ids(''), phone.phoneCountries.map(({ id }) => id))
  assert.equal(phone.phoneCountries.length, 24)
})

test('collapsed selector exposes full selection, semantics, disabled state and unchanged draft', () => {
  for (const country of ['CO', 'PR', 'DO', 'US']) {
    const selected = phone.phoneCountries.find(({ id }) => id === country)
    const html = renderToStaticMarkup(createElement(PhoneField, {
      country, nationalDigits: '001234567', disabled: true, error: 'Error de teléfono',
      onCountryChange() { assert.fail('render changed selection') },
      onDigitsChange() { assert.fail('render changed draft') }, onBlur() {},
    }))
    const button = html.match(/<button\b[^>]*>/)?.[0] ?? ''
    assert.match(button, /type="button"/)
    assert.match(button, /disabled=""/)
    assert.match(button, /aria-haspopup="listbox"/)
    assert.match(button, /aria-expanded="false"/)
    assert.match(button, /aria-controls="proposal-phone-country-list"/)
    assert.ok(button.includes(`aria-label="Código de país: ${selected.name} (+${selected.dial})"`))
    assert.ok(html.includes(`>${country} +${selected.dial}<`))
    assert.match(html, /value="001234567"/)
    assert.match(html, /aria-describedby="proposal-phone-error"/)
    assert.match(html, /Error de teléfono/)
  }
})
