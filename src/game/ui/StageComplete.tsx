import type { StageDef } from '../data/types'
import { useGameStore } from '../store'

export function StageComplete({ stage }: { stage: StageDef }) {
  const continueAfterStage = useGameStore((s) => s.continueAfterStage)
  const isLast = stage.order === 3

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/85 backdrop-blur-sm p-6 z-20">
      <div
        className="max-w-lg w-full rounded-2xl p-8 space-y-5 text-white shadow-2xl border border-white/10 text-center"
        style={{ background: `linear-gradient(135deg, ${stage.accentColor}cc, #0f172acc)` }}
      >
        <p className="text-sm uppercase tracking-widest text-white/70 font-semibold">
          Stage {stage.order + 1} Complete
        </p>
        <h2 className="text-3xl font-bold">{stage.title} Done!</h2>
        <p className="text-white/90 leading-relaxed">{stage.wrapUp}</p>
        <button
          onClick={continueAfterStage}
          className="px-6 py-2.5 rounded-full bg-white text-slate-900 font-bold hover:bg-slate-100 transition"
        >
          {isLast ? 'See Final Summary' : 'Continue to Next Stage'}
        </button>
      </div>
    </div>
  )
}
