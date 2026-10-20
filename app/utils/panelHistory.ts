import { hashForProject } from './hash'

export type HistoryLike = Pick<History, 'pushState' | 'replaceState' | 'back'>

/**
 * Maneja las entradas del historial del panel de proyecto, para que "atrás" siempre
 * cierre el panel (también si se entró con un link directo) y nunca saque del sitio.
 * `basePath` es la URL de la página sin hash (pathname + search).
 */
export function createPanelHistory(history: HistoryLike, basePath: string) {
  /** Hay una entrada `#proyecto` nuestra encima de la página. */
  let ownsEntry = false

  return {
    open(id: string) {
      history.pushState(null, '', basePath + hashForProject(id))
      ownsEntry = true
    },
    /** Se entró con `/#proyecto`: se pone la página debajo para que "atrás" cierre el panel. */
    openFromLoad(id: string) {
      history.replaceState(null, '', basePath)
      history.pushState(null, '', basePath + hashForProject(id))
      ownsEntry = true
    },
    /** Devuelve true si hay que esperar al popstate para cerrar. */
    close(): boolean {
      if (!ownsEntry) {
        // El hash no lo pusimos nosotros (lo editó el usuario): se limpia sin salir de la página.
        history.replaceState(null, '', basePath)
        return false
      }
      ownsEntry = false
      history.back()
      return true
    },
    /** El navegador cambió el hash por su cuenta (atrás, adelante, edición manual). */
    synced(hasProject: boolean) {
      if (!hasProject) ownsEntry = false
    },
  }
}
