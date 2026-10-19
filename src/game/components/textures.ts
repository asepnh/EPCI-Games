import * as THREE from 'three'

/** small seeded PRNG so textures are stable across renders instead of re-randomizing */
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function makeCanvas(size = 256) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  return { canvas, ctx: canvas.getContext('2d')! }
}

function finish(canvas: HTMLCanvasElement, repeat: number) {
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(repeat, repeat)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.needsUpdate = true
  return texture
}

export function makeGrassTexture(repeat = 10) {
  const { canvas, ctx } = makeCanvas(256)
  const rand = mulberry32(7)
  ctx.fillStyle = '#9fc87e'
  ctx.fillRect(0, 0, 256, 256)
  for (let i = 0; i < 2200; i++) {
    const x = rand() * 256
    const y = rand() * 256
    const shade = rand()
    ctx.fillStyle =
      shade < 0.4 ? 'rgba(120,170,95,0.5)' : shade < 0.75 ? 'rgba(180,215,140,0.45)' : 'rgba(80,130,65,0.4)'
    const w = 1.5 + rand() * 2.5
    ctx.fillRect(x, y, w, w * 2.2)
  }
  return finish(canvas, repeat)
}

export function makeGravelTexture(repeat = 9) {
  const { canvas, ctx } = makeCanvas(256)
  const rand = mulberry32(42)
  ctx.fillStyle = '#cdbf9e'
  ctx.fillRect(0, 0, 256, 256)
  for (let i = 0; i < 1600; i++) {
    const x = rand() * 256
    const y = rand() * 256
    const r = 1 + rand() * 2.2
    const shade = rand()
    ctx.fillStyle =
      shade < 0.4 ? 'rgba(150,135,105,0.55)' : shade < 0.75 ? 'rgba(225,212,180,0.5)' : 'rgba(110,98,72,0.4)'
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
  // faint tyre-track streaks
  ctx.strokeStyle = 'rgba(90,78,56,0.15)'
  ctx.lineWidth = 6
  for (let i = 0; i < 4; i++) {
    const y = 30 + i * 55
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.bezierCurveTo(80, y + 10, 180, y - 10, 256, y)
    ctx.stroke()
  }
  return finish(canvas, repeat)
}

export function makeWaterTexture(repeat = 7) {
  const size = 512
  const { canvas, ctx } = makeCanvas(size)
  const rand = mulberry32(99)
  ctx.fillStyle = '#4a96c4'
  ctx.fillRect(0, 0, size, size)

  // layered ripples at different scales/directions so no single band repeats obviously
  const layers = [
    { count: 16, amp: 10, freq: 0.012, alpha: 0.14, width: 3, angle: 0 },
    { count: 22, amp: 6, freq: 0.03, alpha: 0.1, width: 2, angle: 0.3 },
    { count: 30, amp: 3, freq: 0.07, alpha: 0.08, width: 1.5, angle: -0.2 },
  ]
  for (const layer of layers) {
    ctx.strokeStyle = 'rgba(255,255,255,1)'
    ctx.lineWidth = layer.width
    for (let i = 0; i < layer.count; i++) {
      const y0 = rand() * size
      const phase = rand() * Math.PI * 2
      ctx.globalAlpha = layer.alpha * (0.5 + rand() * 0.7)
      ctx.beginPath()
      for (let x = 0; x <= size; x += 10) {
        const y = y0 + x * layer.angle + Math.sin(x * layer.freq + phase) * layer.amp
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
    }
  }

  // sun-glint sparkle flecks
  ctx.globalAlpha = 1
  for (let i = 0; i < 90; i++) {
    const x = rand() * size
    const y = rand() * size
    const r = 0.6 + rand() * 1.4
    ctx.fillStyle = `rgba(255,255,255,${0.2 + rand() * 0.35})`
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }

  return finish(canvas, repeat)
}
