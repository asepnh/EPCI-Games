import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useMemo } from 'react'
import type { StageDef } from '../data/types'
import { Building } from './Building'
import { Label3D } from './Label3D'
import { getPaletteItem } from '../data/stages'

interface IsometricSceneProps {
  stage: StageDef
  placements: Record<string, string>
  selectedSlotId: string | null
  onSelectSlot: (slotId: string) => void
}

const TILE = 1.4

function toWorld(pos: [number, number], gridSize: number): [number, number] {
  const offset = (gridSize - 1) / 2
  return [(pos[0] - offset) * TILE, (pos[1] - offset) * TILE]
}

function Ground({ stage }: { stage: StageDef }) {
  const size = stage.gridSize * TILE + 1.2
  const isWater = stage.key === 'installation'
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial color={isWater ? '#5ba8d1' : stage.groundColor} />
    </mesh>
  )
}

function GridLines({ gridSize }: { gridSize: number }) {
  const size = gridSize * TILE
  return (
    <gridHelper
      args={[size, gridSize, '#94a3b8', '#cbd5e1']}
      position={[0, 0.001, 0]}
    />
  )
}

function SlotPad({
  slot,
  stage,
  filled,
  selected,
  onSelect,
}: {
  slot: StageDef['slots'][number]
  stage: StageDef
  filled: string | undefined
  selected: boolean
  onSelect: () => void
}) {
  const [x, z] = toWorld(slot.pos, stage.gridSize)
  const item = filled ? getPaletteItem(stage, filled) : undefined

  return (
    <group position={[x, 0, z]}>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, 0]}
        onClick={(e) => {
          e.stopPropagation()
          onSelect()
        }}
      >
        <circleGeometry args={[0.62, 24]} />
        <meshStandardMaterial
          color={filled ? stage.accentColor : selected ? '#fde047' : '#ffffff'}
          opacity={filled ? 0.25 : selected ? 0.85 : 0.55}
          transparent
        />
      </mesh>
      {item && <Building shape={item.shape} color={item.color} />}
      <Label3D text={slot.label} position={[0, 0.55, 0]} visible={!item} />
      {!item && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.6, 0.68, 32]} />
          <meshBasicMaterial color={selected ? '#facc15' : '#64748b'} transparent opacity={0.9} />
        </mesh>
      )}
    </group>
  )
}

export function IsometricScene({ stage, placements, selectedSlotId, onSelectSlot }: IsometricSceneProps) {
  const camDistance = useMemo(() => 7 + stage.gridSize * 0.4, [stage.gridSize])

  return (
    <Canvas shadows dpr={[1, 1.5]} camera={{ fov: 32, position: [camDistance, camDistance * 0.9, camDistance] }}>
      <color attach="background" args={[stage.key === 'installation' ? '#bfe3f8' : '#eef2ff']} />
      <hemisphereLight intensity={0.6} groundColor="#94a3b8" />
      <directionalLight
        position={[6, 10, 4]}
        intensity={1.1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <Ground stage={stage} />
      <GridLines gridSize={stage.gridSize} />
      {stage.slots.map((slot) => (
        <SlotPad
          key={slot.id}
          slot={slot}
          stage={stage}
          filled={placements[slot.id]}
          selected={selectedSlotId === slot.id}
          onSelect={() => onSelectSlot(slot.id)}
        />
      ))}
      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={camDistance * 0.6}
        maxDistance={camDistance * 1.3}
        minPolarAngle={0.75}
        maxPolarAngle={0.95}
        minAzimuthAngle={-Math.PI / 3}
        maxAzimuthAngle={Math.PI / 3}
      />
    </Canvas>
  )
}
