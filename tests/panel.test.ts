import { expect, test } from 'vitest'
import { nextPanelState } from '~/utils/panel'

test('abrir deja abierto ese proyecto', () => {
  expect(nextPanelState(null, { type: 'open', id: 'pases' })).toBe('pases')
})
test('cerrar no deja nada abierto', () => {
  expect(nextPanelState('pases', { type: 'close' })).toBeNull()
})
test('si el hash queda sin proyecto, se cierra', () => {
  expect(nextPanelState('pases', { type: 'hash', id: null })).toBeNull()
})
test('si el hash nombra un proyecto, se abre ese', () => {
  expect(nextPanelState(null, { type: 'hash', id: 'techos' })).toBe('techos')
})
