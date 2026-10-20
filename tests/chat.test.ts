import { describe, expect, test } from 'vitest'
import { chatSchedule } from '~/utils/chat'

const msgs = [
  { from: 'user' as const, text: 'Hola' },
  { from: 'bot' as const, text: 'Hola! ¿Para cuándo?' },
  { from: 'user' as const, text: 'Mañana' },
]

describe('chatSchedule', () => {
  test('cada mensaje aparece después del anterior', () => {
    const s = chatSchedule(msgs)
    expect(s).toHaveLength(3)
    for (let i = 1; i < s.length; i++) expect(s[i]!.showAt).toBeGreaterThan(s[i - 1]!.showAt)
  })

  test('el bot "escribe" antes de mandar; el usuario no', () => {
    const s = chatSchedule(msgs)
    expect(s[0]!.typingAt).toBeNull()
    expect(s[1]!.typingAt).not.toBeNull()
    expect(s[1]!.typingAt!).toBeLessThan(s[1]!.showAt)
    expect(s[1]!.typingAt!).toBeGreaterThan(s[0]!.showAt)
  })

  test('los mensajes largos tardan más en escribirse', () => {
    const corto = chatSchedule([{ from: 'bot', text: 'Ok' }])[0]!
    const largo = chatSchedule([{ from: 'bot', text: 'x'.repeat(120) }])[0]!
    expect(largo.showAt - largo.typingAt!).toBeGreaterThan(corto.showAt - corto.typingAt!)
  })

  test('el tipeo nunca tarda más que el tope', () => {
    const s = chatSchedule([{ from: 'bot', text: 'x'.repeat(5000) }], { maxTypingMs: 1800 })[0]!
    expect(s.showAt - s.typingAt!).toBeLessThanOrEqual(1800)
  })

  test('total es el momento del último mensaje más la pausa final', () => {
    const s = chatSchedule(msgs, { endPauseMs: 3000 })
    expect(chatSchedule.total(s, { endPauseMs: 3000 })).toBe(s[2]!.showAt + 3000)
  })
})
