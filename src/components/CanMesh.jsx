import { useMemo, useEffect } from 'react'
import * as THREE from 'three'

/**
 * Renders one beverage can.
 * - externalTexture: a THREE.Texture loaded by the parent (from PNG asset)
 * - flavorConfig:    fallback — generate a canvas label from brand data
 */
export default function CanMesh({ flavorConfig, externalTexture, scale = 1 }) {
  // Canvas-generated label (only when no external texture supplied)
  const canvasTex = useMemo(() => {
    if (externalTexture) return null
    if (!flavorConfig) return null

    const { canColor, labelColor, name, tagline, accent, nutrition } = flavorConfig
    const W = 1024, H = 512
    const cv = document.createElement('canvas')
    cv.width = W; cv.height = H
    const c = cv.getContext('2d')

    // Radial base
    const rad = c.createRadialGradient(W * .5, H * .5, 0, W * .5, H * .5, W * .6)
    rad.addColorStop(0, labelColor)
    rad.addColorStop(1, canColor)
    c.fillStyle = rad; c.fillRect(0, 0, W, H)

    // Vertical shine
    const shine = c.createLinearGradient(W * .3, 0, W * .7, 0)
    shine.addColorStop(0, 'rgba(255,255,255,0)')
    shine.addColorStop(.5, 'rgba(255,255,255,0.13)')
    shine.addColorStop(1, 'rgba(255,255,255,0)')
    c.fillStyle = shine; c.fillRect(0, 0, W, H)

    // Subtle horizontal scan lines
    c.strokeStyle = 'rgba(255,255,255,0.06)'; c.lineWidth = 1
    for (let y = 0; y < H; y += 16) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke() }

    // Brand name
    c.save()
    c.shadowColor = 'rgba(0,0,0,0.55)'; c.shadowBlur = 20
    c.fillStyle = '#fff'
    c.font = '900 195px "Arial Narrow",Arial'
    c.textAlign = 'center'; c.textBaseline = 'middle'
    c.fillText('NIRO', W * .5, H * .30)
    c.restore()

    // Flavor name
    c.fillStyle = 'rgba(255,255,255,0.9)'
    c.font = '700 56px Arial'
    c.fillText(name.toUpperCase(), W * .5, H * .56)

    // Tagline
    c.fillStyle = 'rgba(255,255,255,0.5)'
    c.font = '400 34px Arial'
    c.fillText(tagline.toUpperCase(), W * .5, H * .70)

    // Macro strip
    c.fillStyle = 'rgba(0,0,0,0.32)'; c.fillRect(0, H * .82, W, H * .18)
    c.fillStyle = 'rgba(255,255,255,0.92)'; c.font = '700 30px Arial'
    c.fillText(
      `${nutrition?.protein ?? '20g'} PROTEIN · ${nutrition?.caffeine ?? '150mg'} CAFFEINE`,
      W * .5, H * .92
    )

    // Accent bands top / bottom
    c.fillStyle = accent
    c.fillRect(0, 0, W, 7)
    c.fillRect(0, H - 7, W, 7)

    const tex = new THREE.CanvasTexture(cv)
    tex.wrapS = THREE.RepeatWrapping
    tex.anisotropy = 16
    return tex
  }, [flavorConfig?.id, !!externalTexture])   // re-run only when flavor id changes

  // Dispose canvas texture when component unmounts or texture swaps
  useEffect(() => {
    return () => { canvasTex?.dispose() }
  }, [canvasTex])

  const activeTex = externalTexture ?? canvasTex

  const metalMat = useMemo(() =>
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#d2d2d2'),
      metalness: 0.92,
      roughness: 0.16,
      envMapIntensity: 1.5,
    }), []
  )

  const s = scale

  return (
    <group scale={[s, s, s]}>
      {/* Label body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.42, 0.42, 1.45, 80, 1, true]} />
        <meshStandardMaterial
          map={activeTex}
          metalness={0.5}
          roughness={0.2}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* Top shoulder */}
      <mesh position={[0, 0.725, 0]} material={metalMat}>
        <cylinderGeometry args={[0.34, 0.42, 0.1, 80]} />
      </mesh>
      {/* Top dome */}
      <mesh position={[0, 0.79, 0]} material={metalMat}>
        <sphereGeometry args={[0.34, 80, 20, 0, Math.PI * 2, 0, Math.PI / 2.1]} />
      </mesh>
      {/* Lid rim */}
      <mesh position={[0, 0.82, 0]} material={metalMat}>
        <torusGeometry args={[0.34, 0.016, 8, 80]} />
      </mesh>
      {/* Pull tab body */}
      <mesh position={[0, 0.848, 0.22]} rotation={[0.32, 0, 0]} material={metalMat}>
        <boxGeometry args={[0.076, 0.022, 0.11]} />
      </mesh>
      {/* Pull tab ring */}
      <mesh position={[0, 0.86, 0.272]} rotation={[Math.PI / 2, 0, 0]} material={metalMat}>
        <torusGeometry args={[0.03, 0.01, 8, 20]} />
      </mesh>

      {/* Bottom shoulder */}
      <mesh position={[0, -0.725, 0]} material={metalMat}>
        <cylinderGeometry args={[0.42, 0.36, 0.1, 80]} />
      </mesh>
      {/* Bottom dome (inverted) */}
      <mesh position={[0, -0.79, 0]} rotation={[Math.PI, 0, 0]} material={metalMat}>
        <sphereGeometry args={[0.34, 80, 20, 0, Math.PI * 2, 0, Math.PI / 2.8]} />
      </mesh>
    </group>
  )
}
