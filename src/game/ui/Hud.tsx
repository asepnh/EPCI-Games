import type { StageDef } from '../data/types'
import { stages } from '../data/stages'
import { useGameStore } from '../store'

interface HudProps {
  stage: StageDef
  done: number
  total: number
  completedStageIds: string[]
}

export function Hud({ stage, done, total, completedStageIds }: HudProps) {
  const restart = useGameStore((s) => s.restart)

  return (
    <div className="absolute top-0 left-0 right-0 p-4 flex flex-col sm:flex-row sm:items-center gap-3 pointer-events-none">
      <button
        onClick={restart}
        title="Back to home"
        aria-label="Back to home"
        className="shrink-0 bg-slate-900/85 text-white rounded-xl px-3 py-2.5 shadow-lg pointer-events-auto hover:bg-slate-800 transition flex items-center gap-1.5"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 9.5V21h14V9.5" />
        </svg>
        <span className="hidden sm:inline text-sm font-semibold">Home</span>
      </button>

      <div className="bg-slate-900/85 text-white rounded-xl px-4 py-2.5 shadow-lg pointer-events-auto">
        <p className="text-xs uppercase tracking-wider text-white/60">Now building</p>
        <p className="font-bold text-lg leading-tight" style={{ color: stage.accentColor }}>
          {stage.title}
        </p>
      </div>

      <div className="flex-1 flex items-center gap-2 bg-slate-900/85 text-white rounded-xl px-4 py-2.5 shadow-lg pointer-events-auto">
        {stages.map((s) => (
          <div
            key={s.id}
            className="flex-1 h-2 rounded-full overflow-hidden bg-white/15"
            title={s.title}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width:
                  s.id === stage.id
                    ? `${(done / total) * 100}%`
                    : completedStageIds.includes(s.id)
                      ? '100%'
                      : '0%',
                background: s.accentColor,
              }}
            />
          </div>
        ))}
        <span className="text-sm font-semibold whitespace-nowrap ml-1">
          {done}/{total}
        </span>
      </div>
    </div>
  )
}
