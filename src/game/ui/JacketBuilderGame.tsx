import { JacketStructureScene } from '../components/JacketStructureScene'
import { STICK_BUDGET, structuralFacts } from '../data/structural'
import { useGameStore } from '../store'

export function JacketBuilderGame() {
  const structuralBraces = useGameStore((s) => s.structuralBraces)
  const structuralTestPhase = useGameStore((s) => s.structuralTestPhase)
  const startStabilityTest = useGameStore((s) => s.startStabilityTest)
  const resetStructuralTest = useGameStore((s) => s.resetStructuralTest)

  const used = structuralBraces.length
  const building = structuralTestPhase === 'building'
  const simulating = structuralTestPhase === 'simulating'
  const failed = structuralTestPhase === 'failed'

  return (
    <>
      <JacketStructureScene />

      <div className="absolute inset-x-0 bottom-0 p-4 flex justify-center z-10">
        <div className="max-w-xl w-full bg-slate-900/95 text-white rounded-2xl p-4 shadow-2xl border border-white/10 space-y-3">
          {!failed && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/70">
                  Click an open bay to add or remove a brace. A bay only becomes a rigid triangle
                  once it has both a horizontal (grey) top and a diagonal (amber) - either alone
                  still lets it rack.
                </p>
                <p className="shrink-0 ml-3 text-sm font-bold whitespace-nowrap">
                  {used}/{STICK_BUDGET} braces
                </p>
              </div>
              <button
                onClick={startStabilityTest}
                disabled={!building}
                className="w-full py-2.5 rounded-full bg-sky-400 hover:bg-sky-300 disabled:bg-white/10 disabled:text-white/40 text-slate-900 font-bold transition"
              >
                {simulating ? 'Testing...' : 'Test Stability'}
              </button>
            </>
          )}

          {failed && (
            <>
              <p className="text-sm font-bold uppercase tracking-wide text-rose-400">
                It racked and toppled
              </p>
              <p className="text-white/85 text-sm leading-relaxed">{structuralFacts.fail}</p>
              <button
                onClick={resetStructuralTest}
                className="w-full py-2.5 rounded-full bg-white text-slate-900 font-bold hover:bg-slate-100 transition"
              >
                Reset &amp; Try Again
              </button>
            </>
          )}
        </div>
      </div>
    </>
  )
}
