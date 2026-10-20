<script setup lang="ts">
import type { Project } from '~/content/types'

const props = defineProps<{ project: Project | null }>()
const emit = defineEmits<{ close: [] }>()
const { content } = useLang()
const t = computed(() => content.value.projects)

const dialog = ref<HTMLDialogElement | null>(null)

watch(() => props.project, (p) => {
  const d = dialog.value
  if (!d) return
  if (p && !d.open) {
    d.showModal()
    d.scrollTop = 0
    document.documentElement.style.overflow = 'hidden'
  } else if (!p && d.open) {
    d.close()
  }
}, { flush: 'post', immediate: true })

function onClose() {
  document.documentElement.style.overflow = ''
  if (props.project) emit('close')
}

function onBackdrop(e: MouseEvent) {
  if (e.target === dialog.value) emit('close')
}

function onCancel(e: Event) {
  e.preventDefault()
  emit('close')
}
</script>

<template>
  <dialog
    ref="dialog"
    class="panel"
    :aria-labelledby="project ? `panel-title-${project.id}` : undefined"
    @close="onClose"
    @cancel="onCancel"
    @click="onBackdrop"
  >
    <article v-if="project" class="panel__box">
      <header class="panel__head">
        <div>
          <h2 :id="`panel-title-${project.id}`">{{ project.name }}</h2>
          <p class="panel__tagline">{{ project.tagline }}</p>
        </div>
        <button type="button" class="panel__close" :aria-label="t.close" @click="emit('close')">✕</button>
      </header>

      <img class="panel__shot" :src="project.image" :alt="project.imageAlt" width="1280" height="800">

      <div class="panel__meta">
        <span v-if="project.status === 'live'" class="live">● {{ t.live }}</span>
        <span v-else class="panel__pilot">{{ t.pilot }}</span>
        <div class="tags"><span v-for="s in project.stack" :key="s" class="tag">{{ s }}</span></div>
      </div>

      <section class="panel__sec">
        <h3>{{ t.labels.problem }}</h3>
        <p>{{ project.problem }}</p>
      </section>
      <section class="panel__sec">
        <h3>{{ t.labels.built }}</h3>
        <ul><li v-for="b in project.built" :key="b">{{ b }}</li></ul>
      </section>
      <section class="panel__sec">
        <h3>{{ t.labels.hard }}</h3>
        <ul><li v-for="b in project.hard" :key="b">{{ b }}</li></ul>
      </section>
      <section class="panel__sec">
        <h3>{{ t.labels.result }}</h3>
        <ul><li v-for="b in project.result" :key="b">{{ b }}</li></ul>
      </section>

      <footer class="panel__foot">
        <a v-if="project.url" class="pill pill--dark" :href="project.url" target="_blank" rel="noopener">
          {{ t.labels.visit }} <span aria-hidden="true">↗</span>
        </a>
        <button type="button" class="pill" @click="emit('close')">{{ t.close }}</button>
      </footer>
    </article>
  </dialog>
</template>

<style scoped>
.panel {
  width: min(760px, 100vw); max-width: 100vw; max-height: 100dvh; height: 100dvh;
  margin: 0; padding: 0; border: 0; background: var(--card); color: var(--fg);
  overscroll-behavior: contain;
}
@media (min-width: 768px) {
  .panel { margin: auto; height: auto; max-height: min(88dvh, 920px); border-radius: 20px; box-shadow: 0 30px 80px rgb(0 0 0 / .25); }
}
.panel::backdrop { background: rgb(28 25 23 / .55); backdrop-filter: blur(4px); }
.panel[open] { animation: panel-in .28s cubic-bezier(.2, .8, .2, 1); }
.panel[open]::backdrop { animation: fade-in .28s ease; }
@keyframes panel-in { from { opacity: 0; transform: translateY(18px) scale(.985); } }
@keyframes fade-in { from { opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .panel[open], .panel[open]::backdrop { animation: none; } }

.panel__box { padding: 20px 16px 28px; }
@media (min-width: 768px) { .panel__box { padding: 32px 36px 36px; } }
.panel__head { display: flex; justify-content: space-between; gap: 16px; align-items: flex-start; }
.panel__head h2 { font-size: 28px; letter-spacing: -.02em; line-height: 1.15; }
.panel__tagline { color: var(--fg-2); margin-top: 6px; }
.panel__close {
  flex: none; width: 44px; height: 44px; border-radius: 50%; border: 1px solid var(--border);
  background: var(--card); font-size: 16px; cursor: pointer; color: var(--fg);
}
.panel__shot { width: 100%; height: auto; margin-top: 20px; border-radius: 12px; border: 1px solid var(--border); }
.panel__meta { display: flex; flex-wrap: wrap; gap: 10px 14px; align-items: center; margin-top: 16px; }
.panel__pilot { font-size: 12px; font-weight: 600; color: var(--muted); border: 1px solid var(--border); border-radius: 999px; padding: 3px 9px; }
.panel__sec { margin-top: 26px; }
.panel__sec h3 { font-size: 12px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--accent); margin-bottom: 8px; }
.panel__sec p, .panel__sec li { color: var(--fg-2); }
.panel__sec ul { padding-left: 20px; display: grid; gap: 6px; }
.panel__foot { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 30px; }
</style>
