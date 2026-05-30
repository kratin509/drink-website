import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { useFlavorStore } from '../store/flavorStore'

export default function HeroSection() {
  const { activeFlavor } = useFlavorStore()
  const copyRef  = useRef()
  const ctaRef   = useRef()
  const statsRef = useRef()
  const lineRef  = useRef()

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.15 })
    tl.fromTo(lineRef.current,  { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'expo.out', transformOrigin: 'left' })
    tl.fromTo(copyRef.current,  { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
    tl.fromTo(ctaRef.current,   { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
    tl.fromTo(statsRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
  }, [])

  return (
    <section id="hero" className="section-frame">

      {/* ── z-10: giant background typography ──────────────────────────── */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center overflow-hidden select-none pointer-events-none">
        {/* "NIRO" — fills ~80 vw at condensed weight */}
        <span
          className="vp-word text-[#0a0a0a]"
          style={{ fontSize: 'clamp(9rem, 26vw, 32rem)', opacity: 0.052, textAlign: 'center' }}
        >
          NIRO
        </span>
        {/* Accent sub-word */}
        <span
          className="vp-word text-center mt-2"
          style={{
            fontSize: 'clamp(2rem, 6.5vw, 8rem)',
            letterSpacing: '0.16em',
            color: activeFlavor.accent,
            opacity: 0.1,
            transition: 'color 0.5s',
          }}
        >
          PROTEIN&nbsp;+&nbsp;CAFFEINE
        </span>
      </div>

      {/* ── z-20: foreground UI ─────────────────────────────────────────── */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end px-8 md:px-16 lg:px-24 pb-14">

        {/* Section marker + rule */}
        <div ref={lineRef} className="flex items-center gap-3 mb-8 origin-left">
          <div className="h-px w-8" style={{ background: activeFlavor.accent, transition: 'background 0.4s' }} />
          <span className="label-tag" style={{ color: activeFlavor.accent, opacity: 0.85, transition: 'color 0.4s' }}>
            01 / The Drink
          </span>
        </div>

        {/* Readable headline — left-anchored, clears 3D can on right */}
        <div className="max-w-[52vw]">
          <h1
            className="headline text-[#0a0a0a] mb-1"
            style={{ fontSize: 'clamp(4rem, 10.5vw, 11rem)' }}
          >
            NIRO
          </h1>
          <p
            className="headline mb-8"
            style={{
              fontSize: 'clamp(1.6rem, 4vw, 4.5rem)',
              color: activeFlavor.accent,
              transition: 'color 0.4s',
            }}
          >
            Protein&nbsp;+&nbsp;Caffeine
          </p>

          {/* Sub-copy */}
          <p ref={copyRef} className="mb-8 leading-relaxed"
            style={{ fontFamily: "'Barlow', sans-serif", fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)', color: 'rgba(10,10,10,0.5)', maxWidth: '38ch' }}
          >
            The only performance drink built for the relentless. Real protein,
            real caffeine, zero noise.
          </p>

          {/* CTAs */}
          <div ref={ctaRef} className="flex flex-wrap gap-4 mb-10">
            <a href="#cta" className="btn-primary" style={{ background: activeFlavor.accent, transition: 'background 0.4s' }}>
              Get Yours →
            </a>
            <a href="#flavors" className="btn-outline">See Flavors</a>
          </div>

          {/* Stat badges */}
          <div ref={statsRef} className="flex flex-wrap gap-8">
            {[
              { val: '20g',   lbl: 'Protein' },
              { val: '150mg', lbl: 'Caffeine' },
              { val: '0g',    lbl: 'Sugar' },
              { val: '160',   lbl: 'Kcal' },
            ].map(({ val, lbl }) => (
              <div key={lbl}>
                <div className="headline" style={{ fontSize: 'clamp(1.5rem, 2.2vw, 2.2rem)', color: activeFlavor.accent, transition: 'color 0.4s' }}>{val}</div>
                <div className="label-tag" style={{ opacity: 0.38 }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 z-20 flex flex-col items-center gap-2" style={{ opacity: 0.32 }}>
        <div style={{ width: 1, height: 52, background: `linear-gradient(to bottom, transparent, ${activeFlavor.accent})`, transition: 'background 0.4s' }} />
        <span className="label-tag" style={{ writingMode: 'vertical-rl', letterSpacing: '0.32em', fontSize: '0.6rem' }}>Scroll</span>
      </div>
    </section>
  )
}
