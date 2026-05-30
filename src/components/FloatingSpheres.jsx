import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useFlavorStore } from '../store/flavorStore'

const SPHERES = [
  { pos: [ 1.1,  1.4, -1.0], r: 0.10, speed: 0.7,  phase: 0.0, amp: 0.18 },
  { pos: [ 2.8,  1.1, -1.6], r: 0.09, speed: 1.1,  phase: 1.2, amp: 0.22 },
  { pos: [ 3.5,  0.2, -1.2], r: 0.13, speed: 0.55, phase: 2.1, amp: 0.15 },
  { pos: [ 3.2, -0.8, -1.4], r: 0.10, speed: 0.9,  phase: 0.8, amp: 0.20 },
  { pos: [ 1.4, -1.2, -0.8], r: 0.07, speed: 1.3,  phase: 3.0, amp: 0.12 },
  { pos: [ 2.2,  0.5, -2.0], r: 0.11, speed: 0.65, phase: 1.7, amp: 0.16 },
]

export default function FloatingSpheres() {
  const refs = useRef([])
  const { activeFlavor } = useFlavorStore()
  const color = useMemo(() => new THREE.Color(activeFlavor.accent), [activeFlavor.accent])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    refs.current.forEach((mesh, i) => {
      if (!mesh) return
      const s = SPHERES[i]
      mesh.position.y = s.pos[1] + Math.sin(t * s.speed + s.phase) * s.amp
      // subtle drift on x too
      mesh.position.x = s.pos[0] + Math.sin(t * s.speed * 0.4 + s.phase) * 0.06
    })
  })

  return (
    <>
      {SPHERES.map((s, i) => (
        <mesh key={i} ref={el => { refs.current[i] = el }} position={s.pos} castShadow>
          <sphereGeometry args={[s.r, 32, 32]} />
          <meshStandardMaterial
            color={color}
            metalness={0.1}
            roughness={0.18}
            envMapIntensity={1.4}
          />
        </mesh>
      ))}
    </>
  )
}
