import { describe, expect, test } from 'vitest'
import { createNodes, linkAlpha, nodeCountFor, stepNodes } from '~/utils/network'

function seeded(seed = 1) {
  return () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
}

describe('red de puntos', () => {
  test('createNodes crea la cantidad pedida dentro del área', () => {
    const nodes = createNodes(10, 100, 50, () => 0.5)
    expect(nodes).toHaveLength(10)
    for (const n of nodes) {
      expect(n.x).toBeGreaterThanOrEqual(0); expect(n.x).toBeLessThanOrEqual(100)
      expect(n.y).toBeGreaterThanOrEqual(0); expect(n.y).toBeLessThanOrEqual(50)
    }
  })

  test('después de muchos pasos los nodos siguen dentro (rebotan)', () => {
    const nodes = createNodes(30, 200, 120, seeded(7))
    for (let i = 0; i < 500; i++) stepNodes(nodes, 200, 120, null)
    for (const n of nodes) {
      expect(n.x).toBeGreaterThanOrEqual(0); expect(n.x).toBeLessThanOrEqual(200)
      expect(n.y).toBeGreaterThanOrEqual(0); expect(n.y).toBeLessThanOrEqual(120)
    }
  })

  test('un nodo cerca del mouse se aleja', () => {
    const nodes = [{ x: 50, y: 50, vx: 0, vy: 0 }]
    const mouse = { x: 60, y: 50 }
    const before = Math.hypot(nodes[0]!.x - mouse.x, nodes[0]!.y - mouse.y)
    stepNodes(nodes, 200, 200, mouse)
    const after = Math.hypot(nodes[0]!.x - mouse.x, nodes[0]!.y - mouse.y)
    expect(after).toBeGreaterThan(before)
  })

  test('el mouse justo encima de un nodo no produce NaN', () => {
    const nodes = [{ x: 50, y: 50, vx: 0, vy: 0 }]
    stepNodes(nodes, 200, 200, { x: 50, y: 50 })
    expect(Number.isFinite(nodes[0]!.x)).toBe(true)
    expect(Number.isFinite(nodes[0]!.y)).toBe(true)
  })

  test('menos nodos en pantallas chicas y nunca más de 80', () => {
    expect(nodeCountFor(360)).toBeLessThan(nodeCountFor(1440))
    expect(nodeCountFor(360)).toBeGreaterThanOrEqual(15)
    expect(nodeCountFor(5000)).toBeLessThanOrEqual(80)
  })

  test('linkAlpha va de 1 (pegados) a 0 (en la distancia máxima o más)', () => {
    expect(linkAlpha(0, 80)).toBe(1)
    expect(linkAlpha(40, 80)).toBeCloseTo(0.5)
    expect(linkAlpha(80, 80)).toBe(0)
    expect(linkAlpha(100, 80)).toBe(0)
  })
})
