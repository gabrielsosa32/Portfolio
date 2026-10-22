import { expect, test } from 'vitest'
import { shouldAnimate } from '~/utils/demos'

test('anima solo si está en pantalla, la pestaña está visible y no hay reducir movimiento', () => {
  expect(shouldAnimate({ visible: true, hidden: false, reduced: false })).toBe(true)
  expect(shouldAnimate({ visible: false, hidden: false, reduced: false })).toBe(false)
  expect(shouldAnimate({ visible: true, hidden: true, reduced: false })).toBe(false)
  expect(shouldAnimate({ visible: true, hidden: false, reduced: true })).toBe(false)
})
