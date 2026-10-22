import type { Lang } from '~/content/types'

/** 2825 → "47:05". Nunca negativo. */
export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

/** Cuánto de la carga ya pasó: 0 recién empieza, 1 terminada. */
export function chargeProgress(remaining: number, total: number): number {
  if (total <= 0) return 1
  return Math.min(1, Math.max(0, 1 - remaining / total))
}

/** Totales acumulados del presupuesto a medida que aparecen los ítems. */
export function quoteSteps(items: { amount: number }[]): number[] {
  let sum = 0
  return items.map(i => (sum += i.amount))
}

/** "$ 1.045.800" en español, "$ 1,045,800" en inglés. */
export function formatMoney(n: number, lang: Lang): string {
  return `$ ${n.toLocaleString(lang === 'es' ? 'es-AR' : 'en-US')}`
}

/** Las demos se mueven solo si están en pantalla, la pestaña se ve y no se pidió reducir movimiento. */
export function shouldAnimate(s: { visible: boolean; hidden: boolean; reduced: boolean }): boolean {
  return s.visible && !s.hidden && !s.reduced
}
