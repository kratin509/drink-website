import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useFlavorStore } from '../store/flavorStore'

const STREAM_COUNT = 12
const DROP_COUNT   = 20

export default function LiquidPour({ active }) {
  const groupRef  = useRef()
  const crownRef  = useRef()
  const dropsRef  = useRef([])
  const { activeFlavor } = useFlavorStore()
  const color = useMemo(() => new THREE.Color(activeFlavor.accent), [activeFlavor.accent])

  // Fixed random seed per drop so they don't re-randomize every frame
  const dropData = useMemo(() => Array.from({ length: DROP_COUNT }, (_, i) => {
    const angle  = (i / DROP_COUNT) * Math.PI * 2 + Math.random() * 0.5
    const radius = 0.18 + Math.random() * 0.55
    const height = 0.3  + Math.random() * 1.1
    const size   = 0.018 + Math.random() * 0.022
    return { angle, radius, height, size }
  }), [])

  useFrame((state) => {
    if (!groupRef.current || !active) return
    const t = state.clock.elapsedTime

    // Pulse the crown splash ring
    if (crownRef.current) {
      const pulse = 1 + Math.sin(t * 6) * 0.06
      crownRef.current.scale.set(pulse, 1, pulse)
    }

    // Animate each drop: bob up/down with individual phase offsets
    dropsRef.current.forEach((mesh, i) => {
      if (!mesh) return
      const { angle, radius, height } = dropData[i]
      const phase = (i / DROP_COUNT) * Math.PI * 2
      const yOffset = Math.sin(t * 3 + phase) * 0.12
      mesh.position.set(
        Math.cos(angle) * radius,
        height + yOffset,
        Math.sin(angle) * radius,
      )
      mesh.scale.setScalar(0.9 + Math.sin(t * 5 + phase) * 0.15)
    })
  })

  if (!active) return null

  // Anchored at the lid top (y ≈ 1.05 in CanMesh local space)
  return (
    <group ref={groupRef} position={[0, 1.05, 0]}>

      {/* ── 12 radial streams fanning outward ─────────────────────────────── */}
      {Array.from({ length: STREAM_COUNT }).map((_, i) => {
        const angle   = (i / STREAM_COUNT) * Math.PI * 2
        const tiltOut = 0.52   // lean angle from vertical (radians)
        const len     = 0.55 + (i % 3) * 0.08
        // Place each stream halfway along its length so it starts at the lid
        const cx = Math.sin(tiltOut) * Math.cos(angle) * len * 0.5
        const cy = Math.cos(tiltOut) * len * 0.5
        const cz = Math.sin(tiltOut) * Math.sin(angle) * len * 0.5
        return (
          <mesh
            key={i}
            position={[cx, cy, cz]}
            rotation={[
              -Math.cos(angle) * tiltOut,
               0,
               Math.sin(angle) * tiltOut,
            ]}
            castShadow
          >
            <cylinderGeometry args={[0.018, 0.032, len, 8]} />
            <meshStandardMaterial
              color={color}
              transparent
              opacity={0.78}
              roughness={0.08}
              metalness={0.1}
            />
          </mesh>
        )
      })}

      {/* ── Crown ring where streams originate ───────────────────────────── */}
      <mesh ref={crownRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.06, 0.18, 48]} />
        <meshStandardMaterial color={color} transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* ── Outer splash ring at stream tips ─────────────────────────────── */}
      <mesh position={[0, 0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.28, 0.52, 48]} />
        <meshStandardMaterial color={color} transparent opacity={0.28} side={THREE.DoubleSide} />
      </mesh>

      {/* ── Floating droplets ─────────────────────────────────────────────── */}
      {dropData.map((d, i) => (
        <mesh
          key={i}
          ref={el => { dropsRef.current[i] = el }}
          position={[
            Math.cos(d.angle) * d.radius,
            d.height,
            Math.sin(d.angle) * d.radius,
          ]}
        >
          <sphereGeometry args={[d.size, 6, 6]} />
          <meshStandardMaterial color={color} transparent opacity={0.72} roughness={0.1} />
        </mesh>
      ))}

    </group>
  )
}
