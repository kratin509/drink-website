import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useFlavorStore } from '../store/flavorStore'
import { useMobile } from '../hooks/useMobile'

gsap.registerPlugin(ScrollTrigger)

const CALLOUTS = [
  { key: 'protein',  label: 'Protein / can'  },
  { key: 'caffeine', label: 'Caffeine / can' },
  { key: 'calories', label: 'Calories'       },
  { key: 'sodium',   label: 'Sodium'         },
]

export default function NutritionSection() {
  const sectionRef = useRef()
  const bgRef      = useRef()
  const panelRef   = useRef()
  const nutsRef    = useRef()
  const { activeFlavor } = useFlavorStore()
  const isMobile = useMobile()
  const n = activeFlavor.nutrition

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        yPercent: -14, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
      gsap.fromTo(panelRef.current,
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 74%' } }
      )
      gsap.fromTo(Array.from(nutsRef.current?.children ?? []),
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.09, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 62%' } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [activeFlavor])

  return (
    <section id="nutrition" ref={sectionRef} className="section-frame" style={{ background: 'var(--page-bg)' }}>

      {/* Ghost word */}
      <div ref={bgRef} aria-hidden="true"
        className="absolute inset-0 z-10 flex items-center justify-end overflow-hidden pointer-events-none select-none"
        style={{ paddingRight: '3vw' }}>
        <span className="vp-word" style={{
          fontSize: isMobile ? 'clamp(4rem, 20vw, 10rem)' : 'clamp(6rem, 18vw, 24rem)',
          color: `rgba(${activeFlavor.accentRgb}, 0.07)`,
          transition: 'color 0.5s',
        }}>FACTS</span>
      </div>

      {/* UI */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center"
        style={{
          paddingLeft:  isMobile ? '5vw' : '8vw',
          paddingRight: isMobile ? '5vw' : '8vw',
          paddingTop:   isMobile ? '90px' : '80px',
          paddingBottom: isMobile ? '40px' : '0',
          overflowY: isMobile ? 'auto' : 'visible',
        }}>

        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-6">
          <div style={{ width: '28px', height: '1px', background: activeFlavor.accent, transition: 'background 0.4s' }} />
          <span className="eyebrow" style={{ opacity: 0.45 }}>03 &nbsp;/&nbsp; What's Inside</span>
        </div>

        {/* Layout: side-by-side on desktop, stacked on mobile */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'flex-start',
          gap: isMobile ? '28px' : '56px',
          maxWidth: isMobile ? '100%' : '68vw',
        }}>

          {/* FDA panel */}
          <div ref={panelRef} style={{ flexShrink: 0, width: isMobile ? '100%' : 'auto' }}>
            <h2 className="headline mb-4" style={{ fontSize: isMobile ? 'clamp(2rem, 8vw, 3rem)' : 'clamp(2.8rem, 5.5vw, 6.5rem)' }}>
              <span style={{ color: '#0a0a0a' }}>Nutrition</span>
              <br />
              <span style={{ color: activeFlavor.accent, transition: 'color 0.4s' }}>Facts</span>
            </h2>

            <div style={{ border: '3px solid #0a0a0a', padding: '14px 18px', background: '#fff', width: isMobile ? '100%' : '310px', maxWidth: '100%' }}>
              <div style={{ borderBottom: '8px solid #0a0a0a', paddingBottom: '5px', marginBottom: '6px' }}>
                <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '1.85rem', lineHeight: 1 }}>
                  Nutrition Facts
                </p>
                <p style={{ fontSize: '0.72rem', opacity: 0.5, marginTop: '3px' }}>1 can (355 mL)</p>
              </div>
              <div className="nut-row" style={{ borderTop: '8px solid #0a0a0a', paddingTop: '4px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.82rem' }}>Calories</span>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '1.85rem', lineHeight: 1 }}>{n.calories}</span>
              </div>
              {[
                ['Total Fat', '0g'], ['Saturated Fat', '0g', true],
                ['Sodium', n.sodium], ['Total Carbs', '3g'],
                ['Total Sugars', n.sugar, true],
              ].map(([label, val, sub]) => (
                <div key={label} className="nut-row" style={{ paddingLeft: sub ? '10px' : 0 }}>
                  <span style={{ fontWeight: sub ? 400 : 600, fontSize: '0.74rem' }}>{label}</span>
                  <span style={{ fontSize: '0.74rem' }}>{val}</span>
                </div>
              ))}
              {[['Protein', n.protein], ['Caffeine', n.caffeine]].map(([l, v]) => (
                <div key={l} className="nut-row" style={{ borderTop: `3px solid ${activeFlavor.accent}`, transition: 'border-color 0.4s' }}>
                  <span style={{ fontWeight: 700, color: activeFlavor.accent, fontSize: '0.8rem', transition: 'color 0.4s' }}>{l}</span>
                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '1.1rem', lineHeight: 1, color: activeFlavor.accent, transition: 'color 0.4s' }}>{v}</span>
                </div>
              ))}
            </div>

            <p style={{ fontSize: '0.62rem', opacity: 0.24, maxWidth: '300px', lineHeight: 1.6, marginTop: '10px' }}>
              * Not recommended for children or caffeine-sensitive individuals.
            </p>
          </div>

          {/* Callout numbers — vertical column */}
          <div ref={nutsRef} style={{
            display: isMobile ? 'grid' : 'flex',
            gridTemplateColumns: isMobile ? '1fr 1fr' : undefined,
            flexDirection: isMobile ? undefined : 'column',
            gap: '12px',
            width: isMobile ? '100%' : '220px',
            flexShrink: 0,
          }}>
            {CALLOUTS.map(c => (
              <div key={c.key} className="flex items-stretch gap-4"
                style={{ padding: '14px 16px', background: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}>
                <div style={{ width: '2px', flexShrink: 0, alignSelf: 'stretch', background: activeFlavor.accent, transition: 'background 0.4s', minHeight: '32px' }} />
                <div>
                  <div className="headline" style={{
                    fontSize: isMobile ? 'clamp(1.4rem, 5vw, 2rem)' : 'clamp(2rem, 3.2vw, 3.6rem)',
                    color: activeFlavor.accent, transition: 'color 0.4s',
                  }}>
                    {n[c.key]}
                  </div>
                  <div className="eyebrow" style={{ opacity: 0.36, marginTop: '4px', fontSize: '0.55rem' }}>
                    {c.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
