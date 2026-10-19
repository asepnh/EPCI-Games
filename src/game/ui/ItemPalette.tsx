import type { ShapeKind, StageDef } from '../data/types'
import { useGameStore } from '../store'

const SHAPE_ICON: Record<ShapeKind, string> = {
  desk: '🗂️',
  monitor: '🖥️',
  blueprint: '📐',
  server: '🖲️',
  crate: '📦',
  tank: '🛢️',
  pipeRack: '🔧',
  truck: '🚚',
  ship: '🚢',
  crane: '🏗️',
  container: '📦',
  module: '🧱',
  scaffold: '🪜',
  weldRig: '🔥',
  jacket: '🦾',
  barge: '⛴️',
  heliDeck: '🚁',
  flare: '🔥',
  platformDeck: '🏭',
  pipeline: '➰',
  office: '🏢',
  warehouse: '🏬',
  vessel: '🚤',
}

export function ItemPalette({ stage, slotId }: { stage: StageDef; slotId: string }) {
  const placeItem = useGameStore((s) => s.placeItem)
  const selectSlot = useGameStore((s) => s.selectSlot)
  const slot = stage.slots.find((s) => s.id === slotId)!

  return (
    <div className="absolute inset-x-0 bottom-0 p-4 flex justify-center z-10">
      <div className="max-w-3xl w-full bg-slate-900/95 text-white rounded-2xl p-4 shadow-2xl border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold">
            What goes in <span style={{ color: stage.accentColor }}>{slot.label}</span>?
          </p>
          <button onClick={() => selectSlot(null)} className="text-white/60 hover:text-white text-sm">
            Cancel
          </button>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {stage.palette.map((item) => (
            <button
              key={item.id}
              onClick={() => placeItem(item.id)}
              className="flex flex-col items-center gap-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 p-2.5 transition"
            >
              <div
                className="w-14 h-14 rounded-lg flex items-center justify-center text-2xl shadow-inner"
                style={{ background: `${item.color}33`, border: `2px solid ${item.color}` }}
              >
                {SHAPE_ICON[item.shape] ?? '❓'}
              </div>
              <span className="text-[11px] text-center leading-tight">{item.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
