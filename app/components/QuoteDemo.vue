<script setup lang="ts">
import type { Lang, QuoteDemo } from '~/content/types'
import { formatMoney, quoteSteps } from '~/utils/demos'

const props = defineProps<{ demo: QuoteDemo; lang: Lang }>()
const root = ref<HTMLElement | null>(null)
const { active, reduced } = useInView(root)

const shown = ref(props.demo.items.length)
const totals = computed(() => quoteSteps(props.demo.items))
const total = computed(() => (shown.value ? totals.value[shown.value - 1]! : 0))
let timers: ReturnType<typeof setTimeout>[] = []

function clear() {
  timers.forEach(clearTimeout)
  timers = []
}
function play() {
  clear()
  shown.value = 0
  props.demo.items.forEach((_, i) => timers.push(setTimeout(() => { shown.value = i + 1 }, 600 + i * 700)))
  timers.push(setTimeout(() => { if (active.value) play() }, 600 + props.demo.items.length * 700 + 2800))
}

watch([active, () => props.demo], ([on]) => {
  if (on) play()
  else {
    clear()
    if (reduced.value) shown.value = props.demo.items.length
  }
}, { immediate: true })
onBeforeUnmount(clear)
</script>

<template>
  <div ref="root" class="quote">
    <p class="quote__title">{{ demo.title }}</p>
    <TransitionGroup tag="div" name="row" class="quote__rows">
      <div v-for="(item, i) in demo.items.slice(0, shown)" :key="i" class="quote__row">
        <span>{{ item.description }}</span>
        <span class="quote__amt">{{ formatMoney(item.amount, lang) }}</span>
      </div>
    </TransitionGroup>
    <p class="quote__total">{{ formatMoney(total, lang) }}</p>
  </div>
</template>

<style scoped>
.quote { position: absolute; inset: 0; background: #fafaf9; color: #1c1917; padding: 10px 12px; display: flex; flex-direction: column; font-size: 11px; }
.quote__title { margin: 0; text-align: right; font-weight: 800; letter-spacing: .1em; color: #57534e; font-size: 11px; }
.quote__rows { flex: 1; margin-top: 6px; overflow: hidden; }
.quote__row { display: flex; justify-content: space-between; gap: 8px; border-bottom: 1px solid #e7e5e4; padding: 3px 0; }
.quote__row span:first-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.quote__amt { white-space: nowrap; font-variant-numeric: tabular-nums; }
.quote__total { margin: 4px 0 0; text-align: right; font-weight: 800; color: #c2410c; font-size: 15px; font-variant-numeric: tabular-nums; font-family: var(--mono); }
.row-enter-active { transition: opacity .25s, transform .25s; }
.row-enter-from { opacity: 0; transform: translateY(6px); }
@media (prefers-reduced-motion: reduce) { .row-enter-active { transition: none; } }
</style>
