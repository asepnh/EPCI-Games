import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useMemo } from 'react'
import { JacketAssembly, TopsideAssembly } from '../components/AssemblyModels'
import { Label3D } from '../components/Label3D'
import { makeGravelTexture } from '../components/textures'
import { assemblyTracks } from '../data/construction'
import { useGameStore } from '../store'

function Yard() {
  const gravel = useMemo(() => makeGravelTexture(6), [])
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
      <planeGeometry args={[9, 7]} />
      <meshStandardMaterial map={gravel} roughness={0.95} />
    </mesh>
  )
}

function AssemblyScene() {
  const assemblyProgress = useGameStore((s) => s.assemblyProgress)

  return (
    <Canvas shadows dpr={[1, 1.5]} camera={{ fov: 32, position: [7, 8, 9] }}>
      <color attach="background" args={['#eef2ff']} />
      <hemisphereLight intensity={0.65} groundColor="#94a3b8" />
      <directionalLight position={[6, 10, 5]} intensity={1.1} castShadow />

      <Yard />

      <group position={[-2.4, 0, 0]}>
        <JacketAssembly step={assemblyProgress.jacket} />
        <Label3D text="Jacket" position={[0, 2.7, 0]} visible />
      </group>

      <group position={[2.4, 0, 0]}>
        <TopsideAssembly step={assemblyProgress.topside} />
        <Label3D text="Topside" position={[0, 1.6, 0]} visible />
      </group>

      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={9}
        maxDistance={18}
        minPolarAngle={0.6}
        maxPolarAngle={1.1}
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
        target={[0, 0.8, 0]}
      />
    </Canvas>
  )
}

function TrackRow({ trackId }: { trackId: 'jacket' | 'topside' }) {
  const track = assemblyTracks.find((t) => t.id === trackId)!
  const progress = useGameStore((s) => s.assemblyProgress[trackId])
  const attemptAssemblyStep = useGameStore((s) => s.attemptAssemblyStep)

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: track.accentColor }}>
        {track.title} crew
      </p>
      <div className="flex gap-2 flex-wrap">
        {track.steps.map((step, i) => {
          const done = i < progress
          const active = i === progress
          return (
            <button
              key={step.id}
              onClick={() => attemptAssemblyStep(trackId, step.id)}
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
  )
}

export function AssemblyGame() {
  return (
    <>
      <AssemblyScene />
      <div className="absolute inset-x-0 bottom-0 p-4 flex justify-center z-10">
        <div className="max-w-2xl w-full bg-slate-900/95 text-white rounded-2xl p-4 shadow-2xl border border-white/10 space-y-3">
          <p className="text-sm text-white/70">
            Pick the next piece for each crew, in order - you can work on both at once.
          </p>
          <TrackRow trackId="jacket" />
          <TrackRow trackId="topside" />
        </div>
      </div>
    </>
  )
}
