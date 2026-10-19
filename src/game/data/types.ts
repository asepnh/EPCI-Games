export type ShapeKind =
  | 'desk'
  | 'monitor'
  | 'blueprint'
  | 'server'
  | 'crate'
  | 'tank'
  | 'pipeRack'
  | 'truck'
  | 'ship'
  | 'crane'
  | 'container'
  | 'module'
  | 'scaffold'
  | 'weldRig'
  | 'jacket'
  | 'barge'
  | 'heliDeck'
  | 'flare'
  | 'platformDeck'
  | 'pipeline'
  | 'office'
  | 'warehouse'
  | 'vessel'

export interface ItemDef {
  id: string
  name: string
  shape: ShapeKind
  color: string
  accent?: string
  /** educational fact shown when the kid places this item correctly */
  fact: string
  scale?: number
}

export interface PlacementSlot {
  id: string
  /** grid coordinates on the stage's isometric board */
  pos: [number, number]
  label: string
  requiredItemId: string
}

export interface StageDef {
  id: string
  key: 'engineering' | 'procurement' | 'construction' | 'installation'
  order: number
  title: string
  subtitle: string
  /** shown on the intro card before the stage starts */
  narrative: string
  /** shown after all slots are filled */
  wrapUp: string
  groundColor: string
  gridSize: number
  slots: PlacementSlot[]
  /** full palette offered to the player, includes correct items + a couple of decoys */
  palette: ItemDef[]
  accentColor: string
}
