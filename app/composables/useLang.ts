import { es } from '~/content/es'
import { en } from '~/content/en'
import type { Lang, SiteContent } from '~/content/types'
import { readStoredLang, storeLang } from '~/utils/langStorage'

const contents: Record<Lang, SiteContent> = { es, en }

function safeLocalStorage(): Storage | undefined {
  try {
    return window.localStorage
  } catch {
    return undefined
  }
}

export function useLang() {
  const lang = useState<Lang>('lang', () => 'es')
  const content = computed(() => contents[lang.value])

  function setLang(l: Lang) {
    lang.value = l
    if (import.meta.client) {
      storeLang(safeLocalStorage(), l)
      document.documentElement.lang = l
    }
  }

  function toggle() {
    setLang(lang.value === 'es' ? 'en' : 'es')
  }

  /** Se llama una vez al montar la app: recupera el idioma guardado. */
  function restore() {
    if (!import.meta.client) return
    const stored = readStoredLang(safeLocalStorage())
    if (stored !== lang.value) setLang(stored)
  }

  return { lang, content, setLang, toggle, restore }
}
