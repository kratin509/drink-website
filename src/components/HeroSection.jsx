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
      { yPercent: 120, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'expo.out' }
    )
      .fromTo(
        subRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
        '-=0.4'
      )
      .fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.4'
      )
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-end pb-20 px-8 md:px-16"
    >
      {/* Kinetic headline */}
      <div className="overflow-hidden mb-2">
        <h1
          ref={line1Ref}
          className="headline-fill text-[#0a0a0a] leading-none"
          style={{ fontSize: 'clamp(5rem, 15vw, 15rem)' }}
        >
          NIRO
        </h1>
      </div>

      <div className="overflow-hidden mb-2">
        <p
          ref={line2Ref}
          className="font-display uppercase font-black leading-none tracking-tight"
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 'clamp(2.5rem, 7vw, 7rem)',
            color: activeFlavor.accent,
          }}
        >
          PROTEIN + CAFFEINE
        </p>
      </div>

      <div className="overflow-hidden mb-10">
        <p
          ref={line3Ref}
          className="font-display uppercase font-black text-[#0a0a0a] leading-none tracking-tight"
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 'clamp(1.8rem, 5vw, 5rem)',
            opacity: 0.35,
          }}
        >
          ZERO SUGAR · ZERO EXCUSES
        </p>
      </div>

      {/* Sub-copy & CTAs */}
      <div ref={subRef} className="flex flex-col md:flex-row md:items-end gap-8">
        <p
          className="text-[#0a0a0a]/60 max-w-xs text-lg leading-relaxed"
          style={{ fontFamily: "'Barlow', sans-serif" }}
        >
          The only performance drink built for the relentless. Real protein, real caffeine, zero noise.
        </p>

        <div ref={ctaRef} className="flex items-center gap-4">
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

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 flex flex-col items-center gap-2 opacity-40">
        <div
          className="w-px h-16 origin-top"
          style={{ background: activeFlavor.accent, animation: 'scaleY 1.5s ease-in-out infinite alternate', transformOrigin: 'top' }}
        />
        <span
          className="font-display text-xs tracking-widest uppercase rotate-90 mt-2"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}
        >
          Scroll
        </span>
      </div>
    </section>
  )
}
