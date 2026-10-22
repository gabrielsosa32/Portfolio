<script setup lang="ts">
const { content } = useLang()
const t = computed(() => content.value.about)
</script>

<template>
  <section id="sobre-mi" class="section">
    <div class="container about">
      <div>
        <p class="eyebrow">{{ t.eyebrow }}</p>
        <h2 class="section-title">{{ t.title }}</h2>
        <div class="about__text">
          <p v-for="p in t.paragraphs" :key="p">{{ p }}</p>
        </div>
        <blockquote v-reveal class="about__role">{{ t.role }}</blockquote>
      </div>
      <div class="about__panel">
        <h3 class="about__sub">{{ t.howIWorkTitle }}</h3>
        <ul class="about__list">
          <li v-for="h in t.howIWork" :key="h">{{ h }}</li>
        </ul>
        <h3 class="about__sub">{{ t.stackTitle }}</h3>
        <div class="tags"><span v-for="s in t.stack" :key="s" class="tag about__tag">{{ s }}</span></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about { display: grid; gap: 40px; }
@media (min-width: 900px) { .about { grid-template-columns: 1.2fr 1fr; gap: 64px; } }
.about__text { display: grid; gap: 14px; margin-top: 20px; color: var(--fg-2); }
.about__role {
  margin: 28px 0 0; padding: 14px 18px; border-left: 3px solid var(--accent);
  background: rgb(28 25 23 / .88); border-radius: 0 12px 12px 0; font-weight: 500;
}
.about__panel { align-self: start; padding: 22px; border: 1px solid var(--border-strong); border-radius: 12px; background: rgb(28 25 23 / .88); }
.about__sub { font-family: var(--mono); font-size: 13px; font-weight: 500; color: var(--accent); margin: 0 0 12px; }
.about__sub::before { content: '$ '; color: var(--muted); }
.about__tag { font-family: var(--mono); }
.about__sub + .tags { margin-bottom: 0; }
.about__list { list-style: none; padding: 0; display: grid; gap: 10px; margin-bottom: 32px; }
.about__list li { position: relative; padding-left: 26px; color: var(--fg-2); }
.about__list li::before {
  content: '✓'; position: absolute; left: 0; top: 0; color: var(--live); font-weight: 700;
}
</style>
