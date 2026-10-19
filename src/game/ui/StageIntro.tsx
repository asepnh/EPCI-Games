import type { StageDef } from '../data/types'
import { useGameStore } from '../store'

export function StageIntro({ stage }: { stage: StageDef }) {
  const beginStage = useGameStore((s) => s.beginStage)
  const restart = useGameStore((s) => s.restart)

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-6">
      <button
        onClick={restart}
        title="Back to home"
        aria-label="Back to home"
        className="absolute top-4 left-4 bg-slate-900/85 text-white rounded-xl px-3 py-2.5 shadow-lg hover:bg-slate-800 transition flex items-center gap-1.5"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 9.5V21h14V9.5" />
        </svg>
        <span className="hidden sm:inline text-sm font-semibold">Home</span>
      </button>
      <div
        className="max-w-lg w-full rounded-2xl p-8 space-y-5 text-white shadow-2xl border border-white/10"
        style={{ background: `linear-gradient(135deg, ${stage.accentColor}cc, #0f172acc)` }}
      >
        <p className="text-sm uppercase tracking-widest text-white/70 font-semibold">
          Stage {stage.order + 1} of 4
        </p>
        <h2 className="text-3xl font-bold">{stage.title}</h2>
        <p className="text-white/80 italic">{stage.subtitle}</p>
        <p className="text-white/90 leading-relaxed">{stage.narrative}</p>
        <button
          onClick={beginStage}
          className="px-6 py-2.5 rounded-full bg-white text-slate-900 font-bold hover:bg-slate-100 transition"
        >
          Enter the {stage.title.replace(/^\d+\.\s*/, '')} Site
        </button>
      </div>
    </div>
  )
}
