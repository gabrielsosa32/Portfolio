import type { InjectionKey, Ref } from 'vue'
import { shouldAnimate } from '~/utils/demos'

/**
 * `active` es true mientras el elemento está en pantalla, la pestaña está visible y no se pidió
 * reducir movimiento. Las demos arrancan su loop cuando pasa a true y lo cortan cuando pasa a false.
 */
/** Clave para que un contenedor (la portada) pause las demos que tiene adentro. */
export const DEMO_PAUSED = Symbol('demo-paused') as InjectionKey<Ref<boolean>>

export function useInView(target: Ref<HTMLElement | null>, opts: { threshold?: number } = {}) {
  const paused = inject(DEMO_PAUSED, ref(false))
  const ready = usePageReady()
  const visible = ref(false)
  const hidden = ref(false)
  const reduced = ref(false)
  const active = computed(() => shouldAnimate({ visible: visible.value, hidden: hidden.value, reduced: reduced.value, paused: paused.value, ready: ready.value }))

  let io: IntersectionObserver | null = null
  const onVisibility = () => { hidden.value = document.hidden }

  onMounted(() => {
    reduced.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    hidden.value = document.hidden
    io = new IntersectionObserver(([e]) => { visible.value = Boolean(e?.isIntersecting) }, { threshold: opts.threshold ?? 0.3 })
    if (target.value) io.observe(target.value)
    document.addEventListener('visibilitychange', onVisibility)
  })
  onBeforeUnmount(() => {
    io?.disconnect()
    document.removeEventListener('visibilitychange', onVisibility)
  })

  return { active: readonly(active), reduced: readonly(reduced) }
}
