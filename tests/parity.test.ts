import { readFileSync } from 'node:fs'
import { describe, expect, test } from 'vitest'
import { es } from '~/content/es'
import { en } from '~/content/en'
import { shapeDiff } from './support/shape'

describe('shapeDiff', () => {
  test('detecta una clave que falta', () => {
    expect(shapeDiff({ a: 'x', b: 'y' }, { a: 'x' })).toContain('b: falta en la segunda')
  })
  test('detecta listas de distinto largo', () => {
    expect(shapeDiff({ l: ['1', '2', '3'] }, { l: ['1', '2'] })).toContain('l: largo 3 vs 2')
  })
  test('detecta textos vacíos', () => {
    expect(shapeDiff({ a: 'x' }, { a: ' ' })).toContain('a: texto vacío')
  })
  test('estructuras iguales no dan diferencias', () => {
    expect(shapeDiff({ a: 'x', l: [{ b: 'y' }] }, { a: 'z', l: [{ b: 'w' }] })).toEqual([])
  })
})

test('el inglés tiene exactamente la misma estructura que el español', () => {
  expect(shapeDiff(es, en)).toEqual([])
})

describe('CV', () => {
  test.each(['es', 'en'])('el CV %s no habla de hardware ni de títulos viejos ni tiene teléfono', (l) => {
    const html = readFileSync(`docs/cv/cv-${l}.html`, 'utf8')
    expect(html).not.toMatch(/hardware/i)
    expect(html).not.toMatch(/único desarrollador|sole developer/i)
    expect(html).not.toMatch(/co-?fundador|\bCTO\b|co-?founder/i)
    expect(html).not.toMatch(/tel:|\+54/)
  })
})
