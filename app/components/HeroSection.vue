<script setup lang="ts">
const { lang, content } = useLang()
const hero = computed(() => content.value.hero)
const contact = computed(() => content.value.contact)
const asset = useAsset()

/** Cuando Gabriel pase su foto: guardarla en public/img/photo.webp y poner la ruta acá. */
const photo = ''
</script>

<template>
  <section id="top" class="hero">
    <NetworkBackground />
    <div class="container hero__inner">
      <div class="hero__id">
        <img v-if="photo" :src="asset(photo)" alt="Gabriel Sosa" class="avatar" width="72" height="72">
        <div v-else class="avatar avatar--initials" aria-hidden="true">GS</div>
        <p class="hero__role">
          {{ hero.role }}<span class="dot" aria-hidden="true"> · </span><span class="hero__loc">{{ hero.location }}</span>
        </p>
      </div>

      <TitleReveal :key="lang" :lead="hero.titleLead" :highlight="hero.titleHighlight" />

      <p class="hero__subtitle">{{ hero.subtitle }}</p>
      <p class="live hero__available"><span class="pulse" aria-hidden="true" />{{ hero.availability }}</p>

      <div class="hero__cta">
        <a class="pill pill--dark" :href="asset(hero.cvHref)" download>{{ hero.cta.cv }}</a>
        <a class="pill" href="#contacto">{{ hero.cta.contact }}</a>
        <a class="pill" :href="contact.github" target="_blank" rel="noopener">GitHub</a>
        <a class="pill" :href="contact.linkedin" target="_blank" rel="noopener">LinkedIn</a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero { position: relative; overflow: hidden; }
.hero__inner { position: relative; padding-top: 56px; padding-bottom: 88px; }
@media (min-width: 768px) { .hero__inner { padding-top: 96px; padding-bottom: 128px; } }
.hero__id { display: flex; align-items: center; gap: 14px; margin-bottom: 22px; }
.avatar { width: 72px; height: 72px; border-radius: 50%; object-fit: cover; flex: none; border: 3px solid var(--border-strong); box-shadow: var(--shadow); }
.avatar--initials {
  display: grid; place-items: center; font-weight: 700; font-size: 22px; color: var(--muted);
  background: linear-gradient(135deg, #292524, #1c1917);
}
.hero__role { font-size: 15px; font-weight: 600; color: var(--accent); }
.hero__loc { color: var(--muted); font-weight: 500; }
@media (max-width: 479px) {
  .hero__role .dot { display: none; }
  .hero__loc { display: block; }
}
.hero__subtitle { margin-top: 22px; font-size: clamp(16px, 2vw, 19px); color: var(--fg-2); max-width: 600px; }
.hero__available { display: inline-flex; align-items: center; gap: 8px; margin-top: 14px; }
.pulse { position: relative; width: 8px; height: 8px; border-radius: 50%; background: var(--live); }
.pulse::after {
  content: ''; position: absolute; inset: 0; border-radius: 50%; background: var(--live);
  animation: pulse 2s ease-out infinite;
}
@keyframes pulse { from { transform: scale(1); opacity: .6; } to { transform: scale(3); opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .pulse::after { animation: none; } }
.hero__cta { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 28px; }
</style>
