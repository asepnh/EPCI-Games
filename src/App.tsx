import { useEffect, useRef } from 'react'
import { IsometricScene } from './game/components/IsometricScene'
import { assemblyTracks } from './game/data/construction'
import { puzzlePieces } from './game/data/packing'
import { stages } from './game/data/stages'
import { STICK_BUDGET } from './game/data/structural'
import { stageProgress, useGameStore } from './game/store'
import { AssemblyGame } from './game/ui/AssemblyGame'
import { FactPopup } from './game/ui/FactPopup'
import { FinishedScreen } from './game/ui/FinishedScreen'
import { Hud } from './game/ui/Hud'
import { ItemPalette } from './game/ui/ItemPalette'
import { JacketBuilderGame } from './game/ui/JacketBuilderGame'
import { OverviewHome } from './game/ui/OverviewHome'
import { PackingGame } from './game/ui/PackingGame'
import { StageComplete } from './game/ui/StageComplete'
import { StageIntro } from './game/ui/StageIntro'

const TOTAL_ASSEMBLY_STEPS = assemblyTracks.reduce((sum, t) => sum + t.steps.length, 0)

function App() {
  const phase = useGameStore((s) => s.phase)
  const stageIndex = useGameStore((s) => s.stageIndex)
  const placements = useGameStore((s) => s.placements)
  const selectedSlotId = useGameStore((s) => s.selectedSlotId)
  const selectSlot = useGameStore((s) => s.selectSlot)
  const activeFact = useGameStore((s) => s.activeFact)
  const assemblyProgress = useGameStore((s) => s.assemblyProgress)
  const packingPlacements = useGameStore((s) => s.packingPlacements)
  const completedStageIds = useGameStore((s) => s.completedStageIds)
  const structuralBraces = useGameStore((s) => s.structuralBraces)

  // keep the browser/device back button inside the game: pushing a history
  // entry when a stage starts means "back" pops that entry (and fires
  // popstate below) instead of leaving the site entirely
  const prevPhaseRef = useRef(phase)
  useEffect(() => {
    if (prevPhaseRef.current === 'start' && phase !== 'start') {
      window.history.pushState({ epciGame: true }, '')
    }
    prevPhaseRef.current = phase
  }, [phase])

  useEffect(() => {
    function onPopState() {
      if (useGameStore.getState().phase !== 'start') {
        useGameStore.getState().restart()
      }
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const stage = stages[stageIndex]

  if (phase === 'start') return <OverviewHome />
  if (phase === 'finished') return <FinishedScreen />

  let done = 0
  let total = 0
  if (stage.mode === 'assembly') {
    total = TOTAL_ASSEMBLY_STEPS
    done = assemblyProgress.jacket + assemblyProgress.topside
  } else if (stage.mode === 'packing') {
    total = puzzlePieces.length
    done = Object.keys(packingPlacements).length
  } else if (stage.mode === 'structural') {
    total = STICK_BUDGET
    done = structuralBraces.length
  } else {
    ;({ done, total } = stageProgress(placements, stage.id, stage.slots?.length ?? 0))
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950">
      {stage.mode === 'place' && (
        <IsometricScene
          stage={stage}
          placements={placements[stage.id] ?? {}}
          selectedSlotId={selectedSlotId}
          onSelectSlot={(slotId) => {
            if ((placements[stage.id] ?? {})[slotId]) return
            selectSlot(slotId)
          }}
        />
      )}

      {stage.mode === 'assembly' && <AssemblyGame />}
      {stage.mode === 'packing' && <PackingGame />}
      {stage.mode === 'structural' && <JacketBuilderGame />}

      {phase !== 'stage-intro' && (
        <Hud stage={stage} done={done} total={total} completedStageIds={completedStageIds} />
      )}

      {phase === 'stage-intro' && <StageIntro stage={stage} />}

      {stage.mode === 'place' && phase === 'playing' && selectedSlotId && (
        <ItemPalette stage={stage} slotId={selectedSlotId} />
      )}

      {activeFact && <FactPopup />}

      {phase === 'stage-complete' && !activeFact && <StageComplete stage={stage} />}
    </div>
  )
}

export default App
