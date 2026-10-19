import { create } from 'zustand'
import { stages } from './data/stages'

export type ScreenPhase = 'start' | 'stage-intro' | 'playing' | 'stage-complete' | 'finished'

interface FactPopup {
  itemName: string
  fact: string
  correct: boolean
}

interface GameState {
  phase: ScreenPhase
  stageIndex: number
  /** slotId -> placed itemId, per stage key */
  placements: Record<string, Record<string, string>>
  selectedSlotId: string | null
  activeFact: FactPopup | null

  startGame: () => void
  beginStage: () => void
  selectSlot: (slotId: string | null) => void
  placeItem: (itemId: string) => void
  dismissFact: () => void
  continueAfterStage: () => void
  restart: () => void
}

export const useGameStore = create<GameState>((set, get) => ({
  phase: 'start',
  stageIndex: 0,
  placements: {},
  selectedSlotId: null,
  activeFact: null,

  startGame: () => set({ phase: 'stage-intro', stageIndex: 0, placements: {} }),

  beginStage: () => set({ phase: 'playing', selectedSlotId: null }),

  selectSlot: (slotId) => set({ selectedSlotId: slotId }),

  placeItem: (itemId) => {
    const { stageIndex, selectedSlotId, placements } = get()
    if (!selectedSlotId) return
    const stage = stages[stageIndex]
    const slot = stage.slots.find((s) => s.id === selectedSlotId)
    if (!slot) return
    const item = stage.palette.find((p) => p.id === itemId)
    if (!item) return

    const correct = item.id === slot.requiredItemId
    const stagePlacements = { ...(placements[stage.id] ?? {}) }

    if (correct) {
      stagePlacements[slot.id] = item.id
    }

    const allDone =
      correct &&
      stage.slots.every((s) => stagePlacements[s.id] !== undefined)

    set({
      placements: { ...placements, [stage.id]: stagePlacements },
      selectedSlotId: null,
      activeFact: { itemName: item.name, fact: item.fact, correct },
      phase: allDone ? 'stage-complete' : 'playing',
    })
  },

  dismissFact: () => set({ activeFact: null }),

  continueAfterStage: () => {
    const next = get().stageIndex + 1
    if (next >= stages.length) {
      set({ phase: 'finished' })
    } else {
      set({ stageIndex: next, phase: 'stage-intro', selectedSlotId: null })
    }
  },

  restart: () => set({ phase: 'start', stageIndex: 0, placements: {}, selectedSlotId: null, activeFact: null }),
}))

export function stageProgress(placements: Record<string, Record<string, string>>, stageId: string, totalSlots: number) {
  const done = Object.keys(placements[stageId] ?? {}).length
  return { done, total: totalSlots }
}
