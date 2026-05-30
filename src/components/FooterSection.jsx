import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useFlavorStore } from '../store/flavorStore'

gsap.registerPlugin(ScrollTrigger)

/* ── SVG clip-path: tilted can silhouette + pour stream ─────────────────── */
// Coordinate space 340 × 640 (CSS px units — parent div must match)
const CLIP_ID = 'niro-pour-mask'

function PourClipDef() {
  return (
    <svg
      aria-hidden="true"
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
    >
      <defs>
        <clipPath id={CLIP_ID} clipPathUnits="userSpaceOnUse">
          {/* ── Can top ellipse (slightly tilted with skew) ───────────── */}
          <ellipse cx="172" cy="68"  rx="65" ry="15" />
          {/* ── Can shoulder taper top ───────────────────────────────── */}
          <polygon points="107,68  237,68  242,88  102,88" />
          {/* ── Can main body ────────────────────────────────────────── */}
          <rect x="100" y="86" width="144" height="272" />
          {/* ── Can shoulder taper bottom ────────────────────────────── */}
          <polygon points="100,358  244,358  238,376  106,376" />
          {/* ── Can bottom ellipse ───────────────────────────────────── */}
          <ellipse cx="172" cy="376" rx="66" ry="14" />

          {/* ── Pour stream — narrows then widens toward splash ───────── */}
          {/*    Bezier from can base, tapering ~20px wide then fanning   */}
          <path d="
            M 160 376
            C 156 410, 148 450, 143 498
            Q 138 538, 135 556
            Q 130 578, 172 578
            Q 214 578, 209 556
            Q 206 538, 201 498
            C 196 450, 188 410, 184 376
            Z
          " />

          {/* ── Splash pool ellipse ───────────────────────────────────── */}
          <ellipse cx="172" cy="582" rx="58"  ry="18" />
          {/* ── Ripple 1 ────────────────────────────────────────────── */}
          <ellipse cx="172" cy="586" rx="78"  ry="11" />
          {/* ── Ripple 2 ────────────────────────────────────────────── */}
          <ellipse cx="172" cy="592" rx="96"  ry="7"  />
        </clipPath>
      </defs>
    </svg>
  )
}

export default function FooterSection() {
  const sectionRef = useRef()
  const bgRef      = useRef()
  const leftRef    = useRef()
  const rightRef   = useRef()
  const videoRef   = useRef()
  const [email, setEmail]         = useState('')
  const [submitted, setSubmitted] = useState(false)
  const { activeFlavor } = useFlavorStore()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        yPercent: -10, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
      gsap.fromTo(leftRef.current,  { opacity: 0, x: -48 }, {
        opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 74%' },
      })
      gsap.fromTo(rightRef.current, { opacity: 0, x:  48 }, {
        opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 74%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const handleSubmit = e => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      gsap.fromTo(rightRef.current, { scale: 1 }, { scale: 1.015, duration: 0.12, yoyo: true, repeat: 1 })
    }
  }

  const W = 340, H = 640   // clip-path canvas dimensions

  return (
    <section id="cta" ref={sectionRef} className="section-frame" style={{ background: 'var(--page-bg)' }}>
      <PourClipDef />

      {/* ── z-10: bg word ───────────────────────────────────────────────── */}
      <div ref={bgRef} aria-hidden="true"
        className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden select-none pointer-events-none">
        <span className="vp-word text-[#0a0a0a]" style={{ fontSize: 'clamp(9rem, 28vw, 36rem)', opacity: 0.034 }}>
          PUSH
        </span>
      </div>

      {/* ── z-20: UI ────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-20 flex flex-col px-8 md:px-16 lg:px-24 pt-10 pb-8">

        {/* Label */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px w-8" style={{ background: activeFlavor.accent, transition: 'background 0.4s' }} />
          <span className="label-tag" style={{ opacity: 0.45 }}>05 / Ready?</span>
        </div>

        {/* Two-column: left = video mask can / right = form */}
        <div className="grid grid-cols-[auto_1fr] gap-12 lg:gap-20 items-center flex-1 min-h-0">

          {/* ── Left: liquid pour video mask ────────────────────────── */}
          <div ref={leftRef} className="flex flex-col items-start">
            {/* Tagline above can */}
            <h2 className="headline text-[#0a0a0a] mb-1" style={{ fontSize: 'clamp(2.8rem, 7vw, 8rem)' }}>
              Ready To
            </h2>
            <h2 className="headline mb-6" style={{ fontSize: 'clamp(2.8rem, 7vw, 8rem)', color: activeFlavor.accent, transition: 'color 0.4s' }}>
              Push?
            </h2>

            {/* VIDEO MASK CONTAINER — clip-path applied here */}
            <div
              className="relative"
              style={{ width: W, height: H, flexShrink: 0 }}
            >
              {/* Glow halo behind silhouette */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: '5%', left: '50%',
                  transform: 'translate(-50%, 0)',
                  width: W * 0.8, height: H * 0.5,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, rgba(${activeFlavor.accentRgb}, 0.28) 0%, transparent 70%)`,
                  filter: 'blur(30px)',
                  zIndex: 0,
                  transition: 'background 0.5s',
                  pointerEvents: 'none',
                }}
              />

              {/* Clipped video layer */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  clipPath: `url(#${CLIP_ID})`,
                  zIndex: 1,
                }}
              >
                <video
                  ref={videoRef}
                  src="/footer-leak.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    width: W,
                    height: H,
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>

              {/* Metallic highlight sheen over clip */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  clipPath: `url(#${CLIP_ID})`,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 38%, rgba(0,0,0,0.12) 100%)',
                  zIndex: 2,
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>

          {/* ── Right: email form + CTAs ─────────────────────────────── */}
          <div ref={rightRef} className="flex flex-col gap-6 max-w-lg">
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 'clamp(0.95rem, 1.2vw, 1.12rem)', lineHeight: 1.8, color: 'rgba(10,10,10,0.52)', maxWidth: '38ch' }}>
              Be first to know when new flavors drop. Get&nbsp;
              <strong style={{ color: activeFlavor.accent, transition: 'color 0.4s' }}>20% off</strong>
              &nbsp;your first case — no discount code needed.
            </p>

            {submitted ? (
              <div className="headline" style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.8rem)', color: activeFlavor.accent, transition: 'color 0.4s' }}>
                You're In. Get Ready. ↗
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm">
                <input
                  type="email" required value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="outline-none transition-colors"
                  style={{
                    fontFamily: "'Barlow', sans-serif", fontSize: '1rem',
                    padding: '13px 18px', border: '2px solid rgba(0,0,0,0.12)', background: '#fff',
                  }}
                  onFocus={e => (e.target.style.borderColor = activeFlavor.accent)}
                  onBlur={e  => (e.target.style.borderColor = 'rgba(0,0,0,0.12)')}
                />
                <button type="submit" className="btn-primary"
                  style={{ background: activeFlavor.accent, transition: 'background 0.4s', textAlign: 'center' }}>
                  Claim 20% Off →
                </button>
                <p style={{ fontSize: '0.7rem', opacity: 0.3 }}>No spam. Unsubscribe anytime.</p>
              </form>
            )}

            <div className="flex flex-wrap gap-4">
              <a href="#flavors" className="btn-primary" style={{ background: activeFlavor.accent, transition: 'background 0.4s' }}>
                Shop All Flavors
              </a>
              <a href="#hero" className="btn-outline">Back to Top ↑</a>
            </div>

            {/* Brand promises */}
            <ul className="flex flex-col gap-2">
              {['Free shipping on orders over $40', 'Cancel subscription anytime', '30-day satisfaction guarantee'].map(t => (
                <li key={t} className="flex items-center gap-2"
                  style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.82rem', color: 'rgba(10,10,10,0.46)' }}>
                  <span style={{ color: activeFlavor.accent, fontWeight: 700, transition: 'color 0.4s' }}>✓</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-5 mt-4 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(0,0,0,0.09)' }}>
          <div className="headline" style={{ fontSize: '1.45rem' }}>
            NIRO<span style={{ color: activeFlavor.accent, transition: 'color 0.4s' }}>.</span>
          </div>
          <div className="flex gap-8">
            {['Instagram', 'Twitter', 'TikTok', 'YouTube'].map(s => (
              <a key={s} href="#" className="label-tag"
                style={{ fontSize: '0.7rem', opacity: 0.35, textDecoration: 'none', color: '#0a0a0a', transition: 'opacity 0.2s' }}
                onMouseEnter={e => (e.target.style.opacity = 1)}
                onMouseLeave={e => (e.target.style.opacity = 0.35)}>
                {s}
              </a>
            ))}
          </div>
          <p style={{ fontSize: '0.7rem', opacity: 0.26 }}>© 2025 Niro Beverages. All rights reserved.</p>
        </div>
      </div>
    </section>
  )
}
