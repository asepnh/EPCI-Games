/** 3D props for the Installation stage's offshore half (4b): the heavy-lift
 *  vessel, piles and flare. The jacket/topside themselves reuse the
 *  progressive models already built for Construction (AssemblyModels). */

export function InstallVessel() {
  return (
    <group>
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[3, 0.6, 1.6]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <boxGeometry args={[3.04, 0.05, 1.64]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* deckhouse */}
      <mesh position={[-1.1, 0.95, 0]} castShadow>
        <boxGeometry args={[0.7, 0.7, 1.3]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>
      {/* crane mast + boom */}
      <mesh position={[0.6, 1.7, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.14, 2.2, 10]} />
        <meshStandardMaterial color="#ea580c" />
      </mesh>
      <mesh position={[-0.1, 2.75, 0]} rotation={[0, 0, 0.45]} castShadow>
        <boxGeometry args={[2.8, 0.12, 0.12]} />
        <meshStandardMaterial color="#ea580c" />
      </mesh>
    </group>
  )
}

export function Piles({ legPositions }: { legPositions: [number, number][] }) {
  // driven down through the seabed, but with a visible stick-up alongside
  // each leg so the step actually reads as a change (group's local y=0 is
  // the mudline, matching the Sea seabed plane)
  return (
    <group>
      {legPositions.map(([x, z], i) => (
        <mesh key={i} position={[x * 1.15, 0.35, z * 1.15]} castShadow>
          <cylinderGeometry args={[0.055, 0.055, 1.3, 10]} />
          <meshStandardMaterial color="#78716c" />
        </mesh>
      ))}
    </group>
  )
}

export function FlareBoom() {
  return (
    <group position={[0.95, 2, 0.95]}>
      <mesh position={[0, 1, 0]} rotation={[0, 0, 0.3]} castShadow>
        <cylinderGeometry args={[0.035, 0.05, 1.8, 8]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      <mesh position={[0.27, 1.95, 0]}>
        <coneGeometry args={[0.08, 0.3, 8]} />
        <meshStandardMaterial color="#fb923c" emissive="#f97316" emissiveIntensity={1.4} />
      </mesh>
    </group>
  )
}

export function Sea() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[30, 20]} />
        <meshStandardMaterial color="#0ea5e9" transparent opacity={0.75} roughness={0.3} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]} receiveShadow>
        <planeGeometry args={[30, 20]} />
        <meshStandardMaterial color="#b45309" roughness={1} />
      </mesh>
    </>
  )
}
