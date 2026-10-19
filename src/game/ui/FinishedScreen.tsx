import { stages } from '../data/stages'
import { useGameStore } from '../store'

export function FinishedScreen() {
  const restart = useGameStore((s) => s.restart)

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-sky-900 text-white p-6">
      <div className="max-w-xl text-center space-y-6">
        <p className="uppercase tracking-widest text-sky-300 text-sm font-semibold">
          Project Complete
        </p>
        <h1 className="text-4xl font-bold">You built a full EPCI project! 🏗️</h1>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stages.map((s) => (
            <div
              key={s.id}
              className="rounded-xl p-3 border border-white/10"
              style={{ background: `${s.accentColor}33` }}
            >
              <p className="font-bold" style={{ color: s.accentColor }}>
                {s.order + 1}
              </p>
              <p className="text-sm font-semibold">{s.title.replace(/^\d+\.\s*/, '')}</p>
            </div>
          ))}
        </div>
        <p className="text-slate-200 leading-relaxed">
          Engineering designed it, Procurement sourced and shipped it, Construction fabricated
          it, and Installation put it in place offshore and started it up. That is the real
          lifecycle behind every oil &amp; gas EPCI project in the world.
        </p>
        <button
          onClick={restart}
          className="px-8 py-3 rounded-full bg-sky-400 hover:bg-sky-300 text-slate-900 font-bold text-lg shadow-lg shadow-sky-500/30 transition"
        >
          Play Again
        </button>
      </div>
    </div>
  )
}
