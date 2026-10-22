import { expect, test } from 'vitest'
import { shouldAnimate } from '~/utils/demos'

test('anima solo si está en pantalla, la pestaña está visible y no hay reducir movimiento', () => {
  expect(shouldAnimate({ visible: true, hidden: false, reduced: false })).toBe(true)
  expect(shouldAnimate({ visible: false, hidden: false, reduced: false })).toBe(false)
  expect(shouldAnimate({ visible: true, hidden: true, reduced: false })).toBe(false)
  expect(shouldAnimate({ visible: true, hidden: false, reduced: true })).toBe(false)
})

test('no anima si está en pausa (por ejemplo, la portada tapada por el panel abierto)', () => {
  expect(shouldAnimate({ visible: true, hidden: false, reduced: false, paused: true })).toBe(false)
  expect(shouldAnimate({ visible: true, hidden: false, reduced: false, paused: false })).toBe(true)
})

test('no anima hasta que la página terminó de cargar', () => {
  expect(shouldAnimate({ visible: true, hidden: false, reduced: false, ready: false })).toBe(false)
  expect(shouldAnimate({ visible: true, hidden: false, reduced: false, ready: true })).toBe(true)
})
