export function projectIdFromHash<T extends string>(hash: string, ids: readonly T[]): T | null {
  const id = hash.replace(/^#/, '').toLowerCase()
  return (ids as readonly string[]).includes(id) ? (id as T) : null
}

export function hashForProject(id: string): string {
  return `#${id}`
}
