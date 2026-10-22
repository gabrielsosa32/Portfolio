import type { ProjectId } from '~/content/types'
import { projectIdFromHash } from '~/utils/hash'
import { createPanelHistory } from '~/utils/panelHistory'
import { nextPanelState } from '~/utils/panel'

let panelHistory: ReturnType<typeof createPanelHistory> | null = null
let ids: ProjectId[] = []
let listening = false

/**
 * Estado global del panel "Ver más": lo abren tanto la portada como la sección Proyectos.
 * El historial (atrás cierra, link directo /#id) lo maneja createPanelHistory.
 */
export function usePanel() {
  const openId = useState<ProjectId | null>('panel-open', () => null)

  function syncFromHash() {
    openId.value = nextPanelState(openId.value, { type: 'hash', id: projectIdFromHash(location.hash, ids) })
    panelHistory?.synced(openId.value !== null)
  }

  function open(id: ProjectId) {
    panelHistory?.open(id)
    openId.value = nextPanelState(openId.value, { type: 'open', id })
  }

  function close() {
    if (!openId.value) return
    // Se cierra ya (no al llegar el popstate), así un segundo "cerrar" no vuelve a ir atrás.
    openId.value = nextPanelState(openId.value, { type: 'close' })
    panelHistory?.close()
  }

  /** Se llama una vez al montar la app, con los ids de los proyectos que tienen panel. */
  function init(projectIds: ProjectId[]) {
    ids = projectIds
    if (listening) return
    listening = true
    panelHistory = createPanelHistory(window.history, location.pathname + location.search)
    const initial = projectIdFromHash(location.hash, ids)
    if (initial) {
      panelHistory.openFromLoad(initial)
      openId.value = initial
    }
    window.addEventListener('popstate', syncFromHash)
    window.addEventListener('hashchange', syncFromHash)
  }

  return { openId, open, close, init }
}
