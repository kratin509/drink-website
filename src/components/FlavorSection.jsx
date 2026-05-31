import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FLAVORS } from '../constants/flavors'
import { useFlavorStore } from '../store/flavorStore'
import { useMobile } from '../hooks/useMobile'

gsap.registerPlugin(ScrollTrigger)

export default function FlavorSection() {
  const sectionRef = useRef()
  const bgRef      = useRef()
  const headRef    = useRef()
  const listRef    = useRef()
  const { activeFlavor, setFlavor } = useFlavorStore()
  const isMobile = useMobile()

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
        <span className="vp-word text-[#0a0a0a]" style={{ fontSize: isMobile ? 'clamp(5rem, 28vw, 12rem)' : 'clamp(8rem, 22vw, 28rem)', opacity: 0.032 }}>
          FLAVOR
        </span>
      </div>

      {/* UI */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center"
        style={{
          paddingLeft:  isMobile ? '5vw' : '8vw',
          paddingRight: isMobile ? '5vw' : '8vw',
          paddingTop:   isMobile ? '90px' : '80px',
          paddingBottom: isMobile ? '80px' : '0',
        }}>

        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-6">
          <div style={{ width: '28px', height: '1px', background: activeFlavor.accent, transition: 'background 0.4s' }} />
          <span className="eyebrow" style={{ opacity: 0.45 }}>02 &nbsp;/&nbsp; Choose Your Weapon</span>
        </div>

        {/* Headline */}
        <div ref={headRef} className="mb-6">
          <h2 className="headline text-[#0a0a0a]" style={{ fontSize: isMobile ? 'clamp(2.4rem, 10vw, 4rem)' : 'clamp(3rem, 7.5vw, 8rem)' }}>Pick Your</h2>
          <h2 className="headline" style={{
            fontSize: isMobile ? 'clamp(2.4rem, 10vw, 4rem)' : 'clamp(3rem, 7.5vw, 8rem)',
            color: activeFlavor.accent, transition: 'color 0.45s',
          }}>Flavor</h2>
        </div>

        {/* Flavor list */}
        <div ref={listRef} className="flex flex-col gap-3" style={{ maxWidth: isMobile ? '100%' : '44vw' }}>
          {FLAVORS.map(fl => {
            const on = activeFlavor.id === fl.id
            return (
              <button
                key={fl.id}
                onClick={() => setFlavor(fl)}
                className="text-left flex items-center gap-4 transition-all duration-300 cursor-pointer"
                style={{
                  padding: isMobile ? '12px 14px' : '16px 22px',
                  background: on ? '#fff' : 'rgba(255,255,255,0.45)',
                  border: `1.5px solid ${on ? fl.accent : 'rgba(0,0,0,0.08)'}`,
                  boxShadow: on ? `0 8px 28px rgba(${fl.accentRgb},.14)` : 'none',
                  transform: on ? 'translateX(4px)' : 'translateX(0)',
                }}
              >
                <div style={{ width: '3px', alignSelf: 'stretch', flexShrink: 0, minHeight: '32px', background: on ? fl.accent : 'rgba(0,0,0,0.1)', transition: 'background 0.3s' }} />
                <span style={{ fontSize: isMobile ? '1.4rem' : '1.8rem', lineHeight: 1, flexShrink: 0 }}>{fl.emoji}</span>

                <div className="flex-1 min-w-0">
                  <div className="headline" style={{
                    fontSize: isMobile ? 'clamp(1rem, 4vw, 1.3rem)' : 'clamp(1.15rem, 1.8vw, 1.8rem)',
                    color: on ? fl.accent : '#0a0a0a', transition: 'color 0.3s',
                  }}>{fl.name}</div>
                  <div className="eyebrow" style={{ opacity: 0.32, fontSize: '0.55rem', letterSpacing: '0.18em', marginTop: '2px' }}>{fl.tagline}</div>
                </div>

                {/* Stats — both on desktop, one on mobile */}
                <div className="flex items-center flex-shrink-0" style={{ gap: isMobile ? '12px' : '24px' }}>
                  <div className="text-right">
                    <div className="headline" style={{ fontSize: isMobile ? '0.95rem' : 'clamp(1rem, 1.4vw, 1.4rem)', color: on ? fl.accent : '#0a0a0a', transition: 'color 0.3s' }}>{fl.nutrition.protein}</div>
                    <div className="eyebrow" style={{ opacity: 0.3, fontSize: '0.52rem' }}>Protein</div>
                  </div>
                  {!isMobile && (
                    <div className="text-right">
                      <div className="headline" style={{ fontSize: 'clamp(1rem, 1.4vw, 1.4rem)', color: on ? fl.accent : '#0a0a0a', transition: 'color 0.3s' }}>{fl.nutrition.caffeine}</div>
                      <div className="eyebrow" style={{ opacity: 0.3, fontSize: '0.52rem' }}>Caffeine</div>
                    </div>
                  )}
                </div>

                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: on ? fl.accent : 'rgba(0,0,0,0.2)', transition: 'color 0.3s, transform 0.3s', transform: on ? 'translateX(3px)' : 'none' }}>→</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Ticker tape */}
      <div className="absolute bottom-0 left-0 right-0 z-20 overflow-hidden py-3"
        style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}>
        <div className="ticker-track flex gap-16 whitespace-nowrap">
          {[...Array(6)].flatMap((_, r) =>
            ['PROTEIN', 'CAFFEINE', 'ZERO SUGAR', 'RAW POWER', 'NIRO', '20G'].map((w, i) => (
              <span key={`${r}-${i}`} style={{
                fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900,
                fontSize: isMobile ? '0.95rem' : 'clamp(1.1rem, 1.8vw, 1.8rem)', textTransform: 'uppercase',
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
