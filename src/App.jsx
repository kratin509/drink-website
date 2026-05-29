import { useState, useEffect, useRef } from 'react'
import './index.css'
import Preloader from './components/Preloader'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import FlavorSection from './components/FlavorSection'
import NutritionSection from './components/NutritionSection'
import SocialProofSection from './components/SocialProofSection'
import FooterSection from './components/FooterSection'
import WebGLCanvas from './components/WebGLCanvas'
import { useScrollState } from './hooks/useScrollState'
import { useLenis } from './hooks/useLenis'
import { useFlavorStore } from './store/flavorStore'
import gsap from 'gsap'

function MainApp() {
  useLenis()
  const scrollState = useScrollState()
  const { activeFlavor } = useFlavorStore()
  const rootRef = useRef()

  // Sync CSS accent variable to active flavor
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--accent', activeFlavor.accent)
    root.style.setProperty('--accent-rgb', activeFlavor.accentRgb)
    // Animate background tint
    gsap.to(rootRef.current, {
      backgroundColor: activeFlavor.bg,
      duration: 0.6,
      ease: 'power2.out',
    })
  }, [activeFlavor])

  return (
    <div ref={rootRef} style={{ background: '#f8f8f6' }}>
      <WebGLCanvas scrollState={scrollState} />
      <Navbar />

      <main className="relative z-20">
        <HeroSection />
        <FlavorSection />
        <NutritionSection />
        <SocialProofSection />
        <FooterSection />
      </main>
    </div>
  )
}

export default function App() {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      {!loaded && <Preloader onComplete={() => setLoaded(true)} />}
      {loaded && <MainApp />}
    </>
  )
}
