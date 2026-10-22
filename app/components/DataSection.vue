<script setup lang="ts">
const { content } = useLang()
const t = computed(() => content.value.data)
</script>

<template>
  <section id="datos" class="section">
    <div class="container">
      <p class="eyebrow">{{ t.eyebrow }}</p>
      <h2 class="section-title">{{ t.title }}</h2>
      <p class="section-intro">{{ t.intro }}</p>

      <div class="gauges">
        <article v-for="d in t.projects" :key="d.name" v-reveal class="gauge">
          <h3 class="gauge__name">{{ d.name }}</h3>
          <p v-if="d.metric" class="gauge__metric">{{ d.metric }}</p>
          <div v-if="d.score" class="gauge__bar" aria-hidden="true">
            <span :style="{ width: `${Math.round(d.score * 100)}%` }" />
          </div>
          <p class="gauge__desc">{{ d.description }}</p>
          <a v-if="d.repo" class="gauge__link" :href="d.repo" target="_blank" rel="noopener">
            {{ t.viewCode }} <span aria-hidden="true">↗</span>
          </a>
        </article>
      </div>

      <div class="dextra">
        <div>
          <h3 class="dextra__title">{{ t.toolsTitle }}</h3>
          <div class="tags"><span v-for="s in t.tools" :key="s" class="tag tag--mono">{{ s }}</span></div>
        </div>
        <div>
          <h3 class="dextra__title">{{ t.certificatesTitle }}</h3>
          <ul class="certs"><li v-for="c in t.certificates" :key="c">{{ c }}</li></ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.gauges { display: grid; gap: 14px; margin-top: 36px; }
@media (min-width: 640px) { .gauges { grid-template-columns: 1fr 1fr; } }
@media (min-width: 1024px) { .gauges { grid-template-columns: repeat(3, 1fr); } }
.gauge {
  display: flex; flex-direction: column; gap: 8px; padding: 18px;
  border: 1px solid var(--border-strong); border-radius: 12px; background: rgb(28 25 23 / .88);
}
.gauge__name { font-size: 15px; }
.gauge__metric { font-family: var(--mono); font-size: 24px; font-weight: 700; color: var(--accent); letter-spacing: -.01em; }
.gauge__bar { height: 6px; border-radius: 3px; background: var(--border); overflow: hidden; }
.gauge__bar span { display: block; height: 100%; border-radius: 3px; background: linear-gradient(90deg, var(--accent), var(--accent-2)); }
.gauge__desc { font-size: 14px; color: var(--fg-2); flex: 1; }
.gauge__link { font-family: var(--mono); font-size: 13px; color: var(--accent); text-decoration: none; min-height: 32px; display: inline-flex; align-items: center; }
.gauge__link:hover { text-decoration: underline; }
.dextra { display: grid; gap: 32px; margin-top: 40px; }
@media (min-width: 768px) { .dextra { grid-template-columns: 1fr 1fr; } }
.dextra__title { font-size: 14px; font-weight: 700; margin-bottom: 12px; }
.tag--mono { font-family: var(--mono); }
.certs { padding-left: 18px; display: grid; gap: 4px; color: var(--fg-2); font-size: 14px; }
</style>
