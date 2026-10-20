import { expect, test } from 'vitest'
import { splitWords } from '~/utils/words'

test('separa por espacios y descarta vacíos', () => {
  expect(splitWords('  Armo  productos ')).toEqual(['Armo', 'productos'])
})

test('texto vacío da lista vacía', () => {
  expect(splitWords('   ')).toEqual([])
})
