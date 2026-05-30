import { Suspense, forwardRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import CanScene from './CanScene'
import { useFlavorStore } from '../store/flavorStore'

const WebGLCanvas = forwardRef(({ scrollState }, canvasRef) => {
  const { activeFlavor } = useFlavorStore()

  return (
    <div
      className="fixed inset-0 z-10"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.55} />
          <directionalLight
            position={[4, 8, 6]}
            intensity={2.2}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <pointLight
            position={[-4, -1, 3]}
            intensity={1.1}
            color={activeFlavor.accent}
          />
          <pointLight position={[4, 4, -2]} intensity={0.6} color="#ffffff" />
          <spotLight
            position={[0, 6, 4]}
            angle={0.35}
            penumbra={0.8}
            intensity={1.4}
            castShadow
          />

          <Environment preset="studio" />

          <ContactShadows
            position={[0, -2.0, 0]}
            opacity={0.35}
            scale={8}
            blur={3}
            far={5}
          />

          <CanScene ref={canvasRef} scrollState={scrollState} />
        </Suspense>
      </Canvas>
    </div>
  )
})

WebGLCanvas.displayName = 'WebGLCanvas'
export default WebGLCanvas
