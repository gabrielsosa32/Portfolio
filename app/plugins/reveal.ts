/**
 * v-reveal: aparición suave al entrar en pantalla, una sola vez.
 * La clase que oculta se pone desde JS, así sin JS el contenido se ve igual.
 */
export default defineNuxtPlugin((nuxtApp) => {
  let io: IntersectionObserver | null = null
  const reduced = import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  function observer() {
    io ??= new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-revealed')
          io!.unobserve(e.target)
        }
      }
    }, { rootMargin: '0px 0px -8% 0px' })
    return io
  }

  nuxtApp.vueApp.directive<HTMLElement>('reveal', {
    getSSRProps: () => ({}),
    mounted(el) {
      if (reduced) return
      el.classList.add('reveal')
      observer().observe(el)
    },
    beforeUnmount(el) {
      io?.unobserve(el)
    },
  })
})
