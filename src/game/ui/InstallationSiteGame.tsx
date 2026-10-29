import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { JacketAssembly, TopsideAssembly } from '../components/AssemblyModels'
import { InstallVessel, Piles, FlareBoom, Sea } from '../components/InstallationModels'
import { Label3D } from '../components/Label3D'
import { installSiteSteps } from '../data/installationSite'
import { useGameStore } from '../store'

const JACKET_LEG_POSITIONS: [number, number][] = [
  [-0.715, -0.715],
  [0.715, -0.715],
  [-0.715, 0.715],
  [0.715, 0.715],
]

function InstallScene() {
  const installProgress = useGameStore((s) => s.installProgress)

  const lifted = installProgress >= 1
  const onSeabed = installProgress >= 2
  const piled = installProgress >= 3
  const topsideSet = installProgress >= 4
  const hookedUp = installProgress >= 5

  const jacketPosition: [number, number, number] = onSeabed
    ? [2, -1.6, 0]
    : lifted
      ? [0.8, 0.5, 0]
      : [-3.3, 0.75, 0]
  const jacketScale = onSeabed ? 1 : lifted ? 0.8 : 0.55

  return (
    <Canvas shadows dpr={[1, 1.5]} camera={{ fov: 32, position: [6, 6, 10] }}>
      <color attach="background" args={['#bae6fd']} />
      <hemisphereLight intensity={0.7} groundColor="#0c4a6e" />
      <directionalLight position={[6, 10, 5]} intensity={1.1} castShadow />

      <Sea />

      <group position={[-3.3, 0.62, 0]}>
        <InstallVessel />
        <Label3D text="Install Vessel" position={[0, 2.2, 0]} visible />
      </group>

      <group position={jacketPosition} scale={jacketScale}>
        <JacketAssembly step={3} />
        {topsideSet && (
          <group position={[0, 2, 0]}>
            <TopsideAssembly step={4} />
          </group>
        )}
        {piled && <Piles legPositions={JACKET_LEG_POSITIONS} />}
        {hookedUp && <FlareBoom />}
        {onSeabed && <Label3D text="Install Site" position={[0, topsideSet ? 3.2 : 2.5, 0]} visible />}
      </group>

      <OrbitControls
        enablePan
        enableZoom
        minDistance={8}
        maxDistance={18}
        minPolarAngle={0.5}
        maxPolarAngle={1.2}
        target={[0, 0, 0]}
      />
    </Canvas>
  )
}

export function InstallationSiteGame() {
  const installProgress = useGameStore((s) => s.installProgress)
  const attemptInstallStep = useGameStore((s) => s.attemptInstallStep)

  return (
    <>
      <InstallScene />
      <div className="absolute inset-x-0 bottom-0 p-4 flex justify-center z-10">
        <div className="max-w-2xl w-full bg-slate-900/95 text-white rounded-2xl p-4 shadow-2xl border border-white/10 space-y-3">
          <p className="text-sm text-white/70">
            The barge has arrived offshore - take the jacket and topside through installation, step by step.
          </p>
          <div className="flex gap-2 flex-wrap">
            {installSiteSteps.map((step, i) => {
              const done = i < installProgress
              const active = i === installProgress
              return (
                <button
                  key={step.id}
                  onClick={() => attemptInstallStep(step.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition text-left ${
                    done
                      ? 'bg-white/10 border-white/10 text-white/50'
                      : active
                        ? 'bg-white/15 border-white/40 text-white hover:bg-white/25 cursor-pointer'
                        : 'bg-white/5 border-white/5 text-white/30'
                  }`}
                >
                  {done ? '✓ ' : active ? '' : '🔒 '}
                  {step.name}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
