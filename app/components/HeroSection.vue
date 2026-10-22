<script setup lang="ts">
import type { Project, ProjectId } from '~/content/types'
import { DEMO_PAUSED } from '~/composables/useInView'

const { lang, content } = useLang()
const hero = computed(() => content.value.hero)
const contact = computed(() => content.value.contact)
const projects = computed(() => content.value.projects)
const asset = useAsset()

const photo = '/img/photo.webp'

// Con el panel "Ver más" abierto, las demos de la portada quedan tapadas: se pausan.
const { openId } = usePanel()
provide(DEMO_PAUSED, computed(() => openId.value !== null))

const byId = (id: ProjectId) => projects.value.main.find(p => p.id === id)!
function statusLabel(p: Project) {
  const t = projects.value
  return p.status === 'live' ? t.live : p.status === 'pilot' ? t.pilot : t.inProgress
}
</script>

<template>
  <section id="top" class="hero">
    <div class="container hero__inner">
      <div class="hero__id">
        <div class="hero__who">
          <img :src="asset(photo)" alt="Gabriel Sosa" class="avatar" width="88" height="88">
          <div>
            <h1 class="hero__name">Gabriel Sosa</h1>
            <p class="hero__role">{{ hero.role }}</p>
            <p class="hero__loc">{{ hero.location }}</p>
          </div>
        </div>
        <p class="live hero__available"><span class="pulse" aria-hidden="true" />{{ hero.availability }}</p>
        <p class="hero__intro">{{ hero.intro }}</p>
        <div class="hero__cta">
          <a class="pill pill--dark" :href="asset(hero.cvHref)" download>{{ hero.cta.cv }}</a>
          <a class="pill" href="#contacto">{{ hero.cta.contact }}</a>
          <a class="pill" :href="contact.github" target="_blank" rel="noopener">GitHub</a>
          <a class="pill" :href="contact.linkedin" target="_blank" rel="noopener">LinkedIn</a>
        </div>
      </div>

      <div class="hero__panel">
        <div class="hero__grid">
          <DemoTile :project="byId('reservas')" :status-label="statusLabel(byId('reservas'))" :more-label="projects.more">
            <BotChatDemo :demo="projects.botDemo" />
          </DemoTile>
          <DemoTile :project="byId('pases')" :status-label="statusLabel(byId('pases'))" :more-label="projects.more">
            <DoorDemo :demo="hero.demos.door" />
          </DemoTile>
          <DemoTile :project="byId('plugo')" :status-label="statusLabel(byId('plugo'))" :more-label="projects.more">
            <ChargeDemo :demo="hero.demos.charge" />
          </DemoTile>
          <DemoTile :project="byId('techos')" :status-label="statusLabel(byId('techos'))" :more-label="projects.more">
            <QuoteDemo :demo="hero.demos.quote" :lang="lang" />
          </DemoTile>
        </div>
        <p class="hero__note">{{ hero.demos.note }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero__inner { display: grid; gap: 36px; padding-top: 40px; padding-bottom: 72px; }
@media (min-width: 1024px) {
  .hero__inner { grid-template-columns: minmax(260px, 1fr) 2fr; align-items: center; gap: 40px; padding-top: 56px; padding-bottom: 96px; min-height: min(calc(100vh - 60px), 860px); }
}
.avatar { width: 88px; height: 88px; border-radius: 50%; object-fit: cover; border: 3px solid var(--border-strong); box-shadow: var(--shadow); }
/* En el celular la presentación va compacta (foto al lado del nombre) para que las demos entren en la primera pantalla. */
.hero__who { display: flex; align-items: center; gap: 14px; }
@media (min-width: 1024px) { .hero__who { display: block; } .hero__who .hero__name { margin-top: 18px; } }
@media (max-width: 1023px) { .avatar { width: 64px; height: 64px; } .hero__intro { display: none; } .hero__inner { gap: 24px; padding-top: 24px; } }
.hero__name { margin-top: 0; font-size: clamp(30px, 3.4vw, 40px); line-height: 1.1; letter-spacing: -.03em; }
.hero__role { margin-top: 6px; font-weight: 600; color: var(--accent); }
.hero__loc { color: var(--muted); font-size: 14px; }
.hero__available { display: inline-flex; align-items: center; gap: 8px; margin-top: 12px; }
.pulse { position: relative; width: 8px; height: 8px; border-radius: 50%; background: var(--live); }
.pulse::after { content: ''; position: absolute; inset: 0; border-radius: 50%; background: var(--live); animation: pulse 2s ease-out infinite; }
@keyframes pulse { from { transform: scale(1); opacity: .6; } to { transform: scale(3); opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .pulse::after { animation: none; } }
.hero__intro { margin-top: 16px; color: var(--fg-2); max-width: 36ch; }
.hero__cta { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; }

.hero__grid { display: grid; gap: 12px; }
@media (min-width: 640px) { .hero__grid { grid-template-columns: 1fr 1fr; } }
.hero__grid > * { height: 220px; }
@media (min-width: 1024px) { .hero__grid > * { height: 240px; } }
.hero__note { margin-top: 10px; font-family: var(--mono); font-size: 12px; color: var(--muted); text-align: right; }
.hero__note::before { content: '* '; }
</style>
