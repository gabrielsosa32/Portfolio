<script setup lang="ts">
import type { ProjectId } from '~/content/types'
import { hashForProject, projectIdFromHash } from '~/utils/hash'

const { content } = useLang()
const t = computed(() => content.value.projects)
const ids = computed(() => t.value.main.map(p => p.id))

const openId = ref<ProjectId | null>(null)
const openProject = computed(() => t.value.main.find(p => p.id === openId.value) ?? null)
/** true si el panel lo abrió un clic en esta página (hay una entrada propia en el historial). */
let pushedByUs = false

function syncFromHash() {
  openId.value = projectIdFromHash(location.hash, ids.value)
  if (!openId.value) pushedByUs = false
}

function open(id: ProjectId) {
  history.pushState(null, '', hashForProject(id))
  pushedByUs = true
  openId.value = id
}

function close() {
  if (!openId.value) return
  if (pushedByUs) {
    history.back() // popstate → syncFromHash cierra el panel
  } else {
    history.replaceState(null, '', location.pathname + location.search)
    openId.value = null
  }
}

onMounted(() => {
  syncFromHash()
  window.addEventListener('popstate', syncFromHash)
  window.addEventListener('hashchange', syncFromHash)
})
onBeforeUnmount(() => {
  window.removeEventListener('popstate', syncFromHash)
  window.removeEventListener('hashchange', syncFromHash)
})
</script>

<template>
  <section id="proyectos" class="section">
    <div class="container">
      <p class="eyebrow">{{ t.eyebrow }}</p>
      <h2 class="section-title">{{ t.title }}</h2>
      <p class="section-intro">{{ t.intro }}</p>

      <div class="grid">
        <ProjectCard
          v-for="p in t.main"
          :key="p.id"
          v-reveal
          :project="p"
          :live-label="t.live"
          :pilot-label="t.pilot"
          :more-label="t.more"
          @open="open(p.id)"
        />
      </div>

      <h3 class="others__title">{{ t.othersTitle }}</h3>
      <div class="others">
        <div v-for="o in t.others" :key="o.name" v-reveal class="card other">
          <h4>{{ o.name }}</h4>
          <p>{{ o.description }}</p>
          <div class="tags"><span v-for="s in o.stack" :key="s" class="tag">{{ s }}</span></div>
        </div>
      </div>
    </div>
    <ProjectPanel :project="openProject" @close="close" />
  </section>
</template>

<style scoped>
.grid { display: grid; gap: 20px; margin-top: 40px; }
@media (min-width: 768px) { .grid { grid-template-columns: 1fr 1fr; gap: 24px; } }
.others__title { margin-top: 56px; font-size: 18px; letter-spacing: -.01em; }
.others { display: grid; gap: 14px; margin-top: 16px; }
@media (min-width: 640px) { .others { grid-template-columns: 1fr 1fr; } }
@media (min-width: 1024px) { .others { grid-template-columns: repeat(3, 1fr); } }
.other { padding: 18px; display: flex; flex-direction: column; gap: 8px; box-shadow: none; }
.other h4 { font-size: 15px; }
.other p { font-size: 14px; color: var(--fg-2); flex: 1; }
</style>
