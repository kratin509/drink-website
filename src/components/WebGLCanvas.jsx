import { Suspense, forwardRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import CanScene from './CanScene'
import { useFlavorStore } from '../store/flavorStore'

const WebGLCanvas = forwardRef(({ scrollState }, canvasRef) => {
  const { activeFlavor } = useFlavorStore()

  return (
    <div
      className="fixed inset-0 z-[40]"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        shadows
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[4, 9, 7]} intensity={2.4} castShadow shadow-mapSize={[2048, 2048]} />
          <pointLight position={[-4, -1, 3.5]} intensity={1.2} color={activeFlavor.accent} />
          <pointLight position={[4, 4, -2]} intensity={0.6} color="#ffffff" />
          <spotLight position={[0, 7, 5]} angle={0.32} penumbra={0.85} intensity={1.6} castShadow />
          <Environment preset="studio" />
          <ContactShadows position={[0, -2.2, 0]} opacity={0.28} scale={9} blur={3.5} far={5} />
          <CanScene ref={canvasRef} scrollState={scrollState} />
        </Suspense>
      </Canvas>
    </div>
  )
})

WebGLCanvas.displayName = 'WebGLCanvas'
export default WebGLCanvas
