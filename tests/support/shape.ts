/** Compara la forma de dos objetos de contenido: mismas claves, mismos largos de listas y ningún texto vacío. */
export function shapeDiff(a: unknown, b: unknown, path = ''): string[] {
  const at = path || '(raíz)'
  if (typeof a === 'string' || typeof b === 'string') {
    if (typeof a !== typeof b) return [`${at}: tipos distintos`]
    const out: string[] = []
    if (!(a as string).trim() || !(b as string).trim()) out.push(`${at}: texto vacío`)
    return out
  }
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return [`${at}: tipos distintos`]
    if (a.length !== b.length) return [`${at}: largo ${a.length} vs ${b.length}`]
    return a.flatMap((x, i) => shapeDiff(x, b[i], `${path}[${i}]`))
  }
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const ka = Object.keys(a)
    const kb = Object.keys(b)
    const out: string[] = []
    for (const k of ka) if (!kb.includes(k)) out.push(`${path ? `${path}.` : ''}${k}: falta en la segunda`)
    for (const k of kb) if (!ka.includes(k)) out.push(`${path ? `${path}.` : ''}${k}: falta en la primera`)
    for (const k of ka) {
      if (kb.includes(k)) out.push(...shapeDiff((a as never)[k], (b as never)[k], path ? `${path}.${k}` : k))
    }
    return out
  }
  return a === b || typeof a === typeof b ? [] : [`${at}: tipos distintos`]
}
