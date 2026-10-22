<script setup lang="ts">
const { content } = useLang()
const t = computed(() => content.value.projects)
</script>

<template>
  <section id="proyectos" class="section">
    <div class="container">
      <p class="eyebrow">{{ t.eyebrow }}</p>
      <h2 class="section-title">{{ t.title }}</h2>
      <p class="section-intro">{{ t.intro }}</p>

      <div class="cases">
        <ProjectCase v-for="(p, i) in t.main" :key="p.id" v-reveal :project="p" :index="i" />
      </div>

      <h3 class="others__title">{{ t.othersTitle }}</h3>
      <div class="others">
        <div v-for="o in t.others" :key="o.name" v-reveal class="other">
          <h4>{{ o.name }}</h4>
          <p>{{ o.description }}</p>
          <p class="other__stack">{{ o.stack.join(' · ') }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cases { display: grid; gap: 24px; margin-top: 40px; }
.others__title { margin-top: 56px; font-size: 18px; letter-spacing: -.01em; }
.others { display: grid; gap: 14px; margin-top: 16px; }
@media (min-width: 640px) { .others { grid-template-columns: 1fr 1fr; } }
.other {
  padding: 18px; display: flex; flex-direction: column; gap: 8px;
  border: 1px solid var(--border-strong); border-radius: 12px; background: rgb(28 25 23 / .88);
}
.other h4 { font-size: 15px; }
.other p { font-size: 14px; color: var(--fg-2); flex: 1; }
.other .other__stack { flex: none; font-family: var(--mono); font-size: 12px; color: var(--muted); }
</style>
