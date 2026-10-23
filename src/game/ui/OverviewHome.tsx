import { useMemo, useState } from 'react'
import { overviewZones } from '../data/overview'
import { OverviewScene } from '../components/OverviewScene'
import { useGameStore } from '../store'

export function OverviewHome() {
  const startGame = useGameStore((s) => s.startGame)
  const goToStage = useGameStore((s) => s.goToStage)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const activeId = hoveredId
  const activeZone = useMemo(
    () => overviewZones.find((z) => z.id === activeId) ?? null,
    [activeId],
  )

  const enterZone = (id: string) => {
    const zone = overviewZones.find((z) => z.id === id)
    if (zone) goToStage(zone.stageKey)
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950">
      <OverviewScene
        activeZoneId={activeId}
        onHover={setHoveredId}
        onSelect={enterZone}
      />

      <div className="absolute top-0 left-0 right-0 p-4 flex justify-center pointer-events-none">
        <div className="bg-slate-900/85 text-white rounded-xl px-5 py-3 shadow-lg text-center">
          <p className="text-xs uppercase tracking-widest text-sky-300 font-semibold">
            McDermott Kuala Lumpur - Bring Your Kids to Work Day
          </p>
          <p className="font-bold text-lg sm:text-xl leading-tight">
            A Whole Oil &amp; Gas Project, Bird's-Eye View
          </p>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col items-center gap-3">
        <div className="max-w-xl w-full bg-slate-900/90 text-white rounded-2xl px-5 py-4 shadow-2xl border border-white/10 min-h-[84px] transition-all">
          {activeZone ? (
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-lg" style={{ color: activeZone.accentColor }}>
                  {activeZone.title}
                </p>
                <p className="text-white/85 text-sm leading-relaxed mt-1">
                  {activeZone.description}
                </p>
              </div>
              <button
                onClick={() => enterZone(activeZone.id)}
                className="shrink-0 px-4 py-2 rounded-full font-bold text-sm text-slate-900 transition hover:brightness-110"
                style={{ background: activeZone.accentColor }}
              >
                Play this part →
              </button>
            </div>
          ) : (
            <p className="text-white/60 text-sm text-center">
              Hover (or tap) a part of the site to see what happens there, or click it to jump
              straight into that part's minigame.
            </p>
          )}
        </div>

        <button
          onClick={startGame}
          className="px-8 py-3 rounded-full bg-sky-400 hover:bg-sky-300 text-slate-900 font-bold text-lg shadow-lg shadow-sky-500/30 transition"
        >
          Play the Full Game From the Start
        </button>
      </div>
    </div>
  )
}
