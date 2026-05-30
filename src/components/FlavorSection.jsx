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
  const listRef    = useRef()
  const { activeFlavor, setFlavor } = useFlavorStore()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        yPercent: -18, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
      gsap.fromTo(headRef.current,
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' } }
      )
      gsap.fromTo(Array.from(listRef.current?.children ?? []),
        { opacity: 0, x: -32 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="flavors" ref={sectionRef} className="section-frame" style={{ background: 'var(--page-bg)' }}>

      {/* Ghost word */}
      <div ref={bgRef} aria-hidden="true"
        className="absolute inset-0 z-10 flex items-center justify-end overflow-hidden pointer-events-none select-none"
        style={{ paddingRight: '4vw' }}>
        <span className="vp-word text-[#0a0a0a]" style={{ fontSize: 'clamp(8rem, 22vw, 28rem)', opacity: 0.032 }}>
          FLAVOR
        </span>
      </div>

      {/* UI */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center"
        style={{ paddingLeft: '8vw', paddingRight: '8vw', paddingTop: '80px' }}>

        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-6">
          <div style={{ width: '28px', height: '1px', background: activeFlavor.accent, transition: 'background 0.4s' }} />
          <span className="eyebrow" style={{ opacity: 0.45 }}>02 &nbsp;/&nbsp; Choose Your Weapon</span>
        </div>

        {/* Headline */}
        <div ref={headRef} className="mb-8">
          <h2 className="headline text-[#0a0a0a]" style={{ fontSize: 'clamp(3rem, 7.5vw, 8rem)' }}>Pick Your</h2>
          <h2 className="headline" style={{
            fontSize: 'clamp(3rem, 7.5vw, 8rem)',
            color: activeFlavor.accent, transition: 'color 0.45s',
          }}>Flavor</h2>
        </div>

        {/* Flavor selector — vertical stack, constrained left */}
        <div ref={listRef} className="flex flex-col gap-3" style={{ maxWidth: '44vw' }}>
          {FLAVORS.map(fl => {
            const on = activeFlavor.id === fl.id
            return (
              <button
                key={fl.id}
                onClick={() => setFlavor(fl)}
                className="text-left flex items-center gap-5 transition-all duration-300 cursor-pointer group"
                style={{
                  padding: '16px 22px',
                  background: on ? '#fff' : 'rgba(255,255,255,0.45)',
                  border: `1.5px solid ${on ? fl.accent : 'rgba(0,0,0,0.08)'}`,
                  boxShadow: on ? `0 12px 40px rgba(${fl.accentRgb},.14), 0 2px 8px rgba(0,0,0,0.06)` : 'none',
                  transform: on ? 'translateX(6px)' : 'translateX(0)',
                }}
              >
                {/* Accent bar */}
                <div style={{
                  width: '3px', alignSelf: 'stretch', flexShrink: 0, minHeight: '44px',
                  background: on ? fl.accent : 'rgba(0,0,0,0.1)',
                  transition: 'background 0.3s',
                }} />

                {/* Emoji */}
                <span style={{ fontSize: '1.8rem', lineHeight: 1, flexShrink: 0 }}>{fl.emoji}</span>

                {/* Name + tagline */}
                <div className="flex-1 min-w-0">
                  <div className="headline" style={{
                    fontSize: 'clamp(1.15rem, 1.8vw, 1.8rem)',
                    color: on ? fl.accent : '#0a0a0a', transition: 'color 0.3s',
                  }}>
                    {fl.name}
                  </div>
                  <div className="eyebrow" style={{ opacity: 0.32, fontSize: '0.58rem', letterSpacing: '0.18em', marginTop: '2px' }}>
                    {fl.tagline}
                  </div>
                </div>

                {/* Key stats */}
                <div className="flex items-center gap-6 flex-shrink-0">
                  {[
                    { v: fl.nutrition.protein,  l: 'Protein'  },
                    { v: fl.nutrition.caffeine, l: 'Caffeine' },
                  ].map(({ v, l }) => (
                    <div key={l} className="text-right">
                      <div className="headline" style={{ fontSize: 'clamp(1rem, 1.4vw, 1.4rem)', color: on ? fl.accent : '#0a0a0a', transition: 'color 0.3s' }}>{v}</div>
                      <div className="eyebrow" style={{ opacity: 0.3, fontSize: '0.52rem' }}>{l}</div>
                    </div>
                  ))}
                </div>

                {/* Arrow */}
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
                  fontSize: '1.1rem', color: on ? fl.accent : 'rgba(0,0,0,0.2)',
                  transition: 'color 0.3s, transform 0.3s',
                  transform: on ? 'translateX(3px)' : 'none',
                }}>→</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Ticker tape — anchored to bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20 overflow-hidden py-3"
        style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}>
        <div className="ticker-track flex gap-16 whitespace-nowrap">
          {[...Array(6)].flatMap((_, r) =>
            ['PROTEIN', 'CAFFEINE', 'ZERO SUGAR', 'RAW POWER', 'NIRO', '20G'].map((w, i) => (
              <span key={`${r}-${i}`} style={{
                fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900,
                fontSize: 'clamp(1.1rem, 1.8vw, 1.8rem)', textTransform: 'uppercase',
                color: i % 2 === 0 ? '#0a0a0a' : activeFlavor.accent,
                opacity: i % 2 === 0 ? 0.09 : 0.48, transition: 'color 0.4s',
              }}>{w}</span>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
