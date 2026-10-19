import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'
import type { OverviewZone } from '../data/overview'
import { overviewZones } from '../data/overview'

function zone(id: string): OverviewZone {
  const z = overviewZones.find((z) => z.id === id)
  if (!z) throw new Error(`Unknown overview zone: ${id}`)
  return z
}
import { Building } from './Building'
import { Label3D } from './Label3D'

interface OverviewSceneProps {
  activeZoneId: string | null
  onHover: (zoneId: string | null) => void
  onSelect: (zoneId: string) => void
}

function ZoneHotspot({
  zoneId,
  center,
  size,
  label,
  accent,
  active,
  onHover,
  onSelect,
  children,
}: {
  zoneId: string
  center: [number, number]
  size: [number, number]
  label: string
  accent: string
  active: boolean
  onHover: (id: string | null) => void
  onSelect: (id: string) => void
  children: React.ReactNode
}) {
  return (
    <group position={[center[0], 0, center[1]]}>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.03, 0]}
        onPointerOver={(e) => {
          e.stopPropagation()
          onHover(zoneId)
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          onHover(null)
        }}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(zoneId)
        }}
      >
        <planeGeometry args={size} />
        <meshBasicMaterial color={accent} transparent opacity={active ? 0.22 : 0} />
      </mesh>
      {active && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.035, 0]}>
          <ringGeometry args={[Math.max(...size) / 2 - 0.08, Math.max(...size) / 2, 48]} />
          <meshBasicMaterial color={accent} transparent opacity={0.85} />
        </mesh>
      )}
      {children}
      <Label3D text={label} position={[0, size[1] / 2 + 0.6, 0]} visible />
    </group>
  )
}

function ShuttleTruck() {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = (Math.sin(clock.elapsedTime * 0.35) + 1) / 2
    ref.current.position.x = -3 + t * 5
    ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.35) >= 0 ? 0 : Math.PI
  })
  return (
    <group ref={ref} position={[-3, 0, 1.4]}>
      <Building shape="truck" color="#eab308" />
    </group>
  )
}

function DriftingBarge() {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = (Math.sin(clock.elapsedTime * 0.2) + 1) / 2
    ref.current.position.x = 7.5 + t * 6.5
  })
  return (
    <group ref={ref} position={[7.5, 0, -1.5]}>
      <Building shape="barge" color="#0284c7" />
      <Building shape="module" color="#f59e0b" scale={0.6} />
    </group>
  )
}

export function OverviewScene({ activeZoneId, onHover, onSelect }: OverviewSceneProps) {
  return (
    <Canvas shadows dpr={[1, 1.5]} camera={{ fov: 35, position: [2, 40, 32] }}>
      <color attach="background" args={['#bfe3f8']} />
      <hemisphereLight intensity={0.65} groundColor="#94a3b8" />
      <directionalLight position={[10, 18, 8]} intensity={1.1} castShadow />

      {/* ground strips: onshore land -> yard -> water (edges touch exactly, no overlap, to avoid z-fighting) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-7, -0.02, 0]} receiveShadow>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial color="#dfe9d6" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3, -0.02, 0]} receiveShadow>
        <planeGeometry args={[6, 10]} />
        <meshStandardMaterial color="#e9dfc4" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[15, -0.02, 0]} receiveShadow>
        <planeGeometry args={[18, 14]} />
        <meshStandardMaterial color="#5ba8d1" />
      </mesh>

      {/* Engineering Office */}
      <ZoneHotspot
        zoneId="engineering"
        center={zone('engineering').center}
        size={zone('engineering').size}
        label={zone('engineering').title}
        accent={zone('engineering').accentColor}
        active={activeZoneId === 'engineering'}
        onHover={onHover}
        onSelect={onSelect}
      >
        <Building shape="office" color="#60a5fa" />
        <group position={[-1.6, 0, 1.6]}>
          <Building shape="desk" color="#818cf8" />
        </group>
        <group position={[1.6, 0, 1.6]}>
          <Building shape="monitor" color="#2dd4bf" />
        </group>
      </ZoneHotspot>

      {/* Manufacturing & Supply */}
      <ZoneHotspot
        zoneId="manufacturing"
        center={zone('manufacturing').center}
        size={zone('manufacturing').size}
        label={zone('manufacturing').title}
        accent={zone('manufacturing').accentColor}
        active={activeZoneId === 'manufacturing'}
        onHover={onHover}
        onSelect={onSelect}
      >
        <Building shape="warehouse" color="#4ade80" />
        <group position={[-1.8, 0, -1.8]}>
          <Building shape="crate" color="#94a3b8" />
        </group>
        <group position={[-1, 0, -2]}>
          <Building shape="container" color="#22c55e" />
        </group>
      </ZoneHotspot>
      <ShuttleTruck />

      {/* Fabrication Yard */}
      <ZoneHotspot
        zoneId="fabrication"
        center={zone('fabrication').center}
        size={zone('fabrication').size}
        label={zone('fabrication').title}
        accent={zone('fabrication').accentColor}
        active={activeZoneId === 'fabrication'}
        onHover={onHover}
        onSelect={onSelect}
      >
        <group position={[-2, 0, -1.6]}>
          <Building shape="scaffold" color="#b45309" />
        </group>
        <group position={[-2, 0, 1.8]}>
          <Building shape="weldRig" color="#ef4444" />
        </group>
        <group position={[1.4, 0, -1.6]}>
          <Building shape="jacket" color="#64748b" />
        </group>
        <group position={[1.4, 0, 1.8]}>
          <Building shape="module" color="#f59e0b" />
        </group>
        <group position={[-0.2, 0, 0.1]}>
          <Building shape="crane" color="#ea580c" />
        </group>
      </ZoneHotspot>

      {/* Load-Out & Barge */}
      <ZoneHotspot
        zoneId="loadout"
        center={zone('loadout').center}
        size={zone('loadout').size}
        label={zone('loadout').title}
        accent={zone('loadout').accentColor}
        active={activeZoneId === 'loadout'}
        onHover={onHover}
        onSelect={onSelect}
      >
        <group position={[-1, 0, 0]}>
          <Building shape="crane" color="#0284c7" />
        </group>
      </ZoneHotspot>
      <DriftingBarge />

      {/* Offshore Installation */}
      <ZoneHotspot
        zoneId="offshore"
        center={zone('offshore').center}
        size={zone('offshore').size}
        label={zone('offshore').title}
        accent={zone('offshore').accentColor}
        active={activeZoneId === 'offshore'}
        onHover={onHover}
        onSelect={onSelect}
      >
        <group position={[-1.5, 0, 0]}>
          <Building shape="jacket" color="#64748b" />
        </group>
        <group position={[-1.5, 1.4, 0]}>
          <Building shape="platformDeck" color="#f59e0b" scale={0.9} />
        </group>
        <group position={[-1.5, 0, 0]}>
          <Building shape="flare" color="#f97316" scale={0.7} />
        </group>
        <group position={[2.5, 0, 0.5]}>
          <Building shape="vessel" color="#334155" />
        </group>
      </ZoneHotspot>

      <OrbitControls
        enablePan
        enableZoom
        minDistance={30}
        maxDistance={58}
        minPolarAngle={0.5}
        maxPolarAngle={0.85}
        minAzimuthAngle={-Math.PI / 5}
        maxAzimuthAngle={Math.PI / 5}
        target={[2, 0, 0]}
      />
    </Canvas>
  )
}
