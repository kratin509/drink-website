import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FLAVORS } from '../constants/flavors'
import { useFlavorStore } from '../store/flavorStore'

gsap.registerPlugin(ScrollTrigger)

export default function FlavorSection() {
  const sectionRef = useRef()
  const tickerRef = useRef()
  const cardsRef = useRef([])
  const { activeFlavor, setFlavor } = useFlavorStore()

  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean)
    gsap.fromTo(
      cards,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      }
    )
  }, [])

  return (
    <section
      id="flavors"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center py-24 overflow-hidden"
    >
      {/* Section label */}
      <div className="px-8 md:px-16 mb-8 flex items-center gap-4">
        <div className="w-10 h-px bg-current opacity-40" />
        <span
          className="font-display text-xs tracking-widest uppercase opacity-50"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}
        >
          02 / Choose Your Weapon
        </span>
      </div>

      {/* Giant headline */}
      <div className="px-8 md:px-16 mb-16">
        <h2
          className="headline-fill text-[#0a0a0a]"
          style={{ fontSize: 'clamp(3rem, 10vw, 10rem)' }}
        >
          PICK YOUR
        </h2>
        <h2
          className="headline-fill"
          style={{ fontSize: 'clamp(3rem, 10vw, 10rem)', color: activeFlavor.accent, transition: 'color 0.4s' }}
        >
          FLAVOR
        </h2>
      </div>

      {/* Flavor cards */}
      <div className="px-8 md:px-16 grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {FLAVORS.map((flavor, i) => {
          const isActive = activeFlavor.id === flavor.id
          return (
            <button
              key={flavor.id}
              ref={(el) => (cardsRef.current[i] = el)}
              onClick={() => setFlavor(flavor)}
              className="group text-left p-8 border-2 transition-all duration-300 cursor-pointer"
              style={{
                borderColor: isActive ? flavor.accent : 'rgba(0,0,0,0.12)',
                background: isActive ? `rgba(${flavor.accentRgb}, 0.06)` : '#ffffff',
                transform: isActive ? 'translateY(-4px)' : 'none',
              }}
            >
              {/* Flavor emoji */}
              <div className="text-5xl mb-6">{flavor.emoji}</div>

              {/* Name */}
              <h3
                className="font-display font-black uppercase leading-none mb-3 text-4xl"
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  color: isActive ? flavor.accent : '#0a0a0a',
                  transition: 'color 0.3s',
                }}
              >
                {flavor.name}
              </h3>

              {/* Tagline */}
              <p
                className="font-display uppercase tracking-widest text-sm mb-6"
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  opacity: 0.5,
                }}
              >
                {flavor.tagline}
              </p>

              {/* Ingredients */}
              <ul className="flex flex-wrap gap-2 mb-6">
                {flavor.ingredients.map((ing) => (
                  <li
                    key={ing}
                    className="text-xs px-2 py-1 font-display uppercase tracking-wider"
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 700,
                      background: `rgba(${flavor.accentRgb}, 0.1)`,
                      color: flavor.accent,
                    }}
                  >
                    {ing}
                  </li>
                ))}
              </ul>

              {/* Macro callouts */}
              <div className="flex gap-6">
                <div>
                  <div
                    className="font-display text-2xl font-black leading-none"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif", color: flavor.accent }}
                  >
                    {flavor.nutrition.protein}
                  </div>
                  <div className="text-xs opacity-50 uppercase tracking-wider">Protein</div>
                </div>
                <div>
                  <div
                    className="font-display text-2xl font-black leading-none"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif", color: flavor.accent }}
                  >
                    {flavor.nutrition.caffeine}
                  </div>
                  <div className="text-xs opacity-50 uppercase tracking-wider">Caffeine</div>
                </div>
                <div>
                  <div
                    className="font-display text-2xl font-black leading-none"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif", color: flavor.accent }}
                  >
                    {flavor.nutrition.sugar}
                  </div>
                  <div className="text-xs opacity-50 uppercase tracking-wider">Sugar</div>
                </div>
              </div>

              {/* Active indicator */}
              {isActive && (
                <div
                  className="mt-6 text-xs font-display uppercase tracking-widest flex items-center gap-2"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, color: flavor.accent }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: flavor.accent }} />
                  Currently Selected
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Scrolling ticker tape */}
      <div className="overflow-hidden border-y-2 border-black/10 py-4">
        <div ref={tickerRef} className="ticker-inner flex gap-12 whitespace-nowrap">
          {[...Array(4)].flatMap(() =>
            ['PROTEIN', 'CAFFEINE', 'ZERO SUGAR', 'RAW POWER', 'NIRO', 'PERFORMANCE'].map(
              (word, i) => (
                <span
                  key={`${word}-${i}`}
                  className="font-display font-black uppercase text-3xl tracking-tight"
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    color: i % 2 === 0 ? '#0a0a0a' : activeFlavor.accent,
                    opacity: i % 2 === 0 ? 0.15 : 0.6,
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
