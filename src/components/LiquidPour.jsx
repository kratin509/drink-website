import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useFlavorStore } from '../store/flavorStore'

export default function LiquidPour({ active }) {
  const groupRef = useRef()
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

  return (
    <group ref={groupRef} position={[0, -0.7, 0]}>
      {/* Main stream */}
      <mesh ref={streamRef} position={[0, -0.6, 0]} scale={[1, 0, 1]}>
        <cylinderGeometry args={[0.04, 0.12, 1.2, 16]} />
        <meshStandardMaterial color={color} transparent opacity={0.85} roughness={0.1} />
      </mesh>

      {/* Splash pool */}
      <mesh ref={splashRef} position={[0, -1.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, 0.5, 32]} />
        <meshStandardMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* Droplets */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const r = 0.3 + Math.random() * 0.2
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * r, -1.5 - Math.random() * 0.3, Math.sin(angle) * r]}
          >
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial color={color} transparent opacity={0.7} />
          </mesh>
        )
      })}
    </group>
  )
}
