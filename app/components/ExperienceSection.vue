<script setup lang="ts">
const { content } = useLang()
const t = computed(() => content.value.experience)
</script>

<template>
  <section id="experiencia" class="section">
    <div class="container">
      <p class="eyebrow">{{ t.eyebrow }}</p>
      <h2 class="section-title gitlog__title"><span class="visually-hidden">{{ t.title }}</span><span aria-hidden="true">git log --author=gabriel</span></h2>

      <ol v-reveal class="gitlog">
        <li v-for="item in t.items" :key="item.org" class="gitlog__item">
          <p class="gitlog__head">
            <span class="gitlog__star" aria-hidden="true">*</span>
            <span class="gitlog__period">{{ item.period }}</span>
            <span class="gitlog__role">{{ item.role }} <span class="gitlog__org">· {{ item.org }}</span></span>
          </p>
          <ul class="gitlog__points">
            <li v-for="p in item.points" :key="p"><span class="gitlog__pipe" aria-hidden="true">│</span>{{ p }}</li>
          </ul>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.gitlog__title { font-family: var(--mono); font-size: clamp(20px, 3vw, 28px); letter-spacing: -.01em; }
.gitlog {
  list-style: none; margin: 28px 0 0; padding: 20px 22px; display: grid; gap: 22px;
  background: rgb(0 0 0 / .55); border: 1px solid var(--border-strong); border-radius: 12px;
  font-family: var(--mono); font-size: 14px; line-height: 1.6;
}
.gitlog__head { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 12px; }
.gitlog__star { color: var(--live); }
.gitlog__period { color: var(--amber); white-space: nowrap; }
.gitlog__role { color: var(--fg); font-weight: 700; }
.gitlog__org { color: var(--accent); font-weight: 500; }
.gitlog__points { list-style: none; margin: 6px 0 0; padding: 0; display: grid; gap: 4px; color: var(--fg-2); font-family: Inter, system-ui, sans-serif; font-size: 15px; }
.gitlog__points li { display: flex; gap: 12px; }
.gitlog__pipe { font-family: var(--mono); color: var(--border-strong); flex: none; }
</style>
