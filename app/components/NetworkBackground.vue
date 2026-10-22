<script setup lang="ts">
import { createNodes, linkAlpha, nodeCountFor, stepNodes, type NetNode } from '~/utils/network'

/** Red de puntos fija detrás de toda la página (ocupa la ventana, no un contenedor). */
const canvas = ref<HTMLCanvasElement | null>(null)
const LINK_DIST = 120
let cleanup: (() => void) | null = null
// Con el panel "Ver más" abierto el fondo queda tapado: se pausa para no gastar en lo que no se ve.
const { openId } = usePanel()
const ready = usePageReady()
let control: { start: () => void; stop: () => void } | null = null
watch(openId, id => (id ? control?.stop() : control?.start()))
watch(ready, r => { if (r) control?.start() })

onMounted(() => {
  const el = canvas.value
  const ctx = el?.getContext('2d')
  if (!el || !ctx) return

  const rgb = getComputedStyle(document.documentElement).getPropertyValue('--net-rgb').trim() || '96, 165, 250'
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  // En pantallas táctiles se dibuja un cuadro de cada dos (~30 fps): el fondo es tenue y no se nota.
  const touch = window.matchMedia('(pointer: coarse)').matches
  let frame = 0
  let w = 0, h = 0
  let nodes: NetNode[] = []
  let mouse: { x: number; y: number } | null = null
  let raf = 0

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const nw = window.innerWidth
    const nh = window.innerHeight
    // En el celular la barra de direcciones cambia el alto al hacer scroll: solo se rearma si cambia el ancho.
    const rebuild = nw !== w || nodes.length === 0
    w = nw
    h = nh
    el!.width = Math.round(w * dpr)
    el!.height = Math.round(h * dpr)
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    if (rebuild) nodes = createNodes(nodeCountFor(w), w, h)
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
          ctx!.strokeStyle = `rgba(${rgb}, ${alpha * 0.16})`
          ctx!.lineWidth = 1
          ctx!.beginPath()
          ctx!.moveTo(a.x, a.y)
          ctx!.lineTo(b.x, b.y)
          ctx!.stroke()
        }
      }
    }
    ctx!.fillStyle = `rgba(${rgb}, 0.35)`
    for (const n of nodes) {
      ctx!.beginPath()
      ctx!.arc(n.x, n.y, 1.8, 0, Math.PI * 2)
      ctx!.fill()
    }
  }

  function loop() {
    if (!touch || (frame++ & 1) === 0) {
      stepNodes(nodes, w, h, mouse)
      draw()
    }
    raf = requestAnimationFrame(loop)
  }
  function start() {
    if (reduced || raf || document.hidden || openId.value || !ready.value) return
    raf = requestAnimationFrame(loop)
  }
  function stop() {
    cancelAnimationFrame(raf)
    raf = 0
  }

  const onMove = (e: PointerEvent) => {
    if (e.pointerType === 'mouse') mouse = { x: e.clientX, y: e.clientY }
  }
  const onLeave = () => { mouse = null }
  const onVisibility = () => (document.hidden ? stop() : start())

  window.addEventListener('resize', resize)
  window.addEventListener('pointermove', onMove, { passive: true })
  document.documentElement.addEventListener('pointerleave', onLeave)
  document.addEventListener('visibilitychange', onVisibility)

  control = { start, stop }
  resize()
  start()

  cleanup = () => {
    stop()
    window.removeEventListener('resize', resize)
    window.removeEventListener('pointermove', onMove)
    document.documentElement.removeEventListener('pointerleave', onLeave)
    document.removeEventListener('visibilitychange', onVisibility)
  }
})

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <canvas ref="canvas" class="net" aria-hidden="true" />
</template>

<style scoped>
.net { position: fixed; inset: 0; width: 100vw; height: 100vh; pointer-events: none; }
</style>
