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
import FooterSection      from './components/FooterSection'
import WebGLCanvas        from './components/WebGLCanvas'
import { useLenis }       from './hooks/useLenis'
import { useFlavorStore } from './store/flavorStore'
import { useMobile }      from './hooks/useMobile'

gsap.registerPlugin(ScrollTrigger)

function ScrollProvider({ children, onScrollChange }) {
  useEffect(() => {
    const sectionIds = ['#hero', '#flavors', '#nutrition', '#social', '#cta']
    const els = sectionIds.map(s => document.querySelector(s)).filter(Boolean)
    if (!els.length) return

    const triggers = els.map((el, i) =>
      ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end:   'bottom center',
        onEnter:     () => onScrollChange(p => ({ ...p, section: i })),
        onEnterBack: () => onScrollChange(p => ({ ...p, section: i })),
      })
    )

    const progressTrigger = ScrollTrigger.create({
      trigger: '#flavors',
      start:   'top bottom',
      end:     'bottom top',
      onUpdate: self =>
        onScrollChange(p => ({ ...p, progress: self.progress, raw: self.progress })),
    })

    return () => {
      triggers.forEach(t => t.kill())
      progressTrigger.kill()
    }
  }, [onScrollChange])

  return children
}

function MainApp() {
  useLenis()
  const { activeFlavor } = useFlavorStore()

  useEffect(() => {
    document.documentElement.style.setProperty('--accent',     activeFlavor.accent)
    document.documentElement.style.setProperty('--accent-rgb', activeFlavor.accentRgb)
  }, [activeFlavor])

  return (
    <div style={{ background: 'var(--page-bg)' }}>
      <Navbar />
      <main>
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
  const [phase, setPhase]             = useState('loading')
  const [scrollState, setScrollState] = useState({ section: 0, progress: 0, raw: 0 })
  const sceneRef = useRef(null)
  const isMobile = useMobile()

  const handleBurstReady = () => {
    if (isMobile) {
      // Skip WebGL burst on mobile — go straight to content
      setPhase('ready')
      return
    }
    sceneRef.current?.triggerBurst(() => setPhase('ready'))
  }

  return (
    <>
      {/* Fixed 3D canvas — desktop only */}
      {!isMobile && <WebGLCanvas ref={sceneRef} scrollState={scrollState} />}

      {phase === 'loading' && <Preloader onBurstReady={handleBurstReady} />}

      {phase === 'ready' && (
        <ScrollProvider onScrollChange={setScrollState}>
          <MainApp />
        </ScrollProvider>
      )}
    </>
  )
}
