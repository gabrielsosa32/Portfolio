<script setup lang="ts">
const { content } = useLang()
const t = computed(() => content.value.data)
</script>

<template>
  <section id="datos" class="section section--alt">
    <div class="container">
      <p class="eyebrow">{{ t.eyebrow }}</p>
      <h2 class="section-title">{{ t.title }}</h2>
      <p class="section-intro">{{ t.intro }}</p>

      <div class="dgrid">
        <article v-for="d in t.projects" :key="d.name" v-reveal class="card dcard">
          <p v-if="d.metric" class="dcard__metric">{{ d.metric }}</p>
          <h3>{{ d.name }}</h3>
          <p class="dcard__desc">{{ d.description }}</p>
          <a v-if="d.repo" class="dcard__link" :href="d.repo" target="_blank" rel="noopener">
            {{ t.viewCode }} <span aria-hidden="true">↗</span>
          </a>
        </article>
      </div>

      <div class="dextra">
        <div>
          <h3 class="dextra__title">{{ t.toolsTitle }}</h3>
          <div class="tags"><span v-for="s in t.tools" :key="s" class="tag">{{ s }}</span></div>
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
.dgrid { display: grid; gap: 16px; margin-top: 40px; }
@media (min-width: 640px) { .dgrid { grid-template-columns: 1fr 1fr; } }
@media (min-width: 1024px) { .dgrid { grid-template-columns: repeat(3, 1fr); } }
.dcard { padding: 20px; display: flex; flex-direction: column; gap: 8px; box-shadow: none; }
.dcard__metric {
  font-size: 26px; font-weight: 700; letter-spacing: -.02em; line-height: 1.1;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.dcard h3 { font-size: 16px; }
.dcard__desc { font-size: 14px; color: var(--fg-2); flex: 1; }
.dcard__link { font-size: 14px; font-weight: 600; color: var(--accent); text-decoration: none; min-height: 32px; display: inline-flex; align-items: center; }
.dcard__link:hover { text-decoration: underline; }
.dextra { display: grid; gap: 32px; margin-top: 44px; }
@media (min-width: 768px) { .dextra { grid-template-columns: 1fr 1fr; } }
.dextra__title { font-size: 14px; font-weight: 700; margin-bottom: 12px; }
.certs { padding-left: 18px; display: grid; gap: 4px; color: var(--fg-2); font-size: 14px; }
</style>
