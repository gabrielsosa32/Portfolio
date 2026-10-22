<script setup lang="ts">
import type { Project } from '~/content/types'

const props = defineProps<{ project: Project; index: number }>()
const { content } = useLang()
const t = computed(() => content.value.projects)
const asset = useAsset()
const { open } = usePanel()

const status = computed(() =>
  props.project.status === 'live' ? t.value.live : props.project.status === 'pilot' ? t.value.pilot : t.value.inProgress,
)
/** Primera oración de un texto, para la ficha técnica. */
const firstSentence = (s: string) => s.split(/(?<=[.:])\s/)[0]!.replace(/[.:]$/, '')
const sheet = computed(() => [
  { k: t.value.caseLabels.stack, v: props.project.stack.slice(0, 3).join(' · ') },
  { k: t.value.caseLabels.hard, v: firstSentence(props.project.hard[0] ?? '') },
  { k: t.value.caseLabels.result, v: firstSentence(props.project.result[0] ?? '') },
])
</script>

<template>
  <article class="case" :class="{ 'case--flip': index % 2 === 1 }">
    <button type="button" class="case__shot" :aria-label="`${t.more}: ${project.name}`" @click="open(project.id)">
      <img :src="asset(project.image)" :alt="project.imageAlt" width="1280" height="800" loading="lazy">
    </button>
    <div class="case__body">
      <div class="case__head">
        <h3>{{ project.name }}</h3>
        <span class="case__status" :class="{ 'case__status--live': project.status === 'live' }">● {{ status }}</span>
      </div>
      <p class="case__tagline">{{ project.tagline }}</p>
      <dl class="case__sheet">
        <template v-for="row in sheet" :key="row.k">
          <dt>{{ row.k }}</dt>
          <dd>{{ row.v }}</dd>
        </template>
      </dl>
      <button type="button" class="pill case__more" @click="open(project.id)">
        {{ t.more }} <span aria-hidden="true">→</span>
      </button>
    </div>
  </article>
</template>

<style scoped>
.case {
  display: grid; gap: 0; border: 1px solid var(--border-strong); border-radius: 14px; overflow: hidden;
  background: rgb(28 25 23 / .88); backdrop-filter: blur(2px);
}
@media (min-width: 900px) {
  .case { grid-template-columns: 1.1fr 1fr; }
  .case--flip { grid-template-columns: 1fr 1.1fr; }
  .case--flip .case__shot { order: 2; border-left: 1px solid var(--border); border-right: 0; }
}
.case__shot { display: block; padding: 0; border: 0; border-bottom: 1px solid var(--border); background: var(--bg-alt); cursor: pointer; overflow: hidden; aspect-ratio: 16 / 10; }
@media (min-width: 900px) { .case__shot { border-bottom: 0; border-right: 1px solid var(--border); aspect-ratio: auto; min-height: 300px; } }
.case__shot img { width: 100%; height: 100%; object-fit: cover; object-position: top; transition: transform .4s ease; }
.case:hover .case__shot img { transform: scale(1.03); }
@media (prefers-reduced-motion: reduce) { .case__shot img, .case:hover .case__shot img { transition: none; transform: none; } }
.case__body { display: flex; flex-direction: column; gap: 14px; padding: 22px; }
.case__head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
.case__head h3 { font-size: 22px; letter-spacing: -.02em; }
.case__status { font-family: var(--mono); font-size: 12px; color: var(--muted); white-space: nowrap; }
.case__status--live { color: var(--live); }
.case__tagline { color: var(--fg-2); }
.case__sheet {
  display: grid; grid-template-columns: max-content 1fr; gap: 6px 14px; margin: 0;
  font-family: var(--mono); font-size: 12.5px; line-height: 1.5;
  padding: 12px 14px; border: 1px solid var(--border); border-radius: 8px; background: rgb(0 0 0 / .35);
}
.case__sheet dt { color: var(--muted); }
.case__sheet dd { margin: 0; color: var(--fg); }
.case__more { align-self: flex-start; margin-top: auto; }
</style>
