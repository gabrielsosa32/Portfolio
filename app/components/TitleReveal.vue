<script setup lang="ts">
import { splitWords } from '~/utils/words'

const props = defineProps<{ lead: string; highlight: string }>()
const words = computed(() => [
  ...splitWords(props.lead).map(text => ({ text, hl: false })),
  ...splitWords(props.highlight).map(text => ({ text, hl: true })),
])
const full = computed(() => `${props.lead} ${props.highlight}`)
</script>

<template>
  <h1 class="title" :aria-label="full">
    <template v-for="(w, i) in words" :key="i">
      <span
        class="word"
        :class="{ 'word--hl': w.hl }"
        aria-hidden="true"
        :style="{ animationDelay: `${i * 90}ms` }"
      >{{ w.text }}</span>{{ ' ' }}
    </template>
  </h1>
</template>

<style scoped>
.title {
  font-size: clamp(34px, 6.4vw, 64px); line-height: 1.06; font-weight: 700; letter-spacing: -.035em;
  max-width: 15ch;
}
.word {
  display: inline-block;
  opacity: 0; transform: translateY(24px) rotate(4deg);
  animation: word-in .7s cubic-bezier(.2, .8, .2, 1) forwards;
}
.word--hl {
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
  -webkit-background-clip: text; background-clip: text; color: transparent;
  padding-bottom: .06em;
}
@keyframes word-in { to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) {
  .word { animation: none; opacity: 1; transform: none; }
}
</style>
