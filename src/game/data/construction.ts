export interface AssemblyStep {
  id: string
  name: string
  fact: string
}

export interface AssemblyTrack {
  id: 'jacket' | 'topside'
  title: string
  accentColor: string
  steps: AssemblyStep[]
}

export const assemblyTracks: AssemblyTrack[] = [
  {
    id: 'jacket',
    title: 'Jacket',
    accentColor: '#64748b',
    steps: [
      {
        id: 'jacket-frame',
        name: 'Jacket Frame',
        fact: 'The jacket frame is the steel skeleton of legs and cross-braces that will stand on the seabed. Everything else on the jacket is built around it, so it always comes first.',
      },
      {
        id: 'buoyancy-tank',
        name: 'Buoyancy Tank',
        fact: 'Sealed buoyancy tanks are welded onto the frame so the jacket floats and can be towed safely. Later, they are flooded on purpose so the jacket sinks straight down into place.',
      },
      {
        id: 'risers',
        name: 'Risers',
        fact: 'Risers are the long pipes that will carry oil and gas up from the seabed wells to the platform above. They are clamped onto the jacket now, while it is still easy to reach every level.',
      },
    ],
  },
  {
    id: 'topside',
    title: 'Topside',
    accentColor: '#f59e0b',
    steps: [
      {
        id: 'structure-frame',
        name: 'Structure Frame',
        fact: 'The structure frame is the steel skeleton of the topside deck. Every piece of equipment, pipe and cable will be bolted or welded onto this frame, so it has to exist first.',
      },
      {
        id: 'mechanical-equipment',
        name: 'Mechanical Equipment',
        fact: 'Pumps, separators and compressors are lifted onto the frame next, while there is still open access above to lower them precisely into position.',
      },
      {
        id: 'piping',
        name: 'Piping',
        fact: 'Piping connects all the mechanical equipment together so oil, gas and water can flow exactly where they need to go - it can only be routed once the equipment is in place.',
      },
      {
        id: 'electrical',
        name: 'Electrical',
        fact: 'Electrical cabling and control systems go in last, powering and connecting every pump, valve and sensor so operators can run the whole topside from a control room.',
      },
    ],
  },
]
