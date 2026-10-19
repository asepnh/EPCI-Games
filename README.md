# EPCI Builder

An interactive, 3D isometric web game that teaches kids how a real oil & gas
EPCI (Engineering, Procurement, Construction, Installation) project comes
together - from blueprint to offshore start-up.

## How it works

The game walks through the four real-world stages of an EPCI project:

1. **Engineering** - fill the design office with the teams that draw up the
   plant (process, piping, structural, electrical & instrumentation).
2. **Procurement & Supply Chain** - order steel, pumps, valves and tanks, and
   get them shipped to the yard by truck and cargo ship.
3. **Construction** - fabricate and assemble steel structures and process
   modules at the yard, weld, test and inspect them.
4. **Installation** - transport the finished modules by barge, lift the
   platform jacket and topside deck into place, hook up pipelines, and start
   the plant up.

Each stage is a small isometric "site" rendered in 3D (sim-city style). Click
an empty pad to open a palette of items, then pick the one that belongs
there. Every placement - right or wrong - shows a short real-world fact
about that part of the EPCI process.

## Tech stack

- [Vite](https://vite.dev/) + React + TypeScript
- [react-three-fiber](https://docs.pmnd.rs/react-three-fiber) / three.js for
  the 3D isometric scene
- [zustand](https://github.com/pmndrs/zustand) for game state
- Tailwind CSS v4 for the UI layer

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```
