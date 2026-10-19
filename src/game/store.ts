import { create } from 'zustand'
import { stages } from './data/stages'
import type { StageDef } from './data/types'
import { assemblyTracks } from './data/construction'
import { puzzlePieces, resolvedCells, fitsOnBarge, type Cell } from './data/packing'

export type ScreenPhase = 'start' | 'stage-intro' | 'playing' | 'stage-complete' | 'finished'

interface FactPopup {
  itemName: string
  fact: string
  correct: boolean
}

export interface PackingPlacement {
  rotation: number
  anchorRow: number
  anchorCol: number
}

interface GameState {
  phase: ScreenPhase
  stageIndex: number
  /** slotId -> placed itemId, per stage key (mode: 'place' stages) */
  placements: Record<string, Record<string, string>>
  selectedSlotId: string | null
  activeFact: FactPopup | null
  /** stage ids actually finished this session, so the Hud doesn't claim a jumped-past stage is done */
  completedStageIds: string[]

  /** mode: 'assembly' (Construction) - steps completed per track */
  assemblyProgress: Record<'jacket' | 'topside', number>

  /** mode: 'packing' (Installation) */
  packingPlacements: Record<string, PackingPlacement>
  selectedPieceId: string | null
  selectedRotation: number

  startGame: () => void
  /** jump straight into a specific stage's minigame, skipping earlier stages */
  goToStage: (stageKey: StageDef['key']) => void
  beginStage: () => void
  selectSlot: (slotId: string | null) => void
  placeItem: (itemId: string) => void
  dismissFact: () => void
  continueAfterStage: () => void
  restart: () => void

  attemptAssemblyStep: (trackId: 'jacket' | 'topside', stepId: string) => void

  selectPiece: (pieceId: string | null) => void
  rotateSelectedPiece: () => void
  placeSelectedPieceAt: (row: number, col: number) => boolean
  /** pick a placed piece back up off the barge so it can be repositioned */
  unplacePiece: (pieceId: string) => void
}

const emptyAssemblyProgress = { jacket: 0, topside: 0 } as const

export const useGameStore = create<GameState>((set, get) => ({
  phase: 'start',
  stageIndex: 0,
  placements: {},
  selectedSlotId: null,
  activeFact: null,
  completedStageIds: [],

  assemblyProgress: { ...emptyAssemblyProgress },

  packingPlacements: {},
  selectedPieceId: null,
  selectedRotation: 0,

  startGame: () =>
    set({ phase: 'stage-intro', stageIndex: 0, placements: {}, completedStageIds: [] }),

  goToStage: (stageKey) => {
    const stageIndex = stages.findIndex((s) => s.key === stageKey)
    if (stageIndex === -1) return
    set({
      phase: 'stage-intro',
      stageIndex,
      placements: {},
      selectedSlotId: null,
      activeFact: null,
      completedStageIds: [],
      assemblyProgress: { ...emptyAssemblyProgress },
      packingPlacements: {},
      selectedPieceId: null,
      selectedRotation: 0,
    })
  },

  beginStage: () =>
    set({
      phase: 'playing',
      selectedSlotId: null,
      assemblyProgress: { ...emptyAssemblyProgress },
      packingPlacements: {},
      selectedPieceId: null,
      selectedRotation: 0,
    }),

  selectSlot: (slotId) => set({ selectedSlotId: slotId }),

  placeItem: (itemId) => {
    const { stageIndex, selectedSlotId, placements } = get()
    if (!selectedSlotId) return
    const stage = stages[stageIndex]
    const slot = stage.slots?.find((s) => s.id === selectedSlotId)
    if (!slot) return
    const item = stage.palette?.find((p) => p.id === itemId)
    if (!item) return

    const correct = item.id === slot.requiredItemId
    const stagePlacements = { ...(placements[stage.id] ?? {}) }

    if (correct) {
      stagePlacements[slot.id] = item.id
    }

    const allDone = correct && (stage.slots ?? []).every((s) => stagePlacements[s.id] !== undefined)

    set((s) => ({
      placements: { ...placements, [stage.id]: stagePlacements },
      selectedSlotId: null,
      activeFact: { itemName: item.name, fact: item.fact, correct },
      phase: allDone ? 'stage-complete' : 'playing',
      completedStageIds: allDone ? [...new Set([...s.completedStageIds, stage.id])] : s.completedStageIds,
    }))
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

  restart: () =>
    set({
      phase: 'start',
      stageIndex: 0,
      placements: {},
      selectedSlotId: null,
      activeFact: null,
      completedStageIds: [],
      assemblyProgress: { ...emptyAssemblyProgress },
      packingPlacements: {},
      selectedPieceId: null,
      selectedRotation: 0,
    }),

  attemptAssemblyStep: (trackId, stepId) => {
    const track = assemblyTracks.find((t) => t.id === trackId)
    if (!track) return
    const { assemblyProgress } = get()
    const stepIndex = track.steps.findIndex((s) => s.id === stepId)
    const currentProgress = assemblyProgress[trackId]
    if (stepIndex !== currentProgress) {
      // wrong order: either already built, or trying to skip ahead
      const step = track.steps[stepIndex]
      set({
        activeFact: {
          itemName: step.name,
          fact:
            stepIndex < currentProgress
              ? `The ${step.name} is already built on the ${track.title.toLowerCase()}!`
              : `Not yet - build "${track.steps[currentProgress].name}" on the ${track.title.toLowerCase()} first.`,
          correct: false,
        },
      })
      return
    }

    const step = track.steps[stepIndex]
    const nextProgress = { ...assemblyProgress, [trackId]: currentProgress + 1 }
    const allDone = assemblyTracks.every((t) => nextProgress[t.id] === t.steps.length)
    const stage = stages[get().stageIndex]

    set((s) => ({
      assemblyProgress: nextProgress,
      activeFact: { itemName: step.name, fact: step.fact, correct: true },
      phase: allDone ? 'stage-complete' : 'playing',
      completedStageIds: allDone ? [...new Set([...s.completedStageIds, stage.id])] : s.completedStageIds,
    }))
  },

  selectPiece: (pieceId) => set({ selectedPieceId: pieceId, selectedRotation: 0 }),

  rotateSelectedPiece: () => set((s) => ({ selectedRotation: (s.selectedRotation + 1) % 4 })),

  placeSelectedPieceAt: (row, col) => {
    const { selectedPieceId, selectedRotation, packingPlacements } = get()
    if (!selectedPieceId) return false
    const piece = puzzlePieces.find((p) => p.id === selectedPieceId)
    if (!piece) return false

    const occupied = new Set<string>()
    for (const [id, placement] of Object.entries(packingPlacements)) {
      if (id === selectedPieceId) continue
      const other = puzzlePieces.find((p) => p.id === id)
      if (!other) continue
      for (const [r, c] of resolvedCells(other, placement.rotation, placement.anchorRow, placement.anchorCol)) {
        occupied.add(`${r},${c}`)
      }
    }

    const cells: Cell[] = resolvedCells(piece, selectedRotation, row, col)
    if (!fitsOnBarge(cells, occupied)) return false

    const nextPlacements = {
      ...packingPlacements,
      [selectedPieceId]: { rotation: selectedRotation, anchorRow: row, anchorCol: col },
    }
    const allPlaced = puzzlePieces.every((p) => nextPlacements[p.id] !== undefined)
    const stage = stages[get().stageIndex]

    set((s) => ({
      packingPlacements: nextPlacements,
      selectedPieceId: null,
      selectedRotation: 0,
      activeFact: { itemName: piece.name, fact: piece.fact, correct: true },
      phase: allPlaced ? 'stage-complete' : 'playing',
      completedStageIds: allPlaced ? [...new Set([...s.completedStageIds, stage.id])] : s.completedStageIds,
    }))
    return true
  },

  unplacePiece: (pieceId) => {
    const { packingPlacements } = get()
    if (!packingPlacements[pieceId]) return
    const next = { ...packingPlacements }
    delete next[pieceId]
    set({ packingPlacements: next, selectedPieceId: pieceId, selectedRotation: 0 })
  },
}))

export function stageProgress(
  placements: Record<string, Record<string, string>>,
  stageId: string,
  totalSlots: number,
) {
  const done = Object.keys(placements[stageId] ?? {}).length
  return { done, total: totalSlots }
}
