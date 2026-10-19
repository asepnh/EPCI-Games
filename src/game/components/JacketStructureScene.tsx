import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Physics, RigidBody, useSpringJoint, type RapierRigidBody } from '@react-three/rapier'
import { createRef, useMemo, useRef } from 'react'
import type { RefObject } from 'react'
import * as THREE from 'three'
import { braceSlots, joints, legMembers, TOP_JOINT_IDS, type BraceSlot, type Joint } from '../data/structural'
import { makeBlueprintTexture } from './textures'
import { useGameStore } from '../store'

const PLANE_TRANSLATIONS: [boolean, boolean, boolean] = [true, true, false]
const PLANE_ROTATIONS: [boolean, boolean, boolean] = [false, false, true]

type RBRef = RefObject<RapierRigidBody | null>

function jointPos(j: Joint): [number, number, number] {
  return [j.x, j.y, 0]
}

function Backdrop() {
  const tex = useMemo(() => makeBlueprintTexture(1), [])
  return (
    <mesh position={[2, 1.3, -0.5]}>
      <planeGeometry args={[9, 7]} />
      <meshStandardMaterial map={tex} />
    </mesh>
  )
}

function Seabed() {
  return (
    <mesh position={[2, -0.12, 0]}>
      <boxGeometry args={[6, 0.16, 0.6]} />
      <meshStandardMaterial color="#334155" />
    </mesh>
  )
}

function JointDot({ joint, bodyRef }: { joint: Joint; bodyRef: RBRef }) {
  const color = joint.anchored ? '#334155' : '#1d4ed8'
  if (joint.anchored) {
    return (
      <RigidBody ref={bodyRef} type="fixed" position={jointPos(joint)} colliders={false}>
        <mesh>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </RigidBody>
    )
  }
  // the top two joints also carry the topside deck's weight
  const mass = TOP_JOINT_IDS.includes(joint.id) ? 0.6 : 0.08
  return (
    <RigidBody
      ref={bodyRef}
      type="dynamic"
      position={jointPos(joint)}
      colliders="ball"
      mass={mass}
      linearDamping={1.2}
      angularDamping={1.2}
      additionalSolverIterations={20}
      enabledTranslations={PLANE_TRANSLATIONS}
      enabledRotations={PLANE_ROTATIONS}
    >
      <mesh>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  )
}

/**
 * A truss member: visually a rigid rod, but physically just a stiff spring
 * joint directly between the two joint bodies it connects (no rod body of
 * its own). Modeling each member as its own rigid body pinned at both ends
 * is over-constrained (two point-constraints already fully pin a rigid
 * body) and is numerically unstable for a whole chained truss - a stiff
 * spring between the shared joint bodies is the stable equivalent.
 */
function TrussMember({
  a,
  b,
  aRef,
  bRef,
  color,
  radius,
}: {
  a: Joint
  b: Joint
  aRef: RBRef
  bRef: RBRef
  color: string
  radius: number
}) {
  const length = Math.hypot(b.x - a.x, b.y - a.y)
  const meshRef = useRef<THREE.Mesh>(null)

  useSpringJoint(aRef as RefObject<RapierRigidBody>, bRef as RefObject<RapierRigidBody>, [
    [0, 0, 0],
    [0, 0, 0],
    length,
    6000,
    120,
  ])

  useFrame(() => {
    const ba = aRef.current
    const bb = bRef.current
    const mesh = meshRef.current
    if (!ba || !bb || !mesh) return
    const pa = ba.translation()
    const pb = bb.translation()
    mesh.position.set((pa.x + pb.x) / 2, (pa.y + pb.y) / 2, 0)
    mesh.rotation.set(0, 0, Math.atan2(pb.y - pa.y, pb.x - pa.x))
  })

  return (
    <mesh ref={meshRef} position={[(a.x + b.x) / 2, (a.y + b.y) / 2, 0]} rotation={[0, 0, Math.atan2(b.y - a.y, b.x - a.x)]}>
      <boxGeometry args={[length, radius * 2, radius * 2]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

function GhostSlot({ slot, a, b, onClick, disabled }: { slot: BraceSlot; a: Joint; b: Joint; onClick: () => void; disabled: boolean }) {
  const length = Math.hypot(b.x - a.x, b.y - a.y)
  const midX = (a.x + b.x) / 2
  const midY = (a.y + b.y) / 2
  const angle = Math.atan2(b.y - a.y, b.x - a.x)

  return (
    <group position={[midX, midY, 0]} rotation={[0, 0, angle]}>
      {/* generous invisible hit target, easier to click than the thin visible line */}
      <mesh
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
      >
        <boxGeometry args={[length, 0.3, 0.3]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh>
        <boxGeometry args={[length, 0.045, 0.045]} />
        <meshBasicMaterial
          color={slot.kind === 'diagonal' ? '#fbbf24' : '#e2e8f0'}
          transparent
          opacity={disabled ? 0.25 : 0.65}
        />
      </mesh>
    </group>
  )
}

// shared refs, module scope so GhostSlot/TrussMember/JointDot/TestRunner can all reach the same bodies
const jointBodyRefs: Record<string, RBRef> = {}
for (const j of joints) jointBodyRefs[j.id] = createRef<RapierRigidBody>()

function findJoint(id: string) {
  return joints.find((j) => j.id === id)!
}

export function JacketStructureScene() {
  const structuralBraces = useGameStore((s) => s.structuralBraces)
  const structuralTestPhase = useGameStore((s) => s.structuralTestPhase)
  const toggleBrace = useGameStore((s) => s.toggleBrace)

  const placedSet = useMemo(() => new Set(structuralBraces), [structuralBraces])
  const budgetFull = structuralBraces.length >= 5
  const recordedStartRef = useRef<Map<string, THREE.Vector3>>(new Map())

  return (
    <Canvas shadows dpr={[1, 1.5]} camera={{ fov: 32, position: [2, 1.4, 9] }}>
      <color attach="background" args={['#cfe3f7']} />
      <hemisphereLight intensity={0.7} groundColor="#94a3b8" />
      <directionalLight position={[4, 6, 6]} intensity={1.1} castShadow />

      <Backdrop />
      <Seabed />

      <Physics paused={structuralTestPhase !== 'simulating'} gravity={[0, -9.81, 0]}>
        {joints.map((j) => (
          <JointDot key={j.id} joint={j} bodyRef={jointBodyRefs[j.id]} />
        ))}

        {legMembers.map((m) => (
          <TrussMember
            key={m.id}
            a={findJoint(m.a)}
            b={findJoint(m.b)}
            aRef={jointBodyRefs[m.a]}
            bRef={jointBodyRefs[m.b]}
            color="#64748b"
            radius={0.055}
          />
        ))}

        {/* always-present topside dead-load connecting the two top joints */}
        <TrussMember
          a={findJoint('j3')}
          b={findJoint('j7')}
          aRef={jointBodyRefs['j3']}
          bRef={jointBodyRefs['j7']}
          color="#f59e0b"
          radius={0.09}
        />

        {braceSlots.map((slot) => {
          const placed = placedSet.has(slot.id)
          const a = findJoint(slot.a)
          const b = findJoint(slot.b)
          if (placed) {
            return (
              <TrussMember
                key={slot.id}
                a={a}
                b={b}
                aRef={jointBodyRefs[slot.a]}
                bRef={jointBodyRefs[slot.b]}
                color={slot.kind === 'diagonal' ? '#f59e0b' : '#94a3b8'}
                radius={0.05}
              />
            )
          }
          return (
            <GhostSlot
              key={slot.id}
              slot={slot}
              a={a}
              b={b}
              disabled={structuralTestPhase !== 'building' || budgetFull}
              onClick={() => toggleBrace(slot.id)}
            />
          )
        })}

        {structuralTestPhase === 'building' &&
          structuralBraces.map((id) => {
            const slot = braceSlots.find((s) => s.id === id)!
            const a = findJoint(slot.a)
            const b = findJoint(slot.b)
            return (
              <mesh
                key={`remove-${id}`}
                position={[(a.x + b.x) / 2, (a.y + b.y) / 2, 0.02]}
                rotation={[0, 0, Math.atan2(b.y - a.y, b.x - a.x)]}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleBrace(id)
                }}
              >
                <boxGeometry args={[Math.hypot(b.x - a.x, b.y - a.y), 0.3, 0.1]} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
              </mesh>
            )
          })}

        <TestRunnerConnected startPosRef={recordedStartRef} />
      </Physics>

      <OrbitControls enableRotate={false} enablePan={false} enableZoom minDistance={7} maxDistance={13} target={[2, 1.4, 0]} />
    </Canvas>
  )
}

function TestRunnerConnected({ startPosRef }: { startPosRef: RefObject<Map<string, THREE.Vector3>> }) {
  const timerRef = useRef(0)
  const stageRef = useRef<'idle' | 'settling' | 'pushed' | 'done'>('idle')

  useFrame((_, delta) => {
    const phase = useGameStore.getState().structuralTestPhase

    if (phase !== 'simulating') {
      stageRef.current = 'idle'
      timerRef.current = 0
      return
    }

    if (stageRef.current === 'idle') {
      stageRef.current = 'settling'
      timerRef.current = 0
    }

    timerRef.current += delta

    if (stageRef.current === 'settling' && timerRef.current >= 0.6) {
      // baseline is the settled (post-gravity-sag) pose, so the drift
      // check below measures deformation from the wave load only
      for (const id of TOP_JOINT_IDS) {
        const body = jointBodyRefs[id]?.current
        if (!body) continue
        const p = body.translation()
        startPosRef.current.set(id, new THREE.Vector3(p.x, p.y, p.z))
      }
      stageRef.current = 'pushed'
      timerRef.current = 0
    }

    if (stageRef.current === 'pushed') {
      // a sustained, gentle push (like current/wave drag) rather than a
      // sudden impulse - an instantaneous impulse causes shock-loading
      // overshoot before the (deliberately soft, spring-based) joints can
      // react, which reads as a false collapse regardless of bracing
      for (const id of TOP_JOINT_IDS) {
        const body = jointBodyRefs[id]?.current
        if (body) body.addForce({ x: 0.05, y: 0, z: 0 }, true)
      }
    }

    if (stageRef.current === 'pushed' && timerRef.current >= 2.6) {
      let maxDrift = 0
      for (const id of TOP_JOINT_IDS) {
        const body = jointBodyRefs[id]?.current
        const start = startPosRef.current.get(id)
        if (!body || !start) continue
        const p = body.translation()
        maxDrift = Math.max(maxDrift, Math.abs(p.x - start.x))
      }
      const passed = maxDrift < 2.5
      stageRef.current = 'done'
      setTimeout(() => useGameStore.getState().reportStructuralTestResult(passed), 0)
    }
  })

  return null
}
