export type Cell = [number, number]

export interface PuzzlePiece {
  id: 'jacket' | 'pile' | 'boatlanding' | 'walkway'
  name: string
  color: string
  fact: string
  /** [row, col] offsets from the piece's anchor cell, at 0deg rotation */
  cells: Cell[]
}

export const BARGE_ROWS = 3
export const BARGE_COLS = 8

export const puzzlePieces: PuzzlePiece[] = [
  {
    id: 'jacket',
    name: 'Jacket',
    color: '#64748b',
    cells: [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
      [1, 0],
      [1, 1],
      [1, 2],
      [1, 3],
    ],
    fact: 'The jacket is the heaviest single piece on the barge. Loading crews plan around its footprint first, then fit everything else around it.',
  },
  {
    id: 'pile',
    name: 'Pile',
    color: '#b45309',
    cells: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
    ],
    fact: 'Piles are long steel tubes driven deep into the seabed through the jacket legs to anchor the whole platform in place.',
  },
  {
    id: 'boatlanding',
    name: 'Boat Landing',
    color: '#0ea5e9',
    cells: [[0, 0]],
    fact: 'A boat landing is a small platform that lets crew boats safely tie up and transfer people onto the structure.',
  },
  {
    id: 'walkway',
    name: 'Walkway',
    color: '#16a34a',
    cells: [
      [0, 0],
      [0, 1],
    ],
    fact: 'Walkways let workers move safely between different parts of the platform once everything is installed.',
  },
]

/** rotates a shape 90 degrees clockwise and keeps it normalized to a 0,0-based origin */
export function rotateCells(cells: Cell[]): Cell[] {
  const maxRow = Math.max(...cells.map(([r]) => r))
  return cells.map(([r, c]): Cell => [c, maxRow - r])
}

export function cellsAt(piece: PuzzlePiece, rotation: number): Cell[] {
  let cells = piece.cells
  const turns = ((rotation % 4) + 4) % 4
  for (let i = 0; i < turns; i++) cells = rotateCells(cells)
  return cells
}

export function resolvedCells(piece: PuzzlePiece, rotation: number, anchorRow: number, anchorCol: number): Cell[] {
  return cellsAt(piece, rotation).map(([r, c]): Cell => [r + anchorRow, c + anchorCol])
}

export function fitsOnBarge(cells: Cell[], occupied: Set<string>): boolean {
  return cells.every(
    ([r, c]) => r >= 0 && r < BARGE_ROWS && c >= 0 && c < BARGE_COLS && !occupied.has(`${r},${c}`),
  )
}
