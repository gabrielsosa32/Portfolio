<script setup lang="ts">
import type { Project } from '~/content/types'

defineProps<{ project: Project; liveLabel: string; pilotLabel: string; moreLabel: string }>()
defineEmits<{ open: [] }>()
const asset = useAsset()
</script>

<template>
  <article class="card pcard">
    <button type="button" class="pcard__shot" :aria-label="`${moreLabel}: ${project.name}`" @click="$emit('open')">
      <img :src="asset(project.image)" :alt="project.imageAlt" width="1280" height="800" loading="lazy">
    </button>
    <div class="pcard__body">
      <div class="pcard__head">
        <h3>{{ project.name }}</h3>
        <span v-if="project.status === 'live'" class="live">● {{ liveLabel }}</span>
        <span v-else class="pcard__pilot">{{ pilotLabel }}</span>
      </div>
      <p class="pcard__tagline">{{ project.tagline }}</p>
      <div class="tags">
        <span v-for="s in project.stack.slice(0, 5)" :key="s" class="tag">{{ s }}</span>
      </div>
      <button type="button" class="pill pcard__more" @click="$emit('open')">
        {{ moreLabel }} <span aria-hidden="true">→</span>
      </button>
    </div>
  </article>
</template>

<style scoped>
.pcard { display: flex; flex-direction: column; overflow: hidden; transition: transform .2s ease, box-shadow .2s ease; }
.pcard:hover { transform: translateY(-3px); box-shadow: 0 2px 6px rgb(0 0 0 / .05), 0 18px 40px rgb(0 0 0 / .08); }
@media (prefers-reduced-motion: reduce) { .pcard, .pcard:hover { transition: none; transform: none; } }
.pcard__shot { display: block; padding: 0; border: 0; background: var(--bg-alt); cursor: pointer; aspect-ratio: 16 / 10; overflow: hidden; border-bottom: 1px solid var(--border); }
.pcard__shot img { width: 100%; height: 100%; object-fit: cover; object-position: top; transition: transform .4s ease; }
.pcard:hover .pcard__shot img { transform: scale(1.03); }
.pcard__body { display: flex; flex-direction: column; gap: 12px; padding: 20px; flex: 1; }
.pcard__head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
.pcard__head h3 { font-size: 20px; letter-spacing: -.01em; }
.pcard__pilot { font-size: 12px; font-weight: 600; color: var(--muted); border: 1px solid var(--border); border-radius: 999px; padding: 3px 9px; white-space: nowrap; }
.pcard__tagline { color: var(--fg-2); }
.pcard__more { align-self: flex-start; margin-top: auto; }
</style>
