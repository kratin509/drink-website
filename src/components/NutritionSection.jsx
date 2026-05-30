import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useFlavorStore } from '../store/flavorStore'

gsap.registerPlugin(ScrollTrigger)

const CALLOUTS = [
  { key: 'protein',  label: 'Protein',   unit: '' },
  { key: 'caffeine', label: 'Caffeine',  unit: '' },
  { key: 'calories', label: 'Calories',  unit: 'kcal' },
  { key: 'sodium',   label: 'Sodium',    unit: '' },
]

const NUT_ROWS = [
  { label: 'Total Fat',           sub: false, key: null,      fixed: '0g' },
  { label: 'Saturated Fat',       sub: true,  key: null,      fixed: '0g' },
  { label: 'Trans Fat',           sub: true,  key: null,      fixed: '0g' },
  { label: 'Sodium',              sub: false, key: 'sodium',  fixed: null },
  { label: 'Total Carbohydrate',  sub: false, key: null,      fixed: '3g' },
  { label: 'Total Sugars',        sub: true,  key: 'sugar',   fixed: null },
]

export default function NutritionSection() {
  const sectionRef   = useRef()
  const bgWordRef    = useRef()
  const panelRef     = useRef()
  const calloutsRef  = useRef([])
  const { activeFlavor } = useFlavorStore()
  const n = activeFlavor.nutrition

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(bgWordRef.current, {
        yPercent: -14,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
      gsap.fromTo(panelRef.current,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' } }
      )
      gsap.fromTo(calloutsRef.current.filter(Boolean),
        { opacity: 0, x: 45 },
        { opacity: 1, x: 0, duration: 0.7, stagger: 0.09, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 62%' } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [activeFlavor])

  return (
    <section
      id="nutrition"
      ref={sectionRef}
      className="relative py-28 overflow-hidden"
      style={{ background: '#f8f8f6' }}
    >
      {/* Bg word */}
      <div
        ref={bgWordRef}
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-end pointer-events-none select-none overflow-hidden"
      >
        <span
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(7rem, 22vw, 28rem)',
            lineHeight: 0.82,
            letterSpacing: '-0.04em',
            color: `rgba(${activeFlavor.accentRgb}, 0.06)`,
            transition: 'color 0.5s',
            whiteSpace: 'nowrap',
            paddingRight: '4vw',
          }}
        >
          FACTS
        </span>
      </div>

      <div className="relative z-10 px-8 md:px-16 lg:px-24">
        {/* Label */}
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px w-8" style={{ background: activeFlavor.accent, transition: 'background 0.4s' }} />
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.45 }}>
            03 / What's Inside
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left: headline + panel */}
          <div ref={panelRef}>
            <h2 style={{
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900,
              fontSize: 'clamp(3.5rem, 7vw, 8rem)', lineHeight: 0.85,
              letterSpacing: '-0.03em', textTransform: 'uppercase', marginBottom: '2.5rem',
            }}>
              <span style={{ color: '#0a0a0a' }}>Nutrition</span>
              <br />
              <span style={{ color: activeFlavor.accent, transition: 'color 0.4s' }}>Facts</span>
            </h2>

            {/* FDA-style panel */}
            <div style={{ border: '3px solid #0a0a0a', padding: '20px 24px', background: '#fff', maxWidth: '400px' }}>
              <div style={{ borderBottom: '8px solid #0a0a0a', paddingBottom: '8px', marginBottom: '8px' }}>
                <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '2.5rem', lineHeight: 1 }}>
                  Nutrition Facts
                </p>
                <p style={{ fontSize: '0.82rem', opacity: 0.55, marginTop: '4px' }}>Serving Size 1 can (355 mL)</p>
              </div>

              {/* Calories hero row */}
              <div className="flex justify-between items-baseline py-2" style={{ borderTop: '8px solid #0a0a0a' }}>
                <span style={{ fontWeight: 700 }}>Calories</span>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '2.5rem', lineHeight: 1 }}>{n.calories}</span>
              </div>

              {NUT_ROWS.map(({ label, sub, key, fixed }) => (
                <div key={label} className="flex justify-between items-baseline py-1.5"
                  style={{ borderTop: '1px solid rgba(0,0,0,0.1)', paddingLeft: sub ? '16px' : '0' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: sub ? 400 : 600 }}>{label}</span>
                  <span style={{ fontSize: '0.85rem' }}>{key ? n[key] : fixed}</span>
                </div>
              ))}

              {/* Highlighted protein + caffeine */}
              {[
                { label: 'Protein',  key: 'protein' },
                { label: 'Caffeine', key: 'caffeine' },
              ].map(({ label, key }) => (
                <div key={key} className="flex justify-between items-baseline py-2"
                  style={{ borderTop: `3px solid ${activeFlavor.accent}`, transition: 'border-color 0.4s' }}>
                  <span style={{ fontWeight: 700, color: activeFlavor.accent, fontSize: '0.9rem', transition: 'color 0.4s' }}>{label}</span>
                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '1.3rem', lineHeight: 1, color: activeFlavor.accent, transition: 'color 0.4s' }}>{n[key]}</span>
                </div>
              ))}
            </div>

            <p style={{ fontSize: '0.72rem', opacity: 0.3, marginTop: '16px', maxWidth: '360px', lineHeight: 1.6 }}>
              * Not recommended for children, pregnant women, or caffeine-sensitive individuals.
            </p>
          </div>

          {/* Right: callout numbers */}
          <div className="flex flex-col gap-4 pt-4 lg:pt-20">
            {CALLOUTS.map((c, i) => (
              <div
                key={c.key}
                ref={el => (calloutsRef.current[i] = el)}
                className="flex items-stretch gap-5 bg-white"
                style={{ padding: '22px 26px', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
              >
                <div className="w-1 flex-shrink-0 self-stretch" style={{ background: activeFlavor.accent, transition: 'background 0.4s', minHeight: '44px' }} />
                <div>
                  <div style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 900,
                    fontSize: 'clamp(2.5rem, 4vw, 4.5rem)',
                    lineHeight: 0.9,
                    color: activeFlavor.accent,
                    transition: 'color 0.4s',
                  }}>
                    {n[c.key]}{c.unit && <span style={{ fontSize: '0.45em', opacity: 0.6 }}> {c.unit}</span>}
                  </div>
                  <div style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700,
                    fontSize: '0.68rem',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    opacity: 0.4,
                    marginTop: '6px',
                  }}>
                    {c.label} per can
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
