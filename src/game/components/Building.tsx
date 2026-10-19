import { useMemo } from 'react'
import type { ShapeKind } from '../data/types'

interface BuildingProps {
  shape: ShapeKind
  color: string
  scale?: number
}

const EDGE = '#1f2937'

function Wheels() {
  return (
    <>
      {[-0.35, 0.35].map((x) =>
        [-0.55, 0.55].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.12, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.12, 0.12, 0.12, 12]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        )),
      )}
    </>
  )
}

export function Building({ shape, color, scale = 1 }: BuildingProps) {
  const content = useMemo(() => {
    switch (shape) {
      case 'desk':
        return (
          <group>
            <mesh position={[0, 0.3, 0]} castShadow>
              <boxGeometry args={[0.9, 0.08, 0.5]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 0.45, -0.12]}>
              <boxGeometry args={[0.4, 0.3, 0.04]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
            {[-0.35, 0.35].map((x) => (
              <mesh key={x} position={[x, 0.15, 0.18]}>
                <boxGeometry args={[0.06, 0.3, 0.06]} />
                <meshStandardMaterial color="#475569" />
              </mesh>
            ))}
          </group>
        )
      case 'monitor':
        return (
          <group>
            <mesh position={[0, 0.25, 0]}>
              <boxGeometry args={[0.5, 0.5, 0.5]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 0.6, 0]}>
              <boxGeometry args={[0.45, 0.3, 0.04]} />
              <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={0.6} />
            </mesh>
          </group>
        )
      case 'blueprint':
        return (
          <group>
            <mesh position={[0, 0.28, 0]}>
              <boxGeometry args={[0.9, 0.06, 0.6]} />
              <meshStandardMaterial color="#e2e8f0" />
            </mesh>
            <mesh position={[0, 0.32, 0]}>
              <boxGeometry args={[0.7, 0.02, 0.45]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </group>
        )
      case 'server':
        return (
          <group>
            <mesh position={[0, 0.5, 0]} castShadow>
              <boxGeometry args={[0.5, 1, 0.5]} />
              <meshStandardMaterial color={color} />
            </mesh>
            {[0.3, 0.55, 0.8].map((y) => (
              <mesh key={y} position={[0.2, y, 0.26]}>
                <boxGeometry args={[0.06, 0.06, 0.02]} />
                <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={1} />
              </mesh>
            ))}
          </group>
        )
      case 'crate':
        return (
          <group>
            <mesh position={[0, 0.3, 0]} castShadow>
              <boxGeometry args={[0.7, 0.6, 0.7]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 0.3, 0]}>
              <boxGeometry args={[0.72, 0.62, 0.72]} />
              <meshBasicMaterial color={EDGE} wireframe />
            </mesh>
          </group>
        )
      case 'container':
        return (
          <group>
            <mesh position={[0, 0.35, 0]} castShadow>
              <boxGeometry args={[0.9, 0.7, 0.55]} />
              <meshStandardMaterial color={color} />
            </mesh>
            {[-0.25, 0, 0.25].map((x) => (
              <mesh key={x} position={[x, 0.35, 0.28]}>
                <boxGeometry args={[0.03, 0.65, 0.02]} />
                <meshStandardMaterial color="#1e293b" />
              </mesh>
            ))}
          </group>
        )
      case 'tank':
        return (
          <group>
            <mesh position={[0, 0.5, 0]} castShadow>
              <cylinderGeometry args={[0.45, 0.45, 1, 20]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 1.02, 0]}>
              <coneGeometry args={[0.46, 0.25, 20]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </group>
        )
      case 'truck':
        return (
          <group position={[0, 0.12, 0]}>
            <mesh position={[0, 0.25, 0]} castShadow>
              <boxGeometry args={[1.1, 0.4, 0.55]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0.45, 0.35, 0]}>
              <boxGeometry args={[0.35, 0.5, 0.5]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
            <Wheels />
          </group>
        )
      case 'ship':
        return (
          <group position={[0, 0.1, 0]}>
            <mesh position={[0, 0.15, 0]} castShadow>
              <boxGeometry args={[1.6, 0.3, 0.7]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[-0.4, 0.45, 0]}>
              <boxGeometry args={[0.4, 0.3, 0.5]} />
              <meshStandardMaterial color="#e2e8f0" />
            </mesh>
            {[0, 0.3].map((x) => (
              <mesh key={x} position={[x + 0.2, 0.42, 0]}>
                <boxGeometry args={[0.25, 0.25, 0.4]} />
                <meshStandardMaterial color="#f97316" />
              </mesh>
            ))}
          </group>
        )
      case 'crane':
        return (
          <group>
            <mesh position={[-0.3, 0.1, 0]}>
              <boxGeometry args={[0.4, 0.2, 0.4]} />
              <meshStandardMaterial color="#334155" />
            </mesh>
            <mesh position={[-0.3, 0.7, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 1.2, 10]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0.15, 1.25, 0]}>
              <boxGeometry args={[1, 0.08, 0.08]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0.55, 0.95, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.6, 6]} />
              <meshStandardMaterial color="#111827" />
            </mesh>
            <mesh position={[0.55, 0.65, 0]}>
              <boxGeometry args={[0.1, 0.1, 0.1]} />
              <meshStandardMaterial color="#111827" />
            </mesh>
          </group>
        )
      case 'module':
        return (
          <group>
            <mesh position={[0, 0.4, 0]} castShadow>
              <boxGeometry args={[1, 0.8, 0.8]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 0.4, 0]}>
              <boxGeometry args={[1.02, 0.82, 0.82]} />
              <meshBasicMaterial color={EDGE} wireframe />
            </mesh>
            <mesh position={[0, 0.85, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.3, 10]} />
              <meshStandardMaterial color="#94a3b8" />
            </mesh>
          </group>
        )
      case 'scaffold': {
        const bars: [number, number, number][] = [
          [-0.4, 0.5, -0.4],
          [0.4, 0.5, -0.4],
          [-0.4, 0.5, 0.4],
          [0.4, 0.5, 0.4],
        ]
        return (
          <group>
            {bars.map((p, i) => (
              <mesh key={i} position={p}>
                <cylinderGeometry args={[0.03, 0.03, 1, 8]} />
                <meshStandardMaterial color={color} />
              </mesh>
            ))}
            {[0.25, 0.6, 0.95].map((y) => (
              <mesh key={y} position={[0, y, 0]}>
                <boxGeometry args={[0.85, 0.03, 0.85]} />
                <meshStandardMaterial color={color} wireframe />
              </mesh>
            ))}
          </group>
        )
      }
      case 'weldRig':
        return (
          <group>
            <mesh position={[0, 0.3, 0]} castShadow>
              <boxGeometry args={[0.5, 0.6, 0.5]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 0.65, 0.2]}>
              <coneGeometry args={[0.08, 0.2, 8]} />
              <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1.5} />
            </mesh>
          </group>
        )
      case 'jacket': {
        const legs: [number, number][] = [
          [-0.4, -0.4],
          [0.4, -0.4],
          [-0.4, 0.4],
          [0.4, 0.4],
        ]
        return (
          <group>
            {legs.map(([x, z], i) => (
              <mesh key={i} position={[x * 0.6, 0.6, z * 0.6]} rotation={[0, 0, (x > 0 ? -1 : 1) * 0.08]}>
                <cylinderGeometry args={[0.05, 0.08, 1.2, 8]} />
                <meshStandardMaterial color={color} />
              </mesh>
            ))}
            {[0.3, 0.75, 1.15].map((y) => (
              <mesh key={y} position={[0, y, 0]}>
                <boxGeometry args={[0.95, 0.03, 0.95]} />
                <meshStandardMaterial color={color} wireframe />
              </mesh>
            ))}
          </group>
        )
      }
      case 'barge':
        return (
          <group>
            <mesh position={[0, 0.1, 0]} castShadow>
              <boxGeometry args={[1.5, 0.2, 1] as const} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[-0.3, 0.4, 0]}>
              <boxGeometry args={[0.5, 0.4, 0.5]} />
              <meshStandardMaterial color="#f59e0b" />
            </mesh>
            <mesh position={[0.35, 0.35, 0]}>
              <boxGeometry args={[0.4, 0.3, 0.4]} />
              <meshStandardMaterial color="#94a3b8" />
            </mesh>
          </group>
        )
      case 'heliDeck':
        return (
          <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 0.08, 20]} />
            <meshStandardMaterial color={color} />
          </mesh>
        )
      case 'flare':
        return (
          <group>
            <mesh position={[0, 0.7, 0]}>
              <cylinderGeometry args={[0.07, 0.1, 1.4, 10]} />
              <meshStandardMaterial color="#64748b" />
            </mesh>
            <mesh position={[0, 1.5, 0]}>
              <coneGeometry args={[0.18, 0.4, 10]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.4} />
            </mesh>
          </group>
        )
      case 'platformDeck':
        return (
          <group>
            <mesh position={[0, 0.45, 0]} castShadow>
              <boxGeometry args={[1.1, 0.25, 1.1]} />
              <meshStandardMaterial color={color} />
            </mesh>
            {[
              [-0.3, -0.3],
              [0.3, 0.3],
            ].map(([x, z], i) => (
              <mesh key={i} position={[x, 0.75, z]}>
                <boxGeometry args={[0.3, 0.35, 0.3]} />
                <meshStandardMaterial color="#94a3b8" />
              </mesh>
            ))}
          </group>
        )
      case 'pipeline':
        return (
          <group>
            <mesh position={[0, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.12, 0.12, 1.3, 12]} />
              <meshStandardMaterial color={color} />
            </mesh>
            {[-0.5, 0.5].map((x) => (
              <mesh key={x} position={[x, 0.15, 0]}>
                <boxGeometry args={[0.2, 0.25, 0.25]} />
                <meshStandardMaterial color="#eab308" />
              </mesh>
            ))}
          </group>
        )
      case 'office':
        return (
          <group>
            <mesh position={[0, 0.6, 0]} castShadow>
              <boxGeometry args={[1.3, 1.2, 1]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 1.28, 0]}>
              <boxGeometry args={[1.4, 0.16, 1.1]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
            {[-0.4, 0, 0.4].map((x) => (
              <mesh key={x} position={[x, 0.65, 0.51]}>
                <boxGeometry args={[0.22, 0.3, 0.02]} />
                <meshStandardMaterial color="#bae6fd" emissive="#bae6fd" emissiveIntensity={0.4} />
              </mesh>
            ))}
          </group>
        )
      case 'warehouse':
        return (
          <group>
            <mesh position={[0, 0.45, 0]} castShadow>
              <boxGeometry args={[2, 0.9, 1.3]} />
              <meshStandardMaterial color={color} />
            </mesh>
            {[-0.7, -0.3, 0.1, 0.5].map((x) => (
              <mesh key={x} position={[x, 0.92, 0]}>
                <boxGeometry args={[0.3, 0.06, 1.32]} />
                <meshStandardMaterial color="#94a3b8" />
              </mesh>
            ))}
            <mesh position={[0.85, 0.35, 0]}>
              <boxGeometry args={[0.3, 0.7, 0.8]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
          </group>
        )
      case 'vessel':
        return (
          <group position={[0, 0.1, 0]}>
            <mesh position={[0, 0.18, 0]} castShadow>
              <boxGeometry args={[2.2, 0.36, 0.9]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[-0.7, 0.5, 0]}>
              <boxGeometry args={[0.5, 0.5, 0.7]} />
              <meshStandardMaterial color="#e2e8f0" />
            </mesh>
            <mesh position={[0.3, 1.1, 0]}>
              <cylinderGeometry args={[0.07, 0.07, 1.4, 8]} />
              <meshStandardMaterial color="#334155" />
            </mesh>
            <mesh position={[0.3, 1.75, 0.35]}>
              <boxGeometry args={[0.08, 0.08, 0.9]} />
              <meshStandardMaterial color="#334155" />
            </mesh>
            <mesh position={[0.3, 1.3, 0.6]}>
              <cylinderGeometry args={[0.015, 0.015, 0.9, 6]} />
              <meshStandardMaterial color="#111827" />
            </mesh>
          </group>
        )
      default:
        return (
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[0.6, 0.6, 0.6]} />
            <meshStandardMaterial color={color} />
          </mesh>
        )
    }
  }, [shape, color])

  return <group scale={scale}>{content}</group>
}
