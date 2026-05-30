import { useRef, forwardRef, useImperativeHandle } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import CanMesh from './CanMesh'
import LiquidPour from './LiquidPour'
import FloatingSpheres from './FloatingSpheres'
import { useFlavorStore } from '../store/flavorStore'

const CanScene = forwardRef(({ scrollState }, ref) => {
  const mainRef   = useRef()
  const burstDone = useRef(false)
  const { activeFlavor } = useFlavorStore()

  /* Expose triggerBurst() to App root */
  useImperativeHandle(ref, () => ({
    triggerBurst(onComplete) {
      const main = mainRef.current
      if (!main) { onComplete?.(); return }

      const tl = gsap.timeline({
        onComplete: () => { burstDone.current = true; onComplete?.() },
      })

      // Zoom toward camera → elastic settle into hero position (already inverted)
      tl.to(main.scale,    { x: 2.6, y: 2.6, z: 2.6, duration: 0.38, ease: 'expo.out' }, 0)
      tl.to(main.position, { z: 1.4,          duration: 0.38, ease: 'expo.out' }, 0)
      tl.to(main.scale,    { x: 1,   y: 1,   z: 1,   duration: 0.58, ease: 'back.out(2.2)' }, 0.38)
      tl.to(main.position, { x: 1.85, z: 0,  duration: 0.58, ease: 'back.out(2.2)' }, 0.38)
      // Settle into upside-down tilt
      tl.to(main.rotation, { x: Math.PI, z: 0.52, duration: 0.58, ease: 'back.out(2.2)' }, 0.38)
    },
  }))

  useFrame((state, delta) => {
    const main = mainRef.current
    if (!main) return
    const t = state.clock.elapsedTime

    if (!burstDone.current) {
      main.rotation.y += delta * 0.55
      return
    }

    const { section = 0, progress = 0 } = scrollState ?? {}

    /* Section 0 — Hero: upside-down tilt, slow spin, right side float */
    if (section === 0) {
      main.rotation.y += delta * 0.3
      main.rotation.x  = THREE.MathUtils.lerp(main.rotation.x, Math.PI, 0.04)
      main.rotation.z  = THREE.MathUtils.lerp(main.rotation.z, 0.52,    0.04)
      main.position.x  = THREE.MathUtils.lerp(main.position.x, 1.85,    0.055)
      main.position.y  = Math.sin(t * 0.7) * 0.12
      main.position.z  = THREE.MathUtils.lerp(main.position.z, 0,       0.05)
      main.scale.setScalar(THREE.MathUtils.lerp(main.scale.x,  1,       0.05))
    }

    /* Section 1 — Flavors: keep inverted tilt, fast spin */
    if (section === 1) {
      const floatX = 1.85 - Math.sin(progress * Math.PI) * 0.25
      main.position.x  = THREE.MathUtils.lerp(main.position.x, floatX, 0.055)
      main.position.y  = THREE.MathUtils.lerp(main.position.y, Math.sin(progress * Math.PI) * 0.28, 0.06)
      main.rotation.y += delta * 2.8
      main.rotation.x  = THREE.MathUtils.lerp(main.rotation.x, Math.PI, 0.04)
      main.rotation.z  = THREE.MathUtils.lerp(main.rotation.z, Math.sin(progress * Math.PI) * 0.22, 0.06)
      main.scale.setScalar(THREE.MathUtils.lerp(main.scale.x, 1, 0.05))
    }

    /* Section 2 — Nutrition: upright, back-label, shift right, zoom */
    if (section === 2) {
      main.rotation.x  = THREE.MathUtils.lerp(main.rotation.x, 0,       0.046)
      main.rotation.y  = THREE.MathUtils.lerp(main.rotation.y, Math.PI, 0.046)
      main.rotation.z  = THREE.MathUtils.lerp(main.rotation.z, 0,       0.05)
      main.position.x  = THREE.MathUtils.lerp(main.position.x, 1.75,    0.052)
      main.position.y  = THREE.MathUtils.lerp(main.position.y, 0,       0.05)
      main.scale.setScalar(THREE.MathUtils.lerp(main.scale.x, 1.38, 0.04))
    }

    /* Section 3+ — CTA: upright, far right, pour splash */
    if (section >= 3) {
      main.rotation.x  = THREE.MathUtils.lerp(main.rotation.x, 0,   0.04)
      main.rotation.z  = THREE.MathUtils.lerp(main.rotation.z, 0,   0.04)
      main.position.x  = THREE.MathUtils.lerp(main.position.x, 2.6, 0.05)
      main.position.y  = THREE.MathUtils.lerp(main.position.y, 0,   0.05)
      main.scale.setScalar(THREE.MathUtils.lerp(main.scale.x, 1.1, 0.04))
    }

    // Scale reset for non-zoomed sections
    if (section !== 2 && section < 3)
      main.scale.setScalar(THREE.MathUtils.lerp(main.scale.x, 1, 0.04))
  })

  const section = scrollState?.section ?? 0

  return (
    <>
      <group ref={mainRef} scale={[0, 0, 0]}>
        <CanMesh flavorConfig={activeFlavor} />
        <LiquidPour active={section >= 4} />
      </group>
      <FloatingSpheres />
    </>
  )
})

CanScene.displayName = 'CanScene'
export default CanScene
