import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useFlavorStore } from '../store/flavorStore'

gsap.registerPlugin(ScrollTrigger)

// ── Animated liquid canvas that simulates video inside the mask ──────────────
function LiquidCanvas({ width = 320, height = 620, accent }) {
  const canvasRef = useRef()
  const rafRef    = useRef()

  useEffect(() => {
    const cv = canvasRef.current
    const ctx = cv.getContext('2d')
    let t = 0

    const r = parseInt(accent.slice(1, 3), 16)
    const g = parseInt(accent.slice(3, 5), 16)
    const b = parseInt(accent.slice(5, 7), 16)

    const draw = () => {
      t += 0.012
      ctx.clearRect(0, 0, width, height)

      // Deep background gradient
      const bg = ctx.createLinearGradient(0, 0, 0, height)
      bg.addColorStop(0,   `rgba(${r},${g},${b},1)`)
      bg.addColorStop(0.5, `rgba(${Math.max(0,r-60)},${Math.max(0,g-40)},${Math.max(0,b-20)},1)`)
      bg.addColorStop(1,   `rgba(${Math.max(0,r-100)},${Math.max(0,g-80)},${Math.max(0,b-50)},1)`)
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, width, height)

      // Shimmer streaks (vertical light rays)
      for (let i = 0; i < 5; i++) {
        const x = (width * (i / 5)) + Math.sin(t * 0.7 + i * 1.2) * 18
        const rayGrad = ctx.createLinearGradient(x, 0, x + 20, height)
        rayGrad.addColorStop(0,   'rgba(255,255,255,0)')
        rayGrad.addColorStop(0.4, `rgba(255,255,255,${0.04 + Math.sin(t + i) * 0.02})`)
        rayGrad.addColorStop(1,   'rgba(255,255,255,0)')
        ctx.fillStyle = rayGrad
        ctx.fillRect(x, 0, 22, height)
      }

      // Wave layers (3 stacked, different speeds + offsets)
      for (let layer = 0; layer < 3; layer++) {
        const speed  = 1 + layer * 0.5
        const yBase  = height * (0.35 + layer * 0.12)
        const amp    = 22 - layer * 5
        const alpha  = 0.12 + layer * 0.06

        ctx.beginPath()
        ctx.moveTo(0, yBase)
        for (let x = 0; x <= width; x += 3) {
          const y = yBase
            + Math.sin(x * 0.03 + t * speed)        * amp
            + Math.sin(x * 0.06 + t * speed * 0.7)  * (amp * 0.4)
          ctx.lineTo(x, y)
        }
        ctx.lineTo(width, height)
        ctx.lineTo(0, height)
        ctx.closePath()
        ctx.fillStyle = `rgba(0,0,0,${alpha})`
        ctx.fill()
      }

      // Bubble particles
      for (let i = 0; i < 8; i++) {
        const bx = width * 0.15 + (i / 8) * width * 0.7 + Math.sin(t * 0.6 + i * 2) * 12
        const by = ((height * 0.9) - ((t * 55 * (0.5 + i * 0.1)) % (height * 0.9)))
        const br = 2 + (i % 3) * 2
        ctx.beginPath()
        ctx.arc(bx, by, br, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${0.12 + Math.sin(t + i) * 0.06})`
        ctx.fill()
      }

      // Surface highlight at top
      const topGlow = ctx.createLinearGradient(0, 0, 0, 80)
      topGlow.addColorStop(0, 'rgba(255,255,255,0.22)')
      topGlow.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = topGlow
      ctx.fillRect(0, 0, width, 80)

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [accent, width, height])

  return <canvas ref={canvasRef} width={width} height={height} style={{ display: 'block' }} />
}

// ── SVG clip-path: upright can body + pour stream + splash ──────────────────
// Coordinate space: 320 × 620
const CLIP_ID = 'niro-pour-clip'

function CanPourClipDef() {
  // Can body sits at top; pour stream narrows then re-widens into a splash pool
  return (
    <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
      <defs>
        <clipPath id={CLIP_ID} clipPathUnits="userSpaceOnUse">
          {/* Can top ellipse */}
          <ellipse cx="160" cy="72"  rx="62" ry="14" />
          {/* Can shoulder top */}
          <rect x="98"  y="72"  width="124" height="16" />
          {/* Main body rect */}
          <rect x="96"  y="86"  width="128" height="250" />
          {/* Can shoulder bottom */}
          <rect x="100" y="334" width="120" height="14" />
          {/* Can bottom ellipse */}
          <ellipse cx="160" cy="348" rx="60" ry="13" />
          {/* Pour stream — tapers from can base */}
          <path d="M 148 348 C 144 380 138 420 134 468 Q 130 510 130 530 Q 130 548 160 548 Q 190 548 190 530 Q 190 510 186 468 C 182 420 176 380 172 348 Z" />
          {/* Splash ellipse at base */}
          <ellipse cx="160" cy="552" rx="54" ry="18" />
          {/* Splash ripple 1 */}
          <ellipse cx="160" cy="554" rx="74" ry="10" />
          {/* Splash ripple 2 */}
          <ellipse cx="160" cy="558" rx="92" ry="7" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default function FooterSection() {
  const sectionRef = useRef()
  const bgWordRef  = useRef()
  const leftRef    = useRef()
  const rightRef   = useRef()
  const [email, setEmail]       = useState('')
  const [submitted, setSubmitted] = useState(false)
  const { activeFlavor } = useFlavorStore()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(bgWordRef.current, {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
      gsap.fromTo(leftRef.current, { opacity: 0, x: -50 }, {
        opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
      })
      gsap.fromTo(rightRef.current, { opacity: 0, x: 50 }, {
        opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const handleSubmit = e => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      gsap.fromTo(rightRef.current, { scale: 1 }, { scale: 1.02, duration: 0.12, yoyo: true, repeat: 1 })
    }
  }

  return (
    <footer
      id="cta"
      ref={sectionRef}
      className="relative overflow-hidden py-24"
      style={{ background: '#f8f8f6' }}
    >
      <CanPourClipDef />

      {/* Bg word */}
      <div ref={bgWordRef} aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span style={{
          fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900,
          fontSize: 'clamp(10rem, 30vw, 36rem)', lineHeight: 0.82, letterSpacing: '-0.04em',
          color: '#0a0a0a', opacity: 0.035, whiteSpace: 'nowrap',
        }}>
          PUSH
        </span>
      </div>

      <div className="relative z-10 px-8 md:px-16 lg:px-24">

        {/* Section label */}
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px w-8" style={{ background: activeFlavor.accent, transition: 'background 0.4s' }} />
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.45 }}>
            04 / Ready?
          </span>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-20">

          {/* Left: liquid pour visual */}
          <div ref={leftRef} className="flex flex-col items-center">
            {/* Headline above mask */}
            <div className="mb-8 self-start">
              <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(4rem, 9vw, 10rem)', lineHeight: 0.85, letterSpacing: '-0.03em', textTransform: 'uppercase', color: '#0a0a0a' }}>
                Ready To
              </h2>
              <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(4rem, 9vw, 10rem)', lineHeight: 0.85, letterSpacing: '-0.03em', textTransform: 'uppercase', color: activeFlavor.accent, transition: 'color 0.4s' }}>
                Push?
              </h2>
            </div>

            {/* Video-mask can pour */}
            <div className="relative" style={{ width: 320, height: 620 }}>
              {/* Liquid fills the can silhouette via clipPath */}
              <div
                style={{
                  clipPath: `url(#${CLIP_ID})`,
                  width: 320,
                  height: 620,
                  position: 'absolute',
                  inset: 0,
                }}
              >
                <LiquidCanvas width={320} height={620} accent={activeFlavor.accent} />
              </div>

              {/* Subtle metallic edge overlay for realism */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  clipPath: `url(#${CLIP_ID})`,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 40%, rgba(0,0,0,0.15) 100%)',
                  pointerEvents: 'none',
                }}
              />

              {/* Glow halo behind the can */}
              <div style={{
                position: 'absolute',
                top: '10%', left: '50%',
                transform: 'translate(-50%, 0)',
                width: 200, height: 200,
                borderRadius: '50%',
                background: `radial-gradient(circle, rgba(${activeFlavor.accentRgb}, 0.25) 0%, transparent 70%)`,
                filter: 'blur(24px)',
                zIndex: -1,
                transition: 'background 0.5s',
              }} />
            </div>
          </div>

          {/* Right: email signup + CTA */}
          <div ref={rightRef} className="flex flex-col gap-8">
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: '1.12rem', lineHeight: 1.75, color: 'rgba(10,10,10,0.55)', maxWidth: '36ch' }}>
              Be first to know when new flavors drop.
              Get&nbsp;<strong style={{ color: activeFlavor.accent }}>20% off</strong> your first case — no discount code needed.
            </p>

            {submitted ? (
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(1.8rem, 3vw, 3rem)', textTransform: 'uppercase', color: activeFlavor.accent, letterSpacing: '-0.01em' }}>
                You're In. Get Ready. ↗
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="outline-none transition-colors"
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: '1rem',
                    padding: '15px 20px',
                    border: '2px solid rgba(0,0,0,0.12)',
                    background: '#fff',
                  }}
                  onFocus={e  => (e.target.style.borderColor = activeFlavor.accent)}
                  onBlur={e   => (e.target.style.borderColor = 'rgba(0,0,0,0.12)')}
                />
                <button type="submit" className="btn-primary" style={{ background: activeFlavor.accent, transition: 'background 0.4s', padding: '15px 28px', textAlign: 'center' }}>
                  Claim 20% Off →
                </button>
                <p style={{ fontSize: '0.72rem', opacity: 0.32 }}>No spam. Unsubscribe anytime.</p>
              </form>
            )}

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <a href="#flavors" className="btn-primary" style={{ background: activeFlavor.accent, transition: 'background 0.4s' }}>
                Shop All Flavors
              </a>
              <a href="#hero" className="btn-outline">Back to Top ↑</a>
            </div>

            {/* Brand promise micro-copy */}
            <ul className="flex flex-col gap-2 pt-2">
              {['Free shipping on orders over $40', 'Cancel subscription anytime', '30-day satisfaction guarantee'].map(t => (
                <li key={t} className="flex items-center gap-2" style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.85rem', color: 'rgba(10,10,10,0.5)' }}>
                  <span style={{ color: activeFlavor.accent, fontWeight: 700 }}>✓</span> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-10 mt-4 flex flex-col md:flex-row items-center justify-between gap-6" style={{ borderTop: '1px solid rgba(0,0,0,0.09)' }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '1.5rem', letterSpacing: '-0.02em' }}>
            NIRO<span style={{ color: activeFlavor.accent, transition: 'color 0.4s' }}>.</span>
          </div>
          <div className="flex gap-8">
            {['Instagram', 'Twitter', 'TikTok', 'YouTube'].map(s => (
              <a key={s} href="#" style={{
                fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
                fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                color: '#0a0a0a', opacity: 0.35, textDecoration: 'none', transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => (e.target.style.opacity = 1)}
              onMouseLeave={e => (e.target.style.opacity = 0.35)}>
                {s}
              </a>
            ))}
          </div>
          <p style={{ fontSize: '0.72rem', opacity: 0.28 }}>© 2025 Niro Beverages. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
