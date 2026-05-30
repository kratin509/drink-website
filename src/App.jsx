import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './index.css'
import Preloader          from './components/Preloader'
import Navbar             from './components/Navbar'
import HeroSection        from './components/HeroSection'
import FlavorSection      from './components/FlavorSection'
import NutritionSection   from './components/NutritionSection'
import SocialProofSection from './components/SocialProofSection'
import PortfolioSection   from './components/PortfolioSection'
import FooterSection      from './components/FooterSection'
import WebGLCanvas        from './components/WebGLCanvas'
import { useLenis }       from './hooks/useLenis'
import { useFlavorStore } from './store/flavorStore'

gsap.registerPlugin(ScrollTrigger)

function MainApp() {
  useLenis()
  const { activeFlavor } = useFlavorStore()

  useEffect(() => {
    document.documentElement.style.setProperty('--accent',     activeFlavor.accent)
    document.documentElement.style.setProperty('--accent-rgb', activeFlavor.accentRgb)
  }, [activeFlavor])

  return (
    <>
      <Navbar />
      {/* Scrolling content layer — sits above the fixed z-0 canvas */}
      <div className="relative z-10 w-full">
        <HeroSection />
        <FlavorSection />
        <NutritionSection />
        <SocialProofSection />
        <PortfolioSection />
        <FooterSection />
      </div>
    </>
  )
}

export default function App() {
  const [phase, setPhase] = useState('loading')
  const sceneRef = useRef(null)

  const handleBurstReady = () => {
    sceneRef.current?.triggerBurst(() => setPhase('ready'))
  }

  return (
    <>
      {/* Layer 0 — fixed 3D canvas, always behind everything */}
      <WebGLCanvas ref={sceneRef} scrollState={{}} />

      {/* Preloader overlay */}
      {phase === 'loading' && <Preloader onBurstReady={handleBurstReady} />}

      {/* Layer 10 — scrolling DOM, mounts after burst */}
      {phase === 'ready' && <MainApp />}
    </>
  )
}
