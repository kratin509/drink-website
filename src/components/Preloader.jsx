import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function Preloader({ onBurstReady }) {
  const [pct, setPct] = useState(0)
  const wrapRef  = useRef()
  const numRef   = useRef()
  const barRef   = useRef()
  const logoRef  = useRef()
  const subtextRef = useRef()
  const done = useRef(false)

  useEffect(() => {
    const DURATION = 2000
    const start = performance.now()

    const tick = (now) => {
      if (done.current) return
      const elapsed = Math.min(now - start, DURATION)
      const ease = 1 - Math.pow(1 - elapsed / DURATION, 3) // cubic ease-out
      const value = Math.floor(ease * 100)
      setPct(value)

      if (elapsed < DURATION) {
        requestAnimationFrame(tick)
      } else {
        done.current = true
        // Slight hold at 100 before burst
        gsap.delayedCall(0.25, () => {
          // Logo glitch/shake before reveal
          gsap
            .timeline()
            .to(logoRef.current, { skewX: 12, scaleX: 1.08, duration: 0.08, ease: 'power2.in' })
            .to(logoRef.current, { skewX: -8, scaleX: 0.96, duration: 0.07 })
            .to(logoRef.current, { skewX: 0, scaleX: 1,    duration: 0.06 })
            .to(
              wrapRef.current,
              {
                opacity: 0,
                duration: 0.55,
                ease: 'power2.in',
                onStart: () => onBurstReady?.(), // fire 3D burst at same moment
              },
              0.3
            )
            .set(wrapRef.current, { display: 'none' })
        })
      }
    }
    requestAnimationFrame(tick)
  }, [onBurstReady])

  return (
    <div
      ref={wrapRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#080808' }}
    >
      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Corner marks */}
      {[
        'top-6 left-6',
        'top-6 right-6 rotate-90',
        'bottom-6 left-6 -rotate-90',
        'bottom-6 right-6 rotate-180',
      ].map((pos, i) => (
        <svg
          key={i}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className={`absolute ${pos} opacity-30`}
        >
          <path d="M0 0 L12 0 L0 12 Z" fill="none" stroke="white" strokeWidth="1.5" />
        </svg>
      ))}

      {/* Big NIRO logo */}
      <div ref={logoRef} className="relative mb-8 select-none">
        <span
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(8rem, 22vw, 22rem)',
            lineHeight: 0.85,
            letterSpacing: '-0.04em',
            color: '#ffffff',
            display: 'block',
          }}
        >
          NIRO
        </span>
        {/* Accent underline that grows with progress */}
        <div
          className="absolute -bottom-3 left-0 h-[3px] bg-red-600 origin-left"
          style={{ width: `${pct}%`, transition: 'width 0.08s linear' }}
        />
      </div>

      {/* Sub-label */}
      <p
        ref={subtextRef}
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700,
          fontSize: '0.7rem',
          letterSpacing: '0.5em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.25)',
          marginBottom: '3.5rem',
        }}
      >
        Protein + Caffeine · Zero Compromise
      </p>

      {/* Counter */}
      <div
        ref={numRef}
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 900,
          fontSize: 'clamp(5rem, 14vw, 14rem)',
          lineHeight: 0.88,
          letterSpacing: '-0.04em',
          color: 'rgba(255,255,255,0.08)',
          userSelect: 'none',
          tabularNums: true,
        }}
      >
        {String(pct).padStart(3, '0')}
        <span style={{ fontSize: '0.38em', color: 'rgba(220,38,38,0.7)', marginLeft: '0.1em' }}>%</span>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-10 left-10 right-10">
        <div className="relative h-px bg-white/10 overflow-hidden">
          <div
            ref={barRef}
            className="absolute inset-y-0 left-0 bg-red-600"
            style={{ width: `${pct}%`, transition: 'width 0.08s linear' }}
          />
        </div>
        <div
          className="flex justify-between mt-2"
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '0.65rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.22)',
          }}
        >
          <span>Loading Experience</span>
          <span>{pct}%</span>
        </div>
      </div>
    </div>
  )
}
