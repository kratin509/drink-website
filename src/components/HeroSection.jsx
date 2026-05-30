import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useFlavorStore } from '../store/flavorStore'

gsap.registerPlugin(ScrollTrigger)

export default function HeroSection() {
  const sectionRef = useRef()
  const bgRef      = useRef()
  const lineRef    = useRef()
  const h1aRef     = useRef()
  const h1bRef     = useRef()
  const copyRef    = useRef()
  const ctaRef     = useRef()
  const statsRef   = useRef()
  const { activeFlavor } = useFlavorStore()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        yPercent: -10, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    }, sectionRef)

    const tl = gsap.timeline({ delay: 0.05 })
    tl.fromTo(lineRef.current,  { scaleX: 0 },          { scaleX: 1, duration: 0.55, ease: 'expo.out', transformOrigin: 'left' })
    tl.fromTo(h1aRef.current,   { opacity: 0, y: 40 },  { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.2')
    tl.fromTo(h1bRef.current,   { opacity: 0, y: 40 },  { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
    tl.fromTo(copyRef.current,  { opacity: 0, y: 20 },  { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, '-=0.5')
    tl.fromTo(ctaRef.current,   { opacity: 0, y: 16 },  { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }, '-=0.45')
    tl.fromTo(statsRef.current, { opacity: 0 },         { opacity: 1, duration: 0.5 }, '-=0.3')

    return () => ctx.revert()
  }, [])

  return (
    <section id="hero" ref={sectionRef} className="section-frame" style={{ background: 'var(--page-bg)' }}>

      {/* Parallax ghost word */}
      <div ref={bgRef} aria-hidden="true"
        className="absolute inset-0 z-10 flex items-end justify-start overflow-hidden pointer-events-none select-none"
        style={{ paddingLeft: '6vw', paddingBottom: '2vh' }}>
        <span className="vp-word text-[#0a0a0a]"
          style={{ fontSize: 'clamp(10rem, 28vw, 36rem)', opacity: 0.038 }}>
          NIRO
        </span>
      </div>

      {/* UI layer */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center"
        style={{ paddingLeft: '8vw', paddingRight: '8vw', paddingTop: '80px' }}>

        {/* Eyebrow */}
        <div ref={lineRef} className="flex items-center gap-3 mb-7 origin-left">
          <div style={{ width: '28px', height: '1px', background: activeFlavor.accent, transition: 'background 0.4s' }} />
          <span className="eyebrow" style={{ color: activeFlavor.accent, opacity: 0.9, transition: 'color 0.4s' }}>
            01 &nbsp;/&nbsp; Performance Drink
          </span>
        </div>

        {/* Headline — max 45vw so can reads freely on right */}
        <div style={{ maxWidth: '46vw' }}>
          <h1 ref={h1aRef} className="display text-[#0a0a0a]"
            style={{ fontSize: 'clamp(4.5rem, 10vw, 11rem)', marginBottom: '0.06em' }}>
            Fuel The
          </h1>
          <h1 ref={h1bRef} className="display" style={{
            fontSize: 'clamp(4.5rem, 10vw, 11rem)',
            color: activeFlavor.accent, transition: 'color 0.45s',
            marginBottom: '0.55em',
          }}>
            Relentless.
          </h1>

          <p ref={copyRef} style={{
            fontFamily: "'Barlow', sans-serif", fontWeight: 300,
            fontSize: 'clamp(0.9rem, 1.1vw, 1rem)',
            lineHeight: 1.85, color: 'rgba(10,10,10,0.48)',
            maxWidth: '36ch', marginBottom: '2.2rem',
          }}>
            20g protein. 150mg caffeine. Zero sugar. One can engineered for
            the people who don't stop when it gets hard.
          </p>

          {/* CTA row */}
          <div ref={ctaRef} className="flex items-center gap-4 mb-12">
            <a href="#cta" className="btn-accent"
              style={{ background: activeFlavor.accent, borderColor: activeFlavor.accent, transition: 'background 0.4s, border-color 0.4s' }}>
              Get Yours →
            </a>
            <a href="#flavors" className="btn-ghost">See Flavors</a>
          </div>
        </div>

        {/* Stats strip */}
        <div ref={statsRef} className="flex items-center gap-10"
          style={{ borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '1.4rem', maxWidth: '46vw' }}>
          {[
            { val: '20g',   lbl: 'Protein'   },
            { val: '150mg', lbl: 'Caffeine'  },
            { val: '0g',    lbl: 'Sugar'     },
            { val: '160',   lbl: 'Calories'  },
          ].map(({ val, lbl }, i) => (
            <div key={lbl} className="flex items-baseline gap-2">
              <span className="headline" style={{
                fontSize: 'clamp(1.3rem, 1.8vw, 1.9rem)',
                color: activeFlavor.accent, transition: 'color 0.4s',
              }}>{val}</span>
              <span className="eyebrow" style={{ opacity: 0.36, fontSize: '0.58rem' }}>{lbl}</span>
              {i < 3 && <div style={{ width: '1px', height: '18px', background: 'rgba(0,0,0,0.12)', marginLeft: '0.6rem' }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator — bottom right */}
      <div className="absolute bottom-8 right-10 z-20 flex flex-col items-center gap-2" style={{ opacity: 0.25 }}>
        <div style={{ width: '1px', height: '48px', background: `linear-gradient(to bottom, transparent, ${activeFlavor.accent})`, transition: 'background 0.4s' }} />
        <span className="eyebrow" style={{ writingMode: 'vertical-rl', letterSpacing: '0.38em', fontSize: '0.55rem' }}>Scroll</span>
      </div>
    </section>
  )
}
