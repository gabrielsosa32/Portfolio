<script setup lang="ts">
const { lang, content, toggle } = useLang()
const nav = computed(() => content.value.nav)
</script>

<template>
  <header class="nav">
    <div class="container nav__inner">
      <a href="#top" class="nav__name">Gabriel Sosa</a>
      <nav class="nav__links" aria-label="Secciones">
        <a href="#proyectos">{{ nav.projects }}</a>
        <a href="#experiencia">{{ nav.experience }}</a>
        <a href="#datos">{{ nav.data }}</a>
        <a href="#sobre-mi">{{ nav.about }}</a>
        <a href="#contacto">{{ nav.contact }}</a>
      </nav>
      <button type="button" class="nav__lang" @click="toggle">
        <span :class="{ on: lang === 'es' }">ES</span>
        <span class="sep">|</span>
        <span :class="{ on: lang === 'en' }">EN</span>
        <span class="visually-hidden">— {{ nav.switchLang }}</span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.nav {
  position: sticky; top: 0; z-index: 20;
  background: var(--nav-bg);
  border-bottom: 1px solid var(--border);
}
.nav__inner { display: flex; align-items: center; gap: 24px; height: 60px; }
.nav__name { font-weight: 700; text-decoration: none; letter-spacing: -.01em; margin-right: auto; }
.nav__links { display: none; gap: 24px; font-size: 14px; }
.nav__links a { color: var(--muted); text-decoration: none; transition: color .15s; }
.nav__links a:hover { color: var(--fg); }
@media (min-width: 640px) { .nav__links { display: flex; } }
.nav__lang {
  display: inline-flex; align-items: center; gap: 6px; min-height: 36px; padding: 0 12px;
  border: 1px solid var(--border-strong); border-radius: 999px; background: var(--card);
  font: inherit; font-size: 13px; color: var(--muted); cursor: pointer;
}
.nav__lang .on { color: var(--fg); font-weight: 700; }
.nav__lang .sep { color: var(--border-strong); }
</style>
