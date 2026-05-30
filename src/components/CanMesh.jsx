import { useMemo } from 'react'
import * as THREE from 'three'

export default function CanMesh({ flavorConfig, scale = 1 }) {
  const { canColor, labelColor, name, tagline, accent, nutrition } = flavorConfig

  const labelTex = useMemo(() => {
    const W = 1024, H = 512
    const cv = document.createElement('canvas')
    cv.width = W; cv.height = H
    const c = cv.getContext('2d')

    // Base radial gradient
    const radial = c.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, W * 0.6)
    radial.addColorStop(0, labelColor)
    radial.addColorStop(1, canColor)
    c.fillStyle = radial
    c.fillRect(0, 0, W, H)

    // Subtle vertical shine stripe
    const shine = c.createLinearGradient(W * 0.3, 0, W * 0.7, 0)
    shine.addColorStop(0, 'rgba(255,255,255,0)')
    shine.addColorStop(0.5, 'rgba(255,255,255,0.12)')
    shine.addColorStop(1, 'rgba(255,255,255,0)')
    c.fillStyle = shine
    c.fillRect(0, 0, W, H)

    // Thin horizontal rule lines
    c.strokeStyle = 'rgba(255,255,255,0.07)'
    c.lineWidth = 1
    for (let y = 0; y < H; y += 18) {
      c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke()
    }

    // Brand name
    c.save()
    c.shadowColor = 'rgba(0,0,0,0.6)'
    c.shadowBlur = 18
    c.fillStyle = '#fff'
    c.font = `900 200px "Arial Narrow",Arial`
    c.textAlign = 'center'
    c.textBaseline = 'middle'
    c.fillText('NIRO', W * 0.5, H * 0.32)
    c.restore()

    // Flavor name
    c.fillStyle = 'rgba(255,255,255,0.88)'
    c.font = `700 58px Arial`
    c.fillText(name.toUpperCase(), W * 0.5, H * 0.58)

    // Tagline
    c.fillStyle = 'rgba(255,255,255,0.5)'
    c.font = `400 36px Arial`
    c.fillText(tagline.toUpperCase(), W * 0.5, H * 0.70)

    // Macro strip
    c.fillStyle = 'rgba(0,0,0,0.35)'
    c.fillRect(0, H * 0.82, W, H * 0.18)
    c.fillStyle = 'rgba(255,255,255,0.92)'
    c.font = `700 32px Arial`
    const macroStr = `${nutrition?.protein ?? '20g'} PROTEIN · ${nutrition?.caffeine ?? '150mg'} CAFFEINE`
    c.fillText(macroStr, W * 0.5, H * 0.92)

    // Accent top band
    c.fillStyle = accent
    c.fillRect(0, 0, W, 8)
    c.fillRect(0, H - 8, W, 8)

    const tex = new THREE.CanvasTexture(cv)
    tex.wrapS = THREE.RepeatWrapping
    tex.anisotropy = 16
    return tex
  }, [flavorConfig])

  const metalMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#d0d0d0'),
        metalness: 0.92,
        roughness: 0.18,
        envMapIntensity: 1.4,
      }),
    []
  )

  const s = scale

  return (
    <group scale={[s, s, s]}>
      {/* Body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.42, 0.42, 1.45, 72, 1, true]} />
        <meshStandardMaterial
          map={labelTex}
          metalness={0.55}
          roughness={0.22}
          envMapIntensity={1.1}
        />
      </mesh>
      {/* Top shoulder taper */}
      <mesh position={[0, 0.72, 0]} material={metalMat}>
        <cylinderGeometry args={[0.34, 0.42, 0.1, 72]} />
      </mesh>
      {/* Top dome */}
      <mesh position={[0, 0.79, 0]} material={metalMat}>
        <sphereGeometry args={[0.34, 72, 18, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
      </mesh>
      {/* Lid rim */}
      <mesh position={[0, 0.815, 0]} material={metalMat}>
        <torusGeometry args={[0.34, 0.018, 8, 72]} />
      </mesh>
      {/* Pull tab body */}
      <mesh position={[0, 0.845, 0.22]} rotation={[0.35, 0, 0]} material={metalMat}>
        <boxGeometry args={[0.08, 0.024, 0.12]} />
      </mesh>
      {/* Pull tab ring */}
      <mesh position={[0, 0.858, 0.275]} rotation={[Math.PI / 2, 0, 0]} material={metalMat}>
        <torusGeometry args={[0.032, 0.011, 8, 20]} />
      </mesh>
      {/* Bottom shoulder */}
      <mesh position={[0, -0.72, 0]} material={metalMat}>
        <cylinderGeometry args={[0.42, 0.36, 0.1, 72]} />
      </mesh>
      {/* Bottom dome (inverted) */}
      <mesh position={[0, -0.785, 0]} rotation={[Math.PI, 0, 0]} material={metalMat}>
        <sphereGeometry args={[0.34, 72, 18, 0, Math.PI * 2, 0, Math.PI / 3]} />
      </mesh>
    </group>
  )
}
