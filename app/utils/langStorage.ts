import type { Lang } from '~/content/types'

const KEY = 'lang'

export function readStoredLang(storage: Pick<Storage, 'getItem'> | undefined): Lang {
  try {
    return storage?.getItem(KEY) === 'en' ? 'en' : 'es'
  } catch {
    return 'es'
  }
}

export function storeLang(storage: Pick<Storage, 'setItem'> | undefined, lang: Lang): void {
  try {
    storage?.setItem(KEY, lang)
  } catch {
    // Modo privado o storage bloqueado: el idioma funciona igual, solo no se recuerda.
  }
}
