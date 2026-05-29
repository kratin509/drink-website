import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const wrapRef = useRef(null)
  const logoRef = useRef(null)
  const counterRef = useRef(null)
  const barRef = useRef(null)

  useEffect(() => {
    let current = 0
    const target = 100
    const duration = 2200

    const start = performance.now()

    const tick = (now) => {
      const elapsed = now - start
      const t = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3)
      current = Math.floor(eased * target)
      setProgress(current)

      if (t < 1) {
        requestAnimationFrame(tick)
      } else {
        // Climax animation at 100%
        const tl = gsap.timeline({ onComplete })
        tl.to(logoRef.current, {
          scale: 1.15,
          skewX: -6,
          duration: 0.15,
          ease: 'power4.out',
        })
          .to(logoRef.current, {
            scale: 1,
            skewX: 0,
            duration: 0.1,
          })
          .to(logoRef.current, {
            scale: 30,
            opacity: 0,
            duration: 0.7,
            ease: 'expo.in',
          }, '+=0.1')
          .to(wrapRef.current, {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.in',
          }, '-=0.3')
      }
    }

    requestAnimationFrame(tick)
  }, [onComplete])

  return (
    <div
      ref={wrapRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0a] overflow-hidden"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Logo */}
      <div ref={logoRef} className="relative mb-16 select-none">
        <h1
          className="font-display text-white text-[22vw] leading-none tracking-tighter"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900 }}
        >
          NIRO
        </h1>
        <div
          className="absolute -bottom-1 left-0 right-0 h-1 bg-red-600"
          style={{ transform: `scaleX(${progress / 100})`, transformOrigin: 'left', transition: 'transform 0.05s linear' }}
        />
      </div>

      {/* Counter */}
      <div
        ref={counterRef}
        className="font-display text-white/40 text-[10vw] tabular-nums leading-none"
        style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}
      >
        {String(progress).padStart(3, '0')}
        <span className="text-[5vw] text-red-600 ml-1">%</span>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-10 left-10 right-10">
        <div ref={barRef} className="h-px bg-white/10 relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-red-600 transition-all"
            style={{ width: `${progress}%`, transition: 'width 0.05s linear' }}
          />
        </div>
        <div className="flex justify-between mt-2 font-display text-white/30 text-xs tracking-widest uppercase"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          <span>Loading Experience</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  )
}
