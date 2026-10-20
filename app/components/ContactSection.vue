<script setup lang="ts">
const { content } = useLang()
const t = computed(() => content.value.contact)
const asset = useAsset()
const cvHref = computed(() => asset(content.value.hero.cvHref))
</script>

<template>
  <section id="contacto" class="contact">
    <div class="container contact__inner">
      <h2 class="contact__title">{{ t.title }}</h2>
      <p class="contact__sub">{{ t.subtitle }}</p>
      <div class="contact__cta">
        <a class="pill pill--light" :href="`mailto:${t.email}`">{{ t.email }}</a>
        <a class="pill pill--ghost" :href="t.linkedin" target="_blank" rel="noopener">LinkedIn</a>
        <a class="pill pill--ghost" :href="t.github" target="_blank" rel="noopener">GitHub</a>
        <a class="pill pill--ghost" :href="cvHref" download>{{ t.cv }}</a>
      </div>
      <p class="contact__foot">{{ t.footer }}</p>
    </div>
  </section>
</template>

<style scoped>
.contact { background: var(--fg); color: #fafaf9; }
.contact__inner { padding-top: 88px; padding-bottom: 40px; text-align: center; }
.contact__title { font-size: clamp(30px, 5vw, 48px); letter-spacing: -.03em; line-height: 1.1; }
.contact__sub { color: #d6d3d1; margin: 14px auto 0; max-width: 520px; }
.contact__cta { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-top: 32px; }
.pill--light { background: #fafaf9; color: var(--fg); border-color: #fafaf9; max-width: 100%; overflow-wrap: anywhere; }
.pill--ghost { background: transparent; color: #fafaf9; border-color: #57534e; }
.contact__foot { margin-top: 72px; font-size: 13px; color: #a8a29e; }
</style>
