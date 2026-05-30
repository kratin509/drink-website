import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FLAVORS } from '../constants/flavors'
import { useFlavorStore } from '../store/flavorStore'

gsap.registerPlugin(ScrollTrigger)

export default function FlavorSection() {
  const sectionRef = useRef()
  const bgWordRef  = useRef()
  const headRef    = useRef()
  const cardsRef   = useRef([])
  const tickerRef  = useRef()
  const { activeFlavor, setFlavor } = useFlavorStore()

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Bg word parallax: scrolls slower than page
      gsap.to(bgWordRef.current, {
        yPercent: -18,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })

      gsap.fromTo(headRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' } }
      )
      gsap.fromTo(cardsRef.current.filter(Boolean),
        { opacity: 0, y: 55 },
        { opacity: 1, y: 0, duration: 0.75, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const LABEL_STYLE = {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontWeight: 700,
    fontSize: '0.65rem',
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    opacity: 0.4,
    marginTop: '4px',
  }

  return (
    <section
      id="flavors"
      ref={sectionRef}
      className="relative py-28 overflow-hidden"
      style={{ background: '#f8f8f6' }}
    >
      {/* ── Viewport-filling bg word ─────────────────────────── */}
      <div
        ref={bgWordRef}
        aria-hidden="true"
        className="absolute inset-0 flex flex-col justify-center pointer-events-none select-none overflow-hidden"
      >
        <span
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(8rem, 22vw, 26rem)',
            lineHeight: 0.82,
            letterSpacing: '-0.04em',
            color: '#0a0a0a',
            opacity: 0.04,
            textAlign: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          FLAVOR
        </span>
      </div>

      <div className="relative z-10 px-8 md:px-16 lg:px-24">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px w-8" style={{ background: activeFlavor.accent, transition: 'background 0.4s' }} />
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.45 }}>
            02 / Choose Your Weapon
          </span>
        </div>

        {/* Headline block */}
        <div ref={headRef} className="mb-16">
          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(4rem, 10vw, 11rem)', lineHeight: 0.85, letterSpacing: '-0.03em', textTransform: 'uppercase', color: '#0a0a0a' }}>
            Pick Your
          </h2>
          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(4rem, 10vw, 11rem)', lineHeight: 0.85, letterSpacing: '-0.03em', textTransform: 'uppercase', color: activeFlavor.accent, transition: 'color 0.4s' }}>
            Flavor
          </h2>
        </div>

        {/* Flavor cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {FLAVORS.map((fl, i) => {
            const on = activeFlavor.id === fl.id
            return (
              <button
                key={fl.id}
                ref={el => (cardsRef.current[i] = el)}
                onClick={() => setFlavor(fl)}
                className="text-left transition-all duration-300 cursor-pointer"
                style={{
                  padding: '2rem 2rem 1.75rem',
                  background: on ? '#ffffff' : '#ffffff',
                  border: `2px solid ${on ? fl.accent : 'rgba(0,0,0,0.08)'}`,
                  boxShadow: on
                    ? `0 24px 64px rgba(${fl.accentRgb}, 0.18), 0 4px 16px rgba(0,0,0,0.06)`
                    : '0 2px 8px rgba(0,0,0,0.04)',
                  transform: on ? 'translateY(-8px)' : 'none',
                }}
              >
                {/* Top row: emoji + platform-style badge */}
                <div className="flex justify-between items-start mb-6">
                  <span style={{ fontSize: '2.4rem', lineHeight: 1 }}>{fl.emoji}</span>
                  {on && (
                    <span style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 700,
                      fontSize: '0.6rem',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: fl.accent,
                      background: `rgba(${fl.accentRgb}, 0.1)`,
                      padding: '4px 8px',
                    }}>Active</span>
                  )}
                </div>

                {/* Name */}
                <h3 style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 900,
                  fontSize: 'clamp(1.5rem, 2.2vw, 2.2rem)',
                  lineHeight: 0.9,
                  textTransform: 'uppercase',
                  color: on ? fl.accent : '#0a0a0a',
                  marginBottom: '6px',
                  transition: 'color 0.3s',
                }}>
                  {fl.name}
                </h3>

                {/* Tagline */}
                <p style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.72rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  opacity: 0.38,
                  marginBottom: '1.25rem',
                }}>
                  {fl.tagline}
                </p>

                {/* Ingredient chips */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {fl.ingredients.map(ing => (
                    <span key={ing} style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 700,
                      fontSize: '0.65rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      padding: '3px 8px',
                      background: `rgba(${fl.accentRgb}, 0.09)`,
                      color: fl.accent,
                    }}>
                      {ing}
                    </span>
                  ))}
                </div>

                {/* Macro row */}
                <div className="flex gap-6 pt-5" style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}>
                  {[
                    { val: fl.nutrition.protein,  label: 'Protein' },
                    { val: fl.nutrition.caffeine, label: 'Caffeine' },
                    { val: fl.nutrition.sugar,    label: 'Sugar' },
                  ].map(({ val, label }) => (
                    <div key={label}>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(1.4rem, 2vw, 1.8rem)', lineHeight: 1, color: fl.accent }}>
                        {val}
                      </div>
                      <div style={LABEL_STYLE}>{label}</div>
                    </div>
                  ))}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Ticker tape — runs full bleed */}
      <div
        className="overflow-hidden py-5"
        style={{ borderTop: '1px solid rgba(0,0,0,0.07)', borderBottom: '1px solid rgba(0,0,0,0.07)' }}
      >
        <div ref={tickerRef} className="ticker-inner flex gap-16 whitespace-nowrap">
          {[...Array(4)].flatMap((_, r) =>
            ['PROTEIN', 'CAFFEINE', 'ZERO SUGAR', 'RAW POWER', 'NIRO', '20G PROTEIN'].map((w, i) => (
              <span key={`${r}-${i}`} style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 900,
                fontSize: 'clamp(1.6rem, 2.8vw, 3rem)',
                letterSpacing: '-0.01em',
                textTransform: 'uppercase',
                color: i % 2 === 0 ? '#0a0a0a' : activeFlavor.accent,
                opacity: i % 2 === 0 ? 0.1 : 0.6,
                transition: 'color 0.4s',
              }}>
                {w}
              </span>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
