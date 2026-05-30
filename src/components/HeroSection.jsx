import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { useFlavorStore } from '../store/flavorStore'

export default function HeroSection() {
  const { activeFlavor } = useFlavorStore()
  const wrapRef   = useRef()
  const n1Ref     = useRef()   // "NIRO" bg word
  const n2Ref     = useRef()   // secondary bg word
  const copyRef   = useRef()
  const ctaRef    = useRef()
  const badgesRef = useRef()

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.1 })
    // Words scale up from zero
    tl.fromTo(
      [n1Ref.current, n2Ref.current],
      { opacity: 0, scale: 0.85, y: 40 },
      { opacity: 1, scale: 1, y: 0, duration: 1.1, stagger: 0.14, ease: 'expo.out' }
    )
    tl.fromTo(
      copyRef.current,
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.6'
    )
    tl.fromTo(
      [ctaRef.current, badgesRef.current],
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' },
      '-=0.5'
    )
  }, [])

  return (
    <section
      id="hero"
      ref={wrapRef}
      className="relative min-h-screen flex flex-col justify-end overflow-hidden"
      style={{ paddingBottom: 'clamp(3rem, 8vh, 6rem)' }}
    >
      {/* ── Giant bg typography layer (z-0) ───────────────────── */}
      <div className="absolute inset-0 flex flex-col justify-center pointer-events-none select-none overflow-hidden">
        {/* "NIRO" — fills viewport width */}
        <div
          ref={n1Ref}
          className="leading-none tracking-tighter text-[#0a0a0a] w-full"
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(9rem, 26vw, 30rem)',
            lineHeight: 0.82,
            letterSpacing: '-0.04em',
            opacity: 0.055,
            whiteSpace: 'nowrap',
            textAlign: 'center',
          }}
        >
          NIRO
        </div>

        {/* Sub-word fills the next line */}
        <div
          ref={n2Ref}
          className="leading-none w-full text-center"
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(2.5rem, 7vw, 9rem)',
            letterSpacing: '0.18em',
            color: activeFlavor.accent,
            opacity: 0.12,
            marginTop: '0.5rem',
            transition: 'color 0.5s',
          }}
        >
          PROTEIN + CAFFEINE
        </div>
      </div>

      {/* ── Foreground UI (z-20) ───────────────────────────────── */}
      <div className="relative z-20 px-8 md:px-16 lg:px-24">

        {/* Section marker */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px w-8" style={{ background: activeFlavor.accent, transition: 'background 0.4s' }} />
          <span style={{
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
            fontSize: '0.68rem', letterSpacing: '0.28em', textTransform: 'uppercase',
            color: activeFlavor.accent, opacity: 0.8, transition: 'color 0.4s',
          }}>
            01 / The Drink
          </span>
        </div>

        {/* Solid readable headline */}
        <div className="overflow-hidden mb-2">
          <h1
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(4.5rem, 11vw, 12rem)',
              lineHeight: 0.88,
              letterSpacing: '-0.025em',
              textTransform: 'uppercase',
              color: '#0a0a0a',
            }}
          >
            NIRO
          </h1>
        </div>

        <div className="overflow-hidden mb-8">
          <p
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(1.6rem, 4vw, 4.5rem)',
              lineHeight: 1,
              letterSpacing: '-0.01em',
              textTransform: 'uppercase',
              color: activeFlavor.accent,
              transition: 'color 0.4s',
            }}
          >
            Protein&nbsp;+&nbsp;Caffeine
          </p>
        </div>

        {/* Copy row */}
        <div ref={copyRef} className="flex flex-col md:flex-row md:items-end gap-8 mb-10 max-w-xl">
          <p style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 'clamp(0.95rem, 1.2vw, 1.15rem)',
            lineHeight: 1.75,
            color: 'rgba(10,10,10,0.52)',
            maxWidth: '36ch',
          }}>
            The only performance drink built for the relentless. Real protein, real caffeine, zero noise.
          </p>
        </div>

        {/* CTA row */}
        <div ref={ctaRef} className="flex flex-wrap gap-4 mb-10">
          <a href="#cta" className="btn-primary" style={{ background: activeFlavor.accent, transition: 'background 0.4s' }}>
            Get Yours →
          </a>
          <a href="#flavors" className="btn-outline">
            See Flavors
          </a>
        </div>

        {/* Stat badges */}
        <div ref={badgesRef} className="flex flex-wrap gap-6">
          {[
            { val: '20g',   label: 'Protein' },
            { val: '150mg', label: 'Caffeine' },
            { val: '0g',    label: 'Sugar' },
            { val: '160',   label: 'Kcal' },
          ].map(({ val, label }) => (
            <div key={label} className="flex flex-col">
              <span style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 900,
                fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
                lineHeight: 1,
                color: activeFlavor.accent,
                transition: 'color 0.4s',
              }}>{val}</span>
              <span style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                opacity: 0.4,
              }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 z-20 flex flex-col items-center gap-2" style={{ opacity: 0.35 }}>
        <div style={{
          width: '1px',
          height: '56px',
          background: `linear-gradient(to bottom, transparent, ${activeFlavor.accent})`,
          transition: 'background 0.4s',
        }} />
        <span style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700,
          fontSize: '0.6rem',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          writingMode: 'vertical-rl',
        }}>Scroll</span>
      </div>
    </section>
  )
}
