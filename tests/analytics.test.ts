import { expect, test } from 'vitest'
import { goatcounterScript } from '~/utils/analytics'

test('sin código no se carga ningún script', () => {
  expect(goatcounterScript('')).toBeNull()
  expect(goatcounterScript('   ')).toBeNull()
})

test('con código arma el script oficial de GoatCounter', () => {
  expect(goatcounterScript('gabrielsosa')).toEqual({
    src: 'https://gc.zgo.at/count.js',
    async: true,
    'data-goatcounter': 'https://gabrielsosa.goatcounter.com/count',
  })
})

test('rechaza códigos con caracteres raros', () => {
  expect(goatcounterScript('evil.com/x')).toBeNull()
  expect(goatcounterScript('a b')).toBeNull()
})
