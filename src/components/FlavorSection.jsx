import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FLAVORS } from '../constants/flavors'
import { useFlavorStore } from '../store/flavorStore'

gsap.registerPlugin(ScrollTrigger)

export default function FlavorSection() {
  const sectionRef = useRef()
  const headRef    = useRef()
  const cardsRef   = useRef([])
  const { activeFlavor, setFlavor } = useFlavorStore()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headRef.current,
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' } }
      )
      gsap.fromTo(cardsRef.current.filter(Boolean),
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 64%' } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="flavors"
      ref={sectionRef}
      className="w-screen h-screen overflow-hidden flex flex-col justify-center items-start relative"
      style={{ paddingLeft: '10vw', paddingRight: '10vw' }}
    >
      {/* Bg word */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none" style={{ zIndex: 0 }}>
        <span className="vp-word text-[#0a0a0a]" style={{ fontSize: 'clamp(8rem, 24vw, 30rem)', opacity: 0.034 }}>
          FLAVOR
        </span>
      </div>

      <div style={{ position: 'relative', zIndex: 10, width: '100%' }}>
        {/* Label */}
        <div className="flex items-center gap-3 mb-5">
          <div className="h-px w-8" style={{ background: activeFlavor.accent, transition: 'background 0.4s' }} />
          <span className="label-tag" style={{ opacity: 0.45 }}>02 / Choose Your Weapon</span>
        </div>

        {/* Headline */}
        <div ref={headRef} className="mb-6">
          <h2 className="headline text-[#0a0a0a]" style={{ fontSize: 'clamp(2.8rem, 7.5vw, 8.5rem)' }}>Pick Your</h2>
          <h2 className="headline mb-1" style={{ fontSize: 'clamp(2.8rem, 7.5vw, 8.5rem)', color: activeFlavor.accent, transition: 'color 0.4s' }}>Flavor</h2>
        </div>

        {/* Flavor cards — constrained to left 55% so they don't crowd the can */}
        <div className="grid grid-cols-3 gap-4" style={{ maxWidth: '56vw' }}>
          {FLAVORS.map((fl, i) => {
            const on = activeFlavor.id === fl.id
            return (
              <button
                key={fl.id}
                ref={el => (cardsRef.current[i] = el)}
                onClick={() => setFlavor(fl)}
                className="text-left flex flex-col transition-all duration-300 cursor-pointer"
                style={{
                  padding: '1.1rem 1.3rem',
                  background: 'rgba(255,255,255,0.88)',
                  backdropFilter: 'blur(8px)',
                  border: `2px solid ${on ? fl.accent : 'rgba(0,0,0,0.08)'}`,
                  boxShadow: on ? `0 16px 44px rgba(${fl.accentRgb},.18)` : '0 2px 8px rgba(0,0,0,0.05)',
                  transform: on ? 'translateY(-4px)' : 'none',
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <span style={{ fontSize: '1.7rem', lineHeight: 1 }}>{fl.emoji}</span>
                  {on && (
                    <span className="label-tag" style={{ fontSize: '0.55rem', padding: '2px 6px', background: `rgba(${fl.accentRgb},.1)`, color: fl.accent }}>
                      Active
                    </span>
                  )}
                </div>
                <h3 className="headline mb-1" style={{ fontSize: 'clamp(1rem, 1.6vw, 1.7rem)', color: on ? fl.accent : '#0a0a0a', transition: 'color 0.3s' }}>
                  {fl.name}
                </h3>
                <p className="label-tag mb-3" style={{ opacity: 0.34, letterSpacing: '0.15em', fontSize: '0.58rem' }}>{fl.tagline}</p>
                <div className="flex gap-4 pt-2" style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}>
                  {[
                    { v: fl.nutrition.protein,  l: 'Protein' },
                    { v: fl.nutrition.caffeine, l: 'Caffeine' },
                    { v: fl.nutrition.sugar,    l: 'Sugar' },
                  ].map(({ v, l }) => (
                    <div key={l}>
                      <div className="headline" style={{ fontSize: 'clamp(0.9rem, 1.3vw, 1.4rem)', color: fl.accent }}>{v}</div>
                      <div className="label-tag" style={{ opacity: 0.36, fontSize: '0.55rem' }}>{l}</div>
                    </div>
                  ))}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
