<script setup lang="ts">
import type { BotDemo } from '~/content/types'
import { chatSchedule } from '~/utils/chat'

const props = defineProps<{ demo: BotDemo }>()

const root = ref<HTMLElement | null>(null)
/** Cuántos mensajes se ven y si el bot está "escribiendo". */
const shown = ref(props.demo.messages.length)
const typing = ref(false)

let timers: ReturnType<typeof setTimeout>[] = []
const { active, reduced } = useInView(root, { threshold: 0.35 })

function clear() {
  timers.forEach(clearTimeout)
  timers = []
}

function showAll() {
  clear()
  shown.value = props.demo.messages.length
  typing.value = false
}

function play() {
  clear()
  const steps = chatSchedule(props.demo.messages)
  shown.value = 0
  typing.value = false
  steps.forEach((s, i) => {
    if (s.typingAt !== null) timers.push(setTimeout(() => { typing.value = true }, s.typingAt))
    timers.push(setTimeout(() => { typing.value = false; shown.value = i + 1 }, s.showAt))
  })
  timers.push(setTimeout(() => { if (active.value) play() }, chatSchedule.total(steps)))
}

// Arranca al entrar en pantalla, se corta al salir, y reinicia de cero si cambia el idioma.
watch([active, () => props.demo], ([on]) => {
  if (on) play()
  else if (reduced.value) showAll()
  else clear()
})

onBeforeUnmount(clear)
</script>

<template>
  <div ref="root" class="chat" role="group" :aria-label="demo.label">
    <!-- Versión para lectores de pantalla: la conversación completa, sin animación. -->
    <ol class="visually-hidden">
      <li v-for="(m, i) in demo.messages" :key="i">{{ m.from === 'bot' ? demo.business : '→' }}: {{ m.text }}</li>
    </ol>

    <div class="chat__head" aria-hidden="true">
      <span class="chat__avatar">💈</span>
      <div>
        <div class="chat__name">{{ demo.business }}</div>
        <div class="chat__status">{{ typing ? '…' : demo.status }}</div>
      </div>
    </div>

    <div class="chat__body" aria-hidden="true">
      <TransitionGroup name="msg" tag="div" class="chat__msgs">
        <p
          v-for="(m, i) in demo.messages.slice(0, shown)"
          :key="i"
          class="bubble"
          :class="m.from === 'bot' ? 'bubble--bot' : 'bubble--user'"
        >{{ m.text }}</p>
        <p v-if="typing" key="typing" class="bubble bubble--bot bubble--typing">
          <span /><span /><span />
        </p>
      </TransitionGroup>
    </div>
    <p class="chat__caption" aria-hidden="true">{{ demo.caption }}</p>
  </div>
</template>

<style scoped>
.chat {
  --wa-bg: #0b141a; --wa-head: #1f2c34; --wa-in: #1f2c34; --wa-out: #005c4b; --wa-text: #e9edef; --wa-muted: #8696a0;
  position: relative; display: flex; flex-direction: column; width: 100%; height: 100%;
  background: var(--wa-bg); color: var(--wa-text); font-size: 13px; line-height: 1.35; text-align: left;
  background-image: radial-gradient(rgb(255 255 255 / .025) 1px, transparent 1px); background-size: 14px 14px;
}
.chat__head { display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: var(--wa-head); flex: none; }
.chat__avatar { width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; background: #2a3942; font-size: 15px; }
.chat__name { font-weight: 600; font-size: 13px; }
.chat__status { font-size: 11px; color: var(--wa-muted); min-height: 14px; }
.chat__body { flex: 1; overflow: hidden; display: flex; flex-direction: column; justify-content: flex-end; padding: 10px 12px 6px; }
.chat__msgs { display: flex; flex-direction: column; gap: 6px; }
.bubble { max-width: 78%; padding: 6px 9px; border-radius: 8px; margin: 0; white-space: pre-wrap; }
.bubble--user { align-self: flex-end; background: var(--wa-out); border-top-right-radius: 2px; }
.bubble--bot { align-self: flex-start; background: var(--wa-in); border-top-left-radius: 2px; }
.bubble--typing { display: inline-flex; gap: 4px; padding: 9px 11px; }
.bubble--typing span { width: 6px; height: 6px; border-radius: 50%; background: var(--wa-muted); animation: dot 1s infinite ease-in-out; }
.bubble--typing span:nth-child(2) { animation-delay: .15s; }
.bubble--typing span:nth-child(3) { animation-delay: .3s; }
@keyframes dot { 0%, 80%, 100% { opacity: .3; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-3px); } }
.chat__caption { position: absolute; right: 10px; top: 12px; margin: 0; font-size: 10px; color: var(--wa-muted); max-width: 45%; text-align: right; }

.msg-enter-active { transition: opacity .25s ease, transform .25s cubic-bezier(.2, .8, .2, 1); }
.msg-enter-from { opacity: 0; transform: translateY(8px) scale(.97); }
.msg-leave-active { display: none; }
@media (prefers-reduced-motion: reduce) {
  .msg-enter-active { transition: none; }
  .bubble--typing span { animation: none; }
}
</style>
