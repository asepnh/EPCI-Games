import { create } from 'zustand'
import { stages } from './data/stages'
import type { StageDef } from './data/types'
import { assemblyTracks } from './data/construction'
import { puzzlePieces, resolvedCells, fitsOnBarge, type Cell } from './data/packing'
import { STICK_BUDGET, structuralFacts } from './data/structural'
import { installSiteSteps } from './data/installationSite'

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

  /** mode: 'packing' (Installation) - 4a: load the barge */
  packingPlacements: Record<string, PackingPlacement>
  selectedPieceId: string | null
  selectedRotation: number
  /** mode: 'packing' (Installation) - which half of the stage we're in: 4a load-out or 4b offshore site */
  installationSubPhase: 'loadout' | 'site'
  /** mode: 'packing' (Installation) - 4b: offshore installation steps completed */
  installProgress: number

  /** mode: 'structural' (Engineering) */
  structuralBraces: string[]
  structuralTestPhase: 'building' | 'simulating' | 'passed' | 'failed'

  startGame: () => void
  /**
   * jump straight into a specific stage's minigame, skipping earlier
   * stages. For the Installation stage, optionally jump straight into 4b
   * (offshore install) instead of starting at 4a (load-out).
   */
  goToStage: (stageKey: StageDef['key'], installSubPhase?: 'loadout' | 'site') => void
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

  attemptInstallStep: (stepId: string) => void

  toggleBrace: (slotId: string) => void
  startStabilityTest: () => void
  reportStructuralTestResult: (passed: boolean) => void
  resetStructuralTest: () => void
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
  installationSubPhase: 'loadout',
  installProgress: 0,

  structuralBraces: [],
  structuralTestPhase: 'building',

  startGame: () =>
    set({ phase: 'stage-intro', stageIndex: 0, placements: {}, completedStageIds: [] }),

  goToStage: (stageKey, installSubPhase = 'loadout') => {
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
      installationSubPhase: installSubPhase,
      installProgress: 0,
      structuralBraces: [],
      structuralTestPhase: 'building',
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
      // installationSubPhase is deliberately left as-is here: goToStage is
      // what decides whether this stage starts at 4a or jumps straight to
      // 4b, and that choice has already been made by the time this runs
      installProgress: 0,
      structuralBraces: [],
      structuralTestPhase: 'building',
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
      installationSubPhase: 'loadout',
      installProgress: 0,
      structuralBraces: [],
      structuralTestPhase: 'building',
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

    set((s) => ({
      packingPlacements: nextPlacements,
      selectedPieceId: null,
      selectedRotation: 0,
      activeFact: { itemName: piece.name, fact: piece.fact, correct: true },
      // loading the barge (4a) is only half the Installation stage - once
      // every piece is loaded, move on to the offshore install steps (4b)
      // rather than completing the stage here
      installationSubPhase: allPlaced ? 'site' : s.installationSubPhase,
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

  attemptInstallStep: (stepId) => {
    const { installProgress } = get()
    const stepIndex = installSiteSteps.findIndex((s) => s.id === stepId)
    if (stepIndex !== installProgress) {
      // wrong order: either already done, or trying to skip ahead
      const step = installSiteSteps[stepIndex]
      set({
        activeFact: {
          itemName: step.name,
          fact:
            stepIndex < installProgress
              ? `"${step.name}" is already done!`
              : `Not yet - complete "${installSiteSteps[installProgress].name}" first.`,
          correct: false,
        },
      })
      return
    }

    const step = installSiteSteps[stepIndex]
    const nextProgress = installProgress + 1
    const allDone = nextProgress === installSiteSteps.length
    const stage = stages[get().stageIndex]

    set((s) => ({
      installProgress: nextProgress,
      activeFact: { itemName: step.name, fact: step.fact, correct: true },
      phase: allDone ? 'stage-complete' : 'playing',
      completedStageIds: allDone ? [...new Set([...s.completedStageIds, stage.id])] : s.completedStageIds,
    }))
  },

  toggleBrace: (slotId) => {
    const { structuralBraces, structuralTestPhase } = get()
    if (structuralTestPhase !== 'building') return
    if (structuralBraces.includes(slotId)) {
      set({ structuralBraces: structuralBraces.filter((id) => id !== slotId) })
    } else {
      if (structuralBraces.length >= STICK_BUDGET) return
      set({ structuralBraces: [...structuralBraces, slotId] })
    }
  },

  startStabilityTest: () => {
    if (get().structuralTestPhase !== 'building') return
    set({ structuralTestPhase: 'simulating' })
  },

  reportStructuralTestResult: (passed) => {
    if (passed) {
      const stage = stages[get().stageIndex]
      set((s) => ({
        structuralTestPhase: 'passed',
        activeFact: { itemName: 'Stability Test', fact: structuralFacts.pass, correct: true },
        phase: 'stage-complete',
        completedStageIds: [...new Set([...s.completedStageIds, stage.id])],
      }))
    } else {
      set({ structuralTestPhase: 'failed' })
    }
  },

  resetStructuralTest: () => set({ structuralTestPhase: 'building' }),
}))

export function stageProgress(
  placements: Record<string, Record<string, string>>,
  stageId: string,
  totalSlots: number,
) {
  const done = Object.keys(placements[stageId] ?? {}).length
  return { done, total: totalSlots }
}
