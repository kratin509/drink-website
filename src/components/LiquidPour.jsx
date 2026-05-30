import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useFlavorStore } from '../store/flavorStore'

export default function LiquidPour({ active }) {
  const groupRef  = useRef()
  const streamRef = useRef()
  const splashRef = useRef()
  const { activeFlavor } = useFlavorStore()

  const color = new THREE.Color(activeFlavor.accent)

  useFrame((state) => {
    if (!groupRef.current || !active) return
    const t = state.clock.elapsedTime
    if (streamRef.current) {
      streamRef.current.scale.y = THREE.MathUtils.lerp(streamRef.current.scale.y, 1, 0.06)
    }
    if (splashRef.current) {
      splashRef.current.scale.setScalar(1 + Math.sin(t * 8) * 0.05)
      splashRef.current.rotation.y += 0.04
    }
  })

  if (!active) return null

  // Positioned relative to can top (lid is at y ≈ +0.95 in CanMesh local space)
  // Stream pours upward from the lid; splash and droplets settle above
  return (
    <group ref={groupRef} position={[0, 0.95, 0]}>
      {/* Main stream — pours upward */}
      <mesh ref={streamRef} position={[0, 0.7, 0]} scale={[1, 0, 1]}>
        <cylinderGeometry args={[0.04, 0.09, 1.4, 16]} />
        <meshStandardMaterial color={color} transparent opacity={0.85} roughness={0.1} />
      </mesh>

      {/* Splash ring at the top of the stream */}
      <mesh ref={splashRef} position={[0, 1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, 0.42, 32]} />
        <meshStandardMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* Droplets fanning out from top */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const r = 0.28 + (i % 3) * 0.1
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * r, 1.55 + (i % 4) * 0.08, Math.sin(angle) * r]}
          >
            <sphereGeometry args={[0.022, 8, 8]} />
            <meshStandardMaterial color={color} transparent opacity={0.7} />
          </mesh>
        )
      })}
    </group>
  )
}
