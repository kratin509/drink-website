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
        yPercent: -8, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
      gsap.fromTo(leftRef.current, { opacity: 0, x: -44 }, {
        opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 74%' },
      })
      gsap.fromTo(rightRef.current, { opacity: 0, x: 44 }, {
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
      gsap.fromTo(rightRef.current, { scale: 1 }, { scale: 1.012, duration: 0.1, yoyo: true, repeat: 1 })
    }
  }

  return (
    <section id="cta" ref={sectionRef} className="section-frame" style={{ background: 'var(--page-bg)' }}>

      {/* Ghost word */}
      <div ref={bgRef} aria-hidden="true"
        className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden pointer-events-none select-none">
        <span className="vp-word text-[#0a0a0a]" style={{ fontSize: 'clamp(9rem, 26vw, 34rem)', opacity: 0.028 }}>
          PUSH
        </span>
      </div>

      {/* UI */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center"
        style={{ paddingLeft: '8vw', paddingRight: '8vw', paddingTop: '80px', paddingBottom: '0' }}>

        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-8">
          <div style={{ width: '28px', height: '1px', background: activeFlavor.accent, transition: 'background 0.4s' }} />
          <span className="eyebrow" style={{ opacity: 0.45 }}>05 &nbsp;/&nbsp; Ready?</span>
        </div>

        {/* Two columns */}
        <div className="flex items-start gap-20" style={{ maxWidth: '78vw' }}>

          {/* Left — big typographic statement */}
          <div ref={leftRef} style={{ flexShrink: 0, maxWidth: '36vw' }}>
            <h2 className="display text-[#0a0a0a]" style={{ fontSize: 'clamp(3.5rem, 7.5vw, 9rem)', marginBottom: '0.06em' }}>
              Ready to
            </h2>
            <h2 className="display" style={{
              fontSize: 'clamp(3.5rem, 7.5vw, 9rem)',
              color: activeFlavor.accent, transition: 'color 0.4s',
              marginBottom: '1.4rem',
            }}>
              Push?
            </h2>

            <div style={{ width: '48px', height: '3px', background: activeFlavor.accent, transition: 'background 0.4s', marginBottom: '1.6rem' }} />

            <ul className="flex flex-col gap-4">
              {[
                { icon: '⚡', text: 'Natural caffeine from green tea extract' },
                { icon: '💪', text: '20g grass-fed whey protein per can'      },
                { icon: '🚫', text: 'Zero sugar, zero artificial sweeteners'  },
                { icon: '📦', text: 'Free shipping on orders over $40'         },
              ].map(({ icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <span style={{ fontSize: '0.95rem', lineHeight: 1, opacity: 0.85 }}>{icon}</span>
                  <span style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 300, fontSize: '0.88rem', color: 'rgba(10,10,10,0.55)', lineHeight: 1.5 }}>
                    {text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — email form */}
          <div ref={rightRef} className="flex flex-col gap-6" style={{ maxWidth: '360px', flex: '1' }}>
            <div>
              <p style={{
                fontFamily: "'Barlow',sans-serif", fontWeight: 300,
                fontSize: 'clamp(0.9rem, 1.1vw, 1.02rem)',
                lineHeight: 1.85, color: 'rgba(10,10,10,0.5)', maxWidth: '34ch',
              }}>
                Be first to know when new flavors drop.
                Get <strong style={{ fontWeight: 600, color: activeFlavor.accent, transition: 'color 0.4s' }}>20% off</strong> your
                first case — no code needed.
              </p>
            </div>

            {submitted ? (
              <div className="display" style={{ fontSize: 'clamp(1.5rem, 2.2vw, 2.5rem)', color: activeFlavor.accent, transition: 'color 0.4s' }}>
                You're In. ↗
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  type="email" required value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="outline-none"
                  style={{
                    fontFamily: "'Barlow',sans-serif", fontWeight: 400, fontSize: '0.95rem',
                    padding: '13px 18px',
                    border: '1.5px solid rgba(0,0,0,0.14)',
                    background: '#fff',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => (e.target.style.borderColor = activeFlavor.accent)}
                  onBlur={e  => (e.target.style.borderColor = 'rgba(0,0,0,0.14)')}
                />
                <button type="submit" className="btn-accent"
                  style={{ background: activeFlavor.accent, borderColor: activeFlavor.accent, transition: 'background 0.4s, border-color 0.4s', textAlign: 'center' }}>
                  Claim 20% Off →
                </button>
                <p style={{ fontSize: '0.66rem', opacity: 0.26, fontFamily: "'Barlow',sans-serif" }}>
                  No spam. Unsubscribe anytime.
                </p>
              </form>
            )}

            <div className="flex gap-3">
              <a href="#flavors" className="btn-accent"
                style={{ background: activeFlavor.accent, borderColor: activeFlavor.accent, transition: 'background 0.4s, border-color 0.4s', fontSize: '0.74rem', padding: '11px 22px' }}>
                Shop Flavors
              </a>
              <a href="#hero" className="btn-ghost" style={{ fontSize: '0.74rem', padding: '9px 20px' }}>
                Back to Top ↑
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between"
          style={{ padding: '16px 8vw', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
          <div className="headline" style={{ fontSize: '1.3rem' }}>
            NIRO<span style={{ color: activeFlavor.accent, transition: 'color 0.4s' }}>.</span>
          </div>
          <div className="flex gap-7">
            {['Instagram', 'Twitter', 'TikTok', 'YouTube'].map(s => (
              <a key={s} href="#" className="eyebrow"
                style={{ fontSize: '0.62rem', opacity: 0.3, textDecoration: 'none', color: '#0a0a0a', transition: 'opacity 0.2s' }}
                onMouseEnter={e => (e.target.style.opacity = 1)}
                onMouseLeave={e => (e.target.style.opacity = 0.3)}>
                {s}
              </a>
            ))}
          </div>
          <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: '0.65rem', opacity: 0.22 }}>
            © 2025 Niro Beverages. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  )
}
