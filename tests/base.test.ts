import { expect, test } from 'vitest'
import { withBase } from '~/utils/base'

test('prefija la ruta con la base del sitio', () => {
  expect(withBase('/Portfolio/', '/img/og.png')).toBe('/Portfolio/img/og.png')
})
test('con base raíz no cambia nada', () => {
  expect(withBase('/', '/cv/a.pdf')).toBe('/cv/a.pdf')
})
test('tolera base sin barra final y ruta sin barra inicial', () => {
  expect(withBase('/Portfolio', 'img/x.webp')).toBe('/Portfolio/img/x.webp')
})
test('deja intactas las URLs absolutas', () => {
  expect(withBase('/Portfolio/', 'https://github.com/x')).toBe('https://github.com/x')
})
