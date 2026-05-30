import { useRef, forwardRef, useImperativeHandle } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import CanMesh from './CanMesh'
import FloatingIngredients from './FloatingIngredients'
import LiquidPour from './LiquidPour'
import { useFlavorStore } from '../store/flavorStore'
import { FLAVORS } from '../constants/flavors'

/* ── Satellite can configs (flavor variant + fan position) ──────────────── */
const SAT_CFG = [
  { flavor: FLAVORS[2], target: [-4.1, 0.05,  -0.9],  scale: 0.76 },  // Citrus – far left
  { flavor: FLAVORS[1], target: [-2.15, 0.28, -0.38], scale: 0.85 },  // Chocolate – mid-left
  { flavor: FLAVORS[0], target: [ 2.15, 0.28, -0.38], scale: 0.85 },  // Berry – mid-right
  { flavor: FLAVORS[2], target: [ 4.1, 0.05,  -0.9],  scale: 0.76 },  // Citrus – far right
]

/* ── Per-section can targets ─────────────────────────────────────────────── */
const T = {
  heroX:  1.25,
  flavX:  0,
  nutX:   1.1,
  ctaX:   0,
}

const CanScene = forwardRef(({ scrollState }, ref) => {
  const mainRef = useRef()
  const satRefs = useRef([null, null, null, null])
  const burstDone   = useRef(false)
  const satBaseY    = useRef(SAT_CFG.map(c => c.target[1]))

  const { activeFlavor } = useFlavorStore()

  /* ── Load real PNG label from /public ─────────────────────────────────── */
  const mainTexture = useTexture('/niro-crimson-asset.png')
  mainTexture.wrapS = THREE.RepeatWrapping
  mainTexture.anisotropy = 16

  /* ── Expose triggerBurst() to App via forwardRef ───────────────────────── */
  useImperativeHandle(ref, () => ({
    triggerBurst(onComplete) {
      const main = mainRef.current
      if (!main) { onComplete?.(); return }

      // Reset all satellites to behind-center, invisible
      satRefs.current.forEach(r => {
        if (!r) return
        r.position.set(0, 0, -4)
        r.scale.setScalar(0)
        r.rotation.set(0, 0, 0)
      })

      const tl = gsap.timeline({
        onComplete: () => { burstDone.current = true; onComplete?.() },
      })

      /* Main can — cinematic ZOOM toward camera ───────────────────────── */
      // Step 1: explode forward (scale up + z toward camera)
      tl.to(main.scale,    { x: 2.7, y: 2.7, z: 2.7, duration: 0.36, ease: 'expo.out' },  0)
      tl.to(main.position, { z: 1.4,          duration: 0.36, ease: 'expo.out' },           0)
      // Step 2: snap back with elastic rebound
      tl.to(main.scale,    { x: 1,   y: 1,   z: 1,   duration: 0.55, ease: 'back.out(2.4)' }, 0.36)
      tl.to(main.position, { z: 0,            duration: 0.55, ease: 'back.out(2.4)' },          0.36)

      /* Satellite cans — elastic fan-out ─────────────────────────────── */
      SAT_CFG.forEach((cfg, i) => {
        const r = satRefs.current[i]
        if (!r) return
        const d = 0.50 + i * 0.042   // staggered start time
        tl.to(r.scale, {
          x: 1, y: 1, z: 1,
          duration: 0.75, ease: 'elastic.out(1, 0.75)',
        }, d)
        tl.to(r.position, {
          x: cfg.target[0], y: cfg.target[1], z: cfg.target[2],
          duration: 0.80, ease: 'elastic.out(1, 0.75)',
        }, d)
        tl.to(r.rotation, {
          y: Math.PI * 2, duration: 0.80, ease: 'power3.out',
        }, d)
      })

      // Settle main can into hero position after burst
      tl.to(main.position, { x: T.heroX, duration: 0.48, ease: 'power2.inOut' }, 0.92)
    },
  }))

  /* ── Per-frame scroll-driven animation ──────────────────────────────────── */
  useFrame((state, delta) => {
    const main = mainRef.current
    if (!main) return
    const t = state.clock.elapsedTime

    // Pre-burst idle spin so something moves while loading
    if (!burstDone.current) {
      main.rotation.y += delta * 0.55
      return
    }

    const { section, progress } = scrollState

    /* Section 0 — Hero: float right-of-center ─────────────────────────── */
    if (section === 0) {
      main.rotation.y += delta * 0.35
      main.position.x  = THREE.MathUtils.lerp(main.position.x,  T.heroX, 0.055)
      main.position.y  = Math.sin(t * 0.72) * 0.09
      main.position.z  = THREE.MathUtils.lerp(main.position.z,  0, 0.05)
      main.scale.setScalar(THREE.MathUtils.lerp(main.scale.x,   1, 0.05))
    }

    /* Section 1 — Flavors: sweep + spin Y+Z ───────────────────────────── */
    if (section === 1) {
      const sweep = (progress - 0.5) * 3.4
      main.position.x = THREE.MathUtils.lerp(main.position.x, sweep, 0.058)
      main.position.y = THREE.MathUtils.lerp(main.position.y, Math.sin(progress * Math.PI) * 0.48, 0.06)
      main.rotation.y += delta * 2.9
      main.rotation.z  = THREE.MathUtils.lerp(main.rotation.z, Math.sin(progress * Math.PI) * 0.3, 0.06)
      main.scale.setScalar(THREE.MathUtils.lerp(main.scale.x, 1, 0.05))
    }

    /* Section 2 — Nutrition: back-label lock, shift right, zoom ─────── */
    if (section === 2) {
      main.rotation.y  = THREE.MathUtils.lerp(main.rotation.y, Math.PI, 0.046)
      main.rotation.z  = THREE.MathUtils.lerp(main.rotation.z, 0,       0.05)
      main.position.x  = THREE.MathUtils.lerp(main.position.x, T.nutX,  0.052)
      main.position.y  = THREE.MathUtils.lerp(main.position.y, 0,       0.05)
      main.scale.setScalar(THREE.MathUtils.lerp(main.scale.x, 1.38, 0.04))
    }

    /* Section 3 — CTA / Portfolio: center, tilt forward ──────────────── */
    if (section >= 3) {
      main.position.x  = THREE.MathUtils.lerp(main.position.x, T.ctaX, 0.05)
      main.position.y  = THREE.MathUtils.lerp(main.position.y, 0.32,   0.05)
      main.rotation.x  = THREE.MathUtils.lerp(main.rotation.x, -0.46,  0.04)
      main.scale.setScalar(THREE.MathUtils.lerp(main.scale.x, 1.06, 0.04))
    }

    // Global resets
    if (section !== 2 && section < 3)
      main.scale.setScalar(THREE.MathUtils.lerp(main.scale.x, 1, 0.04))
    if (section < 3)
      main.rotation.x = THREE.MathUtils.lerp(main.rotation.x, 0, 0.04)
    if (section !== 1 && section !== 2)
      main.rotation.z = THREE.MathUtils.lerp(main.rotation.z, 0, 0.05)

    /* Satellite ambient float ─────────────────────────────────────────── */
    satRefs.current.forEach((r, i) => {
      if (!r || r.scale.x < 0.05) return
      r.rotation.y += delta * (0.26 + i * 0.075)
      r.rotation.x  = Math.sin(t * 0.38 + i) * 0.05
      r.position.y   = satBaseY.current[i] + Math.sin(t * 0.62 + i * 1.5) * 0.09
    })
  })

  return (
    <group>
      {/* ── Main can (PNG texture from public asset) ─────────────────── */}
      <group ref={mainRef} scale={[0, 0, 0]}>
        <CanMesh externalTexture={mainTexture} flavorConfig={FLAVORS[0]} />
      </group>

      {/* ── 4 satellite cans (canvas-generated flavor labels) ──────────── */}
      {SAT_CFG.map((cfg, i) => (
        <group
          key={i}
          ref={el => (satRefs.current[i] = el)}
          position={[0, 0, -4]}
          scale={[0, 0, 0]}
        >
          <CanMesh flavorConfig={cfg.flavor} scale={cfg.scale} />
        </group>
      ))}

      <FloatingIngredients
        active={scrollState.section === 1}
        scrollProgress={scrollState.raw}
      />
      <LiquidPour active={scrollState.section >= 3} />
    </group>
  )
})

CanScene.displayName = 'CanScene'
export default CanScene
