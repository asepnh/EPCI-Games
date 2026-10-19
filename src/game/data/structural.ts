export interface Joint {
  id: string
  /** design-space position, in local X/Y units (Z is always 0) */
  x: number
  y: number
  /** anchored joints are fixed to the seabed and never move */
  anchored: boolean
}

export interface Member {
  id: string
  a: string
  b: string
}

export const joints: Joint[] = [
  { id: 'j0', x: 0, y: 0, anchored: true },
  { id: 'j1', x: 0, y: 1, anchored: false },
  { id: 'j2', x: 0, y: 2, anchored: false },
  { id: 'j3', x: 0, y: 3, anchored: false },
  { id: 'j4', x: 4, y: 0, anchored: true },
  { id: 'j5', x: 4, y: 1, anchored: false },
  { id: 'j6', x: 4, y: 2, anchored: false },
  { id: 'j7', x: 4, y: 3, anchored: false },
]

/** the two legs: always present, free, not part of the stick budget */
export const legMembers: Member[] = [
  { id: 'leg-l1', a: 'j0', b: 'j1' },
  { id: 'leg-l2', a: 'j1', b: 'j2' },
  { id: 'leg-l3', a: 'j2', b: 'j3' },
  { id: 'leg-r1', a: 'j4', b: 'j5' },
  { id: 'leg-r2', a: 'j5', b: 'j6' },
  { id: 'leg-r3', a: 'j6', b: 'j7' },
]

export type BraceKind = 'horizontal' | 'diagonal'

export interface BraceSlot extends Member {
  kind: BraceKind
}

/** candidate bracing positions the player chooses from (budget-limited).
 *  note: the top span (j3-j7) is already a mandatory member carrying the
 *  topside dead-load, so there's no separate "h3" candidate there. */
export const braceSlots: BraceSlot[] = [
  { id: 'h1', a: 'j1', b: 'j5', kind: 'horizontal' },
  { id: 'h2', a: 'j2', b: 'j6', kind: 'horizontal' },
  { id: 'd1a', a: 'j0', b: 'j5', kind: 'diagonal' },
  { id: 'd1b', a: 'j4', b: 'j1', kind: 'diagonal' },
  { id: 'd2a', a: 'j1', b: 'j6', kind: 'diagonal' },
  { id: 'd2b', a: 'j5', b: 'j2', kind: 'diagonal' },
  { id: 'd3a', a: 'j2', b: 'j7', kind: 'diagonal' },
  { id: 'd3b', a: 'j6', b: 'j3', kind: 'diagonal' },
]

export const STICK_BUDGET = 5

export const TOP_JOINT_IDS = ['j3', 'j7']

export const structuralFacts = {
  intro:
    "Before any real steel is cut, engineers test a scale model to make sure the jacket won't rack or topple under wave and current loads. The legs are already up - you have 5 steel braces to add. You can't brace every bay, so choose where it matters most!",
  pass: "Solid! Diagonal braces turn floppy rectangles into rigid triangles, so the frame resists sideways wave and current loads - even in the bays you left open, as long as the load has nowhere to go but through a triangle.",
  fail: "That design racked under the wave load - watch which bay folded into a parallelogram. A bay with no diagonal can't resist sideways force, even though it looked solid just standing still. Add a brace there and test again.",
}
