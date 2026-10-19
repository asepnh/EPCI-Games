import type { StageDef } from './types'

export const stages: StageDef[] = [
  {
    id: 'engineering',
    key: 'engineering',
    order: 0,
    title: '1. Engineering',
    subtitle: 'Design it before you build it',
    narrative:
      "Welcome to the Engineering Office! Before anyone picks up a tool, engineers design the entire oil & gas facility on computers. They decide how the process works, how pipes connect, how strong the steel must be, and how the electrics are wired. Fill the office with the design teams to finish the blueprints.",
    wrapUp:
      "Great work! The blueprints are finished. Every pipe, pump and beam has been designed and checked. Now Procurement can order the real equipment that matches these drawings.",
    groundColor: '#dfe7f5',
    accentColor: '#3b82f6',
    gridSize: 5,
    slots: [
      { id: 'e1', pos: [1, 1], label: 'Process Design', requiredItemId: 'process-desk' },
      { id: 'e2', pos: [3, 1], label: 'Piping & Plant Layout', requiredItemId: 'piping-desk' },
      { id: 'e3', pos: [1, 3], label: 'Structural Design', requiredItemId: 'structural-desk' },
      { id: 'e4', pos: [3, 3], label: 'Electrical & Instrumentation', requiredItemId: 'electrical-desk' },
      { id: 'e5', pos: [2, 2], label: 'Design Review Room', requiredItemId: 'review-table' },
    ],
    palette: [
      {
        id: 'process-desk',
        name: 'Process Engineer Desk',
        shape: 'desk',
        color: '#60a5fa',
        fact:
          'Process engineers decide how oil and gas flow through the plant: what gets separated, cleaned, cooled or compressed, and in what order.',
      },
      {
        id: 'piping-desk',
        name: 'Piping Design Desk',
        shape: 'blueprint',
        color: '#38bdf8',
        fact:
          'Piping engineers draw every pipe in 3D so none of them crash into each other, and so pipes can be inspected and maintained later.',
      },
      {
        id: 'structural-desk',
        name: 'Structural Design Desk',
        shape: 'desk',
        color: '#818cf8',
        fact:
          'Structural engineers calculate how strong the steel frames, decks and platforms must be to hold everything up safely - even in storms.',
      },
      {
        id: 'electrical-desk',
        name: 'Electrical & I&C Desk',
        shape: 'monitor',
        color: '#2dd4bf',
        fact:
          'Electrical and instrumentation engineers design the cables, sensors and control systems that let operators run the plant safely from a control room.',
      },
      {
        id: 'review-table',
        name: '3D Model Review Table',
        shape: 'server',
        color: '#a78bfa',
        fact:
          'Before anything is built, the whole team reviews a 3D computer model together to catch mistakes early - fixing a drawing is much cheaper than fixing a finished pipe!',
      },
      {
        id: 'coffee-cart',
        name: 'Coffee Cart',
        shape: 'crate',
        color: '#f59e0b',
        fact: "Nice try - engineers do love coffee, but this won't help finish the blueprints!",
      },
      {
        id: 'crane-decoy',
        name: 'Mobile Crane',
        shape: 'crane',
        color: '#f97316',
        fact: 'Cranes are for the Construction yard, not the design office. Try again!',
      },
    ],
  },
  {
    id: 'procurement',
    key: 'procurement',
    order: 1,
    title: '2. Procurement & Supply Chain',
    subtitle: 'Order it, track it, ship it',
    narrative:
      "Now that the design is approved, the Procurement team orders everything on the drawings: steel, pumps, valves, cables and giant pre-built modules. They choose suppliers all over the world, track every order, and arrange trucks and ships to deliver it all to the construction yard on time.",
    wrapUp:
      'All the equipment has been ordered and delivered to the yard! Nothing can be built without the right parts arriving at the right time - that is the magic of supply chain.',
    groundColor: '#e7f3e8',
    accentColor: '#16a34a',
    gridSize: 5,
    slots: [
      { id: 'p1', pos: [1, 1], label: 'Steel & Pipe Order', requiredItemId: 'steel-crate' },
      { id: 'p2', pos: [3, 1], label: 'Pumps & Valves Order', requiredItemId: 'valve-crate' },
      { id: 'p3', pos: [1, 3], label: 'Storage Tank Delivery', requiredItemId: 'tank' },
      { id: 'p4', pos: [3, 3], label: 'Cargo Ship Delivery', requiredItemId: 'ship' },
      { id: 'p5', pos: [2, 2], label: 'Yard Logistics Truck', requiredItemId: 'truck' },
    ],
    palette: [
      {
        id: 'steel-crate',
        name: 'Steel & Pipe Crate',
        shape: 'crate',
        color: '#94a3b8',
        fact:
          'Steel beams and pipe sections are ordered from mills and fabricators months in advance, because big orders take time to produce.',
      },
      {
        id: 'valve-crate',
        name: 'Pumps & Valves Crate',
        shape: 'container',
        color: '#4ade80',
        fact:
          'Pumps, valves and instruments often come from specialist factories around the world - procurement tracks each one so it arrives before it is needed.',
      },
      {
        id: 'tank',
        name: 'Storage Tank',
        shape: 'tank',
        color: '#22c55e',
        fact:
          'Large storage tanks are sometimes built off-site and shipped whole, or built on-site plate by plate - procurement decides which is faster and cheaper.',
      },
      {
        id: 'ship',
        name: 'Cargo Ship',
        shape: 'ship',
        color: '#0ea5e9',
        fact:
          'Heavy equipment often travels across oceans on cargo ships. Logistics teams plan routes and schedules so nothing arrives late.',
      },
      {
        id: 'truck',
        name: 'Delivery Truck',
        shape: 'truck',
        color: '#eab308',
        fact:
          'Once equipment reaches a port, trucks carry it the final distance to the construction yard, carefully timed with the yard\'s crane schedule.',
      },
      {
        id: 'blueprint-decoy',
        name: 'Rolled-up Blueprint',
        shape: 'blueprint',
        color: '#60a5fa',
        fact: "That belongs back in Engineering - procurement needs real equipment, not drawings!",
      },
      {
        id: 'jacket-decoy',
        name: 'Platform Jacket',
        shape: 'jacket',
        color: '#64748b',
        fact: 'The jacket structure gets installed later offshore, not ordered in a crate here!',
      },
    ],
  },
  {
    id: 'construction',
    key: 'construction',
    order: 2,
    title: '3. Construction',
    subtitle: 'Fabricate and assemble',
    narrative:
      "Welcome to the fabrication yard! This is where steel, pipes and equipment become real structures. Workers weld steel frames, assemble huge modules, and test everything before it ever leaves the yard. Build up the yard to finish construction.",
    wrapUp:
      'The modules are fabricated, welded, painted and tested. These giant steel structures are now ready for the toughest part: getting them out to the real site.',
    groundColor: '#f5ece0',
    accentColor: '#d97706',
    gridSize: 5,
    slots: [
      { id: 'c1', pos: [1, 1], label: 'Steel Scaffold Frame', requiredItemId: 'scaffold' },
      { id: 'c2', pos: [3, 1], label: 'Welding Station', requiredItemId: 'weld-rig' },
      { id: 'c3', pos: [1, 3], label: 'Process Module Assembly', requiredItemId: 'module' },
      { id: 'c4', pos: [3, 3], label: 'Heavy Lift Crane', requiredItemId: 'construction-crane' },
      { id: 'c5', pos: [2, 2], label: 'Quality Test Bay', requiredItemId: 'server' },
    ],
    palette: [
      {
        id: 'scaffold',
        name: 'Steel Scaffold Frame',
        shape: 'scaffold',
        color: '#b45309',
        fact:
          'Scaffolding lets workers safely reach every level of a tall structure while it is being built.',
      },
      {
        id: 'weld-rig',
        name: 'Welding Station',
        shape: 'weldRig',
        color: '#ef4444',
        fact:
          'Welders join steel plates and pipes into one strong structure. Every weld is inspected to make sure it will not fail.',
      },
      {
        id: 'module',
        name: 'Process Module',
        shape: 'module',
        color: '#f59e0b',
        fact:
          'Instead of building everything on the final site, teams build big ready-made "modules" in the yard, then transport the whole module at once - much faster and safer.',
      },
      {
        id: 'construction-crane',
        name: 'Heavy Lift Crane',
        shape: 'crane',
        color: '#ea580c',
        fact:
          'Cranes lift incredibly heavy steel sections into place. Some construction cranes can lift more than 1,000 tonnes!',
      },
      {
        id: 'server',
        name: 'Quality Test Bay',
        shape: 'server',
        color: '#78716c',
        fact:
          'Before anything leaves the yard, it is pressure-tested, inspected and checked against the original engineering drawings.',
      },
      {
        id: 'ship-decoy',
        name: 'Cargo Ship',
        shape: 'ship',
        color: '#0ea5e9',
        fact: 'Shipping already happened in Procurement - this yard is for building, not sailing!',
      },
      {
        id: 'desk-decoy',
        name: 'Office Desk',
        shape: 'desk',
        color: '#60a5fa',
        fact: 'Desks belong in the design office - the fabrication yard needs tools and steel!',
      },
    ],
  },
  {
    id: 'installation',
    key: 'installation',
    order: 3,
    title: '4. Installation',
    subtitle: 'Transport it, lift it, hook it up',
    narrative:
      "This is the final and most dramatic step! The finished modules are loaded onto a barge, towed out to the real site, and lifted into their final position - sometimes far out at sea. Then everything is connected, tested and started up for the very first time.",
    wrapUp:
      "Congratulations! The platform is installed, hooked up, and ready to produce oil and gas safely. You just completed an entire EPCI project - Engineering, Procurement, Construction and Installation!",
    groundColor: '#dbeefb',
    accentColor: '#0369a1',
    gridSize: 5,
    slots: [
      { id: 'i1', pos: [1, 1], label: 'Transport Barge', requiredItemId: 'barge' },
      { id: 'i2', pos: [3, 1], label: 'Platform Jacket (Legs)', requiredItemId: 'jacket' },
      { id: 'i3', pos: [1, 3], label: 'Topside Deck Lift', requiredItemId: 'deck' },
      { id: 'i4', pos: [3, 3], label: 'Pipeline Hook-up', requiredItemId: 'pipeline' },
      { id: 'i5', pos: [2, 2], label: 'Flare & Helideck Start-up', requiredItemId: 'flare' },
    ],
    palette: [
      {
        id: 'barge',
        name: 'Transport Barge',
        shape: 'barge',
        color: '#0284c7',
        fact:
          'Giant modules are floated out to the installation site on a barge, sometimes towed for thousands of kilometres by tugboats.',
      },
      {
        id: 'jacket',
        name: 'Platform Jacket',
        shape: 'jacket',
        color: '#64748b',
        fact:
          'The "jacket" is the steel-leg structure that is fixed to the seabed. The rest of the platform sits on top of it, like a table on its legs.',
      },
      {
        id: 'deck',
        name: 'Topside Deck',
        shape: 'platformDeck',
        color: '#f59e0b',
        fact:
          'The topside deck holds all the process equipment. A heavy-lift crane vessel lowers it onto the jacket in one of the most delicate lifts in engineering.',
      },
      {
        id: 'pipeline',
        name: 'Pipeline Hook-up',
        shape: 'pipeline',
        color: '#334155',
        fact:
          'Pipelines connect the new platform to other platforms or to shore, so the oil and gas can actually be transported and sold.',
      },
      {
        id: 'flare',
        name: 'Flare & Start-up',
        shape: 'flare',
        color: '#f97316',
        fact:
          'At start-up, engineers test every system. The flare safely burns off excess gas during testing - and the plant is finally in operation!',
      },
      {
        id: 'module-decoy',
        name: 'Process Module',
        shape: 'module',
        color: '#f59e0b',
        fact: 'That module should already be finished and loaded - it was built back in Construction!',
      },
      {
        id: 'truck-decoy',
        name: 'Delivery Truck',
        shape: 'truck',
        color: '#eab308',
        fact: "Trucks can't drive on open water - out here you need a barge!",
      },
    ],
  },
]

export function getPaletteItem(stage: StageDef, itemId: string) {
  return stage.palette.find((p) => p.id === itemId)
}
