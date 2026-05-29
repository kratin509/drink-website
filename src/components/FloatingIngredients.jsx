import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { useFlavorStore } from '../store/flavorStore'

function IngredientBlob({ position, phase, scale, emoji }) {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.7 + phase) * 0.3
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5 + phase) * 0.2
    ref.current.rotation.y += 0.008
  })
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <sphereGeometry args={[0.18, 16, 16]} />
      <meshStandardMaterial color={new THREE.Color('#ff4455')} roughness={0.4} metalness={0.1} />
    </mesh>
  )
}

function ParticleField({ count = 60, active }) {
  const ref = useRef()
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 12
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6
    }
    return arr
  }, [count])

  useFrame((state) => {
    if (!ref.current || !active) return
    ref.current.rotation.y += 0.001
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#ffffff" transparent opacity={0.4} sizeAttenuation />
    </points>
  )
}

export default function FloatingIngredients({ active }) {
  const { activeFlavor } = useFlavorStore()

  const blobs = useMemo(
    () => [
      { position: [-2.5, 0.6, -1.5], phase: 0, scale: 1.2 },
      { position: [2.8, -0.3, -2], phase: 1.2, scale: 0.9 },
      { position: [-1.8, -1.4, -1], phase: 2.5, scale: 0.7 },
      { position: [3.2, 1.2, -2.5], phase: 0.7, scale: 1.1 },
      { position: [-3.5, 1.8, -3], phase: 3.1, scale: 0.6 },
      { position: [1.5, 2, -1.8], phase: 1.8, scale: 0.8 },
    ],
    []
  )

  if (!active) return null

  return (
    <group>
      {blobs.map((b, i) => (
        <IngredientBlob key={i} {...b} emoji={activeFlavor.emoji} />
      ))}
      <ParticleField active={active} />
    </group>
  )
}
