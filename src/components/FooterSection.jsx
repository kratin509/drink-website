import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useFlavorStore } from '../store/flavorStore'

gsap.registerPlugin(ScrollTrigger)

export default function FooterSection() {
  const sectionRef = useRef()
  const bgRef      = useRef()
  const leftRef    = useRef()
  const rightRef   = useRef()
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

  return (
    <section id="cta" ref={sectionRef} className="section-frame" style={{ background: 'var(--page-bg)' }}>

      {/* z-10: bg word */}
      <div ref={bgRef} aria-hidden="true"
        className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden select-none pointer-events-none">
        <span className="vp-word text-[#0a0a0a]" style={{ fontSize: 'clamp(9rem, 28vw, 36rem)', opacity: 0.032 }}>
          PUSH
        </span>
      </div>

      {/* z-20: UI */}
      <div className="absolute inset-0 z-20 flex flex-col px-8 md:px-16 lg:px-24 pt-10 pb-8">

        {/* Label */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px w-8" style={{ background: activeFlavor.accent, transition: 'background 0.4s' }} />
          <span className="label-tag" style={{ opacity: 0.45 }}>05 / Ready?</span>
        </div>

        {/* Two-column: left typographic / right form */}
        <div className="grid grid-cols-[auto_1fr] gap-16 lg:gap-24 items-center flex-1 min-h-0">

          {/* Left: big typographic CTA */}
          <div ref={leftRef} className="flex flex-col justify-center" style={{ maxWidth: '38vw' }}>
            <h2 className="headline text-[#0a0a0a] leading-none" style={{ fontSize: 'clamp(3.5rem, 8vw, 9.5rem)' }}>
              Ready
            </h2>
            <h2 className="headline leading-none mb-6" style={{ fontSize: 'clamp(3.5rem, 8vw, 9.5rem)', color: activeFlavor.accent, transition: 'color 0.4s' }}>
              To Push?
            </h2>

            {/* Decorative accent rule */}
            <div style={{ width: '60px', height: '4px', background: activeFlavor.accent, transition: 'background 0.4s', marginBottom: '24px' }} />

            {/* Brand promise pills */}
            <div className="flex flex-col gap-3">
              {[
                { icon: '⚡', text: '150mg natural caffeine per can'      },
                { icon: '💪', text: '20g whey protein, zero compromise'   },
                { icon: '🚫', text: 'Zero sugar, zero artificial flavors' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <span style={{ fontSize: '1rem', lineHeight: 1 }}>{icon}</span>
                  <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.88rem', color: 'rgba(10,10,10,0.58)' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: email form + CTAs */}
          <div ref={rightRef} className="flex flex-col gap-6 max-w-md">
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 'clamp(0.92rem, 1.15vw, 1.08rem)', lineHeight: 1.8, color: 'rgba(10,10,10,0.52)', maxWidth: '38ch' }}>
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
                  style={{ fontFamily: "'Barlow', sans-serif", fontSize: '1rem', padding: '13px 18px', border: '2px solid rgba(0,0,0,0.12)', background: '#fff' }}
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
                style={{ fontSize: '0.7rem', opacity: 0.34, textDecoration: 'none', color: '#0a0a0a', transition: 'opacity 0.2s' }}
                onMouseEnter={e => (e.target.style.opacity = 1)}
                onMouseLeave={e => (e.target.style.opacity = 0.34)}>
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
