import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function Preloader({ onBurstReady }) {
  const [pct, setPct] = useState(0)
  const wrapRef  = useRef()
  const logoRef  = useRef()
  const done     = useRef(false)

  useEffect(() => {
    const DURATION = 2200
    const start    = performance.now()

    const tick = (now) => {
      if (done.current) return
      const elapsed = Math.min(now - start, DURATION)
      const ease    = 1 - Math.pow(1 - elapsed / DURATION, 3)
      setPct(Math.floor(ease * 100))

      if (elapsed < DURATION) {
        requestAnimationFrame(tick)
      } else {
        done.current = true
        gsap.delayedCall(0.2, () => {
          gsap.timeline()
            .to(logoRef.current, { skewX: 10, scaleX: 1.06, duration: 0.07, ease: 'power2.in' })
            .to(logoRef.current, { skewX: -7, scaleX: 0.97, duration: 0.06 })
            .to(logoRef.current, { skewX: 0,  scaleX: 1,    duration: 0.05 })
            .to(wrapRef.current, {
              opacity: 0, duration: 0.6, ease: 'power2.in',
              onStart: () => onBurstReady?.(),
            }, 0.22)
            .set(wrapRef.current, { display: 'none' })
        })
      }
    }
    requestAnimationFrame(tick)
  }, [onBurstReady])

  return (
    <div ref={wrapRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden select-none"
      style={{ background: '#080808' }}
    >
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Corner marks */}
      {['top-7 left-7', 'top-7 right-7 rotate-90', 'bottom-7 right-7 rotate-180', 'bottom-7 left-7 -rotate-90'].map((cls, i) => (
        <svg key={i} width="20" height="20" viewBox="0 0 20 20" className={`absolute ${cls} opacity-25`}>
          <polyline points="10,0 0,0 0,10" fill="none" stroke="white" strokeWidth="1.5" />
        </svg>
      ))}

      {/* Center block */}
      <div className="flex flex-col items-center">
        {/* Logo */}
        <div ref={logoRef} className="relative mb-5">
          <span style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 900,
            fontStyle: 'italic',
            fontSize: 'clamp(7rem, 20vw, 20rem)',
            lineHeight: 0.85,
            letterSpacing: '-0.04em',
            color: '#fff',
            display: 'block',
          }}>
            NIRO
          </span>
          {/* Progress underline */}
          <div className="absolute -bottom-2 left-0 h-[2px] origin-left"
            style={{ width: `${pct}%`, background: 'var(--accent)', transition: 'width 0.08s linear' }} />
        </div>

        {/* Tagline */}
        <p className="eyebrow" style={{ color: 'rgba(255,255,255,0.22)', marginBottom: '4rem', letterSpacing: '0.45em' }}>
          Protein · Caffeine · Zero Compromise
        </p>

        {/* Big percent ghost */}
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 900,
          fontSize: 'clamp(4.5rem, 12vw, 12rem)',
          lineHeight: 1,
          letterSpacing: '-0.04em',
          color: 'rgba(255,255,255,0.06)',
          userSelect: 'none',
        }}>
          {String(pct).padStart(3, '0')}
          <span style={{ fontSize: '0.35em', color: `rgba(${220},${38},${38},0.55)`, marginLeft: '0.08em' }}>%</span>
        </div>
      </div>

      {/* Bottom progress bar */}
      <div className="absolute bottom-8 left-8 right-8">
        <div className="relative h-[1px] w-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div className="absolute inset-y-0 left-0 origin-left"
            style={{ width: `${pct}%`, background: 'var(--accent)', transition: 'width 0.08s linear' }} />
        </div>
        <div className="flex justify-between mt-2">
          <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.18)', fontSize: '0.58rem' }}>Initialising Experience</span>
          <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.18)', fontSize: '0.58rem' }}>{pct}%</span>
        </div>
      </div>
    </div>
  )
}
