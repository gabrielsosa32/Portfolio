export interface ChatMessage {
  from: 'user' | 'bot'
  text: string
}

export interface ChatStep {
  /** Momento (ms desde el inicio) en que aparece el indicador "escribiendo…"; null si no hay. */
  typingAt: number | null
  /** Momento en que aparece el mensaje. */
  showAt: number
}

interface Options {
  /** Pausa entre que llega un mensaje y empieza el siguiente. */
  gapMs?: number
  /** Tiempo de "escribiendo…" por carácter para el bot. */
  msPerChar?: number
  minTypingMs?: number
  maxTypingMs?: number
  /** Pausa al final antes de reiniciar el loop. */
  endPauseMs?: number
}

const DEFAULTS = { gapMs: 700, msPerChar: 18, minTypingMs: 600, maxTypingMs: 1800, endPauseMs: 3500 }

/** Calcula cuándo aparece cada mensaje del chat de demo. El bot "escribe" antes de responder. */
export function chatSchedule(messages: ChatMessage[], opts: Options = {}): ChatStep[] {
  const o = { ...DEFAULTS, ...opts }
  let t = 400
  return messages.map((m) => {
    if (m.from === 'user') {
      const step = { typingAt: null, showAt: t }
      t += o.gapMs + m.text.length * 6
      return step
    }
    const typing = Math.min(o.maxTypingMs, Math.max(o.minTypingMs, m.text.length * o.msPerChar))
    const step = { typingAt: t, showAt: t + typing }
    t = step.showAt + o.gapMs
    return step
  })
}

chatSchedule.total = (steps: ChatStep[], opts: Options = {}): number =>
  (steps.at(-1)?.showAt ?? 0) + (opts.endPauseMs ?? DEFAULTS.endPauseMs)
