import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { useFlavorStore } from '../store/flavorStore'

export default function HeroSection() {
  const { activeFlavor } = useFlavorStore()
  const line1Ref = useRef()
  const line2Ref = useRef()
  const line3Ref = useRef()
  const subRef = useRef()
  const ctaRef = useRef()

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 })
    tl.fromTo(
      [line1Ref.current, line2Ref.current, line3Ref.current],
      { yPercent: 110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1, stagger: 0.13, ease: 'expo.out' }
    )
      .fromTo(
        subRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.5'
      )
      .fromTo(
        ctaRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
        '-=0.5'
      )
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center pt-28 pb-24 px-8 md:px-16 lg:px-24"
    >
      {/* Text constrained to left ~55% so the 3D can has clear right-side real estate */}
      <div className="max-w-[55vw] min-w-0">

        {/* Section marker */}
        <div className="flex items-center gap-3 mb-10 overflow-hidden">
          <div className="w-8 h-px" style={{ background: activeFlavor.accent }} />
          <span
            className="text-xs tracking-[0.25em] uppercase"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              color: activeFlavor.accent,
              opacity: 0.8,
            }}
          >
            01 / The Drink
          </span>
        </div>

        {/* Main headline lines */}
        <div className="overflow-hidden mb-1">
          <h1
            ref={line1Ref}
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(5.5rem, 13vw, 13rem)',
              lineHeight: 0.88,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: '#0a0a0a',
            }}
          >
            NIRO
          </h1>
        </div>

        <div className="overflow-hidden mb-1">
          <p
            ref={line2Ref}
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(2rem, 5vw, 5rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.01em',
              textTransform: 'uppercase',
              color: activeFlavor.accent,
              transition: 'color 0.4s',
            }}
          >
            Protein + Caffeine
          </p>
        </div>

        <div className="overflow-hidden mb-12">
          <p
            ref={line3Ref}
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(1.1rem, 2.2vw, 2.2rem)',
              lineHeight: 1,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#0a0a0a',
              opacity: 0.3,
            }}
          >
            Zero Sugar · Zero Excuses
          </p>
        </div>

        {/* Sub-copy */}
        <p
          ref={subRef}
          className="mb-10 leading-relaxed"
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 'clamp(0.95rem, 1.4vw, 1.2rem)',
            color: 'rgba(10,10,10,0.55)',
            maxWidth: '38ch',
          }}
        >
          The only performance drink built for the relentless.
          Real protein, real caffeine, zero noise.
        </p>

        {/* CTAs */}
        <div ref={ctaRef} className="flex flex-wrap items-center gap-4">
          <a
            href="#cta"
            className="btn-primary"
            style={{ background: activeFlavor.accent, transition: 'background 0.4s' }}
          >
            Get Yours →
          </a>
          <a href="#flavors" className="btn-outline">
            See Flavors
          </a>
        </div>
      </div>

      {/* Scroll indicator — bottom right */}
      <div className="absolute bottom-10 right-10 flex flex-col items-center gap-3 opacity-35">
        <div
          className="w-px h-14"
          style={{
            background: `linear-gradient(to bottom, transparent, ${activeFlavor.accent})`,
            animation: 'scaleY 1.4s ease-in-out infinite alternate',
            transformOrigin: 'top',
          }}
        />
        <span
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '0.65rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            writingMode: 'vertical-rl',
          }}
        >
          Scroll
        </span>
      </div>
    </section>
  )
}
