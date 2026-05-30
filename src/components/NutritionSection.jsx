import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useFlavorStore } from '../store/flavorStore'

gsap.registerPlugin(ScrollTrigger)

const CALLOUTS = [
  { key: 'protein',  label: 'Protein' },
  { key: 'caffeine', label: 'Caffeine' },
  { key: 'calories', label: 'Calories' },
  { key: 'sodium',   label: 'Sodium' },
]

export default function NutritionSection() {
  const sectionRef  = useRef()
  const bgRef       = useRef()
  const panelRef    = useRef()
  const rightRef    = useRef()
  const { activeFlavor } = useFlavorStore()
  const n = activeFlavor.nutrition

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        yPercent: -16, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
      gsap.fromTo(panelRef.current,
        { opacity: 0, x: -44 },
        { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 74%' } }
      )
      gsap.fromTo(rightRef.current?.children ? Array.from(rightRef.current.children) : [],
        { opacity: 0, x: 38 },
        { opacity: 1, x: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 64%' } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [activeFlavor])

  return (
    <section id="nutrition" ref={sectionRef} className="section-frame" style={{ background: 'var(--page-bg)' }}>

      {/* ── z-10: bg word ───────────────────────────────────────────────── */}
      <div ref={bgRef} aria-hidden="true"
        className="absolute inset-0 z-10 flex items-center justify-end overflow-hidden select-none pointer-events-none pr-[4vw]">
        <span className="vp-word" style={{
          fontSize: 'clamp(6rem, 20vw, 26rem)',
          color: `rgba(${activeFlavor.accentRgb}, 0.07)`,
          transition: 'color 0.5s',
        }}>
          FACTS
        </span>
      </div>

      {/* ── z-20: UI ────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-20 flex flex-col px-8 md:px-16 lg:px-24 pt-10 pb-8">

        {/* Label */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px w-8" style={{ background: activeFlavor.accent, transition: 'background 0.4s' }} />
          <span className="label-tag" style={{ opacity: 0.45 }}>03 / What's Inside</span>
        </div>

        {/* Two-column content fills remaining height */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 flex-1 min-h-0 items-start">

          {/* Left: headline + FDA panel */}
          <div ref={panelRef} className="flex flex-col gap-5 min-h-0">
            <h2 className="headline" style={{ fontSize: 'clamp(2.8rem, 6vw, 7rem)' }}>
              <span style={{ color: '#0a0a0a' }}>Nutrition</span>
              <br />
              <span style={{ color: activeFlavor.accent, transition: 'color 0.4s' }}>Facts</span>
            </h2>

            {/* FDA-style panel — compact */}
            <div style={{ border: '3px solid #0a0a0a', padding: '16px 20px', background: '#fff', maxWidth: '380px' }}>
              <div style={{ borderBottom: '8px solid #0a0a0a', paddingBottom: '6px', marginBottom: '6px' }}>
                <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '2.1rem', lineHeight: 1 }}>
                  Nutrition Facts
                </p>
                <p style={{ fontSize: '0.78rem', opacity: 0.55, marginTop: '3px' }}>Serving Size 1 can (355 mL)</p>
              </div>

              {/* Calories */}
              <div className="nut-row" style={{ borderTop: '8px solid #0a0a0a', paddingTop: '4px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Calories</span>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '2.1rem', lineHeight: 1 }}>{n.calories}</span>
              </div>

              {[
                ['Total Fat', '0g'], ['Saturated Fat', '0g', true], ['Sodium', n.sodium],
                ['Total Carbohydrate', '3g'], ['Total Sugars', n.sugar, true],
              ].map(([label, val, sub]) => (
                <div key={label} className="nut-row" style={{ paddingLeft: sub ? '12px' : 0 }}>
                  <span style={{ fontWeight: sub ? 400 : 600, fontSize: '0.8rem' }}>{label}</span>
                  <span style={{ fontSize: '0.8rem' }}>{val}</span>
                </div>
              ))}

              {[['Protein', n.protein], ['Caffeine', n.caffeine]].map(([l, v]) => (
                <div key={l} className="nut-row" style={{ borderTop: `3px solid ${activeFlavor.accent}`, transition: 'border-color 0.4s' }}>
                  <span style={{ fontWeight: 700, color: activeFlavor.accent, fontSize: '0.85rem', transition: 'color 0.4s' }}>{l}</span>
                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '1.2rem', lineHeight: 1, color: activeFlavor.accent, transition: 'color 0.4s' }}>{v}</span>
                </div>
              ))}
            </div>

            <p style={{ fontSize: '0.68rem', opacity: 0.28, maxWidth: '340px', lineHeight: 1.6 }}>
              * Not recommended for children or caffeine-sensitive individuals.
            </p>
          </div>

          {/* Right: big callout numbers — data cards */}
          <div ref={rightRef} className="grid grid-cols-2 gap-4 content-start">
            {CALLOUTS.map(c => (
              <div key={c.key} className="flex items-stretch gap-4 bg-white"
                style={{ padding: '18px 22px', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
                <div className="w-0.5 flex-shrink-0 self-stretch"
                  style={{ background: activeFlavor.accent, transition: 'background 0.4s', minHeight: '40px' }} />
                <div>
                  <div className="headline"
                    style={{ fontSize: 'clamp(2rem, 3.5vw, 3.8rem)', color: activeFlavor.accent, transition: 'color 0.4s' }}>
                    {n[c.key]}
                  </div>
                  <div className="label-tag" style={{ opacity: 0.4, marginTop: '4px', fontSize: '0.62rem' }}>
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
