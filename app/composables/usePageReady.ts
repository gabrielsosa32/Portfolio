/**
 * true un rato después de que la página terminó de cargar (y el navegador quedó libre).
 * Las animaciones esperan a esto para no competir con la carga en el celular.
 */
const ready = ref(false)
let scheduled = false

export function usePageReady() {
  if (import.meta.client && !scheduled) {
    scheduled = true
    const go = () => {
      const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback
      if (idle) idle(() => { ready.value = true }, { timeout: 2500 })
      else setTimeout(() => { ready.value = true }, 1200)
    }
    if (document.readyState === 'complete') go()
    else window.addEventListener('load', go, { once: true })
  }
  return readonly(ready)
}
