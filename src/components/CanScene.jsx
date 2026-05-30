import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CanMesh from './CanMesh'
import { FLAVORS } from '../constants/flavors'

gsap.registerPlugin(ScrollTrigger)

/*
 * Scroll waypoints: [x, y, rotX, rotY, scale]
 * One entry per section in page order:
 *   0 Hero → 1 Flavors → 2 Nutrition → 3 Social → 4 Portfolio → 5 CTA
 */
const WAYPOINTS = [
  [  1.20,  0.00,  0.05,  0.30, 1.15 ],  // Hero      – right-center, gentle tilt
  [  1.65, -0.18,  0.00,  1.40, 1.00 ],  // Flavors   – drift right, rotate
  [ -1.55,  0.12,  0.14, -0.65, 1.10 ],  // Nutrition – cross to left, back-label
  [  0.60, -0.25,  0.00,  2.30, 0.92 ],  // Social    – center-right, half-spin
  [ -0.85,  0.05,  0.00,  3.10, 0.96 ],  // Portfolio – cross left again
  [  0.10,  0.08, -0.44,  3.55, 1.02 ],  // CTA       – centre, pour tilt
]

function getTarget(progress) {
  const n = WAYPOINTS.length - 1
  const raw = Math.min(Math.max(progress, 0), 1) * n
  const i = Math.floor(raw)
  const t = raw - i
  const a = WAYPOINTS[Math.min(i, n)]
  const b = WAYPOINTS[Math.min(i + 1, n)]
  // smooth-step t for organic feel
  const s = t * t * (3 - 2 * t)
  return a.map((v, k) => v + (b[k] - v) * s)
}

const CanScene = forwardRef(({ scrollState }, ref) => {
  const mainRef     = useRef()
  const burstDone   = useRef(false)
  const scrollProg  = useRef(0)

  const mainTexture = useTexture('/niro-crimson-asset.png')
  mainTexture.wrapS = THREE.RepeatWrapping
  mainTexture.anisotropy = 16

  /* ── Master scroll → progress ──────────────────────────────────────────── */
  useEffect(() => {
    // Wait a tick for sections to mount
    const id = setTimeout(() => {
      const st = ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.4,
        onUpdate: self => { scrollProg.current = self.progress },
      })
      return () => st.kill()
    }, 100)
    return () => clearTimeout(id)
  }, [])

  /* ── Expose burst trigger to App ────────────────────────────────────────── */
  useImperativeHandle(ref, () => ({
    triggerBurst(onComplete) {
      const main = mainRef.current
      if (!main) { onComplete?.(); return }

      const tl = gsap.timeline({
        onComplete: () => { burstDone.current = true; onComplete?.() },
      })

      // Cinematic zoom toward camera → elastic settle
      tl.to(main.scale,    { x: 2.8, y: 2.8, z: 2.8, duration: 0.38, ease: 'expo.out' }, 0)
      tl.to(main.position, { z: 1.5,          duration: 0.38, ease: 'expo.out' }, 0)
      tl.to(main.scale,    { x: 1,   y: 1,   z: 1,   duration: 0.58, ease: 'back.out(2.2)' }, 0.38)
      tl.to(main.position, { x: WAYPOINTS[0][0], y: WAYPOINTS[0][1], z: 0, duration: 0.58, ease: 'back.out(2.2)' }, 0.38)
    },
  }))

  /* ── Per-frame: lerp can toward scroll-driven target ───────────────────── */
  useFrame((_, delta) => {
    const main = mainRef.current
    if (!main) return

    // Pre-burst: idle spin so something moves during preloader
    if (!burstDone.current) {
      main.rotation.y += delta * 0.5
      return
    }

    const [tx, ty, trx, try_, ts] = getTarget(scrollProg.current)
    const k = 1 - Math.pow(0.018, delta)   // frame-rate-independent lerp coeff

    main.position.x  = THREE.MathUtils.lerp(main.position.x, tx,  k * 1.2)
    main.position.y  = THREE.MathUtils.lerp(main.position.y, ty,  k * 1.2)
    main.position.z  = THREE.MathUtils.lerp(main.position.z, 0,   k)
    main.rotation.x  = THREE.MathUtils.lerp(main.rotation.x, trx, k)
    main.rotation.y  = THREE.MathUtils.lerp(main.rotation.y, try_, k * 0.55)
    main.scale.setScalar(THREE.MathUtils.lerp(main.scale.x, ts, k))
  })

  return (
    <group ref={mainRef} scale={[0, 0, 0]}>
      <CanMesh externalTexture={mainTexture} flavorConfig={FLAVORS[0]} />
    </group>
  )
})

CanScene.displayName = 'CanScene'
export default CanScene
