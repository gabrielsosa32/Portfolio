<script setup lang="ts">
const { content } = useLang()
const t = computed(() => content.value.testimonial)
</script>

<template>
  <section class="section testimonial-section" :aria-label="t.eyebrow">
    <div class="container">
      <p class="eyebrow">{{ t.eyebrow }}</p>
      <figure v-reveal class="comment">
        <span class="comment__mark" aria-hidden="true">/**</span>
        <blockquote class="comment__quote">{{ t.quote }}</blockquote>
        <figcaption class="comment__author">
          <span class="comment__at" aria-hidden="true">@author</span>
          <span><strong>{{ t.name }}</strong> <span class="comment__role">{{ t.role }} · {{ t.relation }}</span></span>
        </figcaption>
        <p class="comment__note"><span aria-hidden="true">@note </span>{{ t.note }}</p>
        <span class="comment__mark" aria-hidden="true">*/</span>
      </figure>
    </div>
  </section>
</template>

<style scoped>
.testimonial-section { padding-top: 0; }
.comment {
  margin: 0; padding: 22px 24px 22px 28px; border-radius: 12px; border: 1px solid var(--border-strong);
  border-left: 3px solid var(--accent); background: rgb(28 25 23 / .88);
}
@media (min-width: 768px) { .comment { padding: 28px 40px 28px 44px; } }
.comment__mark { display: block; font-family: var(--mono); color: var(--muted); font-size: 14px; }
.comment__quote {
  margin: 10px 0 0; font-size: clamp(18px, 2.2vw, 21px); line-height: 1.55; color: var(--fg); font-weight: 500; max-width: 820px;
}
.comment__author { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; margin-top: 20px; }
.comment__at, .comment__note span { font-family: var(--mono); color: var(--accent-2); font-size: 13px; }
.comment__role { color: var(--muted); font-size: 14px; }
.comment__note { margin: 8px 0 10px; font-size: 13px; color: var(--muted); }
</style>
