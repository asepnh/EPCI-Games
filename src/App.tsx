import { IsometricScene } from './game/components/IsometricScene'
import { stages } from './game/data/stages'
import { stageProgress, useGameStore } from './game/store'
import { FactPopup } from './game/ui/FactPopup'
import { FinishedScreen } from './game/ui/FinishedScreen'
import { Hud } from './game/ui/Hud'
import { ItemPalette } from './game/ui/ItemPalette'
import { StageComplete } from './game/ui/StageComplete'
import { StageIntro } from './game/ui/StageIntro'
import { StartScreen } from './game/ui/StartScreen'

function App() {
  const phase = useGameStore((s) => s.phase)
  const stageIndex = useGameStore((s) => s.stageIndex)
  const placements = useGameStore((s) => s.placements)
  const selectedSlotId = useGameStore((s) => s.selectedSlotId)
  const selectSlot = useGameStore((s) => s.selectSlot)
  const activeFact = useGameStore((s) => s.activeFact)

  const stage = stages[stageIndex]

  if (phase === 'start') return <StartScreen />
  if (phase === 'finished') return <FinishedScreen />

  const stagePlacements = placements[stage.id] ?? {}
  const { done, total } = stageProgress(placements, stage.id, stage.slots.length)

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950">
      <IsometricScene
        stage={stage}
        placements={stagePlacements}
        selectedSlotId={selectedSlotId}
        onSelectSlot={(slotId) => {
          if (stagePlacements[slotId]) return
          selectSlot(slotId)
        }}
      />

      {phase !== 'stage-intro' && <Hud stage={stage} done={done} total={total} />}

      {phase === 'stage-intro' && <StageIntro stage={stage} />}

      {phase === 'playing' && selectedSlotId && (
        <ItemPalette stage={stage} slotId={selectedSlotId} />
      )}

      {activeFact && <FactPopup />}

      {phase === 'stage-complete' && !activeFact && <StageComplete stage={stage} />}
    </div>
  )
}

export default App
