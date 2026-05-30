import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useFlavorStore } from '../store/flavorStore'

gsap.registerPlugin(ScrollTrigger)

const CARDS = [
  { handle: '@fitz_lifts',      text: 'Swapped my pre-workout for Niro 3 months ago. PRs every week.',                            followers: '42.1K', platform: 'IG', emoji: '💪', accent: '#dc2626', rgb: '220,38,38' },
  { handle: '@coffeeandcodes',  text: 'Zero crash. 6 hours of clean focus. This is what functional caffeine feels like.',         followers: '18.9K', platform: 'X',  emoji: '⚡', accent: '#ca8a04', rgb: '202,138,4' },
  { handle: '@ultrarunner_maya',text: '200km ultra + Niro Dark Chocolate = the only fuel I trust on race day.',                   followers: '91.4K', platform: 'IG', emoji: '🏔', accent: '#78350f', rgb: '120,53,15' },
  { handle: '@gym.aesthetics',  text: 'The branding alone made me buy it. The taste made me subscribe.',                          followers: '330K',  platform: 'TT', emoji: '🎯', accent: '#dc2626', rgb: '220,38,38' },
  { handle: '@dr_nutrifit',     text: '20g protein + 150mg caffeine in a can is a genuinely impressive formula. Period.',         followers: '55.2K', platform: 'IG', emoji: '🔬', accent: '#ca8a04', rgb: '202,138,4' },
  { handle: '@nightshift_nurse',text: 'Kept me going through a 12-hour shift. Zero sugar part is absolutely not a lie.',          followers: '28.7K', platform: 'X',  emoji: '🌙', accent: '#78350f', rgb: '120,53,15' },
]

function Card({ d }) {
  const ref = useRef()

  const onMove = e => {
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width  / 2) / rect.width
    const y = (e.clientY - rect.top  - rect.height / 2) / rect.height
    gsap.to(ref.current, { rotateX: -y * 9, rotateY: x * 9, duration: 0.3, ease: 'power2.out', transformPerspective: 900 })
  }
  const onLeave = () => gsap.to(ref.current, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'elastic.out(1, 0.6)' })

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative flex flex-col bg-white"
      style={{ padding: '28px', border: '1px solid rgba(255,255,255,0.07)', transformStyle: 'preserve-3d', minHeight: '210px' }}
    >
      {/* Accent corner */}
      <div aria-hidden="true" className="absolute top-0 right-0 w-6 h-6"
        style={{ background: d.accent, clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />

      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <span style={{ fontSize: '2rem', lineHeight: 1 }}>{d.emoji}</span>
        <span style={{
          fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
          fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase',
          padding: '3px 7px', background: `rgba(${d.rgb}, 0.12)`, color: d.accent,
        }}>
          {d.platform}
        </span>
      </div>

      {/* Quote */}
      <blockquote className="flex-1 mb-5 leading-relaxed"
        style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.93rem', color: '#1a1a1a' }}>
        "{d.text}"
      </blockquote>

      {/* Footer */}
      <div className="flex justify-between items-center pt-4" style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}>
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '0.88rem', color: d.accent }}>
          {d.handle}
        </span>
        <span style={{ fontSize: '0.72rem', opacity: 0.35 }}>{d.followers}</span>
      </div>
    </div>
  )
}

export default function SocialProofSection() {
  const sectionRef = useRef()
  const bgWordRef  = useRef()
  const headRef    = useRef()
  const gridRef    = useRef()
  const statsRef   = useRef()
  const { activeFlavor } = useFlavorStore()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(bgWordRef.current, {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
      gsap.fromTo(headRef.current,   { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' } })
      gsap.fromTo(Array.from(gridRef.current?.children ?? []), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.65, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: gridRef.current, start: 'top 82%' } })
      gsap.fromTo(statsRef.current,  { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: statsRef.current, start: 'top 88%' } })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-28 overflow-hidden" style={{ background: '#0a0a0a' }}>

      {/* Bg word */}
      <div ref={bgWordRef} aria-hidden="true"
        className="absolute inset-0 flex items-center pointer-events-none select-none overflow-hidden">
        <span style={{
          fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900,
          fontSize: 'clamp(8rem, 22vw, 28rem)', lineHeight: 0.82, letterSpacing: '-0.04em',
          color: '#ffffff', opacity: 0.025, whiteSpace: 'nowrap', paddingLeft: '4vw',
        }}>
          COMMUNITY
        </span>
      </div>

      <div className="relative z-10 px-8 md:px-16 lg:px-24">
        {/* Label */}
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px w-8" style={{ background: activeFlavor.accent, transition: 'background 0.4s' }} />
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.32)' }}>
            The Community / Real Athletes
          </span>
        </div>

        {/* Heading */}
        <div ref={headRef} className="mb-16">
          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(4rem, 10vw, 11rem)', lineHeight: 0.85, letterSpacing: '-0.03em', textTransform: 'uppercase', color: '#fff' }}>
            The Niro
          </h2>
          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(4rem, 10vw, 11rem)', lineHeight: 0.85, letterSpacing: '-0.03em', textTransform: 'uppercase', color: activeFlavor.accent, transition: 'color 0.4s', marginBottom: '24px' }}>
            Effect
          </h2>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: '1.05rem', color: 'rgba(255,255,255,0.38)', maxWidth: '38ch', lineHeight: 1.7 }}>
            50,000+ athletes, coders, nurses, and night owls trust Niro to push further.
          </p>
        </div>

        {/* Card grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {CARDS.map(d => <Card key={d.handle} d={d} />)}
        </div>

        {/* Stats bar */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-14" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {[
            { val: '50K+', label: 'Subscribers' },
            { val: '4.9★', label: 'Avg Rating' },
            { val: '3',    label: 'Live Flavors' },
            { val: '0g',   label: 'Sugar Added' },
          ].map(({ val, label }) => (
            <div key={label} className="text-center">
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(2.5rem, 4vw, 4rem)', lineHeight: 1, color: '#fff', marginBottom: '6px' }}>{val}</div>
              <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.32)' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
