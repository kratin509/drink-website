import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { useFlavorStore } from '../store/flavorStore'

export default function HeroSection() {
  const { activeFlavor } = useFlavorStore()
  const wrapRef  = useRef()
  const lineRef  = useRef()

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.1 })
    tl.fromTo(lineRef.current,  { scaleX: 0 },         { scaleX: 1, duration: 0.7, ease: 'expo.out', transformOrigin: 'left' })
    tl.fromTo(wrapRef.current,  { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.4')
  }, [])

  return (
    <section
      id="hero"
      className="w-screen h-screen overflow-hidden flex flex-col justify-center items-start relative"
      style={{ paddingLeft: '10vw', paddingRight: '10vw' }}
    >
      {/* Decorative bg word */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none" style={{ zIndex: 0 }}>
        <span className="vp-word text-[#0a0a0a]" style={{ fontSize: 'clamp(9rem, 26vw, 32rem)', opacity: 0.044 }}>
          NIRO
        </span>
      </div>

      {/* Section label */}
      <div ref={lineRef} className="flex items-center gap-3 mb-8 origin-left" style={{ position: 'relative', zIndex: 10 }}>
        <div className="h-px w-8" style={{ background: activeFlavor.accent, transition: 'background 0.4s' }} />
        <span className="label-tag" style={{ color: activeFlavor.accent, opacity: 0.85, transition: 'color 0.4s' }}>
          01 / The Drink
        </span>
      </div>

      {/* Copy block — constrained to left half so can reads on the right */}
      <div ref={wrapRef} style={{ maxWidth: '48ch', position: 'relative', zIndex: 10 }}>
        <h1 className="headline text-[#0a0a0a] mb-1" style={{ fontSize: 'clamp(4rem, 10.5vw, 11rem)' }}>
          NIRO
        </h1>
        <p className="headline mb-8" style={{ fontSize: 'clamp(1.6rem, 4vw, 4.5rem)', color: activeFlavor.accent, transition: 'color 0.4s' }}>
          Protein&nbsp;+&nbsp;Caffeine
        </p>

        <p className="mb-8 leading-relaxed"
          style={{ fontFamily: "'Barlow', sans-serif", fontSize: 'clamp(0.9rem, 1.15vw, 1.05rem)', color: 'rgba(10,10,10,0.5)', maxWidth: '38ch' }}>
          The only performance drink built for the relentless.
          Real protein, real caffeine, zero noise.
        </p>

        <div className="flex flex-wrap gap-4 mb-10">
          <a href="#cta" className="btn-primary" style={{ background: activeFlavor.accent, transition: 'background 0.4s' }}>
            Get Yours →
          </a>
          <a href="#flavors" className="btn-outline">See Flavors</a>
        </div>

        <div className="flex flex-wrap gap-8">
          {[
            { val: '20g',   lbl: 'Protein'  },
            { val: '150mg', lbl: 'Caffeine' },
            { val: '0g',    lbl: 'Sugar'    },
            { val: '160',   lbl: 'Kcal'     },
          ].map(({ val, lbl }) => (
            <div key={lbl}>
              <div className="headline" style={{ fontSize: 'clamp(1.4rem, 2vw, 2.1rem)', color: activeFlavor.accent, transition: 'color 0.4s' }}>{val}</div>
              <div className="label-tag" style={{ opacity: 0.38 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 right-[10vw] flex flex-col items-center gap-2" style={{ zIndex: 10, opacity: 0.3 }}>
        <div style={{ width: 1, height: 52, background: `linear-gradient(to bottom, transparent, ${activeFlavor.accent})`, transition: 'background 0.4s' }} />
        <span className="label-tag" style={{ writingMode: 'vertical-rl', letterSpacing: '0.32em', fontSize: '0.6rem' }}>Scroll</span>
      </div>
    </section>
  )
}
