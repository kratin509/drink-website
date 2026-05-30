import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useFlavorStore } from '../store/flavorStore'

gsap.registerPlugin(ScrollTrigger)

const CALLOUTS = [
  { key: 'protein',  label: 'Protein'  },
  { key: 'caffeine', label: 'Caffeine' },
  { key: 'calories', label: 'Calories' },
  { key: 'sodium',   label: 'Sodium'   },
]

export default function NutritionSection() {
  const sectionRef = useRef()
  const panelRef   = useRef()
  const nutsRef    = useRef()
  const { activeFlavor } = useFlavorStore()
  const n = activeFlavor.nutrition

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(panelRef.current,
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 74%' } }
      )
      gsap.fromTo(Array.from(nutsRef.current?.children ?? []),
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.65, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 62%' } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [activeFlavor])

  return (
    <section
      id="nutrition"
      ref={sectionRef}
      className="w-screen h-screen overflow-hidden flex flex-col justify-center items-start relative"
      style={{ paddingLeft: '10vw', paddingRight: '10vw' }}
    >
      {/* Bg word — right-aligned */}
      <div className="absolute inset-0 flex items-center justify-end overflow-hidden pointer-events-none select-none pr-[6vw]" style={{ zIndex: 0 }}>
        <span className="vp-word" style={{ fontSize: 'clamp(6rem, 20vw, 26rem)', color: `rgba(${activeFlavor.accentRgb}, 0.065)`, transition: 'color 0.5s' }}>
          FACTS
        </span>
      </div>

      <div style={{ position: 'relative', zIndex: 10, width: '100%' }}>
        {/* Label */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px w-8" style={{ background: activeFlavor.accent, transition: 'background 0.4s' }} />
          <span className="label-tag" style={{ opacity: 0.45 }}>03 / What's Inside</span>
        </div>

        <div className="grid grid-cols-[auto_1fr] gap-12 items-start" style={{ maxWidth: '72vw' }}>
          {/* Left: headline + FDA panel */}
          <div ref={panelRef}>
            <h2 className="headline mb-5" style={{ fontSize: 'clamp(2.5rem, 5.5vw, 6.5rem)' }}>
              <span style={{ color: '#0a0a0a' }}>Nutrition</span>
              <br />
              <span style={{ color: activeFlavor.accent, transition: 'color 0.4s' }}>Facts</span>
            </h2>

            {/* FDA panel */}
            <div style={{ border: '3px solid #0a0a0a', padding: '14px 18px', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(6px)', maxWidth: '340px' }}>
              <div style={{ borderBottom: '8px solid #0a0a0a', paddingBottom: '5px', marginBottom: '5px' }}>
                <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '1.9rem', lineHeight: 1 }}>Nutrition Facts</p>
                <p style={{ fontSize: '0.74rem', opacity: 0.55, marginTop: '3px' }}>Serving Size 1 can (355 mL)</p>
              </div>
              <div className="nut-row" style={{ borderTop: '8px solid #0a0a0a', paddingTop: '4px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Calories</span>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '1.9rem', lineHeight: 1 }}>{n.calories}</span>
              </div>
              {[
                ['Total Fat', '0g'], ['Saturated Fat', '0g', true], ['Sodium', n.sodium],
                ['Total Carbohydrate', '3g'], ['Total Sugars', n.sugar, true],
              ].map(([label, val, sub]) => (
                <div key={label} className="nut-row" style={{ paddingLeft: sub ? '12px' : 0 }}>
                  <span style={{ fontWeight: sub ? 400 : 600, fontSize: '0.77rem' }}>{label}</span>
                  <span style={{ fontSize: '0.77rem' }}>{val}</span>
                </div>
              ))}
              {[['Protein', n.protein], ['Caffeine', n.caffeine]].map(([l, v]) => (
                <div key={l} className="nut-row" style={{ borderTop: `3px solid ${activeFlavor.accent}`, transition: 'border-color 0.4s' }}>
                  <span style={{ fontWeight: 700, color: activeFlavor.accent, fontSize: '0.82rem', transition: 'color 0.4s' }}>{l}</span>
                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '1.15rem', lineHeight: 1, color: activeFlavor.accent, transition: 'color 0.4s' }}>{v}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.65rem', opacity: 0.26, maxWidth: '320px', lineHeight: 1.6, marginTop: '10px' }}>
              * Not recommended for children or caffeine-sensitive individuals.
            </p>
          </div>

          {/* Right: callout numbers */}
          <div ref={nutsRef} className="grid grid-cols-2 gap-4">
            {CALLOUTS.map(c => (
              <div key={c.key} className="flex items-stretch gap-3"
                style={{ padding: '16px 18px', background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(6px)', border: '1px solid rgba(0,0,0,0.07)' }}>
                <div className="w-0.5 flex-shrink-0 self-stretch" style={{ background: activeFlavor.accent, transition: 'background 0.4s', minHeight: '36px' }} />
                <div>
                  <div className="headline" style={{ fontSize: 'clamp(1.8rem, 3vw, 3.4rem)', color: activeFlavor.accent, transition: 'color 0.4s' }}>{n[c.key]}</div>
                  <div className="label-tag" style={{ opacity: 0.38, marginTop: '3px', fontSize: '0.6rem' }}>{c.label} per can</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
