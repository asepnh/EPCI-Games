import type { StageDef } from './types'

export const stages: StageDef[] = [
  {
    id: 'engineering',
    key: 'engineering',
    order: 0,
    title: '1. Engineering',
    subtitle: 'Design a jacket that can take a hit',
    narrative:
      "Welcome to the structural test lab! Before anyone cuts real steel, engineers test a scale model to make sure the jacket design can resist ocean waves and currents - not just hold itself up on a calm day. The legs are already built. Add bracing where it matters, then put your design through a wave test.",
    wrapUp:
      "The jacket design holds firm under load! Every brace you placed does real structural work - that's exactly how real engineers prove a design before a single real beam is cut. Now Procurement can order the steel that matches this proven design.",
    groundColor: '#dfe7f5',
    accentColor: '#3b82f6',
    mode: 'structural',
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
    mode: 'place',
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
    subtitle: 'Build the jacket and the topside, in order',
    narrative:
      "Welcome to the fabrication yard! Two crews are working side by side: one builds the jacket (the steel legs that will stand on the seabed), the other builds the topside (the deck that sits on top). Everything has to be built in the right order - you can't bolt on equipment before the frame exists! Pick the next correct piece for each crew to keep both builds moving.",
    wrapUp:
      'The jacket and the topside are both fabricated, welded, painted and tested. These giant steel structures are now ready for the toughest part: getting them out to the real site.',
    groundColor: '#f5ece0',
    accentColor: '#d97706',
    mode: 'assembly',
  },
  {
    id: 'installation',
    key: 'installation',
    order: 3,
    title: '4. Installation',
    subtitle: 'Load the barge like a puzzle',
    narrative:
      "This is the final and most dramatic step! Before the barge can sail, every fabricated piece has to be loaded onto its deck - and deck space is tight. Fit the jacket, the piles, the boat landing and the walkway onto the barge without wasting space, then it's off to the real site to be lifted into position and hooked up for start-up.",
    wrapUp:
      "Congratulations! Every piece is loaded, the barge has sailed, and the platform is installed, hooked up, and ready to produce oil and gas safely. You just completed an entire EPCI project - Engineering, Procurement, Construction and Installation!",
    groundColor: '#dbeefb',
    accentColor: '#0369a1',
    mode: 'packing',
  },
]

export function getPaletteItem(stage: StageDef, itemId: string) {
  return stage.palette?.find((p) => p.id === itemId)
}
