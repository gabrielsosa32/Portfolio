<script setup lang="ts">
const { content } = useLang()
const t = computed(() => content.value.testimonial)
</script>

<template>
  <section class="section testimonial-section" :aria-label="t.eyebrow">
    <div class="container">
      <figure v-reveal class="testimonial">
        <p class="eyebrow">{{ t.eyebrow }}</p>
        <span class="testimonial__mark" aria-hidden="true">“</span>
        <blockquote class="testimonial__quote">{{ t.quote }}</blockquote>
        <figcaption class="testimonial__author">
          <span class="testimonial__initials" aria-hidden="true">AG</span>
          <span>
            <strong>{{ t.name }}</strong>
            <span class="testimonial__role">{{ t.role }} · {{ t.relation }}</span>
          </span>
        </figcaption>
        <p class="testimonial__note">{{ t.note }}</p>
      </figure>
    </div>
  </section>
</template>

<style scoped>
.testimonial-section { padding-top: 0; }
.testimonial {
  position: relative; margin: 0; padding: 36px 28px 28px; border-radius: 20px;
  background: var(--card); border: 1px solid var(--border);
  background-image: radial-gradient(circle at 100% 0%, rgba(var(--net-rgb), .10), transparent 45%);
}
@media (min-width: 768px) { .testimonial { padding: 48px 56px 40px; } }
.testimonial__mark {
  position: absolute; right: 28px; top: 4px; font-size: 140px; line-height: 1; font-family: Georgia, serif;
  background: linear-gradient(135deg, var(--accent), var(--accent-2)); -webkit-background-clip: text; background-clip: text; color: transparent;
  opacity: .5;
}
.testimonial__quote {
  margin: 10px 0 0; font-size: clamp(18px, 2.2vw, 22px); line-height: 1.5; color: var(--fg); font-weight: 500;
  max-width: 820px; letter-spacing: -.005em;
}
.testimonial__author { display: flex; align-items: center; gap: 14px; margin-top: 28px; }
.testimonial__initials {
  flex: none; width: 44px; height: 44px; border-radius: 50%; display: grid; place-items: center;
  font-weight: 700; font-size: 15px; color: var(--muted); background: var(--bg-alt); border: 1px solid var(--border-strong);
}
.testimonial__author strong { display: block; font-size: 16px; }
.testimonial__role { display: block; font-size: 14px; color: var(--muted); }
.testimonial__note { margin-top: 18px; font-size: 13px; color: var(--muted); }
</style>
