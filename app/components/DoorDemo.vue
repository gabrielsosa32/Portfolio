<script setup lang="ts">
import type { DoorDemo } from '~/content/types'

const props = defineProps<{ demo: DoorDemo }>()
const root = ref<HTMLElement | null>(null)
const { active, reduced } = useInView(root)

const count = ref(props.demo.startCount)
const ok = ref(false)
let timers: ReturnType<typeof setTimeout>[] = []

/** QR de 21×21 módulos con los tres "ojos" de esquina; el resto, un patrón fijo (no codifica nada). */
const SIZE = 21
const modules = (() => {
  let seed = 7
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647
  const cells: { x: number; y: number }[] = []
  const inFinder = (x: number, y: number) =>
    (x < 8 && y < 8) || (x > SIZE - 9 && y < 8) || (x < 8 && y > SIZE - 9)
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (!inFinder(x, y) && rand() > 0.52) cells.push({ x, y })
    }
  }
  return cells
})()
/** Todos los módulos en un solo trazo SVG: un elemento en lugar de ~230 (menos trabajo de estilo y diseño). */
const modulesPath = modules.map(m => `M${m.x} ${m.y}h1v1h-1z`).join('')
const finders = [[0, 0], [SIZE - 7, 0], [0, SIZE - 7]] as const

function clear() {
  timers.forEach(clearTimeout)
  timers = []
}
function cycle() {
  timers.push(setTimeout(() => {
    ok.value = true
    count.value++
    timers.push(setTimeout(() => { ok.value = false; if (active.value) cycle() }, 900))
  }, 1800))
}

watch([active, () => props.demo], ([on]) => {
  clear()
  ok.value = false
  if (on) cycle()
}, { immediate: true })
onBeforeUnmount(clear)
</script>

<template>
  <div ref="root" class="door">
    <p class="door__event">{{ demo.event }}</p>
    <div class="door__qr">
      <svg :viewBox="`-1 -1 ${SIZE + 2} ${SIZE + 2}`" shape-rendering="crispEdges">
        <rect x="-1" y="-1" :width="SIZE + 2" :height="SIZE + 2" fill="#fafaf9" />
        <path :d="modulesPath" fill="#0c0a09" />
        <g v-for="([fx, fy], i) in finders" :key="`f${i}`">
          <rect :x="fx" :y="fy" width="7" height="7" fill="#0c0a09" />
          <rect :x="fx + 1" :y="fy + 1" width="5" height="5" fill="#fafaf9" />
          <rect :x="fx + 2" :y="fy + 2" width="3" height="3" fill="#0c0a09" />
        </g>
      </svg>
      <span v-if="!reduced" class="door__scan" :class="{ 'door__scan--paused': !active }" />
    </div>
    <div class="door__ok" :class="{ on: ok }">{{ demo.verdict }}</div>
    <p class="door__count">{{ demo.countLabel }}: <b>{{ count }}</b></p>
  </div>
</template>

<style scoped>
.door { position: absolute; inset: 0; display: grid; place-items: center; background: #0f0d1a; }
.door__event { position: absolute; top: 8px; left: 10px; margin: 0; font-family: var(--mono); font-size: 10px; color: var(--muted); }
.door__qr { position: relative; width: min(52%, 170px); aspect-ratio: 1; border-radius: 6px; overflow: hidden; }
.door__qr svg { width: 100%; height: 100%; display: block; }
.door__scan {
  position: absolute; left: 0; right: 0; top: 0; height: 100%;
  animation: scan 1.3s ease-in-out infinite alternate;
}
/* La línea va en un ::before y se mueve con transform (no con top): no fuerza a recalcular el layout. */
.door__scan::before { content: ''; position: absolute; left: 0; right: 0; top: 4%; height: 3px; background: var(--live); box-shadow: 0 0 12px var(--live); }
.door__scan--paused { animation-play-state: paused; }
@keyframes scan { from { transform: translateY(0); } to { transform: translateY(90%); } }
.door__ok {
  position: absolute; inset: 0; display: grid; place-items: center; background: #16a34a; color: #052e16;
  font-weight: 800; font-size: clamp(20px, 3vw, 32px); letter-spacing: .03em;
  opacity: 0; transform: scale(.96); transition: opacity .18s, transform .18s;
}
.door__ok.on { opacity: 1; transform: none; }
.door__count { position: absolute; bottom: 8px; left: 10px; margin: 0; font-family: var(--mono); font-size: 11px; color: var(--muted); }
.door__count b { color: var(--fg); }
@media (prefers-reduced-motion: reduce) { .door__ok { transition: none; } }
</style>
