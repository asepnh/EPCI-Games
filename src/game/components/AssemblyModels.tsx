/** progressive 3D models for the Construction stage: each grows as more steps complete */

function JacketFrame() {
  const legs: [number, number][] = [
    [-0.55, -0.55],
    [0.55, -0.55],
    [-0.55, 0.55],
    [0.55, 0.55],
  ]
  const braceWidth = 1.1
  const braceHeight = 1.6
  const braceLen = Math.hypot(braceWidth, braceHeight)
  const braceAngle = Math.atan2(braceHeight, braceWidth)
  return (
    <group>
      {legs.map(([x, z], i) => (
        <mesh key={i} position={[x * 1.3, 1, z * 1.3]} rotation={[0, 0, (x > 0 ? -1 : 1) * 0.06]} castShadow>
          <cylinderGeometry args={[0.08, 0.12, 2, 10]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
      ))}
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[1.5, 0.08, 1.5]} />
        <meshStandardMaterial color="#44403c" />
      </mesh>
      {[0.5, 1.2, 1.9].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <boxGeometry args={[1.5, 0.04, 1.5]} />
          <meshStandardMaterial color="#64748b" wireframe />
        </mesh>
      ))}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((rotY, i) => (
        <group key={i} rotation={[0, rotY, 0]} position={[0, 0, -0.55]}>
          <mesh rotation={[0, 0, braceAngle]} position={[0, 1, 0]}>
            <boxGeometry args={[braceLen, 0.04, 0.04]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
          <mesh rotation={[0, 0, -braceAngle]} position={[0, 1, 0]}>
            <boxGeometry args={[braceLen, 0.04, 0.04]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function BuoyancyTanks() {
  return (
    <group>
      {[-0.55, 0.55].map((x) => (
        <mesh key={x} position={[x * 1.3, 1.1, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 1.5, 14]} />
          <meshStandardMaterial color="#facc15" />
        </mesh>
      ))}
    </group>
  )
}

function JacketRisers() {
  return (
    <group>
      {[-0.75, -0.9].map((x, i) => (
        <mesh key={i} position={[x * 1.1, 1, 0.85]} castShadow>
          <cylinderGeometry args={[0.055, 0.055, 2, 10]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
      ))}
    </group>
  )
}

export function JacketAssembly({ step }: { step: number }) {
  return (
    <group>
      {step >= 1 && <JacketFrame />}
      {step >= 2 && <BuoyancyTanks />}
      {step >= 3 && <JacketRisers />}
    </group>
  )
}

function TopsideFrame() {
  return (
    <group>
      {[
        [-0.8, -0.6],
        [0.8, -0.6],
        [-0.8, 0.6],
        [0.8, 0.6],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.4, z]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 0.8, 8]} />
          <meshStandardMaterial color="#f59e0b" />
        </mesh>
      ))}
      <mesh position={[0, 0.82, 0]}>
        <boxGeometry args={[1.8, 0.1, 1.4]} />
        <meshStandardMaterial color="#f59e0b" />
      </mesh>
      <mesh position={[0, 0.82, 0]}>
        <boxGeometry args={[1.82, 0.12, 1.42]} />
        <meshBasicMaterial color="#1f2937" wireframe />
      </mesh>
    </group>
  )
}

function MechanicalEquipment() {
  return (
    <group position={[0, 0.87, 0]}>
      <mesh position={[-0.5, 0.25, -0.3]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.5, 14]} />
        <meshStandardMaterial color="#78716c" />
      </mesh>
      <mesh position={[0.4, 0.2, 0.3]} castShadow>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      <mesh position={[0.5, 0.18, -0.35]} castShadow>
        <cylinderGeometry args={[0.16, 0.16, 0.36, 10]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>
    </group>
  )
}

function TopsidePiping() {
  return (
    <group position={[0, 0.87, 0]}>
      <mesh position={[-0.1, 0.25, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.85, 8]} />
        <meshStandardMaterial color="#0ea5e9" />
      </mesh>
      <mesh position={[0, 0.18, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.6, 8]} />
        <meshStandardMaterial color="#0ea5e9" />
      </mesh>
    </group>
  )
}

function TopsideElectrical() {
  return (
    <group position={[0, 0.87, 0]}>
      <mesh position={[0.75, 0.25, 0.55]} castShadow>
        <boxGeometry args={[0.12, 0.5, 0.3]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0.75, 0.42, 0.56]}>
        <boxGeometry args={[0.03, 0.06, 0.06]} />
        <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={1} />
      </mesh>
      <mesh position={[0, 0.52, 0.6]}>
        <boxGeometry args={[1.6, 0.03, 0.04]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
    </group>
  )
}

export function TopsideAssembly({ step }: { step: number }) {
  return (
    <group>
      {step >= 1 && <TopsideFrame />}
      {step >= 2 && <MechanicalEquipment />}
      {step >= 3 && <TopsidePiping />}
      {step >= 4 && <TopsideElectrical />}
    </group>
  )
}
