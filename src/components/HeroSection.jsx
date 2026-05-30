import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useFlavorStore } from '../store/flavorStore'

gsap.registerPlugin(ScrollTrigger)

export default function HeroSection() {
  const sectionRef = useRef()
  const bgRef      = useRef()
  const lineRef    = useRef()
  const copyRef    = useRef()
  const ctaRef     = useRef()
  const statsRef   = useRef()
  const { activeFlavor } = useFlavorStore()

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Bg word parallax
      gsap.to(bgRef.current, {
        yPercent: -8, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    }, sectionRef)

    // Entrance sequence
    const tl = gsap.timeline({ delay: 0.1 })
    tl.fromTo(lineRef.current,  { scaleX: 0 },         { scaleX: 1, duration: 0.7, ease: 'expo.out', transformOrigin: 'left' })
    tl.fromTo(copyRef.current,  { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.4')
    tl.fromTo(ctaRef.current,   { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
    tl.fromTo(statsRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')

    return () => ctx.revert()
  }, [])

  return (
    <section id="hero" ref={sectionRef} className="section-frame" style={{ background: 'var(--page-bg)' }}>

      {/* z-10: background typography */}
      <div ref={bgRef} aria-hidden="true"
        className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden select-none pointer-events-none">
        <span className="vp-word text-[#0a0a0a]" style={{ fontSize: 'clamp(9rem, 26vw, 32rem)', opacity: 0.048 }}>
          NIRO
        </span>
      </div>

      {/* z-20: UI content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end px-8 md:px-16 lg:px-24 pb-14">

        {/* Section label + rule */}
        <div ref={lineRef} className="flex items-center gap-3 mb-8 origin-left">
          <div className="h-px w-8" style={{ background: activeFlavor.accent, transition: 'background 0.4s' }} />
          <span className="label-tag" style={{ color: activeFlavor.accent, opacity: 0.85, transition: 'color 0.4s' }}>
            01 / The Drink
          </span>
        </div>

        {/* Headline + copy — left half, clears the 3D can */}
        <div ref={copyRef} style={{ maxWidth: '50vw' }}>
          <h1 className="headline text-[#0a0a0a] mb-1" style={{ fontSize: 'clamp(4rem, 10vw, 10.5rem)' }}>
            NIRO
          </h1>
          <p className="headline mb-8" style={{ fontSize: 'clamp(1.5rem, 3.8vw, 4.2rem)', color: activeFlavor.accent, transition: 'color 0.4s' }}>
            Protein&nbsp;+&nbsp;Caffeine
          </p>
          <p className="mb-8 leading-relaxed"
            style={{ fontFamily: "'Barlow', sans-serif", fontSize: 'clamp(0.88rem, 1.15vw, 1.05rem)', color: 'rgba(10,10,10,0.5)', maxWidth: '38ch' }}>
            The only performance drink built for the relentless.
            Real protein, real caffeine, zero noise.
          </p>
        </div>

        {/* CTAs */}
        <div ref={ctaRef} className="flex flex-wrap gap-4 mb-10">
          <a href="#cta" className="btn-primary" style={{ background: activeFlavor.accent, transition: 'background 0.4s' }}>
            Get Yours →
          </a>
          <a href="#flavors" className="btn-outline">See Flavors</a>
        </div>

        {/* Key stats */}
        <div ref={statsRef} className="flex flex-wrap gap-8">
          {[
            { val: '20g',   lbl: 'Protein'  },
            { val: '150mg', lbl: 'Caffeine' },
            { val: '0g',    lbl: 'Sugar'    },
            { val: '160',   lbl: 'Kcal'     },
          ].map(({ val, lbl }) => (
            <div key={lbl}>
              <div className="headline" style={{ fontSize: 'clamp(1.4rem, 2vw, 2rem)', color: activeFlavor.accent, transition: 'color 0.4s' }}>{val}</div>
              <div className="label-tag" style={{ opacity: 0.38 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 right-8 z-20 flex flex-col items-center gap-2" style={{ opacity: 0.28 }}>
        <div style={{ width: 1, height: 52, background: `linear-gradient(to bottom, transparent, ${activeFlavor.accent})`, transition: 'background 0.4s' }} />
        <span className="label-tag" style={{ writingMode: 'vertical-rl', letterSpacing: '0.32em', fontSize: '0.6rem' }}>Scroll</span>
      </div>
    </section>
  )
}
