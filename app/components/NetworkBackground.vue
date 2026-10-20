<script setup lang="ts">
import { createNodes, linkAlpha, nodeCountFor, stepNodes, type NetNode } from '~/utils/network'

const canvas = ref<HTMLCanvasElement | null>(null)
const LINK_DIST = 120
/** Color de la red, tomado de --net-rgb (p. ej. "96, 165, 250"). */
let rgb = '96, 165, 250'

onMounted(() => {
  const el = canvas.value
  const host = el?.parentElement
  const ctx = el?.getContext('2d')
  if (!el || !host || !ctx) return

  rgb = getComputedStyle(document.documentElement).getPropertyValue('--net-rgb').trim() || rgb
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let w = 0, h = 0
  let nodes: NetNode[] = []
  let mouse: { x: number; y: number } | null = null
  let visible = true
  let raf = 0

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    w = host!.clientWidth
    h = host!.clientHeight
    el!.width = Math.round(w * dpr)
    el!.height = Math.round(h * dpr)
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    nodes = createNodes(nodeCountFor(w), w, h)
    draw()
  }

  function draw() {
    ctx!.clearRect(0, 0, w, h)
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i]!
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j]!
        const alpha = linkAlpha(Math.hypot(a.x - b.x, a.y - b.y), LINK_DIST)
        if (alpha > 0) {
          ctx!.strokeStyle = `rgba(${rgb}, ${alpha * 0.22})`
          ctx!.lineWidth = 1
          ctx!.beginPath()
          ctx!.moveTo(a.x, a.y)
          ctx!.lineTo(b.x, b.y)
          ctx!.stroke()
        }
      }
    }
    ctx!.fillStyle = `rgba(${rgb}, 0.5)`
    for (const n of nodes) {
      ctx!.beginPath()
      ctx!.arc(n.x, n.y, 2, 0, Math.PI * 2)
      ctx!.fill()
    }
  }

  function loop() {
    stepNodes(nodes, w, h, mouse)
    draw()
    raf = requestAnimationFrame(loop)
  }

  function start() {
    if (reduced || raf || !visible || document.hidden) return
    raf = requestAnimationFrame(loop)
  }
  function stop() {
    cancelAnimationFrame(raf)
    raf = 0
  }

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    const r = host.getBoundingClientRect()
    mouse = { x: e.clientX - r.left, y: e.clientY - r.top }
  }
  const onLeave = () => { mouse = null }
  const onVisibility = () => (document.hidden ? stop() : start())

  const ro = new ResizeObserver(resize)
  ro.observe(host)
  const io = new IntersectionObserver(([entry]) => {
    visible = Boolean(entry?.isIntersecting)
    visible ? start() : stop()
  })
  io.observe(host)
  host.addEventListener('pointermove', onMove)
  host.addEventListener('pointerleave', onLeave)
  document.addEventListener('visibilitychange', onVisibility)

  resize()
  start()

  onBeforeUnmount(() => {
    stop()
    ro.disconnect()
    io.disconnect()
    host.removeEventListener('pointermove', onMove)
    host.removeEventListener('pointerleave', onLeave)
    document.removeEventListener('visibilitychange', onVisibility)
  })
})
</script>

<template>
  <canvas ref="canvas" class="net" aria-hidden="true" />
</template>

<style scoped>
.net {
  position: absolute; inset: 0; width: 100%; height: 100%;
  pointer-events: none;
  mask-image: linear-gradient(to bottom, #000 60%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, #000 60%, transparent);
}
</style>
