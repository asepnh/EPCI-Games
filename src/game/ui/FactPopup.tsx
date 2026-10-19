import { useGameStore } from '../store'

export function FactPopup() {
  const activeFact = useGameStore((s) => s.activeFact)
  const dismissFact = useGameStore((s) => s.dismissFact)
  if (!activeFact) return null

  return (
    <div className="absolute inset-0 flex items-end sm:items-center justify-center bg-black/40 p-4 z-20">
      <div className="max-w-md w-full bg-white rounded-2xl p-6 shadow-2xl space-y-3">
        <p
          className={`text-sm font-bold uppercase tracking-wide ${
            activeFact.correct ? 'text-emerald-600' : 'text-rose-500'
          }`}
        >
          {activeFact.correct ? 'Correct placement!' : 'Not quite right'}
        </p>
        <h3 className="text-xl font-bold text-slate-900">{activeFact.itemName}</h3>
        <p className="text-slate-600 leading-relaxed">{activeFact.fact}</p>
        <button
          onClick={dismissFact}
          className="w-full mt-2 py-2.5 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-700 transition"
        >
          {activeFact.correct ? 'Continue' : 'Try again'}
        </button>
      </div>
    </div>
  )
}
