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

gsap.registerPlugin(ScrollTrigger)

// ── Scroll provider — wires up ScrollTrigger after DOM exists ───────────────
function ScrollProvider({ children, onScrollChange }) {
  useEffect(() => {
    const sectionIds = ['#hero', '#flavors', '#nutrition', '#cta']
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

// ── Main page (mounted after burst completes) ───────────────────────────────
function MainApp() {
  useLenis()
  const { activeFlavor } = useFlavorStore()
  const rootRef = useRef()

  useEffect(() => {
    document.documentElement.style.setProperty('--accent',     activeFlavor.accent)
    document.documentElement.style.setProperty('--accent-rgb', activeFlavor.accentRgb)
    gsap.to(rootRef.current, {
      backgroundColor: activeFlavor.bg,
      duration: 0.55,
      ease: 'power2.out',
    })
  }, [activeFlavor])

  return (
    <div ref={rootRef} style={{ background: '#f8f8f6' }}>
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

// ── Root ────────────────────────────────────────────────────────────────────
export default function App() {
  const [phase, setPhase]           = useState('loading') // 'loading' | 'ready'
  const [scrollState, setScrollState] = useState({ section: 0, progress: 0, raw: 0 })
  const sceneRef = useRef(null)

  const handleBurstReady = () => {
    // sceneRef.current is the useImperativeHandle object from CanScene
    sceneRef.current?.triggerBurst(() => setPhase('ready'))
  }

  return (
    <>
      {/* Three.js canvas always mounted — burst fires into it */}
      <WebGLCanvas ref={sceneRef} scrollState={scrollState} />

      {/* Dark preloader overlay — sits above canvas */}
      {phase === 'loading' && <Preloader onBurstReady={handleBurstReady} />}

      {/* DOM content — mounts after burst, feeds scroll state back up */}
      {phase === 'ready' && (
        <ScrollProvider onScrollChange={setScrollState}>
          <MainApp />
        </ScrollProvider>
      )}
    </>
  )
}
