/** Antepone la base del sitio (p. ej. `/Portfolio/` en GitHub Pages) a una ruta de `public/`. */
export function withBase(base: string, path: string): string {
  if (/^[a-z]+:/i.test(path)) return path
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`
}
