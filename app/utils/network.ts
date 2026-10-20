export interface NetNode { x: number; y: number; vx: number; vy: number }

const SPEED = 0.35
const MOUSE_RADIUS = 110
const MOUSE_PUSH = 1.6

export function createNodes(count: number, w: number, h: number, rand: () => number = Math.random): NetNode[] {
  return Array.from({ length: count }, () => {
    const angle = rand() * Math.PI * 2
    return {
      x: rand() * w,
      y: rand() * h,
      vx: Math.cos(angle) * SPEED,
      vy: Math.sin(angle) * SPEED,
    }
  })
}

/** Avanza un cuadro: deriva, rebote en los bordes y empuje suave lejos del mouse. Muta los nodos. */
export function stepNodes(nodes: NetNode[], w: number, h: number, mouse: { x: number; y: number } | null): void {
  for (const n of nodes) {
    n.x += n.vx
    n.y += n.vy

    if (mouse) {
      const dx = n.x - mouse.x
      const dy = n.y - mouse.y
      const d = Math.hypot(dx, dy)
      if (d < MOUSE_RADIUS) {
        const force = (1 - d / MOUSE_RADIUS) * MOUSE_PUSH
        const ux = d === 0 ? 1 : dx / d
        const uy = d === 0 ? 0 : dy / d
        n.x += ux * force
        n.y += uy * force
      }
    }

    if (n.x < 0) { n.x = 0; n.vx = Math.abs(n.vx) }
    else if (n.x > w) { n.x = w; n.vx = -Math.abs(n.vx) }
    if (n.y < 0) { n.y = 0; n.vy = Math.abs(n.vy) }
    else if (n.y > h) { n.y = h; n.vy = -Math.abs(n.vy) }
  }
}

export function nodeCountFor(width: number): number {
  return Math.min(80, Math.max(18, Math.round(width / 20)))
}

export function linkAlpha(dist: number, maxDist: number): number {
  return dist >= maxDist ? 0 : 1 - dist / maxDist
}
