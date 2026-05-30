import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useFlavorStore } from '../store/flavorStore'

gsap.registerPlugin(ScrollTrigger)

const CALLOUTS = [
  { label: 'Protein per can', key: 'protein' },
  { label: 'Caffeine per can', key: 'caffeine' },
  { label: 'Calories per serving', key: 'calories' },
  { label: 'Sodium per can', key: 'sodium' },
]

export default function NutritionSection() {
  const sectionRef = useRef()
  const panelRef = useRef()
  const calloutsRef = useRef([])
  const { activeFlavor } = useFlavorStore()
  const n = activeFlavor.nutrition

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      )
      gsap.fromTo(
        calloutsRef.current.filter(Boolean),
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
        }
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
      {/* Faint large section number */}
      <div
        aria-hidden="true"
        className="absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none leading-none"
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 900,
          fontSize: 'clamp(12rem, 30vw, 30rem)',
          color: `rgba(${activeFlavor.accentRgb}, 0.05)`,
          transition: 'color 0.4s',
          lineHeight: 1,
        }}
      >
        03
      </div>

      <div className="relative z-10 px-8 md:px-16 lg:px-24">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-12">
          <div className="w-8 h-px" style={{ background: activeFlavor.accent }} />
          <span
            className="text-xs tracking-[0.25em] uppercase"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              opacity: 0.45,
            }}
          >
            03 / What's Inside
          </span>
        </div>

        {/* Two-column layout — left: label + panel, right: callout numbers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left column */}
          <div ref={panelRef}>
            <h2
              className="mb-10"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 900,
                fontSize: 'clamp(3.5rem, 7vw, 7rem)',
                lineHeight: 0.88,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
              }}
            >
              <span style={{ color: '#0a0a0a' }}>Nutrition</span>
              <br />
              <span style={{ color: activeFlavor.accent, transition: 'color 0.4s' }}>Facts</span>
            </h2>

            {/* Nutrition label */}
            <div
              className="bg-white"
              style={{
                border: '3px solid #0a0a0a',
                padding: '20px 24px',
                maxWidth: '420px',
              }}
            >
              <div style={{ borderBottom: '8px solid #0a0a0a', paddingBottom: '10px', marginBottom: '10px' }}>
                <p
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 900,
                    fontSize: '2.8rem',
                    lineHeight: 1,
                  }}
                >
                  Nutrition Facts
                </p>
                <p style={{ fontSize: '0.85rem', opacity: 0.6, marginTop: '4px' }}>
                  Serving Size 1 can (355 mL)
                </p>
              </div>

              {[
                { label: 'Calories', val: n.calories, bold: true, thick: true },
                { label: 'Total Fat', val: '0g' },
                { label: 'Saturated Fat', val: '0g', indent: true },
                { label: 'Trans Fat', val: '0g', indent: true },
                { label: 'Sodium', val: n.sodium },
                { label: 'Total Carbohydrate', val: '3g' },
                { label: 'Total Sugars', val: n.sugar, indent: true },
              ].map(({ label, val, bold, thick, indent }) => (
                <div
                  key={label}
                  className="flex justify-between items-baseline py-1.5"
                  style={{
                    borderTop: thick ? '8px solid #0a0a0a' : '1px solid rgba(0,0,0,0.1)',
                    paddingLeft: indent ? '16px' : '0',
                  }}
                >
                  <span style={{ fontWeight: bold ? 700 : 400, fontSize: '0.875rem' }}>{label}</span>
                  <span style={{ fontWeight: bold ? 900 : 400, fontSize: bold ? '2rem' : '0.875rem', lineHeight: 1 }}>
                    {val}
                  </span>
                </div>
              ))}

              {/* Highlighted rows */}
              {[
                { label: 'Protein', val: n.protein },
                { label: 'Caffeine', val: n.caffeine },
              ].map(({ label, val }) => (
                <div
                  key={label}
                  className="flex justify-between items-baseline py-1.5"
                  style={{ borderTop: `3px solid ${activeFlavor.accent}`, transition: 'border-color 0.4s' }}
                >
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      color: activeFlavor.accent,
                      transition: 'color 0.4s',
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontWeight: 900,
                      fontSize: '1.25rem',
                      lineHeight: 1,
                      color: activeFlavor.accent,
                      transition: 'color 0.4s',
                    }}
                  >
                    {val}
                  </span>
                </div>
              ))}
            </div>

            <p
              className="mt-5 leading-relaxed"
              style={{ fontSize: '0.75rem', opacity: 0.35, maxWidth: '380px' }}
            >
              * Percent Daily Values are based on a 2,000 calorie diet.
              Not recommended for children, pregnant women, or caffeine-sensitive individuals.
            </p>
          </div>

          {/* Right column — big callout numbers */}
          <div className="flex flex-col gap-5">
            {CALLOUTS.map((c, i) => (
              <div
                key={c.key}
                ref={(el) => (calloutsRef.current[i] = el)}
                className="flex items-center gap-5 bg-white"
                style={{
                  padding: '24px 28px',
                  border: '1px solid rgba(0,0,0,0.07)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                }}
              >
                <div
                  className="self-stretch w-1 flex-shrink-0 rounded-full"
                  style={{ background: activeFlavor.accent, transition: 'background 0.4s', minHeight: '48px' }}
                />
                <div>
                  <div
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 900,
                      fontSize: 'clamp(3rem, 4.5vw, 4.5rem)',
                      lineHeight: 0.9,
                      color: activeFlavor.accent,
                      transition: 'color 0.4s',
                    }}
                  >
                    {n[c.key]}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      opacity: 0.45,
                      marginTop: '6px',
                    }}
                  >
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
