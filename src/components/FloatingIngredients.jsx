import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useFlavorStore } from '../store/flavorStore'

// Procedural icosahedron "chunk" – looks like cacao/berry fragment
function Chunk({ position, scale, color, phase, zSpeed, scrollProgress }) {
  const ref = useRef()
  const baseZ = position[2]

  useFrame((state, delta) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.rotation.x += delta * 0.45 * Math.sin(phase)
    ref.current.rotation.y += delta * 0.6
    ref.current.rotation.z += delta * 0.3 * Math.cos(phase)
    ref.current.position.y = position[1] + Math.sin(t * 0.6 + phase) * 0.22
    // Parallax fly-past: each chunk has own z-speed relative to scroll
    ref.current.position.z = baseZ + scrollProgress * zSpeed
  })

  return (
    <mesh ref={ref} position={position} scale={scale} castShadow>
      <icosahedronGeometry args={[0.14, 0]} />
      <meshStandardMaterial
        color={new THREE.Color(color)}
        roughness={0.55}
        metalness={0.1}
        flatShading
      />
    </mesh>
  )
}

function Sphere({ position, radius, color, phase, zSpeed, scrollProgress }) {
  const ref = useRef()
  const baseZ = position[2]

  useFrame((state, delta) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.rotation.y += delta * 0.4
    ref.current.position.y = position[1] + Math.sin(t * 0.5 + phase) * 0.18
    ref.current.position.z = baseZ + scrollProgress * zSpeed
  })

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[radius, 18, 18]} />
      <meshStandardMaterial color={new THREE.Color(color)} roughness={0.3} metalness={0.05} />
    </mesh>
  )
}

function ParticleCloud({ count = 80, active }) {
  const ref = useRef()
  const geo = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 14
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9
      positions[i * 3 + 2] = (Math.random() - 0.5) * 7
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return g
  }, [count])

  useFrame((state, delta) => {
    if (!ref.current || !active) return
    ref.current.rotation.y += delta * 0.006
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.04
  })

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.035} color="#ffffff" transparent opacity={0.35} sizeAttenuation />
    </points>
  )
}

export default function FloatingIngredients({ active, scrollProgress = 0 }) {
  const { activeFlavor } = useFlavorStore()
  const ac = activeFlavor.accent

  const chunks = useMemo(
    () => [
      { position: [-2.8, 0.7,  -1.8], scale: 1.3, color: ac, phase: 0,   zSpeed: 2.5 },
      { position: [3.1, -0.4,  -2.4], scale: 0.9, color: ac, phase: 1.2, zSpeed: 3.2 },
      { position: [-1.9, -1.2, -1.1], scale: 0.7, color: '#ffffff', phase: 2.5, zSpeed: 1.8 },
      { position: [3.4,  1.3,  -3.0], scale: 1.1, color: ac, phase: 0.7, zSpeed: 4.0 },
      { position: [-3.6, 1.9,  -3.5], scale: 0.6, color: '#ffffff', phase: 3.1, zSpeed: 4.8 },
      { position: [1.6,  2.1,  -2.0], scale: 0.8, color: ac, phase: 1.8, zSpeed: 2.1 },
      { position: [-0.9, -2.0, -1.5], scale: 1.0, color: '#ffffff', phase: 0.4, zSpeed: 3.5 },
      { position: [2.2, -1.8,  -2.8], scale: 0.65,color: ac, phase: 2.2, zSpeed: 4.2 },
    ],
    [ac]
  )

  const spheres = useMemo(
    () => [
      { position: [-2.2, 0.3,  -0.9], radius: 0.12, color: ac, phase: 0.3, zSpeed: 1.6 },
      { position: [2.6,  0.8,  -1.4], radius: 0.09, color: ac, phase: 1.7, zSpeed: 2.8 },
      { position: [-3.1, -0.9, -2.1], radius: 0.14, color: ac, phase: 0.9, zSpeed: 3.6 },
      { position: [1.0,  1.6,  -1.2], radius: 0.10, color: '#ffffff', phase: 2.0, zSpeed: 2.2 },
    ],
    [ac]
  )

  if (!active) return null

  return (
    <group>
      {chunks.map((p, i) => (
        <Chunk key={i} {...p} scrollProgress={scrollProgress} />
      ))}
      {spheres.map((p, i) => (
        <Sphere key={i} {...p} scrollProgress={scrollProgress} />
      ))}
      <ParticleCloud active={active} />
    </group>
  )
}
