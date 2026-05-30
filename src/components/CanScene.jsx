import { useRef, forwardRef, useImperativeHandle, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import CanMesh from './CanMesh'
import FloatingIngredients from './FloatingIngredients'
import LiquidPour from './LiquidPour'
import { useFlavorStore } from '../store/flavorStore'
import { FLAVORS } from '../constants/flavors'

// Fan-out positions for 4 satellite cans
const SAT_CFG = [
  { flavor: FLAVORS[2], target: [-4.0, 0.1, -0.9], scale: 0.78 },
  { flavor: FLAVORS[1], target: [-2.1, 0.3, -0.4], scale: 0.86 },
  { flavor: FLAVORS[0], target: [2.1, 0.3, -0.4],  scale: 0.86 },
  { flavor: FLAVORS[2], target: [4.0, 0.1, -0.9],  scale: 0.78 },
]

// Per-section target states for the main can
const HERO_POS       = new THREE.Vector3(1.3, 0, 0)
const FLAVOR_POS_MID = new THREE.Vector3(0, 0.25, 0)
const NUTRITION_POS  = new THREE.Vector3(1.05, 0, 0)
const CTA_POS        = new THREE.Vector3(0, 0.35, 0)

const CanScene = forwardRef(({ scrollState }, ref) => {
  const mainRef = useRef()
  const satRefs = useRef([null, null, null, null])
  const burstDone = useRef(false)
  const satFloatBase = useRef(SAT_CFG.map(c => ({ ...c.target })))
  const { activeFlavor } = useFlavorStore()

  // Expose triggerBurst to parent (App via WebGLCanvas)
  useImperativeHandle(ref, () => ({
    triggerBurst(onComplete) {
      const main = mainRef.current
      if (!main) { onComplete?.(); return }

      // Init satellites: stacked at origin, invisible
      satRefs.current.forEach(r => {
        if (!r) return
        r.position.set(0, 0, -3.5)
        r.scale.setScalar(0)
        r.rotation.y = 0
      })

      const tl = gsap.timeline({
        onComplete: () => {
          burstDone.current = true
          onComplete?.()
        },
      })

      // ── Main can: cinematic zoom forward ──────────────────────
      tl.to(main.scale,    { x: 2.6, y: 2.6, z: 2.6, duration: 0.38, ease: 'expo.out' }, 0)
      tl.to(main.position, { z: 1.2,          duration: 0.38, ease: 'expo.out' }, 0)
      tl.to(main.scale,    { x: 1,   y: 1,   z: 1,   duration: 0.52, ease: 'back.out(2.2)' }, 0.38)
      tl.to(main.position, { z: 0,            duration: 0.52, ease: 'back.out(2.2)' }, 0.38)

      // ── Satellites: burst from behind with elastic fan ────────
      SAT_CFG.forEach((cfg, i) => {
        const r = satRefs.current[i]
        if (!r) return
        const delay = 0.48 + i * 0.045
        tl.to(r.scale, {
          x: 1, y: 1, z: 1,
          duration: 0.72, ease: 'elastic.out(1, 0.72)',
        }, delay)
        tl.to(r.position, {
          x: cfg.target[0], y: cfg.target[1], z: cfg.target[2],
          duration: 0.78, ease: 'elastic.out(1, 0.72)',
        }, delay)
        tl.to(r.rotation, {
          y: Math.PI * 2,
          duration: 0.78, ease: 'power3.out',
        }, delay)
      })

      // Nudge main can right after burst settles
      tl.to(main.position, { x: HERO_POS.x, duration: 0.5, ease: 'power2.inOut' }, 0.9)
    },
  }))

  useFrame((state, delta) => {
    const main = mainRef.current
    if (!main) return

    // ── Pre-burst: idle rotation so something moves ──────────
    if (!burstDone.current) {
      main.rotation.y += delta * 0.6
      return
    }

    const { section, progress } = scrollState
    const t = state.clock.elapsedTime

    // ── Main can section states ──────────────────────────────
    if (section === 0) {
      // Hero: float right-of-center
      main.rotation.y += delta * 0.38
      main.position.x = THREE.MathUtils.lerp(main.position.x, HERO_POS.x, 0.05)
      main.position.y = Math.sin(t * 0.75) * 0.09
      main.position.z = THREE.MathUtils.lerp(main.position.z, 0, 0.05)
      main.scale.setScalar(THREE.MathUtils.lerp(main.scale.x, 1, 0.05))
    }

    if (section === 1) {
      // Flavors: sweep across screen, spin Y+Z
      const px = (progress - 0.5) * 3.2
      main.position.x = THREE.MathUtils.lerp(main.position.x, px, 0.055)
      main.position.y = THREE.MathUtils.lerp(main.position.y, Math.sin(progress * Math.PI) * 0.45, 0.055)
      main.rotation.y += delta * 2.8
      main.rotation.z = THREE.MathUtils.lerp(main.rotation.z, Math.sin(progress * Math.PI) * 0.28, 0.06)
      main.scale.setScalar(THREE.MathUtils.lerp(main.scale.x, 1, 0.05))
    }

    if (section === 2) {
      // Nutrition: can spins to back label, shifts right, zooms
      main.rotation.y = THREE.MathUtils.lerp(main.rotation.y, Math.PI, 0.045)
      main.position.x = THREE.MathUtils.lerp(main.position.x, NUTRITION_POS.x, 0.05)
      main.position.y = THREE.MathUtils.lerp(main.position.y, 0, 0.05)
      main.rotation.z = THREE.MathUtils.lerp(main.rotation.z, 0, 0.05)
      main.scale.setScalar(THREE.MathUtils.lerp(main.scale.x, 1.4, 0.04))
    }

    if (section === 3) {
      // CTA: center, tilt forward, pour
      main.position.x = THREE.MathUtils.lerp(main.position.x, CTA_POS.x, 0.05)
      main.position.y = THREE.MathUtils.lerp(main.position.y, CTA_POS.y, 0.05)
      main.rotation.x = THREE.MathUtils.lerp(main.rotation.x, -0.48, 0.04)
      main.scale.setScalar(THREE.MathUtils.lerp(main.scale.x, 1.08, 0.04))
    }

    // Reset x-rotation outside CTA
    if (section !== 3) {
      main.rotation.x = THREE.MathUtils.lerp(main.rotation.x, 0, 0.04)
    }
    // Reset z-rotation outside flavors
    if (section !== 1 && section !== 2) {
      main.rotation.z = THREE.MathUtils.lerp(main.rotation.z, 0, 0.05)
    }
    // Reset scale outside nutrition/CTA
    if (section !== 2 && section !== 3) {
      main.scale.setScalar(THREE.MathUtils.lerp(main.scale.x, 1, 0.04))
    }

    // ── Satellites: gentle ambient float after burst ──────────
    satRefs.current.forEach((r, i) => {
      if (!r || r.scale.x < 0.05) return
      r.rotation.y += delta * (0.28 + i * 0.07)
      r.rotation.x = Math.sin(t * 0.4 + i) * 0.06
      r.position.y = satFloatBase.current[i].y + Math.sin(t * 0.65 + i * 1.4) * 0.09
    })
  })

  return (
    <group>
      {/* Main can – starts hidden, burst reveals it */}
      <group ref={mainRef} scale={[0, 0, 0]}>
        <CanMesh flavorConfig={activeFlavor} />
      </group>

      {/* Satellite cans */}
      {SAT_CFG.map((cfg, i) => (
        <group
          key={i}
          ref={el => (satRefs.current[i] = el)}
          position={[0, 0, -3.5]}
          scale={[0, 0, 0]}
        >
          <CanMesh flavorConfig={cfg.flavor} scale={cfg.scale} />
        </group>
      ))}

      <FloatingIngredients active={scrollState.section === 1} scrollProgress={scrollState.raw} />
      <LiquidPour active={scrollState.section === 3} />
    </group>
  )
})

CanScene.displayName = 'CanScene'
export default CanScene
