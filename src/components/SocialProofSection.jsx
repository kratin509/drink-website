import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useFlavorStore } from '../store/flavorStore'

gsap.registerPlugin(ScrollTrigger)

const CARDS = [
  { h: '@fitz_lifts',      q: 'Swapped my pre-workout for Niro 3 months ago. PRs every week.',                      f: '42.1K', p: 'IG', e: '💪', a: '#dc2626', r: '220,38,38'  },
  { h: '@coffeeandcodes',  q: 'Zero crash. 6 hours of clean focus. This is functional caffeine done right.',        f: '18.9K', p: 'X',  e: '⚡', a: '#ca8a04', r: '202,138,4'  },
  { h: '@ultrarunner_maya',q: '200km ultra + Niro Dark Chocolate = the only fuel I trust on race day.',             f: '91.4K', p: 'IG', e: '🏔', a: '#78350f', r: '120,53,15'  },
  { h: '@gym.aesthetics',  q: 'The branding alone made me buy it. The taste made me subscribe monthly.',            f: '330K',  p: 'TT', e: '🎯', a: '#dc2626', r: '220,38,38'  },
  { h: '@dr_nutrifit',     q: '20g protein + 150mg caffeine in a single can is a genuinely impressive formula.',   f: '55.2K', p: 'IG', e: '🔬', a: '#ca8a04', r: '202,138,4'  },
  { h: '@nightshift_nurse',q: 'Kept me going through a 12-hour shift. Zero sugar? Absolutely not a lie.',          f: '28.7K', p: 'X',  e: '🌙', a: '#78350f', r: '120,53,15'  },
]

function Card({ d }) {
  const ref = useRef()
  const onMove = e => {
    const rc = ref.current.getBoundingClientRect()
    const x = (e.clientX - rc.left - rc.width  / 2) / rc.width
    const y = (e.clientY - rc.top  - rc.height / 2) / rc.height
    gsap.to(ref.current, { rotateX: -y * 7, rotateY: x * 7, duration: 0.3, ease: 'power2.out', transformPerspective: 900 })
  }
  const onLeave = () => gsap.to(ref.current, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'elastic.out(1, 0.6)' })

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      className="relative flex flex-col cursor-default"
      style={{ padding: '20px 20px 16px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', transformStyle: 'preserve-3d' }}>
      <div className="absolute top-0 right-0 w-4 h-4" style={{ background: d.a, clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />
      <div className="flex justify-between items-center mb-3">
        <span style={{ fontSize: '1.55rem', lineHeight: 1 }}>{d.e}</span>
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '0.55rem', letterSpacing: '0.18em', textTransform: 'uppercase', padding: '2px 5px', background: `rgba(${d.r},.15)`, color: d.a }}>{d.p}</span>
      </div>
      <blockquote className="flex-1 mb-3 leading-relaxed" style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.82rem', color: 'rgba(255,255,255,0.78)' }}>
        "{d.q}"
      </blockquote>
      <div className="flex justify-between items-center pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '0.78rem', color: d.a }}>{d.h}</span>
        <span style={{ fontSize: '0.68rem', opacity: 0.35, color: '#fff' }}>{d.f}</span>
      </div>
    </div>
  )
}

export default function SocialProofSection() {
  const sectionRef = useRef()
  const headRef    = useRef()
  const gridRef    = useRef()
  const statsRef   = useRef()
  const { activeFlavor } = useFlavorStore()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headRef.current,
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 76%' } }
      )
      gsap.fromTo(Array.from(gridRef.current?.children ?? []),
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.07, ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 82%' } }
      )
      gsap.fromTo(statsRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: statsRef.current, start: 'top 90%' } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="w-screen h-screen overflow-hidden flex flex-col justify-center items-start relative"
      style={{ paddingLeft: '10vw', paddingRight: '10vw', background: 'var(--dark)' }}
    >
      {/* Bg word */}
      <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-none select-none pl-[3vw]" style={{ zIndex: 0 }}>
        <span className="vp-word text-white" style={{ fontSize: 'clamp(7rem, 20vw, 26rem)', opacity: 0.022 }}>
          COMMUNITY
        </span>
      </div>

      <div style={{ position: 'relative', zIndex: 10, width: '100%' }}>
        {/* Label */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-8" style={{ background: activeFlavor.accent, transition: 'background 0.4s' }} />
          <span className="label-tag" style={{ color: 'rgba(255,255,255,0.32)' }}>The Community / Real Athletes</span>
        </div>

        {/* Heading */}
        <div ref={headRef} className="mb-5">
          <h2 className="headline text-white" style={{ fontSize: 'clamp(2.6rem, 7vw, 8rem)' }}>The Niro</h2>
          <h2 className="headline mb-2" style={{ fontSize: 'clamp(2.6rem, 7vw, 8rem)', color: activeFlavor.accent, transition: 'color 0.4s' }}>Effect</h2>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.9rem', color: 'rgba(255,255,255,0.36)', maxWidth: '36ch' }}>
            50,000+ athletes, coders, nurses, and night owls trust Niro to push further.
          </p>
        </div>

        {/* Cards — constrained width so 3D can shows on right */}
        <div ref={gridRef} className="grid gap-3 mb-5" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', maxWidth: '68vw' }}>
          {CARDS.map(d => <Card key={d.h} d={d} />)}
        </div>

        {/* Stats */}
        <div ref={statsRef} className="grid grid-cols-4 gap-6 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', maxWidth: '68vw' }}>
          {[['50K+', 'Subscribers'], ['4.9★', 'Avg Rating'], ['3', 'Live Flavors'], ['0g', 'Sugar Added']].map(([v, l]) => (
            <div key={l} className="text-center">
              <div className="headline text-white" style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.8rem)' }}>{v}</div>
              <div className="label-tag" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
