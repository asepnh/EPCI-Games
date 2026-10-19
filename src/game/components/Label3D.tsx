import { useMemo } from 'react'
import * as THREE from 'three'

interface Label3DProps {
  text: string
  position: [number, number, number]
  visible: boolean
}

function makeLabelTexture(text: string) {
  const canvas = document.createElement('canvas')
  const scale = 2
  canvas.width = 256 * scale
  canvas.height = 64 * scale
  const ctx = canvas.getContext('2d')!
  ctx.scale(scale, scale)
  ctx.font = 'bold 20px Segoe UI, system-ui, sans-serif'
  const metrics = ctx.measureText(text)
  const paddingX = 10
  const boxWidth = Math.min(256, metrics.width + paddingX * 2)
  const boxX = (256 - boxWidth) / 2

  ctx.fillStyle = 'rgba(255,255,255,0.88)'
  const r = 8
  ctx.beginPath()
  ctx.moveTo(boxX + r, 20)
  ctx.arcTo(boxX + boxWidth, 20, boxX + boxWidth, 44, r)
  ctx.arcTo(boxX + boxWidth, 44, boxX, 44, r)
  ctx.arcTo(boxX, 44, boxX, 20, r)
  ctx.arcTo(boxX, 20, boxX + boxWidth, 20, r)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = '#1e293b'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, 128, 32, boxWidth - paddingX)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return { texture, aspect: canvas.width / canvas.height }
}

export function Label3D({ text, position, visible }: Label3DProps) {
  const { texture, aspect } = useMemo(() => makeLabelTexture(text), [text])

  if (!visible) return null

  const height = 0.34
  return (
    <sprite position={position} scale={[height * aspect, height, 1]}>
      <spriteMaterial map={texture} depthTest={false} transparent />
    </sprite>
  )
}
