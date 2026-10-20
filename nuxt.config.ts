export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  modules: ['@nuxt/fonts'],
  css: ['~/assets/css/main.css'],
  devtools: { enabled: false },
  fonts: {
    families: [{ name: 'Inter', provider: 'google', weights: [400, 500, 600, 700] }],
  },
  app: {
    baseURL: '/',
    head: {
      htmlAttrs: { lang: 'es' },
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    },
  },
  nitro: {
    prerender: { routes: ['/'] },
  },
})
