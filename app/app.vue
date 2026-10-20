<script setup lang="ts">
import { goatcounterScript } from '~/utils/analytics'

const { lang, content, restore } = useLang()
const counter = goatcounterScript(useRuntimeConfig().public.goatcounter)
if (counter) useHead({ script: [counter] })

useHead(() => ({
  htmlAttrs: { lang: lang.value },
  title: content.value.meta.title,
  meta: [
    { name: 'description', content: content.value.meta.description },
    { property: 'og:title', content: content.value.meta.title },
    { property: 'og:description', content: content.value.meta.description },
  ],
}))

onMounted(restore)
</script>

<template>
  <SiteNav />
  <main>
    <HeroSection />
    <ProjectsSection />
    <ExperienceSection />
    <TestimonialSection />
    <DataSection />
    <AboutSection />
  </main>
  <ContactSection />
</template>

<style>
.reveal { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s cubic-bezier(.2, .8, .2, 1); }
.reveal.is-revealed { opacity: 1; transform: none; }
</style>
