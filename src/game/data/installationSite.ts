export interface InstallStep {
  id: string
  name: string
  fact: string
}

/** mode: 'packing' (Installation), site half - sequential offshore installation steps (4b) */
export const installSiteSteps: InstallStep[] = [
  {
    id: 'lift-jacket',
    name: 'Lift the Jacket',
    fact: "A heavy-lift vessel's giant crane hoists the jacket off the barge - some of these cranes can lift thousands of tons in a single pick.",
  },
  {
    id: 'lower-to-seabed',
    name: 'Upend & Lower to Seabed',
    fact: 'The jacket is tipped upright and lowered slowly through the water until its legs touch down exactly on the surveyed spot on the seabed.',
  },
  {
    id: 'drive-piles',
    name: 'Drive the Piles',
    fact: "Long steel piles are hammered through the jacket's legs deep into the seabed, anchoring the whole structure so it can't shift, even in a storm.",
  },
  {
    id: 'set-topside',
    name: 'Lift & Set the Topside',
    fact: 'The same giant crane lifts the topside deck - already full of equipment - and lowers it onto the jacket legs in one careful move.',
  },
  {
    id: 'hook-up',
    name: 'Hook-Up & Commission',
    fact: 'Engineers connect every pipe, cable and riser, then test each system one by one before the platform is cleared to start producing oil and gas.',
  },
]
