import { expect, test } from 'vitest'
import { hashForProject, projectIdFromHash } from '~/utils/hash'

const ids = ['pases', 'reservas', 'techos', 'plugo', 'resortes'] as const

test('reconoce el hash de un proyecto', () => {
  expect(projectIdFromHash('#pases', ids)).toBe('pases')
})
test('no distingue mayúsculas', () => {
  expect(projectIdFromHash('#PASES', ids)).toBe('pases')
})
test('hash desconocido devuelve null', () => {
  expect(projectIdFromHash('#xyz', ids)).toBeNull()
})
test('hash vacío devuelve null', () => {
  expect(projectIdFromHash('', ids)).toBeNull()
})
test('hash de sección no es proyecto', () => {
  expect(projectIdFromHash('#proyectos', ids)).toBeNull()
})
test('hashForProject arma el hash', () => {
  expect(hashForProject('plugo')).toBe('#plugo')
})
