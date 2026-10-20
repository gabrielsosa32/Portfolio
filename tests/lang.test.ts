import { describe, expect, test } from 'vitest'
import { readStoredLang, storeLang } from '~/utils/langStorage'

describe('readStoredLang', () => {
  test('sin storage devuelve español', () => {
    expect(readStoredLang(undefined)).toBe('es')
  })
  test('respeta inglés guardado', () => {
    expect(readStoredLang({ getItem: () => 'en' })).toBe('en')
  })
  test('ignora valores desconocidos', () => {
    expect(readStoredLang({ getItem: () => 'fr' })).toBe('es')
  })
  test('si el storage tira error (modo privado) devuelve español', () => {
    expect(readStoredLang({ getItem: () => { throw new Error('SecurityError') } })).toBe('es')
  })
})

describe('storeLang', () => {
  test('guarda el idioma', () => {
    const saved: Record<string, string> = {}
    storeLang({ setItem: (k, v) => { saved[k] = v } }, 'en')
    expect(saved.lang).toBe('en')
  })
  test('no tira si el storage falla', () => {
    expect(() => storeLang({ setItem: () => { throw new Error('QuotaExceeded') } }, 'en')).not.toThrow()
  })
  test('no tira sin storage', () => {
    expect(() => storeLang(undefined, 'en')).not.toThrow()
  })
})
