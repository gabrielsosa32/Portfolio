import { withBase } from '~/utils/base'

/** Devuelve una función que convierte rutas de `public/` en URLs con la base del sitio. */
export function useAsset() {
  const base = useRuntimeConfig().app.baseURL
  return (path: string) => withBase(base, path)
}
