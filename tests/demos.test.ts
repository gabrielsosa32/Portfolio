import { describe, expect, test } from 'vitest'
import { chargeProgress, formatClock, formatMoney, quoteSteps } from '~/utils/demos'

describe('formatClock', () => {
  test('minutos y segundos con dos dígitos', () => {
    expect(formatClock(2825)).toBe('47:05')
    expect(formatClock(59)).toBe('00:59')
  })
  test('nunca negativo', () => {
    expect(formatClock(-3)).toBe('00:00')
  })
})

describe('chargeProgress', () => {
  test('va de 0 (recién empieza) a 1 (terminado)', () => {
    expect(chargeProgress(0, 3600)).toBe(1)
    expect(chargeProgress(3600, 3600)).toBe(0)
    expect(chargeProgress(1800, 3600)).toBeCloseTo(0.5)
  })
  test('se acota si sobra tiempo', () => {
    expect(chargeProgress(5000, 3600)).toBe(0)
  })
})

test('quoteSteps acumula los montos', () => {
  expect(quoteSteps([{ amount: 1 }, { amount: 2 }, { amount: 3 }])).toEqual([1, 3, 6])
  expect(quoteSteps([])).toEqual([])
})

test('formatMoney usa el separador de cada idioma', () => {
  expect(formatMoney(1045800, 'es')).toBe('$ 1.045.800')
  expect(formatMoney(1045800, 'en')).toBe('$ 1,045,800')
})
