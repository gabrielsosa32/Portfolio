<script setup lang="ts">
import type { Project } from '~/content/types'

const props = defineProps<{ project: Project; statusLabel: string; moreLabel: string }>()
const { open } = usePanel()

function onKey(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    open(props.project.id)
  }
}
</script>

<template>
  <!-- No es un <button> real porque la demo tiene bloques adentro; se comporta igual. -->
  <div
    class="tile"
    role="button"
    tabindex="0"
    @click="open(project.id)"
    @keydown="onKey"
  >
    <div class="tile__bar">
      <span class="tile__name">{{ project.name }}</span>
      <span class="tile__status" :class="{ 'tile__status--live': project.status === 'live' }">
        <span aria-hidden="true">●</span> {{ statusLabel }}
      </span>
      <span class="visually-hidden">— {{ moreLabel }}</span>
    </div>
    <div class="tile__body" aria-hidden="true">
      <slot />
    </div>
    <span class="tile__more" aria-hidden="true">{{ moreLabel }} →</span>
  </div>
</template>

<style scoped>
.tile {
  position: relative; display: flex; flex-direction: column; min-height: 0;
  background: var(--card); border: 1px solid var(--border); border-radius: 12px; overflow: hidden;
  cursor: pointer; transition: border-color .2s, transform .2s, box-shadow .2s;
}
.tile:hover, .tile:focus-visible { border-color: var(--accent); transform: translateY(-2px); box-shadow: 0 12px 30px rgb(0 0 0 / .45); }
@media (prefers-reduced-motion: reduce) { .tile, .tile:hover { transition: none; transform: none; } }
.tile__bar {
  display: flex; justify-content: space-between; align-items: center; gap: 8px; padding: 8px 12px;
  border-bottom: 1px solid var(--border); font-family: var(--mono); font-size: 12px;
}
.tile__name { color: var(--fg); font-weight: 700; }
.tile__status { color: var(--muted); white-space: nowrap; }
.tile__status--live { color: var(--live); }
.tile__body { position: relative; flex: 1; overflow: hidden; }
/* La grilla ya tiene un único aviso de "datos de ejemplo": el del chat sobra acá. */
.tile__body :deep(.chat__caption) { display: none; }
.tile__more {
  position: absolute; right: 10px; bottom: 8px; font-family: var(--mono); font-size: 11px; color: var(--fg);
  background: rgb(0 0 0 / .65); padding: 3px 8px; border-radius: 6px; opacity: 0; transition: opacity .2s;
}
.tile:hover .tile__more, .tile:focus-visible .tile__more { opacity: 1; }
/* En pantallas táctiles no hay hover: el "Ver más" se muestra siempre para que se entienda que se puede tocar. */
@media (hover: none), (max-width: 1023px) { .tile__more { opacity: 1; } }
</style>
