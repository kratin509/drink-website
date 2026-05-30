import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useFlavorStore } from '../store/flavorStore'

gsap.registerPlugin(ScrollTrigger)

const CARDS = [
  { h: '@fitz_lifts',       q: 'Swapped my pre-workout for Niro. PRs every single week.',               f: '42.1K', p: 'IG', e: '💪', a: '#ef4444' },
  { h: '@coffeeandcodes',   q: 'Six hours of clean focus, zero crash. Functional caffeine done right.', f: '18.9K', p: 'X',  e: '⚡', a: '#f59e0b' },
  { h: '@ultrarunner_maya', q: '200km ultra finished. Niro Dark Chocolate was my only fuel.',           f: '91.4K', p: 'IG', e: '🏔', a: '#a16207' },
  { h: '@gym.aesthetics',   q: 'The branding made me buy it. The taste made me subscribe.',             f: '330K',  p: 'TT', e: '🎯', a: '#ef4444' },
  { h: '@dr_nutrifit',      q: '20g protein + 150mg caffeine in one can is genuinely impressive.',      f: '55.2K', p: 'IG', e: '🔬', a: '#f59e0b' },
  { h: '@nightshift_nurse', q: 'Powered through a 12-hour shift. Zero sugar claim? 100% true.',         f: '28.7K', p: 'X',  e: '🌙', a: '#a16207' },
]

function Card({ d }) {
  const ref = useRef()

  const onMove = e => {
    const rc = ref.current.getBoundingClientRect()
    const x = (e.clientX - rc.left - rc.width  / 2) / rc.width
    const y = (e.clientY - rc.top  - rc.height / 2) / rc.height
    gsap.to(ref.current, { rotateX: -y * 7, rotateY: x * 7, duration: 0.3, ease: 'power2.out', transformPerspective: 900 })
  }
  const onLeave = () =>
    gsap.to(ref.current, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'elastic.out(1,0.6)' })

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      className="relative flex flex-col cursor-default"
      style={{ padding: '20px 20px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', transformStyle: 'preserve-3d' }}>
      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-4 h-4"
        style={{ background: d.a, clipPath: 'polygon(100% 0,0 0,100% 100%)' }} />
      {/* Platform + emoji */}
      <div className="flex items-center justify-between mb-4">
        <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{d.e}</span>
        <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: '0.54rem', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '2px 6px', background: `${d.a}22`, color: d.a }}>
          {d.p}
        </span>
      </div>
      {/* Quote */}
      <blockquote className="flex-1 mb-4" style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 300, fontSize: '0.82rem', lineHeight: 1.65, color: 'rgba(255,255,255,0.72)' }}>
        "{d.q}"
      </blockquote>
      {/* Footer */}
      <div className="flex justify-between items-center pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: '0.78rem', color: d.a }}>{d.h}</span>
        <span style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.28)' }}>{d.f} followers</span>
      </div>
    </div>
  )
}

export default function SocialProofSection() {
  const sectionRef = useRef()
  const bgRef      = useRef()
  const headRef    = useRef()
  const gridRef    = useRef()
  const statsRef   = useRef()
  const { activeFlavor } = useFlavorStore()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        yPercent: -12, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
      gsap.fromTo(headRef.current, { opacity: 0, y: 36 }, {
        opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
      })
      gsap.fromTo(Array.from(gridRef.current?.children ?? []), { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.55, stagger: 0.07, ease: 'power3.out',
        scrollTrigger: { trigger: gridRef.current, start: 'top 82%' },
      })
      gsap.fromTo(statsRef.current, { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.55, ease: 'power3.out',
        scrollTrigger: { trigger: statsRef.current, start: 'top 90%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="social" ref={sectionRef} className="section-frame" style={{ background: 'var(--dark)' }}>

      {/* Ghost word */}
      <div ref={bgRef} aria-hidden="true"
        className="absolute inset-0 z-10 flex items-center overflow-hidden pointer-events-none select-none"
        style={{ paddingLeft: '5vw' }}>
        <span className="vp-word text-white" style={{ fontSize: 'clamp(6rem, 18vw, 24rem)', opacity: 0.018 }}>
          COMMUNITY
        </span>
      </div>

      {/* UI */}
      <div className="absolute inset-0 z-20 flex flex-col"
        style={{ paddingLeft: '8vw', paddingRight: '8vw', paddingTop: '80px', paddingBottom: '32px' }}>

        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-4">
          <div style={{ width: '28px', height: '1px', background: activeFlavor.accent, transition: 'background 0.4s' }} />
          <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.62rem' }}>
            04 &nbsp;/&nbsp; The Community
          </span>
        </div>

        {/* Heading */}
        <div ref={headRef} className="mb-5">
          <h2 className="headline text-white" style={{ fontSize: 'clamp(2.8rem, 7vw, 8rem)' }}>The Niro</h2>
          <h2 className="headline mb-2" style={{ fontSize: 'clamp(2.8rem, 7vw, 8rem)', color: activeFlavor.accent, transition: 'color 0.4s' }}>
            Effect
          </h2>
          <p style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 300, fontSize: '0.9rem', color: 'rgba(255,255,255,0.32)', maxWidth: '34ch' }}>
            50,000+ athletes, coders, nurses, and night owls pushing further on Niro.
          </p>
        </div>

        {/* 3-column card grid */}
        <div ref={gridRef} className="grid grid-cols-3 gap-3 flex-1 min-h-0 content-start mb-5">
          {CARDS.map(d => <Card key={d.h} d={d} />)}
        </div>

        {/* Stats bar */}
        <div ref={statsRef} className="grid grid-cols-4 pt-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)', gap: '0' }}>
          {[['50K+', 'Subscribers'], ['4.9★', 'Avg Rating'], ['3', 'Live Flavors'], ['0g', 'Added Sugar']].map(([v, l], i) => (
            <div key={l} className="flex flex-col items-center py-2"
              style={{ borderRight: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
              <div className="headline text-white" style={{ fontSize: 'clamp(1.6rem, 2.6vw, 2.8rem)' }}>{v}</div>
              <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.26)', fontSize: '0.58rem', marginTop: '2px' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
