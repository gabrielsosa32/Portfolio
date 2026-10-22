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

      <div v-reveal class="term">
        <div class="term__bar" aria-hidden="true"><span>● ● ●</span><span>gabriel@funes: ~</span></div>
        <div class="term__body">
          <p class="term__line" aria-hidden="true"><span class="term__prompt">gabriel@funes ~ $</span> contacto</p>
          <ul class="term__links">
            <li><span aria-hidden="true">→ </span><a :href="`mailto:${t.email}`">{{ t.email }}</a></li>
            <li><span aria-hidden="true">→ </span><a :href="t.linkedin" target="_blank" rel="noopener">LinkedIn</a></li>
            <li><span aria-hidden="true">→ </span><a :href="t.github" target="_blank" rel="noopener">GitHub</a></li>
            <li><span aria-hidden="true">→ </span><a :href="cvHref" download>{{ t.cv }}</a></li>
          </ul>
          <p class="term__line" aria-hidden="true"><span class="term__prompt">gabriel@funes ~ $</span> <span class="term__cursor" /></p>
        </div>
      </div>

      <p class="contact__foot">{{ t.footer }}</p>
    </div>
  </section>
</template>

<style scoped>
.contact__inner { padding-top: 88px; padding-bottom: 40px; }
.contact__title { font-size: clamp(30px, 5vw, 48px); letter-spacing: -.03em; line-height: 1.1; text-align: center; }
.contact__sub { color: var(--fg-2); margin: 14px auto 0; max-width: 520px; text-align: center; }
.term {
  max-width: 640px; margin: 32px auto 0; border-radius: 12px; overflow: hidden;
  border: 1px solid var(--border-strong); background: #050505; box-shadow: 0 24px 60px rgb(0 0 0 / .5);
  font-family: var(--mono); font-size: 14px;
}
.term__bar { display: flex; justify-content: space-between; padding: 8px 14px; background: var(--card); border-bottom: 1px solid var(--border); color: var(--muted); font-size: 12px; }
.term__bar span:first-child { color: var(--border-strong); letter-spacing: 2px; }
.term__body { padding: 16px 18px 18px; line-height: 1.9; }
.term__line { margin: 0; color: var(--fg); }
.term__prompt { color: var(--live); }
.term__links { list-style: none; margin: 4px 0 6px; padding: 0 0 0 14px; }
.term__links li { color: var(--muted); }
.term__links a { color: var(--fg); text-decoration: none; display: inline-block; min-height: 32px; overflow-wrap: anywhere; }
.term__links a:hover, .term__links a:focus-visible { color: var(--accent); text-decoration: underline; }
.term__cursor { display: inline-block; width: 8px; height: 16px; background: var(--fg); vertical-align: -3px; animation: blink 1s steps(1) infinite; }
@keyframes blink { 50% { opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .term__cursor { animation: none; } }
.contact__foot { margin-top: 64px; font-size: 13px; color: var(--muted); text-align: center; }
</style>
