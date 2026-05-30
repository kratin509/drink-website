import { useMemo, useEffect } from 'react'
import * as THREE from 'three'

export default function CanMesh({ flavorConfig, scale = 1 }) {
  /* ── Canvas label texture ──────────────────────────────────────────────── */
  const labelTex = useMemo(() => {
    if (!flavorConfig) return null
    const { canColor, labelColor, name, tagline, accent, nutrition } = flavorConfig
    const W = 1024, H = 640
    const cv = document.createElement('canvas')
    cv.width = W; cv.height = H
    const c = cv.getContext('2d')

    // Base gradient — dark edges, bright center
    const bg = c.createLinearGradient(0, 0, W, 0)
    bg.addColorStop(0,    canColor)
    bg.addColorStop(0.22, labelColor)
    bg.addColorStop(0.78, labelColor)
    bg.addColorStop(1,    canColor)
    c.fillStyle = bg
    c.fillRect(0, 0, W, H)

    // Vertical highlight streak (left of center)
    const shine = c.createLinearGradient(W * 0.24, 0, W * 0.46, 0)
    shine.addColorStop(0,   'rgba(255,255,255,0)')
    shine.addColorStop(0.5, 'rgba(255,255,255,0.22)')
    shine.addColorStop(1,   'rgba(255,255,255,0)')
    c.fillStyle = shine
    c.fillRect(0, 0, W, H)

    // Second subtle highlight on right
    const shine2 = c.createLinearGradient(W * 0.62, 0, W * 0.78, 0)
    shine2.addColorStop(0,   'rgba(255,255,255,0)')
    shine2.addColorStop(0.5, 'rgba(255,255,255,0.08)')
    shine2.addColorStop(1,   'rgba(255,255,255,0)')
    c.fillStyle = shine2
    c.fillRect(0, 0, W, H)

    // Dark vignette edges
    const vig = c.createLinearGradient(0, 0, W, 0)
    vig.addColorStop(0,    'rgba(0,0,0,0.5)')
    vig.addColorStop(0.15, 'rgba(0,0,0,0)')
    vig.addColorStop(0.85, 'rgba(0,0,0,0)')
    vig.addColorStop(1,    'rgba(0,0,0,0.5)')
    c.fillStyle = vig
    c.fillRect(0, 0, W, H)

    // Top shoulder tint (metal-to-label transition)
    const topFade = c.createLinearGradient(0, 0, 0, H * 0.12)
    topFade.addColorStop(0, 'rgba(0,0,0,0.55)')
    topFade.addColorStop(1, 'rgba(0,0,0,0)')
    c.fillStyle = topFade
    c.fillRect(0, 0, W, H * 0.12)

    // Bottom fade to dark
    const botFade = c.createLinearGradient(0, H * 0.78, 0, H)
    botFade.addColorStop(0, 'rgba(0,0,0,0)')
    botFade.addColorStop(1, 'rgba(0,0,0,0.55)')
    c.fillStyle = botFade
    c.fillRect(0, H * 0.78, W, H * 0.22)

    // Accent stripe top
    c.fillStyle = accent
    c.fillRect(0, 0, W, 10)

    // Macro dark bar at bottom
    c.fillStyle = 'rgba(0,0,0,0.42)'
    c.fillRect(0, H * 0.8, W, H * 0.2)

    // NIRO wordmark — large, centered vertically upper half
    c.save()
    c.shadowColor = 'rgba(0,0,0,0.7)'
    c.shadowBlur  = 32
    c.fillStyle   = '#fff'
    c.font        = '900 230px "Arial Narrow",Arial,sans-serif'
    c.textAlign   = 'center'
    c.textBaseline = 'alphabetic'
    c.fillText('NIRO', W * 0.5, H * 0.42)
    c.restore()

    // Flavor name
    c.fillStyle = 'rgba(255,255,255,0.95)'
    c.font = 'bold 58px Arial,sans-serif'
    c.textAlign = 'center'
    c.textBaseline = 'alphabetic'
    c.fillText(name.toUpperCase(), W * 0.5, H * 0.60)

    // Tagline
    c.fillStyle = 'rgba(255,255,255,0.48)'
    c.font = '300 34px Arial,sans-serif'
    c.fillText(tagline.toUpperCase(), W * 0.5, H * 0.71)

    // Macro bar text
    c.fillStyle = 'rgba(255,255,255,0.92)'
    c.font = 'bold 30px Arial,sans-serif'
    c.fillText(
      `${nutrition?.protein ?? '20g'} PROTEIN  ·  ${nutrition?.caffeine ?? '150mg'} CAFFEINE`,
      W * 0.5, H * 0.92
    )

    const tex = new THREE.CanvasTexture(cv)
    tex.wrapS     = THREE.RepeatWrapping
    tex.anisotropy = 16
    return tex
  }, [flavorConfig?.id])

  useEffect(() => () => labelTex?.dispose(), [labelTex])

  /* ── Materials ─────────────────────────────────────────────────────────── */
  const metal = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#b8b8b8'),
    metalness: 0.96,
    roughness: 0.12,
    envMapIntensity: 2.0,
  }), [])

  // Slightly darker aluminum for bottom / top ends
  const metalDark = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#a0a0a0'),
    metalness: 0.98,
    roughness: 0.10,
    envMapIntensity: 1.6,
  }), [])

  const s = scale

  // Real 355 ml can proportions: H≈122mm, D≈66mm → ratio 1.85
  // In 3D units: radius 0.42, body height 1.62
  const R  = 0.42   // body radius
  const BH = 1.62   // body (label) height
  const BY = 0      // body center y
  // Bottom sits at y = -BH/2 = -0.81
  // Body top edge at y = +BH/2 = +0.81

  return (
    <group scale={[s, s, s]}>

      {/* ── Label cylinder (open) ──────────────────────────────────────────── */}
      <mesh castShadow position={[0, BY, 0]}>
        <cylinderGeometry args={[R, R, BH, 80, 1, true]} />
        <meshStandardMaterial
          map={labelTex}
          metalness={0.38}
          roughness={0.25}
          envMapIntensity={1.0}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* ── Bottom ─────────────────────────────────────────────────────────── */}
      {/* Outer rim ring */}
      <mesh position={[0, -0.815, 0]} material={metalDark} castShadow>
        <torusGeometry args={[R - 0.005, 0.018, 10, 80]} />
      </mesh>
      {/* Flat base disk */}
      <mesh position={[0, -0.813, 0]} rotation={[Math.PI, 0, 0]} castShadow material={metalDark}>
        <circleGeometry args={[R - 0.018, 64]} />
      </mesh>
      {/* Inner chime ring (concave base detail) */}
      <mesh position={[0, -0.79, 0]} material={metalDark} castShadow>
        <torusGeometry args={[0.26, 0.013, 6, 64]} />
      </mesh>

      {/* ── Bottom-to-body taper (slight pinch at base) ─────────────────── */}
      <mesh position={[0, -0.84, 0]} material={metalDark} castShadow>
        <cylinderGeometry args={[R, R - 0.012, 0.06, 80]} />
      </mesh>

      {/* ── Top shoulder — two-stage taper for realistic profile ──────────── */}
      {/* Lower shoulder — gentle start */}
      <mesh position={[0, 0.875, 0]} material={metal} castShadow>
        <cylinderGeometry args={[0.38, R, 0.09, 80]} />
      </mesh>
      {/* Upper shoulder — steeper neck taper */}
      <mesh position={[0, 0.955, 0]} material={metal} castShadow>
        <cylinderGeometry args={[0.315, 0.38, 0.10, 80]} />
      </mesh>

      {/* ── Neck ───────────────────────────────────────────────────────────── */}
      <mesh position={[0, 1.015, 0]} material={metal} castShadow>
        <cylinderGeometry args={[0.315, 0.315, 0.04, 80]} />
      </mesh>

      {/* ── Lid seam flange (real cans have a raised seam rim) ────────────── */}
      <mesh position={[0, 1.038, 0]} material={metalDark} castShadow>
        <torusGeometry args={[0.305, 0.017, 10, 80]} />
      </mesh>

      {/* ── Lid top face ───────────────────────────────────────────────────── */}
      <mesh position={[0, 1.046, 0]} castShadow material={metalDark}>
        <cylinderGeometry args={[0.295, 0.295, 0.008, 80]} />
      </mesh>

      {/* ── Pull tab base plate ────────────────────────────────────────────── */}
      <mesh position={[0.04, 1.053, 0.08]} rotation={[-0.12, 0, 0]} material={metal} castShadow>
        <boxGeometry args={[0.10, 0.008, 0.13]} />
      </mesh>
      {/* Pull tab lever arm */}
      <mesh position={[0.04, 1.063, 0.16]} rotation={[-0.35, 0, 0]} material={metal} castShadow>
        <boxGeometry args={[0.062, 0.010, 0.08]} />
      </mesh>
      {/* Pull tab ring */}
      <mesh position={[0.04, 1.068, 0.225]} rotation={[Math.PI / 2, 0, 0]} material={metal} castShadow>
        <torusGeometry args={[0.026, 0.008, 8, 24]} />
      </mesh>

    </group>
  )
}
