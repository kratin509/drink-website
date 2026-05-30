import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FLAVORS } from '../constants/flavors'
import { useFlavorStore } from '../store/flavorStore'

gsap.registerPlugin(ScrollTrigger)

export default function FlavorSection() {
  const sectionRef = useRef()
  const bgRef      = useRef()
  const headRef    = useRef()
  const cardsRef   = useRef([])
  const { activeFlavor, setFlavor } = useFlavorStore()

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Bg word parallax slower than page
      gsap.to(bgRef.current, {
        yPercent: -20, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })

      gsap.fromTo(headRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
      )
      gsap.fromTo(cardsRef.current.filter(Boolean),
        { opacity: 0, y: 44 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="flavors" ref={sectionRef} className="section-frame" style={{ background: 'var(--page-bg)' }}>

      {/* ── z-10: bg word ───────────────────────────────────────────────── */}
      <div
        ref={bgRef}
        aria-hidden="true"
        className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden select-none pointer-events-none"
      >
        <span className="vp-word text-[#0a0a0a]"
          style={{ fontSize: 'clamp(8rem, 24vw, 30rem)', opacity: 0.038 }}>
          FLAVOR
        </span>
      </div>

      {/* ── z-20: UI ────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-20 flex flex-col px-8 md:px-16 lg:px-24 pt-10 pb-6">

        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-px w-8" style={{ background: activeFlavor.accent, transition: 'background 0.4s' }} />
            <span className="label-tag" style={{ opacity: 0.45 }}>02 / Choose Your Weapon</span>
          </div>
        </div>

        {/* Headline */}
        <div ref={headRef} className="mb-6">
          <h2 className="headline text-[#0a0a0a]" style={{ fontSize: 'clamp(3rem, 8.5vw, 9rem)' }}>Pick Your</h2>
          <h2 className="headline" style={{ fontSize: 'clamp(3rem, 8.5vw, 9rem)', color: activeFlavor.accent, transition: 'color 0.4s' }}>Flavor</h2>
        </div>

        {/* Cards — 3 col, compact fit inside h-screen */}
        <div className="grid grid-cols-3 gap-5 flex-1 min-h-0 mb-4">
          {FLAVORS.map((fl, i) => {
            const on = activeFlavor.id === fl.id
            return (
              <button
                key={fl.id}
                ref={el => (cardsRef.current[i] = el)}
                onClick={() => setFlavor(fl)}
                className="text-left flex flex-col transition-all duration-300 cursor-pointer"
                style={{
                  padding: '1.25rem 1.5rem',
                  background: '#fff',
                  border: `2px solid ${on ? fl.accent : 'rgba(0,0,0,0.08)'}`,
                  boxShadow: on ? `0 20px 52px rgba(${fl.accentRgb},.16)` : '0 2px 8px rgba(0,0,0,0.04)',
                  transform: on ? 'translateY(-5px)' : 'none',
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <span style={{ fontSize: '1.9rem', lineHeight: 1 }}>{fl.emoji}</span>
                  {on && (
                    <span className="label-tag" style={{ fontSize: '0.58rem', padding: '2px 7px', background: `rgba(${fl.accentRgb},.1)`, color: fl.accent }}>
                      Active
                    </span>
                  )}
                </div>

                <h3 className="headline mb-1" style={{ fontSize: 'clamp(1.2rem, 1.8vw, 1.9rem)', color: on ? fl.accent : '#0a0a0a', transition: 'color 0.3s' }}>
                  {fl.name}
                </h3>

                <p className="label-tag mb-3" style={{ opacity: 0.36, letterSpacing: '0.18em', fontSize: '0.62rem' }}>{fl.tagline}</p>

                <div className="flex flex-wrap gap-1.5 mb-auto">
                  {fl.ingredients.map(ing => (
                    <span key={ing} style={{
                      fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
                      fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                      padding: '2px 6px', background: `rgba(${fl.accentRgb},.09)`, color: fl.accent,
                    }}>{ing}</span>
                  ))}
                </div>

                <div className="flex gap-5 pt-3 mt-3" style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}>
                  {[
                    { v: fl.nutrition.protein,  l: 'Protein' },
                    { v: fl.nutrition.caffeine, l: 'Caffeine' },
                    { v: fl.nutrition.sugar,    l: 'Sugar' },
                  ].map(({ v, l }) => (
                    <div key={l}>
                      <div className="headline" style={{ fontSize: 'clamp(1.1rem, 1.6vw, 1.6rem)', color: fl.accent }}>{v}</div>
                      <div className="label-tag" style={{ opacity: 0.38, fontSize: '0.6rem', letterSpacing: '0.14em' }}>{l}</div>
                    </div>
                  ))}
                </div>
              </button>
            )
          })}
        </div>

        {/* Ticker — bottom of section */}
        <div className="overflow-hidden py-3" style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
          <div className="ticker-inner flex gap-14 whitespace-nowrap">
            {[...Array(4)].flatMap((_, r) =>
              ['PROTEIN', 'CAFFEINE', 'ZERO SUGAR', 'RAW POWER', 'NIRO', '20G PROTEIN'].map((w, i) => (
                <span key={`${r}-${i}`} style={{
                  fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900,
                  fontSize: 'clamp(1.3rem, 2.2vw, 2.2rem)', textTransform: 'uppercase',
                  color: i % 2 === 0 ? '#0a0a0a' : activeFlavor.accent,
                  opacity: i % 2 === 0 ? 0.1 : 0.55, transition: 'color 0.4s',
                }}>{w}</span>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
