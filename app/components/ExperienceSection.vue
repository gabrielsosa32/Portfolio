<script setup lang="ts">
const { content } = useLang()
const t = computed(() => content.value.experience)
</script>

<template>
  <section id="experiencia" class="section">
    <div class="container">
      <p class="eyebrow">{{ t.eyebrow }}</p>
      <h2 class="section-title">{{ t.title }}</h2>

      <ol class="timeline">
        <li v-for="item in t.items" :key="item.org" v-reveal class="timeline__item">
          <span class="timeline__dot" aria-hidden="true" />
          <div class="timeline__head">
            <h3>{{ item.role }} <span class="timeline__org">· {{ item.org }}</span></h3>
            <span class="timeline__period">{{ item.period }}</span>
          </div>
          <ul class="timeline__points">
            <li v-for="p in item.points" :key="p">{{ p }}</li>
          </ul>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.timeline { list-style: none; margin: 40px 0 0; padding: 0 0 0 28px; position: relative; display: grid; gap: 36px; }
.timeline::before {
  content: ''; position: absolute; left: 7px; top: 8px; bottom: 8px; width: 2px;
  background: linear-gradient(to bottom, var(--accent), var(--accent-2) 60%, var(--border));
  border-radius: 2px;
}
.timeline__item { position: relative; }
.timeline__dot {
  position: absolute; left: -28px; top: 6px; width: 16px; height: 16px; border-radius: 50%;
  background: var(--bg); border: 3px solid var(--accent);
}
.timeline__item:first-child .timeline__dot { background: var(--accent); box-shadow: 0 0 0 6px rgba(var(--net-rgb), .15); }
.timeline__head { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 4px 16px; }
.timeline__head h3 { font-size: 18px; letter-spacing: -.01em; }
.timeline__org { color: var(--accent); font-weight: 600; }
.timeline__period { font-size: 13px; color: var(--muted); white-space: nowrap; font-variant-numeric: tabular-nums; }
.timeline__points { margin-top: 8px; padding-left: 18px; display: grid; gap: 6px; color: var(--fg-2); max-width: 760px; }
</style>
