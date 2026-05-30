import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useFlavorStore } from '../store/flavorStore'

gsap.registerPlugin(ScrollTrigger)

const CLIP_ID = 'niro-pour-mask'

function PourClipDef() {
  return (
    <svg aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
      <defs>
        <clipPath id={CLIP_ID} clipPathUnits="userSpaceOnUse">
          <ellipse cx="172" cy="68"  rx="65" ry="15" />
          <polygon points="107,68  237,68  242,88  102,88" />
          <rect x="100" y="86" width="144" height="272" />
          <polygon points="100,358  244,358  238,376  106,376" />
          <ellipse cx="172" cy="376" rx="66" ry="14" />
          <path d="M 160 376 C 156 410, 148 450, 143 498 Q 138 538, 135 556 Q 130 578, 172 578 Q 214 578, 209 556 Q 206 538, 201 498 C 196 450, 188 410, 184 376 Z" />
          <ellipse cx="172" cy="582" rx="58" ry="18" />
          <ellipse cx="172" cy="586" rx="78" ry="11" />
          <ellipse cx="172" cy="592" rx="96" ry="7"  />
        </clipPath>
      </defs>
    </svg>
  )
}

export default function FooterSection() {
  const sectionRef = useRef()
  const leftRef    = useRef()
  const rightRef   = useRef()
  const [email, setEmail]         = useState('')
  const [submitted, setSubmitted] = useState(false)
  const { activeFlavor } = useFlavorStore()
  const W = 300, H = 560

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(leftRef.current,  { opacity: 0, x: -40 }, {
        opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 74%' },
      })
      gsap.fromTo(rightRef.current, { opacity: 0, x:  40 }, {
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

  return (
    <section
      id="cta"
      ref={sectionRef}
      className="w-screen h-screen overflow-hidden flex flex-col justify-center items-start relative"
      style={{ paddingLeft: '10vw', paddingRight: '10vw' }}
    >
      <PourClipDef />

      {/* Bg word */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none" style={{ zIndex: 0 }}>
        <span className="vp-word text-[#0a0a0a]" style={{ fontSize: 'clamp(9rem, 28vw, 36rem)', opacity: 0.03 }}>
          PUSH
        </span>
      </div>

      <div style={{ position: 'relative', zIndex: 10, width: '100%' }}>
        {/* Label */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px w-8" style={{ background: activeFlavor.accent, transition: 'background 0.4s' }} />
          <span className="label-tag" style={{ opacity: 0.45 }}>05 / Ready?</span>
        </div>

        <div className="grid items-center gap-14" style={{ gridTemplateColumns: 'auto 1fr', maxWidth: '80vw' }}>
          {/* Left: video mask pour */}
          <div ref={leftRef} className="flex flex-col items-start">
            <h2 className="headline text-[#0a0a0a] mb-1" style={{ fontSize: 'clamp(2.4rem, 5.5vw, 6.5rem)' }}>Ready To</h2>
            <h2 className="headline mb-5" style={{ fontSize: 'clamp(2.4rem, 5.5vw, 6.5rem)', color: activeFlavor.accent, transition: 'color 0.4s' }}>Push?</h2>

            <div className="relative" style={{ width: W, height: H, flexShrink: 0 }}>
              {/* Glow halo */}
              <div aria-hidden="true" style={{
                position: 'absolute', top: '5%', left: '50%',
                transform: 'translate(-50%, 0)',
                width: W * 0.8, height: H * 0.5,
                borderRadius: '50%',
                background: `radial-gradient(circle, rgba(${activeFlavor.accentRgb}, 0.26) 0%, transparent 70%)`,
                filter: 'blur(28px)', zIndex: 0, transition: 'background 0.5s', pointerEvents: 'none',
              }} />
              {/* Clipped video */}
              <div style={{ position: 'absolute', inset: 0, clipPath: `url(#${CLIP_ID})`, zIndex: 1 }}>
                <video
                  src="/footer-leak.mp4"
                  autoPlay loop muted playsInline
                  style={{ width: W, height: H, objectFit: 'cover', display: 'block' }}
                />
              </div>
              {/* Metallic sheen */}
              <div aria-hidden="true" style={{
                position: 'absolute', inset: 0,
                clipPath: `url(#${CLIP_ID})`,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 38%, rgba(0,0,0,0.1) 100%)',
                zIndex: 2, pointerEvents: 'none',
              }} />
            </div>
          </div>

          {/* Right: email form */}
          <div ref={rightRef} className="flex flex-col gap-5 max-w-sm">
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 'clamp(0.9rem, 1.1vw, 1.05rem)', lineHeight: 1.8, color: 'rgba(10,10,10,0.5)', maxWidth: '36ch' }}>
              Be first to know when new flavors drop. Get&nbsp;
              <strong style={{ color: activeFlavor.accent, transition: 'color 0.4s' }}>20% off</strong>
              &nbsp;your first case — no code needed.
            </p>

            {submitted ? (
              <div className="headline" style={{ fontSize: 'clamp(1.4rem, 2.2vw, 2.4rem)', color: activeFlavor.accent, transition: 'color 0.4s' }}>
                You're In. Get Ready. ↗
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  type="email" required value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="outline-none transition-colors"
                  style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.95rem', padding: '12px 16px', border: '2px solid rgba(0,0,0,0.12)', background: 'rgba(255,255,255,0.9)' }}
                  onFocus={e => (e.target.style.borderColor = activeFlavor.accent)}
                  onBlur={e  => (e.target.style.borderColor = 'rgba(0,0,0,0.12)')}
                />
                <button type="submit" className="btn-primary"
                  style={{ background: activeFlavor.accent, transition: 'background 0.4s', textAlign: 'center' }}>
                  Claim 20% Off →
                </button>
                <p style={{ fontSize: '0.68rem', opacity: 0.28 }}>No spam. Unsubscribe anytime.</p>
              </form>
            )}

            <div className="flex flex-wrap gap-3">
              <a href="#flavors" className="btn-primary" style={{ background: activeFlavor.accent, transition: 'background 0.4s' }}>Shop All Flavors</a>
              <a href="#hero" className="btn-outline">Back to Top ↑</a>
            </div>

            <ul className="flex flex-col gap-1.5">
              {['Free shipping on orders over $40', 'Cancel subscription anytime', '30-day satisfaction guarantee'].map(t => (
                <li key={t} className="flex items-center gap-2"
                  style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.8rem', color: 'rgba(10,10,10,0.44)' }}>
                  <span style={{ color: activeFlavor.accent, fontWeight: 700, transition: 'color 0.4s' }}>✓</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-5 mt-6 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(0,0,0,0.09)', maxWidth: '80vw' }}>
          <div className="headline" style={{ fontSize: '1.35rem' }}>
            NIRO<span style={{ color: activeFlavor.accent, transition: 'color 0.4s' }}>.</span>
          </div>
          <div className="flex gap-7">
            {['Instagram', 'Twitter', 'TikTok', 'YouTube'].map(s => (
              <a key={s} href="#" className="label-tag"
                style={{ fontSize: '0.68rem', opacity: 0.32, textDecoration: 'none', color: '#0a0a0a', transition: 'opacity 0.2s' }}
                onMouseEnter={e => (e.target.style.opacity = 1)}
                onMouseLeave={e => (e.target.style.opacity = 0.32)}>
                {s}
              </a>
            ))}
          </div>
          <p style={{ fontSize: '0.68rem', opacity: 0.24 }}>© 2025 Niro Beverages. All rights reserved.</p>
        </div>
      </div>
    </section>
  )
}
