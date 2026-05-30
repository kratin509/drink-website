import { useMemo, useEffect } from 'react'
import * as THREE from 'three'

export default function CanMesh({ flavorConfig, scale = 1 }) {
  /* ── Canvas-generated label texture ───────────────────────────────────── */
  const labelTex = useMemo(() => {
    if (!flavorConfig) return null
    const { canColor, labelColor, name, tagline, accent, nutrition } = flavorConfig
    const W = 1024, H = 512
    const cv = document.createElement('canvas')
    cv.width = W; cv.height = H
    const c = cv.getContext('2d')

    // Background gradient
    const bg = c.createLinearGradient(0, 0, W, 0)
    bg.addColorStop(0,    canColor)
    bg.addColorStop(0.35, labelColor)
    bg.addColorStop(0.65, labelColor)
    bg.addColorStop(1,    canColor)
    c.fillStyle = bg
    c.fillRect(0, 0, W, H)

    // Vertical shine streak
    const shine = c.createLinearGradient(W * 0.28, 0, W * 0.55, 0)
    shine.addColorStop(0,   'rgba(255,255,255,0)')
    shine.addColorStop(0.5, 'rgba(255,255,255,0.18)')
    shine.addColorStop(1,   'rgba(255,255,255,0)')
    c.fillStyle = shine
    c.fillRect(0, 0, W, H)

    // Dark edge vignette left/right
    const vig = c.createLinearGradient(0, 0, W, 0)
    vig.addColorStop(0,    'rgba(0,0,0,0.45)')
    vig.addColorStop(0.18, 'rgba(0,0,0,0)')
    vig.addColorStop(0.82, 'rgba(0,0,0,0)')
    vig.addColorStop(1,    'rgba(0,0,0,0.45)')
    c.fillStyle = vig
    c.fillRect(0, 0, W, H)

    // Accent top/bottom bands
    c.fillStyle = accent
    c.fillRect(0, 0, W, 14)
    c.fillRect(0, H - 14, W, 14)

    // Macro dark strip at bottom
    c.fillStyle = 'rgba(0,0,0,0.38)'
    c.fillRect(0, H * 0.78, W, H * 0.22)

    // NIRO wordmark
    c.save()
    c.shadowColor = 'rgba(0,0,0,0.6)'
    c.shadowBlur = 28
    c.fillStyle = '#fff'
    c.font = '900 210px "Arial Narrow",Arial,sans-serif'
    c.textAlign = 'center'
    c.textBaseline = 'alphabetic'
    c.fillText('NIRO', W * 0.5, H * 0.38)
    c.restore()

    // Flavor name
    c.fillStyle = 'rgba(255,255,255,0.95)'
    c.font = `bold 64px Arial,sans-serif`
    c.textAlign = 'center'
    c.textBaseline = 'alphabetic'
    c.fillText(name.toUpperCase(), W * 0.5, H * 0.58)

    // Tagline
    c.fillStyle = 'rgba(255,255,255,0.52)'
    c.font = '400 38px Arial,sans-serif'
    c.fillText(tagline.toUpperCase(), W * 0.5, H * 0.70)

    // Macro text
    c.fillStyle = 'rgba(255,255,255,0.9)'
    c.font = 'bold 34px Arial,sans-serif'
    c.fillText(
      `${nutrition?.protein ?? '20g'} PROTEIN  ·  ${nutrition?.caffeine ?? '150mg'} CAFFEINE`,
      W * 0.5, H * 0.92
    )

    const tex = new THREE.CanvasTexture(cv)
    tex.wrapS  = THREE.RepeatWrapping
    tex.anisotropy = 16
    return tex
  }, [flavorConfig?.id])

  useEffect(() => () => labelTex?.dispose(), [labelTex])

  /* ── Shared metal material ─────────────────────────────────────────────── */
  const metal = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#c8c8c8'),
    metalness: 0.94,
    roughness: 0.14,
    envMapIntensity: 1.8,
  }), [])

  const s = scale

  return (
    <group scale={[s, s, s]}>

      {/* ── Label body — open cylinder ─────────────────────────────────── */}
      <mesh castShadow>
        <cylinderGeometry args={[0.44, 0.44, 1.52, 80, 1, true]} />
        <meshStandardMaterial
          map={labelTex}
          metalness={0.45}
          roughness={0.22}
          envMapIntensity={1.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ── Bottom disk cap ────────────────────────────────────────────── */}
      <mesh position={[0, -0.76, 0]} rotation={[Math.PI, 0, 0]} castShadow material={metal}>
        <circleGeometry args={[0.44, 64]} />
      </mesh>
      {/* Bottom outer rim ring */}
      <mesh position={[0, -0.755, 0]} material={metal} castShadow>
        <torusGeometry args={[0.43, 0.016, 8, 80]} />
      </mesh>
      {/* Bottom inner chime (slight inset ring) */}
      <mesh position={[0, -0.73, 0]} material={metal} castShadow>
        <torusGeometry args={[0.3, 0.012, 6, 64]} />
      </mesh>

      {/* ── Top shoulder taper ─────────────────────────────────────────── */}
      <mesh position={[0, 0.83, 0]} material={metal} castShadow>
        <cylinderGeometry args={[0.33, 0.44, 0.14, 80]} />
      </mesh>

      {/* ── Neck ───────────────────────────────────────────────────────── */}
      <mesh position={[0, 0.92, 0]} material={metal} castShadow>
        <cylinderGeometry args={[0.33, 0.33, 0.04, 80]} />
      </mesh>

      {/* ── Lid disk ───────────────────────────────────────────────────── */}
      <mesh position={[0, 0.942, 0]} material={metal} castShadow>
        <cylinderGeometry args={[0.33, 0.33, 0.012, 80]} />
      </mesh>

      {/* ── Lid outer rim ──────────────────────────────────────────────── */}
      <mesh position={[0, 0.946, 0]} material={metal} castShadow>
        <torusGeometry args={[0.32, 0.018, 8, 80]} />
      </mesh>

      {/* ── Pull tab body ──────────────────────────────────────────────── */}
      <mesh position={[0, 0.965, 0.19]} rotation={[0.28, 0, 0]} material={metal} castShadow>
        <boxGeometry args={[0.072, 0.016, 0.1]} />
      </mesh>
      {/* Pull tab ring */}
      <mesh position={[0, 0.972, 0.262]} rotation={[Math.PI / 2, 0, 0]} material={metal} castShadow>
        <torusGeometry args={[0.028, 0.009, 8, 24]} />
      </mesh>

    </group>
  )
}
