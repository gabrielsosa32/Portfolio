/** GitHub Pages de proyecto: el sitio vive en /Portfolio/. */
const BASE = '/Portfolio/'
const SITE_URL = 'https://gabrielsosa32.github.io/Portfolio'

export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  modules: ['@nuxt/fonts'],
  css: ['~/assets/css/main.css'],
  devtools: { enabled: false },
  fonts: {
    families: [{ name: 'Inter', provider: 'google', weights: [400, 500, 600, 700] }],
  },
  app: {
    baseURL: BASE,
    head: {
      htmlAttrs: { lang: 'es' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#fafaf9' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: `${SITE_URL}/` },
        { property: 'og:site_name', content: 'Gabriel Sosa' },
        { property: 'og:image', content: `${SITE_URL}/img/og.png` },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:locale', content: 'es_AR' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: `${SITE_URL}/img/og.png` },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: `${BASE}favicon.svg` },
        { rel: 'canonical', href: `${SITE_URL}/` },
      ],
    },
  },
  nitro: {
    prerender: { routes: ['/'] },
  },
})
