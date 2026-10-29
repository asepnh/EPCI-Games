import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { OverviewZone } from '../data/overview'
import { overviewZones } from '../data/overview'
import { Building } from './Building'
import { Label3D } from './Label3D'
import { makeGrassTexture, makeGravelTexture, makeWaterTexture } from './textures'

function zone(id: string): OverviewZone {
  const z = overviewZones.find((z) => z.id === id)
  if (!z) throw new Error(`Unknown overview zone: ${id}`)
  return z
}

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

function Ground() {
  const grass = useMemo(() => makeGrassTexture(9), [])
  const gravel = useMemo(() => makeGravelTexture(5), [])
  const water = useMemo(() => makeWaterTexture(10), [])

  useFrame((_, delta) => {
    water.offset.x += delta * 0.015
    water.offset.y += delta * 0.006
  })

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-7, -0.02, 0]} receiveShadow>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial map={grass} roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3, -0.02, 0]} receiveShadow>
        <planeGeometry args={[6, 10]} />
        <meshStandardMaterial map={gravel} roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[15, -0.02, 0]} receiveShadow>
        <planeGeometry args={[18, 14]} />
        <meshStandardMaterial map={water} roughness={0.3} metalness={0.15} />
      </mesh>
    </group>
  )
}

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 0.5, 6]} />
        <meshStandardMaterial color="#6b4423" />
      </mesh>
      <mesh position={[0, 0.7, 0]} castShadow>
        <coneGeometry args={[0.38, 0.75, 8]} />
        <meshStandardMaterial color="#4a9850" />
      </mesh>
      <mesh position={[0, 1.05, 0]} castShadow>
        <coneGeometry args={[0.28, 0.55, 8]} />
        <meshStandardMaterial color="#5cb264" />
      </mesh>
    </group>
  )
}

function YardFence() {
  const posts = Array.from({ length: 9 }, (_, i) => -0.5 + i * 0.9)
  return (
    <group position={[0, 0, -3.4]}>
      {posts.map((x) => (
        <mesh key={x} position={[x, 0.3, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.6, 6]} />
          <meshStandardMaterial color="#78716c" />
        </mesh>
      ))}
      <mesh position={[posts[Math.floor(posts.length / 2)] - 0.45, 0.45, 0]}>
        <boxGeometry args={[8.1, 0.04, 0.04]} />
        <meshStandardMaterial color="#78716c" />
      </mesh>
    </group>
  )
}

function CloudPuff({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const puffs: [number, number, number, number][] = [
    [0, 0, 0, 1],
    [0.7, 0.1, 0.1, 0.75],
    [-0.65, 0.05, -0.1, 0.7],
    [0.2, 0.35, 0.15, 0.65],
    [-0.25, 0.3, -0.05, 0.6],
  ]
  return (
    <group position={position} scale={scale}>
      {puffs.map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[r, 10, 10]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#dbeafe"
            emissiveIntensity={0.15}
            transparent
            opacity={0.85}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

function SkyClouds() {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.position.x = Math.sin(clock.elapsedTime * 0.02) * 1.5
  })
  return (
    <group ref={ref}>
      <CloudPuff position={[-8, 13, -6]} scale={1.3} />
      <CloudPuff position={[6, 15, -8]} scale={1.6} />
      <CloudPuff position={[18, 14, -5]} scale={1.2} />
    </group>
  )
}

function ShuttleTruck() {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = (Math.sin(clock.elapsedTime * 0.35) + 1) / 2
    ref.current.position.x = -3 + t * 5
    // face the direction of travel (the derivative of position, not position itself)
    const movingPositiveX = Math.cos(clock.elapsedTime * 0.35) >= 0
    ref.current.rotation.y = movingPositiveX ? 0 : Math.PI
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

      <SkyClouds />

      {/* ground strips: onshore land -> yard -> water (edges touch exactly, no overlap, to avoid z-fighting) */}
      <Ground />

      <Tree position={[-13, 0, -3.2]} />
      <Tree position={[-12.3, 0, -3.6]} />
      <Tree position={[-9.5, 0, 3.6]} />
      <Tree position={[-1.5, 0, -3.8]} />
      <Tree position={[-0.8, 0, 4.2]} />
      <YardFence />

      <ContactShadows
        position={[2, 0.001, 0]}
        opacity={0.35}
        scale={40}
        blur={1.8}
        far={3}
        resolution={512}
        frames={1}
      />

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
        enableRotate={false}
        minDistance={6}
        maxDistance={58}
        mouseButtons={{ LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN }}
        touches={{ ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_PAN }}
        target={[2, 0, 0]}
      />
    </Canvas>
  )
}
