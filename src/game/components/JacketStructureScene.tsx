import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Physics, RigidBody, useRapier, useSpringJoint, type RapierRigidBody } from '@react-three/rapier'
import { createRef, useEffect, useMemo, useRef } from 'react'
import type { RefObject } from 'react'
import * as THREE from 'three'
import { bays, braceSlots, joints, legMembers, TOP_JOINT_IDS, type BraceSlot, type Joint } from '../data/structural'
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
  stiffness = 6000,
  damping = 120,
}: {
  a: Joint
  b: Joint
  aRef: RBRef
  bRef: RBRef
  color: string
  radius: number
  stiffness?: number
  damping?: number
}) {
  const length = Math.hypot(b.x - a.x, b.y - a.y)
  const meshRef = useRef<THREE.Mesh>(null)

  useSpringJoint(aRef as RefObject<RapierRigidBody>, bRef as RefObject<RapierRigidBody>, [
    [0, 0, 0],
    [0, 0, 0],
    length,
    stiffness,
    damping,
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

/**
 * The physics bodies stay wherever they ended up after a test (toppled,
 * swayed, etc.) - pausing the world again doesn't move them back, since
 * the RigidBody `position` prop only sets the initial pose on mount. So
 * when a test ends and the player goes back to 'building' (via Reset &
 * Try Again, or re-entering the stage), snap every free joint back to its
 * design pose and kill any residual velocity.
 */
function ResetOnBuildingPhase() {
  const phase = useGameStore((s) => s.structuralTestPhase)
  const wasBuilding = useRef(true)
  const { step } = useRapier()

  useEffect(() => {
    if (phase === 'building' && !wasBuilding.current) {
      for (const j of joints) {
        if (j.anchored) continue
        const body = jointBodyRefs[j.id]?.current
        if (!body) continue
        body.setTranslation({ x: j.x, y: j.y, z: 0 }, true)
        body.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true)
        body.setLinvel({ x: 0, y: 0, z: 0 }, true)
        body.setAngvel({ x: 0, y: 0, z: 0 }, true)
      }
      // the physics bodies are now back at their design pose, but the
      // visual meshes only get copied over from inside react-three-rapier's
      // own step(), which is skipped while paused=true (which it is here,
      // since we're back in 'building'). Call step() directly with a zero
      // delta to force that one mesh sync without actually advancing
      // physics time.
      step(0)
    }
    wasBuilding.current = phase === 'building'
  }, [phase, step])

  return null
}

export function JacketStructureScene() {
  const structuralBraces = useGameStore((s) => s.structuralBraces)
  const structuralTestPhase = useGameStore((s) => s.structuralTestPhase)
  const toggleBrace = useGameStore((s) => s.toggleBrace)

  const placedSet = useMemo(() => new Set(structuralBraces), [structuralBraces])
  const budgetFull = structuralBraces.length >= 5

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
                stiffness={60000}
                damping={400}
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

        <ResetOnBuildingPhase />
        <TestRunnerConnected />
      </Physics>

      <OrbitControls enableRotate={false} enablePan={false} enableZoom minDistance={7} maxDistance={13} target={[2, 1.4, 0]} />
    </Canvas>
  )
}

/** current length of a bay's diagonal, or null if either joint body isn't ready yet */
function diagonalLength(aId: string, bId: string): number | null {
  const pa = jointBodyRefs[aId]?.current?.translation()
  const pb = jointBodyRefs[bId]?.current?.translation()
  if (!pa || !pb) return null
  return Math.hypot(pb.x - pa.x, pb.y - pa.y)
}

/**
 * How racked the worst bay is right now: the gap between a bay's two
 * diagonal lengths (0 for an undeformed rectangle; large once it shears
 * into a parallelogram). Self-referential (relative distances within the
 * structure), so it doesn't care whether the whole frame has also swung or
 * rotated as a rigid body - only genuine bay-level shear counts.
 */
function worstBayShear(): number {
  let worst = 0
  for (const bay of bays) {
    const diagA = diagonalLength(bay.leftBottom, bay.rightTop)
    const diagB = diagonalLength(bay.rightBottom, bay.leftTop)
    if (diagA === null || diagB === null) continue
    worst = Math.max(worst, Math.abs(diagA - diagB))
  }
  return worst
}

function TestRunnerConnected() {
  const timerRef = useRef(0)
  const stageRef = useRef<'idle' | 'settling' | 'pushed' | 'releasing' | 'done'>('idle')
  const maxShearRef = useRef(0)

  useFrame((_, delta) => {
    const phase = useGameStore.getState().structuralTestPhase

    if (phase !== 'simulating') {
      stageRef.current = 'idle'
      timerRef.current = 0
      maxShearRef.current = 0
      return
    }

    if (stageRef.current === 'idle') {
      stageRef.current = 'settling'
      timerRef.current = 0
      maxShearRef.current = 0
    }

    timerRef.current += delta

    if (stageRef.current === 'settling' && timerRef.current >= 0.6) {
      stageRef.current = 'pushed'
      timerRef.current = 0
    }

    if (stageRef.current === 'pushed') {
      // a brief push (like a wave hitting the structure) rather than an
      // indefinite drag - every spring member has some give, so an
      // open-ended sustained force keeps everything (braced or not)
      // slowly swaying in the direction of the load, which swamps the
      // actual signal: whether triangulated bays spring back once the
      // load is gone, vs. an unbraced bay settling into a new, permanently
      // racked shape
      for (const id of TOP_JOINT_IDS) {
        const body = jointBodyRefs[id]?.current
        if (body) body.addForce({ x: 0.3, y: 0, z: 0 }, true)
      }
      if (timerRef.current >= 0.35) {
        stageRef.current = 'releasing'
        timerRef.current = 0
      }
    }

    if (stageRef.current === 'releasing') {
      // once the load is gone, let it settle, and watch for any racking
      // that doesn't recover - a bay with no diagonal has nothing to pull
      // it back into shape and stays deformed; a triangulated one springs
      // back close to its original rectangle
      if (timerRef.current >= 1.0) {
        maxShearRef.current = Math.max(maxShearRef.current, worstBayShear())
      }
    }

    if (stageRef.current === 'releasing' && timerRef.current >= 2.2) {
      const passed = maxShearRef.current < 0.6
      stageRef.current = 'done'
      setTimeout(() => useGameStore.getState().reportStructuralTestResult(passed), 0)
    }
  })

  return null
}
