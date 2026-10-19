import { useMemo, useState } from 'react'
import {
  BARGE_COLS,
  BARGE_ROWS,
  cellsAt,
  fitsOnBarge,
  puzzlePieces,
  resolvedCells,
  type PuzzlePiece,
} from '../data/packing'
import { PieceIcon } from '../components/PieceIcon'
import { useGameStore } from '../store'

const CELL_PX = 48

function boundingBox(cells: [number, number][]) {
  const rows = cells.map(([r]) => r)
  const cols = cells.map(([, c]) => c)
  const minRow = Math.min(...rows)
  const minCol = Math.min(...cols)
  return { minRow, minCol, w: Math.max(...cols) - minCol + 1, h: Math.max(...rows) - minRow + 1 }
}

function ShapePreview({ piece, cells }: { piece: PuzzlePiece; cells: [number, number][] }) {
  const { w, h } = boundingBox(cells)
  const px = 12
  return (
    <div
      className="rounded-[3px] flex items-center justify-center"
      style={{ width: w * px, height: h * px, background: piece.color }}
    >
      <PieceIcon pieceId={piece.id} w={w} h={h} />
    </div>
  )
}

function PieceCard({ piece }: { piece: PuzzlePiece }) {
  const selectedPieceId = useGameStore((s) => s.selectedPieceId)
  const selectedRotation = useGameStore((s) => s.selectedRotation)
  const selectPiece = useGameStore((s) => s.selectPiece)
  const rotateSelectedPiece = useGameStore((s) => s.rotateSelectedPiece)

  const isSelected = selectedPieceId === piece.id
  const cells = cellsAt(piece, isSelected ? selectedRotation : 0)

  return (
    <div
      className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 transition ${
        isSelected ? 'bg-white/20 border-white/50' : 'bg-white/5 border-white/10 hover:bg-white/10'
      }`}
    >
      <button onClick={() => selectPiece(isSelected ? null : piece.id)} className="flex flex-col items-center gap-1.5">
        <div className="w-16 h-14 flex items-center justify-center">
          <ShapePreview piece={piece} cells={cells} />
        </div>
        <span className="text-[11px] text-center leading-tight text-white">{piece.name}</span>
      </button>
      {isSelected && (
        <button
          onClick={rotateSelectedPiece}
          className="text-[10px] px-2 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white"
        >
          ↻ Rotate
        </button>
      )}
    </div>
  )
}

export function PackingGame() {
  const packingPlacements = useGameStore((s) => s.packingPlacements)
  const selectedPieceId = useGameStore((s) => s.selectedPieceId)
  const selectedRotation = useGameStore((s) => s.selectedRotation)
  const placeSelectedPieceAt = useGameStore((s) => s.placeSelectedPieceAt)
  const selectPiece = useGameStore((s) => s.selectPiece)
  const unplacePiece = useGameStore((s) => s.unplacePiece)
  const [hoverCell, setHoverCell] = useState<[number, number] | null>(null)
  const [invalidFlash, setInvalidFlash] = useState(false)

  const selectedPiece = puzzlePieces.find((p) => p.id === selectedPieceId) ?? null
  const remainingPieces = puzzlePieces.filter((p) => !packingPlacements[p.id])

  const occupied = useMemo(() => {
    const cells = new Map<string, string>()
    for (const [id, placement] of Object.entries(packingPlacements)) {
      const piece = puzzlePieces.find((p) => p.id === id)
      if (!piece) continue
      for (const [r, c] of resolvedCells(piece, placement.rotation, placement.anchorRow, placement.anchorCol)) {
        cells.set(`${r},${c}`, piece.id)
      }
    }
    return cells
  }, [packingPlacements])

  const previewCells = useMemo(() => {
    if (!selectedPiece || !hoverCell) return null
    const cells = resolvedCells(selectedPiece, selectedRotation, hoverCell[0], hoverCell[1])
    const occSet = new Set(occupied.keys())
    return { cells, valid: fitsOnBarge(cells, occSet) }
  }, [selectedPiece, selectedRotation, hoverCell, occupied])

  const previewSet = previewCells ? new Set(previewCells.cells.map(([r, c]) => `${r},${c}`)) : null

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-sky-200 to-sky-300 p-4">
      <div className="max-w-3xl w-full space-y-5">
        <div className="text-center">
          <p className="text-sm text-slate-700 font-medium">
            Load every piece onto the barge deck - nothing can overlap or hang off the edge. Tap a loaded
            piece to pick it back up.
          </p>
        </div>

        <div className="flex justify-center">
          <div
            className="relative inline-grid gap-1 p-3 rounded-2xl bg-sky-800 shadow-2xl"
            style={{
              gridTemplateColumns: `repeat(${BARGE_COLS}, ${CELL_PX}px)`,
              gridTemplateRows: `repeat(${BARGE_ROWS}, ${CELL_PX}px)`,
            }}
            onMouseLeave={() => setHoverCell(null)}
          >
            {Array.from({ length: BARGE_ROWS }).flatMap((_, r) =>
              Array.from({ length: BARGE_COLS }).map((_, c) => {
                const key = `${r},${c}`
                const occupied_ = occupied.has(key)
                const inPreview = previewSet?.has(key)

                let bg = '#7dc4e8'
                const border = '1px solid rgba(255,255,255,0.25)'
                if (!occupied_ && inPreview) {
                  bg = previewCells?.valid ? 'rgba(74,222,128,0.65)' : 'rgba(248,113,113,0.65)'
                }

                return (
                  <div
                    key={key}
                    onMouseEnter={() => selectedPiece && setHoverCell([r, c])}
                    onClick={() => {
                      if (!selectedPiece || occupied_) return
                      const ok = placeSelectedPieceAt(r, c)
                      if (!ok) {
                        setInvalidFlash(true)
                        window.setTimeout(() => setInvalidFlash(false), 400)
                      } else {
                        setHoverCell(null)
                      }
                    }}
                    className="rounded-sm transition-colors"
                    style={{
                      background: bg,
                      border,
                      cursor: selectedPiece && !occupied_ ? 'pointer' : 'default',
                      gridRow: r + 1,
                      gridColumn: c + 1,
                    }}
                  />
                )
              }),
            )}

            {Object.entries(packingPlacements).map(([id, placement]) => {
              const piece = puzzlePieces.find((p) => p.id === id)
              if (!piece) return null
              const cells = resolvedCells(piece, placement.rotation, placement.anchorRow, placement.anchorCol)
              const { minRow, minCol, w, h } = boundingBox(cells)
              return (
                <button
                  key={id}
                  onClick={() => unplacePiece(id)}
                  title={`Pick ${piece.name} back up`}
                  className="rounded-sm flex items-center justify-center cursor-pointer hover:brightness-110 transition"
                  style={{
                    gridRow: `${minRow + 1} / span ${h}`,
                    gridColumn: `${minCol + 1} / span ${w}`,
                    background: piece.color,
                    border: '1px solid rgba(0,0,0,0.25)',
                  }}
                >
                  <PieceIcon pieceId={piece.id} w={w} h={h} />
                </button>
              )
            })}
          </div>
        </div>

        {invalidFlash && (
          <p className="text-center text-rose-700 text-sm font-semibold">That doesn't fit there - try another spot!</p>
        )}

        <div className="flex justify-center">
          <div className="bg-slate-900/90 rounded-2xl p-4 shadow-xl border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase tracking-wide text-white/60 font-semibold">Pieces to load</p>
              {selectedPieceId && (
                <button onClick={() => selectPiece(null)} className="text-white/50 hover:text-white text-xs">
                  Cancel
                </button>
              )}
            </div>
            <div className="flex gap-2">
              {remainingPieces.length > 0 ? (
                remainingPieces.map((p) => <PieceCard key={p.id} piece={p} />)
              ) : (
                <p className="text-white/60 text-sm px-2">All pieces loaded!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
