import { describe, expect, test } from 'vitest'
import { createPanelHistory, type HistoryLike } from '~/utils/panelHistory'

/** Historial falso: una pila de URLs con un índice, como el del navegador. */
function fakeHistory(start: string) {
  const entries = [start]
  let index = 0
  const h: HistoryLike & { entries: string[]; current: () => string; backCalls: number } = {
    entries,
    backCalls: 0,
    current: () => entries[index]!,
    pushState: (_s, _t, url) => { entries.splice(index + 1); entries.push(String(url)); index++ },
    replaceState: (_s, _t, url) => { entries[index] = String(url) },
    back: () => { h.backCalls++; if (index > 0) index-- },
  }
  return h
}

describe('historial del panel de proyecto', () => {
  test('abrir con un clic agrega una entrada y cerrar vuelve atrás', () => {
    const h = fakeHistory('/')
    const p = createPanelHistory(h, '/')
    p.open('pases')
    expect(h.current()).toBe('/#pases')
    p.close()
    expect(h.current()).toBe('/')
  })

  test('entrar con link directo deja una entrada propia, así "atrás" cierra el panel y no sale del sitio', () => {
    const h = fakeHistory('/#pases')
    const p = createPanelHistory(h, '/')
    p.openFromLoad('pases')
    expect(h.entries).toEqual(['/', '/#pases'])
    h.back()
    expect(h.current()).toBe('/')
  })

  test('cerrar dos veces seguidas solo vuelve una vez', () => {
    const h = fakeHistory('/')
    const p = createPanelHistory(h, '/')
    p.open('plugo')
    p.close()
    p.close()
    expect(h.backCalls).toBe(1)
    expect(h.current()).toBe('/')
  })

  test('cerrar sin entrada propia no va atrás', () => {
    const h = fakeHistory('/')
    const p = createPanelHistory(h, '/')
    p.close()
    expect(h.backCalls).toBe(0)
  })

  test('cerrar un panel abierto por un hash escrito a mano limpia el hash sin ir atrás', () => {
    const h = fakeHistory('/')
    const p = createPanelHistory(h, '/')
    h.pushState(null, '', '/#plugo') // el usuario editó la URL
    p.synced(true)
    p.close()
    expect(h.backCalls).toBe(0)
    expect(h.current()).toBe('/')
  })

  test('cuando el navegador cambia el hash, synced olvida el estado anterior', () => {
    const h = fakeHistory('/')
    const p = createPanelHistory(h, '/')
    p.open('pases')
    h.back()          // el usuario aprieta atrás
    p.synced(false)   // popstate: ya no hay proyecto en el hash
    p.close()
    expect(h.backCalls).toBe(1)
  })
})
