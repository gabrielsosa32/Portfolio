<script setup lang="ts">
import type { ChargeDemo } from '~/content/types'
import { chargeProgress, formatClock } from '~/utils/demos'

const props = defineProps<{ demo: ChargeDemo }>()
const root = ref<HTMLElement | null>(null)
const { active } = useInView(root)

const TOTAL = 3600 // la sesión de ejemplo es de 1 h
const MIN = 40 * 60 // al llegar a 40:00 vuelve a empezar, para no mostrar nunca "terminado"
const remaining = ref(props.demo.startSeconds)
const progress = computed(() => chargeProgress(remaining.value, TOTAL))
let timer: ReturnType<typeof setInterval> | null = null

function stop() {
  if (timer) clearInterval(timer)
  timer = null
}
watch([active, () => props.demo], ([on]) => {
  stop()
  if (on) {
    timer = setInterval(() => {
      remaining.value = remaining.value <= MIN ? props.demo.startSeconds : remaining.value - 1
    }, 1000)
  }
}, { immediate: true })
onBeforeUnmount(stop)
</script>

<template>
  <div ref="root" class="charge">
    <p class="charge__place">{{ demo.place }}</p>
    <div class="charge__ring" :style="{ '--p': `${Math.round(progress * 100)}%` }">
      <div class="charge__inner">
        <span class="charge__status">{{ demo.status }}</span>
        <span class="charge__time">{{ formatClock(remaining) }}</span>
      </div>
    </div>
    <p class="charge__paid">{{ demo.paid }}</p>
  </div>
</template>

<style scoped>
.charge { position: absolute; inset: 0; display: grid; place-items: center; background: #0b0f0a; }
.charge__place { position: absolute; top: 8px; left: 10px; margin: 0; font-family: var(--mono); font-size: 10px; color: var(--muted); }
.charge__ring {
  width: min(52%, 140px); aspect-ratio: 1; border-radius: 50%; display: grid; place-items: center;
  background: conic-gradient(#d9f99d var(--p), #292524 0);
  transition: background .9s linear;
}
.charge__inner { width: 84%; aspect-ratio: 1; border-radius: 50%; background: var(--card); display: grid; place-content: center; text-align: center; }
.charge__status { font-family: var(--mono); font-size: 9px; letter-spacing: .12em; color: var(--muted); }
.charge__time { font-family: var(--mono); font-size: clamp(18px, 2.4vw, 26px); font-weight: 700; color: #d9f99d; font-variant-numeric: tabular-nums; }
.charge__paid { position: absolute; bottom: 8px; left: 10px; margin: 0; font-family: var(--mono); font-size: 11px; color: var(--muted); }
</style>
