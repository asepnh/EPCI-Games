import type { PuzzlePiece } from '../data/packing'

interface PieceIconProps {
  pieceId: PuzzlePiece['id']
  /** footprint size in grid cells, after rotation */
  w: number
  h: number
  stroke?: string
}

/** draws a simple line-art icon of the piece, scaled to its current (possibly rotated) footprint */
export function PieceIcon({ pieceId, w, h, stroke = 'rgba(255,255,255,0.9)' }: PieceIconProps) {
  const horizontal = w >= h

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-full">
      {pieceId === 'jacket' && <JacketMark w={w} h={h} horizontal={horizontal} stroke={stroke} />}
      {pieceId === 'pile' && <PileMark w={w} h={h} horizontal={horizontal} stroke={stroke} />}
      {pieceId === 'boatlanding' && <BoatLandingMark w={w} h={h} stroke={stroke} />}
      {pieceId === 'walkway' && <WalkwayMark w={w} h={h} horizontal={horizontal} stroke={stroke} />}
    </svg>
  )
}

function JacketMark({ w, h, horizontal, stroke }: { w: number; h: number; horizontal: boolean; stroke: string }) {
  const m = 0.12
  const lo = horizontal ? h * m : w * m
  const legA = horizontal ? lo : w * m
  const legB = horizontal ? h - lo : w - w * m
  const span = horizontal ? w : h
  const segments = Math.max(2, Math.round(span))
  const step = span / segments
  const zig: number[] = Array.from({ length: segments + 1 }, (_, i) => (i % 2 === 0 ? legA : legB))
  const points = zig
    .map((cross, i) => {
      const along = i * step
      return horizontal ? `${along},${cross}` : `${cross},${along}`
    })
    .join(' ')

  return (
    <g stroke={stroke} strokeWidth={0.07} fill="none" strokeLinecap="round">
      {/* top/bottom (or left/right) chords */}
      {horizontal ? (
        <>
          <line x1={0} y1={legA} x2={w} y2={legA} />
          <line x1={0} y1={legB} x2={w} y2={legB} />
        </>
      ) : (
        <>
          <line x1={legA} y1={0} x2={legA} y2={h} />
          <line x1={legB} y1={0} x2={legB} y2={h} />
        </>
      )}
      {/* zig-zag bracing between the chords */}
      <polyline points={points} />
    </g>
  )
}

function PileMark({ w, h, horizontal, stroke }: { w: number; h: number; horizontal: boolean; stroke: string }) {
  const thickness = (horizontal ? h : w) * 0.3
  const mid = horizontal ? h / 2 : w / 2
  const ringCount = Math.max(2, Math.round((horizontal ? w : h) / 1.1))
  const span = horizontal ? w : h

  return (
    <g stroke={stroke} strokeWidth={0.06} fill="none" strokeLinecap="round">
      {horizontal ? (
        <>
          <line x1={0.15} y1={mid - thickness} x2={w - 0.15} y2={mid - thickness} />
          <line x1={0.15} y1={mid + thickness} x2={w - 0.15} y2={mid + thickness} />
          <circle cx={0.15} cy={mid} r={thickness} />
        </>
      ) : (
        <>
          <line x1={mid - thickness} y1={0.15} x2={mid - thickness} y2={h - 0.15} />
          <line x1={mid + thickness} y1={0.15} x2={mid + thickness} y2={h - 0.15} />
          <circle cx={mid} cy={0.15} r={thickness} />
        </>
      )}
      {Array.from({ length: ringCount }).map((_, i) => {
        const t = 0.5 + (i * span) / ringCount
        return horizontal ? (
          <line key={i} x1={t} y1={mid - thickness} x2={t} y2={mid + thickness} />
        ) : (
          <line key={i} x1={mid - thickness} y1={t} x2={mid + thickness} y2={t} />
        )
      })}
    </g>
  )
}

function BoatLandingMark({ w, h, stroke }: { w: number; h: number; stroke: string }) {
  return (
    <g stroke={stroke} strokeWidth={0.07} fill="none" strokeLinecap="round">
      <line x1={w * 0.15} y1={h * 0.3} x2={w * 0.85} y2={h * 0.3} />
      <line x1={w * 0.3} y1={h * 0.3} x2={w * 0.3} y2={h * 0.85} />
      <line x1={w * 0.7} y1={h * 0.3} x2={w * 0.7} y2={h * 0.85} />
      <line x1={w * 0.3} y1={h * 0.58} x2={w * 0.7} y2={h * 0.58} />
    </g>
  )
}

function WalkwayMark({ w, h, horizontal, stroke }: { w: number; h: number; horizontal: boolean; stroke: string }) {
  const m = 0.22
  const span = horizontal ? w : h
  const rungs = Math.max(2, Math.round(span / 0.9))

  return (
    <g stroke={stroke} strokeWidth={0.06} fill="none" strokeLinecap="round">
      {horizontal ? (
        <>
          <line x1={0.1} y1={h * m} x2={w - 0.1} y2={h * m} />
          <line x1={0.1} y1={h * (1 - m)} x2={w - 0.1} y2={h * (1 - m)} />
          {Array.from({ length: rungs }).map((_, i) => {
            const x = 0.1 + ((w - 0.2) * i) / (rungs - 1)
            return <line key={i} x1={x} y1={h * m} x2={x} y2={h * (1 - m)} />
          })}
        </>
      ) : (
        <>
          <line x1={w * m} y1={0.1} x2={w * m} y2={h - 0.1} />
          <line x1={w * (1 - m)} y1={0.1} x2={w * (1 - m)} y2={h - 0.1} />
          {Array.from({ length: rungs }).map((_, i) => {
            const y = 0.1 + ((h - 0.2) * i) / (rungs - 1)
            return <line key={i} x1={w * m} y1={y} x2={w * (1 - m)} y2={y} />
          })}
        </>
      )}
    </g>
  )
}
