import { useRef, Suspense } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import CanMesh from './CanMesh'
import FloatingIngredients from './FloatingIngredients'
import LiquidPour from './LiquidPour'
import { useFlavorStore } from '../store/flavorStore'

function Rig({ scrollState }) {
  const { camera } = useThree()
  useRef(() => {
    camera.fov = 45
    camera.near = 0.1
    camera.far = 100
    camera.updateProjectionMatrix()
  })
  return null
}

export default function WebGLCanvas({ scrollState }) {
  const { activeFlavor } = useFlavorStore()

  return (
    <div
      className="fixed inset-0 z-10"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[5, 8, 5]}
            intensity={2}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <pointLight position={[-3, -2, 3]} intensity={0.8} color={activeFlavor.accent} />
          <pointLight position={[3, 3, -2]} intensity={0.5} color="#ffffff" />

          <Environment preset="city" />

          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.4}
            scale={5}
            blur={2.5}
            far={4}
          />

          <CanMesh scrollState={scrollState} />
          <FloatingIngredients active={scrollState.section === 1} />
          <LiquidPour active={scrollState.section === 3} />

          <Rig scrollState={scrollState} />
        </Suspense>
      </Canvas>
    </div>
  )
}
