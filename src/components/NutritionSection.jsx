import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useFlavorStore } from '../store/flavorStore'

gsap.registerPlugin(ScrollTrigger)

const CALLOUTS = [
  { label: 'Protein', unit: 'g', key: 'protein', x: '62%', y: '28%' },
  { label: 'Caffeine', unit: 'mg', key: 'caffeine', x: '62%', y: '44%' },
  { label: 'Calories', unit: 'kcal', key: 'calories', x: '62%', y: '60%' },
  { label: 'Sodium', unit: 'mg', key: 'sodium', x: '62%', y: '76%' },
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
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      )
      gsap.fromTo(
        calloutsRef.current.filter(Boolean),
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
          },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="nutrition"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center py-24 px-8 md:px-16 overflow-hidden"
    >
      {/* Background number */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 font-display font-black text-[30vw] leading-none select-none pointer-events-none"
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          color: `rgba(${activeFlavor.accentRgb}, 0.06)`,
          transition: 'color 0.4s',
        }}
      >
        03
      </div>

      {/* Section label */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-px opacity-40" style={{ background: activeFlavor.accent }} />
        <span
          className="font-display text-xs tracking-widest uppercase opacity-50"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}
        >
          03 / What's Inside
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left: nutrition panel */}
        <div ref={panelRef} className="max-w-sm">
          <h2
            className="headline-fill text-[#0a0a0a] mb-10"
            style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}
          >
            NUTRITION
            <br />
            <span style={{ color: activeFlavor.accent, transition: 'color 0.4s' }}>FACTS</span>
          </h2>

          {/* Official nutrition panel */}
          <div className="border-[3px] border-black p-5 bg-white">
            <div className="border-b-8 border-black pb-2 mb-2">
              <p className="font-black text-5xl leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Nutrition Facts
              </p>
              <p className="text-sm mt-1 opacity-70">Serving Size 1 can (355 mL)</p>
            </div>

            <div className="nutrition-row thick">
              <span>Calories</span>
              <span className="text-4xl font-black">{n.calories}</span>
            </div>
            <div className="nutrition-row">
              <span className="font-bold">Total Fat</span>
              <span>0g</span>
            </div>
            <div className="nutrition-row pl-4">
              <span>Saturated Fat</span>
              <span>0g</span>
            </div>
            <div className="nutrition-row pl-4">
              <span>Trans Fat</span>
              <span>0g</span>
            </div>
            <div className="nutrition-row">
              <span className="font-bold">Sodium</span>
              <span>{n.sodium}</span>
            </div>
            <div className="nutrition-row">
              <span className="font-bold">Total Carbohydrate</span>
              <span>3g</span>
            </div>
            <div className="nutrition-row pl-4">
              <span>Total Sugars</span>
              <span>{n.sugar}</span>
            </div>
            <div className="nutrition-row" style={{ borderTop: `4px solid ${activeFlavor.accent}` }}>
              <span className="font-bold" style={{ color: activeFlavor.accent }}>Protein</span>
              <span className="font-black text-xl" style={{ color: activeFlavor.accent }}>{n.protein}</span>
            </div>
            <div className="nutrition-row" style={{ borderTop: `4px solid ${activeFlavor.accent}` }}>
              <span className="font-bold" style={{ color: activeFlavor.accent }}>Caffeine</span>
              <span className="font-black text-xl" style={{ color: activeFlavor.accent }}>{n.caffeine}</span>
            </div>
          </div>

          <p className="mt-4 text-xs opacity-40 leading-relaxed">
            * Percent Daily Values are based on a 2,000 calorie diet.
            This product contains caffeine. Not recommended for children or pregnant women.
          </p>
        </div>

        {/* Right: callout cards */}
        <div className="space-y-6">
          {CALLOUTS.map((c, i) => (
            <div
              key={c.key}
              ref={(el) => (calloutsRef.current[i] = el)}
              className="flex items-center gap-6 p-6 bg-white border border-black/10"
            >
              <div
                className="w-1 self-stretch"
                style={{ background: activeFlavor.accent, transition: 'background 0.4s' }}
              />
              <div>
                <div
                  className="font-display font-black text-6xl leading-none"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", color: activeFlavor.accent, transition: 'color 0.4s' }}
                >
                  {n[c.key]}
                </div>
                <div
                  className="font-display uppercase tracking-widest text-xs mt-1 opacity-60"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}
                >
                  {c.label} per can
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
