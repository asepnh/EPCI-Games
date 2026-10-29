import type { StageDef } from './types'

export interface OverviewZone {
  id: string
  title: string
  /** short sentence shown in the info panel on hover/tap */
  description: string
  accentColor: string
  /** footprint center on the map, in world units */
  center: [number, number]
  /** footprint size, used for the hover hit-box and highlight */
  size: [number, number]
  /** clicking this zone jumps straight into this stage's minigame */
  stageKey: StageDef['key']
  /** for the Installation stage only: which half to jump into (defaults to 'loadout') */
  installSubPhase?: 'loadout' | 'site'
}

export const overviewZones: OverviewZone[] = [
  {
    id: 'engineering',
    title: 'Engineering Office',
    description:
      'Engineers design the whole plant on computers first - the process, the piping, the steel structures and the electrics - before anything is built.',
    accentColor: '#3b82f6',
    center: [-9, 0],
    size: [5.5, 5.5],
    stageKey: 'engineering',
  },
  {
    id: 'manufacturing',
    title: 'Manufacturing & Supply',
    description:
      'Steel, pipes, pumps and valves are manufactured all over the world, then trucked in to the fabrication yard right when they are needed.',
    accentColor: '#16a34a',
    center: [-3.5, 0],
    size: [5.5, 5.5],
    stageKey: 'procurement',
  },
  {
    id: 'fabrication',
    title: 'Fabrication Yard',
    description:
      'Workers weld steel frames and assemble the jacket (the legs) and the topside (the deck) as giant ready-made modules.',
    accentColor: '#d97706',
    center: [2.5, 0],
    size: [6.5, 6.5],
    stageKey: 'construction',
  },
  {
    id: 'loadout',
    title: 'Load-Out & Barge',
    description:
      'Finished modules are rolled onto a heavy transport barge, which is towed out to the real offshore site.',
    accentColor: '#0ea5e9',
    center: [8.5, 0],
    size: [4.5, 5.5],
    stageKey: 'installation',
  },
  {
    id: 'offshore',
    title: 'Offshore Installation',
    description:
      'A heavy-lift installation vessel sets the jacket on the seabed, then lowers the topside into place and hooks everything up.',
    accentColor: '#0369a1',
    center: [15, 0],
    size: [6.5, 6.5],
    stageKey: 'installation',
    installSubPhase: 'site',
  },
]
