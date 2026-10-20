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
  test('los proyectos principales son los cinco, en el mismo orden en ambos idiomas', () => {
    const ids = ['pases', 'reservas', 'techos', 'plugo', 'resortes']
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

  test('Techos no figura dos veces (está en principales, no en otros)', () => {
    for (const c of [es, en]) expect(c.projects.others.map(o => o.name)).not.toContain('Techos')
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

  test('la experiencia tiene los mismos puestos y fechas en ambos idiomas, del más reciente al más viejo', () => {
    const orgs = ['Teros', 'THV Ingeniería', 'Municipalidad de Funes']
    expect(es.experience.items.map(i => i.org)).toEqual(orgs)
    expect(en.experience.items.map(i => i.org)).toEqual(orgs.map(o => o === 'Municipalidad de Funes' ? 'Municipality of Funes' : o))
    expect(en.experience.items.map(i => i.period)).toEqual(es.experience.items.map(i => i.period.replace('actualidad', 'present')))
    for (const i of es.experience.items) expect(i.points.length).toBeGreaterThanOrEqual(1)
  })

  test('la demo del bot es una conversación que arranca el cliente y termina el bot, igual en ambos idiomas', () => {
    for (const c of [es, en]) {
      const m = c.projects.botDemo.messages
      expect(m.length).toBeGreaterThanOrEqual(4)
      expect(m[0]!.from).toBe('user')
      expect(m.at(-1)!.from).toBe('bot')
    }
    expect(en.projects.botDemo.messages.map(m => m.from)).toEqual(es.projects.botDemo.messages.map(m => m.from))
  })

  test('la recomendación es de Alan, dice que es socio y en inglés aclara que es traducción', () => {
    expect(es.testimonial.name).toBe('Alan Graef')
    expect(en.testimonial.name).toBe('Alan Graef')
    expect(es.testimonial.relation).toMatch(/socio/i)
    expect(en.testimonial.relation).toMatch(/partner/i)
    expect(en.testimonial.note).toMatch(/translat/i)
    expect(es.testimonial.quote.length).toBeGreaterThan(80)
  })

  test.each(langs)('%s no publica datos de contacto de terceros', (_, c) => {
    for (const s of allStrings(c)) {
      expect(s).not.toMatch(/graefalan|216\s?7903/i)
    }
  })

  test('el CV apunta a un PDF por idioma', () => {
    expect(es.hero.cvHref).toBe('/cv/gabriel-sosa-cv-es.pdf')
    expect(en.hero.cvHref).toBe('/cv/gabriel-sosa-cv-en.pdf')
  })
})
