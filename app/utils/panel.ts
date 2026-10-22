import type { ProjectId } from '~/content/types'

export type PanelAction =
  | { type: 'open'; id: ProjectId }
  | { type: 'close' }
  | { type: 'hash'; id: ProjectId | null }

/** Qué proyecto queda abierto en el panel "Ver más" después de cada acción. */
export function nextPanelState(_current: ProjectId | null, action: PanelAction): ProjectId | null {
  switch (action.type) {
    case 'open': return action.id
    case 'close': return null
    case 'hash': return action.id
  }
}
