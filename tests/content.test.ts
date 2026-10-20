import { describe, expect, test } from 'vitest'
import { es } from '~/content/es'
import { en } from '~/content/en'
import type { SiteContent } from '~/content/types'

const langs: [string, SiteContent][] = [['es', es], ['en', en]]

function allStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) return value.flatMap(allStrings)
  if (value && typeof value === 'object') return Object.values(value).flatMap(allStrings)
  return []
}

describe('contenido ES/EN', () => {
  test('los proyectos principales son los cuatro, en el mismo orden en ambos idiomas', () => {
    const ids = ['pases', 'reservas', 'plugo', 'resortes']
    expect(es.projects.main.map(p => p.id)).toEqual(ids)
    expect(en.projects.main.map(p => p.id)).toEqual(ids)
  })

  test.each(langs)('cada proyecto principal en %s tiene historia completa', (_, c) => {
    for (const p of c.projects.main) {
      expect(p.tagline.trim(), p.id).not.toBe('')
      expect(p.problem.trim(), p.id).not.toBe('')
      expect(p.built.length, p.id).toBeGreaterThanOrEqual(2)
      expect(p.hard.length, p.id).toBeGreaterThanOrEqual(2)
      expect(p.result.length, p.id).toBeGreaterThanOrEqual(2)
    }
  })

  test('url, imagen, estado y stack son idénticos entre idiomas', () => {
    es.projects.main.forEach((p, i) => {
      const q = en.projects.main[i]!
      expect(q.url).toBe(p.url)
      expect(q.image).toBe(p.image)
      expect(q.status).toBe(p.status)
      expect(q.stack).toEqual(p.stack)
    })
  })

  test('otros proyectos y proyectos de datos están alineados entre idiomas', () => {
    expect(en.projects.others.length).toBe(es.projects.others.length)
    expect(en.data.projects.length).toBe(es.data.projects.length)
    expect(en.data.projects.map(d => d.repo)).toEqual(es.data.projects.map(d => d.repo))
    expect(en.data.certificates.length).toBe(es.data.certificates.length)
  })

  test.each(langs)('%s no usa títulos prohibidos ni texto de relleno', (_, c) => {
    for (const s of allStrings(c)) {
      expect(s).not.toMatch(/co-?fundador|\bCTO\b|co-?founder|lorem/i)
      expect(s).not.toMatch(/\bTODO\b/)
      // La placa de Plugo la hace un tercero: se habla de firmware, no de hardware.
      expect(s).not.toMatch(/hardware/i)
      // Decidido por Gabriel: "desarrollador principal", no "único".
      expect(s).not.toMatch(/único desarrollador|sole developer/i)
    }
  })

  test.each(langs)('%s no linkea repos privados ni repos con README roto', (_, c) => {
    const links = [
      ...c.projects.main.map(p => p.url),
      ...c.data.projects.map(d => d.repo),
    ].filter((l): l is string => Boolean(l))
    for (const l of links) {
      expect(l).toMatch(/^https:\/\//)
      expect(l).not.toMatch(/Teros12|series-prediction|Clasificador-imagenes/i)
    }
  })

  test('la frase de rol dice desarrollador principal', () => {
    expect(es.about.role).toContain('Desarrollador principal')
    expect(en.about.role.toLowerCase()).toContain('lead developer')
  })

  test('el CV apunta a un PDF por idioma', () => {
    expect(es.hero.cvHref).toBe('/cv/gabriel-sosa-cv-es.pdf')
    expect(en.hero.cvHref).toBe('/cv/gabriel-sosa-cv-en.pdf')
  })
})
