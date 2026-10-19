import { useGameStore } from '../store'

export function StartScreen() {
  const startGame = useGameStore((s) => s.startGame)

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-sky-900 to-emerald-900 text-white p-6">
      <div className="max-w-xl text-center space-y-6">
        <p className="uppercase tracking-widest text-sky-300 text-sm font-semibold">
          EPCI Builder
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
          Build an Oil &amp; Gas Project,
          <br />
          Step by Step
        </h1>
        <p className="text-slate-200 text-lg">
          Play through the four real-world stages of an EPCI project -
          <span className="font-semibold text-sky-300"> Engineering</span>,{' '}
          <span className="font-semibold text-emerald-300">Procurement</span>,{' '}
          <span className="font-semibold text-amber-300">Construction</span> and{' '}
          <span className="font-semibold text-cyan-300">Installation</span> - and learn how
          a real oil &amp; gas platform gets made, from blueprint to start-up.
        </p>
        <button
          onClick={startGame}
          className="px-8 py-3 rounded-full bg-sky-400 hover:bg-sky-300 text-slate-900 font-bold text-lg shadow-lg shadow-sky-500/30 transition"
        >
          Start Building
        </button>
        <p className="text-slate-400 text-sm">
          Click an empty pad in the 3D yard, then pick the correct item from the list.
        </p>
      </div>
    </div>
  )
}
