import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FLAVORS } from '../constants/flavors'
import { useFlavorStore } from '../store/flavorStore'

gsap.registerPlugin(ScrollTrigger)

export default function FlavorSection() {
  const sectionRef = useRef()
  const cardsRef = useRef([])
  const headRef = useRef()
  const { activeFlavor, setFlavor } = useFlavorStore()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      )
      gsap.fromTo(
        cardsRef.current.filter(Boolean),
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="flavors"
      ref={sectionRef}
      className="relative py-28 overflow-hidden"
      style={{ background: '#f8f8f6' }}
    >
      {/* Section label */}
      <div className="px-8 md:px-16 lg:px-24 flex items-center gap-4 mb-12">
        <div className="w-8 h-px" style={{ background: activeFlavor.accent }} />
        <span
          className="text-xs tracking-[0.25em] uppercase"
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            opacity: 0.45,
          }}
        >
          02 / Choose Your Weapon
        </span>
      </div>

      {/* Headline */}
      <div ref={headRef} className="px-8 md:px-16 lg:px-24 mb-16">
        <h2
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(3.5rem, 9vw, 9rem)',
            lineHeight: 0.88,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: '#0a0a0a',
          }}
        >
          Pick Your
        </h2>
        <h2
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(3.5rem, 9vw, 9rem)',
            lineHeight: 0.88,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: activeFlavor.accent,
            transition: 'color 0.4s',
          }}
        >
          Flavor
        </h2>
      </div>

      {/* Flavor cards */}
      <div className="px-8 md:px-16 lg:px-24 grid grid-cols-1 md:grid-cols-3 gap-5 mb-20">
        {FLAVORS.map((flavor, i) => {
          const isActive = activeFlavor.id === flavor.id
          return (
            <button
              key={flavor.id}
              ref={(el) => (cardsRef.current[i] = el)}
              onClick={() => setFlavor(flavor)}
              className="group text-left transition-all duration-300 cursor-pointer"
              style={{
                padding: '2rem',
                border: `2px solid ${isActive ? flavor.accent : 'rgba(0,0,0,0.1)'}`,
                background: isActive
                  ? `rgba(${flavor.accentRgb}, 0.05)`
                  : '#ffffff',
                transform: isActive ? 'translateY(-6px)' : 'none',
                boxShadow: isActive
                  ? `0 20px 60px rgba(${flavor.accentRgb}, 0.15)`
                  : '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              {/* Emoji */}
              <div className="text-4xl mb-5">{flavor.emoji}</div>

              {/* Name */}
              <h3
                className="mb-1 leading-none"
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 900,
                  fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)',
                  textTransform: 'uppercase',
                  color: isActive ? flavor.accent : '#0a0a0a',
                  transition: 'color 0.3s',
                }}
              >
                {flavor.name}
              </h3>

              {/* Tagline */}
              <p
                className="mb-5"
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  opacity: 0.4,
                }}
              >
                {flavor.tagline}
              </p>

              {/* Ingredient tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {flavor.ingredients.map((ing) => (
                  <span
                    key={ing}
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      padding: '3px 8px',
                      background: `rgba(${flavor.accentRgb}, 0.1)`,
                      color: flavor.accent,
                    }}
                  >
                    {ing}
                  </span>
                ))}
              </div>

              {/* Macros */}
              <div
                className="flex gap-6 pt-5"
                style={{ borderTop: `1px solid rgba(0,0,0,0.08)` }}
              >
                {[
                  { val: flavor.nutrition.protein, label: 'Protein' },
                  { val: flavor.nutrition.caffeine, label: 'Caffeine' },
                  { val: flavor.nutrition.sugar, label: 'Sugar' },
                ].map(({ val, label }) => (
                  <div key={label}>
                    <div
                      style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontWeight: 900,
                        fontSize: '1.6rem',
                        lineHeight: 1,
                        color: flavor.accent,
                      }}
                    >
                      {val}
                    </div>
                    <div
                      style={{
                        fontSize: '0.65rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        opacity: 0.45,
                        marginTop: '3px',
                      }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Active indicator */}
              {isActive && (
                <div
                  className="flex items-center gap-2 mt-5"
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: flavor.accent,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: flavor.accent }}
                  />
                  Currently Viewing
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Ticker tape */}
      <div
        className="overflow-hidden py-4"
        style={{ borderTop: '1px solid rgba(0,0,0,0.08)', borderBottom: '1px solid rgba(0,0,0,0.08)' }}
      >
        <div className="ticker-inner flex gap-16 whitespace-nowrap">
          {[...Array(4)].flatMap((_, rep) =>
            ['PROTEIN', 'CAFFEINE', 'ZERO SUGAR', 'RAW POWER', 'NIRO', 'PERFORMANCE'].map(
              (word, i) => (
                <span
                  key={`${rep}-${word}`}
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 900,
                    fontSize: 'clamp(1.5rem, 2.5vw, 2.5rem)',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.01em',
                    color: i % 2 === 0 ? '#0a0a0a' : activeFlavor.accent,
                    opacity: i % 2 === 0 ? 0.12 : 0.55,
                    transition: 'color 0.4s',
                  }}
                >
                  {word}
                </span>
              )
            )
          )}
        </div>
      </div>
    </section>
  )
}
