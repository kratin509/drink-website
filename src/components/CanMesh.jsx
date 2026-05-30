import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useFlavorStore } from '../store/flavorStore'

export default function CanMesh({ scrollState }) {
  const groupRef = useRef()
  const topRef = useRef()
  const bottomRef = useRef()
  const bodyRef = useRef()
  const labelRef = useRef()
  const { activeFlavor } = useFlavorStore()

  const labelTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 512
    const ctx = canvas.getContext('2d')

    // Base gradient
    const grad = ctx.createLinearGradient(0, 0, 1024, 0)
    grad.addColorStop(0, activeFlavor.canColor)
    grad.addColorStop(0.5, activeFlavor.labelColor)
    grad.addColorStop(1, activeFlavor.canColor)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 1024, 512)

    // Brand name
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 160px "Arial Narrow", Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('NIRO', 512, 180)

    // Flavor name
    ctx.font = 'bold 52px Arial'
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    ctx.fillText(activeFlavor.name.toUpperCase(), 512, 280)

    // Tagline
    ctx.font = '36px Arial'
    ctx.fillStyle = 'rgba(255,255,255,0.55)'
    ctx.fillText(activeFlavor.tagline.toUpperCase(), 512, 340)

    // Macro strip
    ctx.fillStyle = 'rgba(0,0,0,0.3)'
    ctx.fillRect(0, 400, 1024, 80)
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.font = 'bold 36px Arial'
    ctx.fillText('20G PROTEIN · 150MG CAFFEINE · ZERO SUGAR', 512, 445)

    // Decorative lines
    ctx.strokeStyle = 'rgba(255,255,255,0.25)'
    ctx.lineWidth = 2
    for (let x = 0; x < 1024; x += 40) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, 512)
      ctx.stroke()
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.anisotropy = 16
    return texture
  }, [activeFlavor])

  // Metal cap material
  const metalMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#c0c0c0'),
        metalness: 0.9,
        roughness: 0.2,
        envMapIntensity: 1.2,
      }),
    []
  )

  useFrame((state, delta) => {
    if (!groupRef.current) return
    const { section, progress } = scrollState

    // Hero: sit right-of-center, gentle float + slow spin
    if (section === 0) {
      groupRef.current.rotation.y += delta * 0.35
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, 1.4, 0.04)
    }

    // Flavors: sweep left→right across screen with full spin
    if (section === 1) {
      const p = progress
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        (p - 0.5) * 3.0,
        0.06
      )
      groupRef.current.rotation.y += delta * 2.5
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        Math.sin(p * Math.PI) * 0.25,
        0.05
      )
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        Math.sin(p * Math.PI) * 0.35,
        0.05
      )
    }

    // Nutrition: shift right, spin to back, gentle zoom
    if (section === 2) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        Math.PI * 1.0,
        0.04
      )
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        1.1,
        0.05
      )
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, 0.05)
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, 1.35, 0.04))
    }

    // CTA: center, tilt toward user, pour
    if (section === 3) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -0.45, 0.04)
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, 0, 0.04)
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0.4, 0.04)
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, 1.05, 0.04))
    }

    if (section !== 2 && section !== 3) {
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, 1, 0.04))
    }
    if (section !== 3) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.04)
    }
  })

  return (
    <group ref={groupRef}>
      {/* Can body */}
      <mesh ref={bodyRef} castShadow>
        <cylinderGeometry args={[0.42, 0.42, 1.4, 64, 1, true]} />
        <meshStandardMaterial
          map={labelTexture}
          metalness={0.6}
          roughness={0.25}
          envMapIntensity={1}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Top cap */}
      <mesh ref={topRef} position={[0, 0.7, 0]} castShadow material={metalMat}>
        <cylinderGeometry args={[0.38, 0.42, 0.08, 64]} />
      </mesh>

      {/* Top dome */}
      <mesh position={[0, 0.75, 0]} material={metalMat}>
        <sphereGeometry args={[0.38, 64, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>

      {/* Pull tab */}
      <mesh position={[0, 0.82, 0.2]} rotation={[0.4, 0, 0]} material={metalMat}>
        <torusGeometry args={[0.07, 0.018, 8, 20, Math.PI]} />
      </mesh>

      {/* Bottom cap */}
      <mesh ref={bottomRef} position={[0, -0.7, 0]} material={metalMat}>
        <cylinderGeometry args={[0.42, 0.38, 0.08, 64]} />
      </mesh>

      {/* Bottom indent */}
      <mesh position={[0, -0.76, 0]} material={metalMat} rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[0.38, 64, 16, 0, Math.PI * 2, 0, Math.PI / 4]} />
      </mesh>
    </group>
  )
}
