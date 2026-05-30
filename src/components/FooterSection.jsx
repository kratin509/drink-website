import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useFlavorStore } from '../store/flavorStore'

gsap.registerPlugin(ScrollTrigger)

export default function FooterSection() {
  const sectionRef = useRef()
  const taglineRef = useRef()
  const formRef = useRef()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const { activeFlavor } = useFlavorStore()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        taglineRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      )
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: formRef.current, start: 'top 85%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      gsap.fromTo(
        formRef.current,
        { scale: 1 },
        { scale: 1.015, duration: 0.15, yoyo: true, repeat: 1 }
      )
    }
  }

  return (
    <footer
      id="cta"
      ref={sectionRef}
      className="relative overflow-hidden py-32 px-8 md:px-16 lg:px-24"
      style={{ background: '#f8f8f6' }}
    >
      {/* Giant watermark "NIRO" — purely decorative */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
      >
        <span
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(12rem, 38vw, 38rem)',
            lineHeight: 1,
            color: `rgba(${activeFlavor.accentRgb}, 0.05)`,
            transition: 'color 0.4s',
            letterSpacing: '-0.04em',
          }}
        >
          NIRO
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto text-center">

        {/* Big tagline */}
        <div ref={taglineRef}>
          <h2
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(4rem, 11vw, 11rem)',
              lineHeight: 0.88,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: '#0a0a0a',
            }}
          >
            Ready To
          </h2>
          <h2
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(4rem, 11vw, 11rem)',
              lineHeight: 0.88,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: activeFlavor.accent,
              transition: 'color 0.4s',
              marginBottom: '32px',
            }}
          >
            Push?
          </h2>
          <p
            className="mx-auto mb-14"
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: '1.1rem',
              color: 'rgba(10,10,10,0.5)',
              maxWidth: '36ch',
              lineHeight: 1.7,
            }}
          >
            Be first to know when new flavors drop.
            Get 20% off your first case.
          </p>
        </div>

        {/* Email form */}
        <div ref={formRef} className="mb-14">
          {submitted ? (
            <p
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 900,
                fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
                textTransform: 'uppercase',
                color: activeFlavor.accent,
                letterSpacing: '-0.01em',
              }}
            >
              You're In. Get Ready. ↗
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 outline-none transition-colors"
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: '1rem',
                  padding: '14px 20px',
                  border: '2px solid rgba(0,0,0,0.15)',
                  background: '#ffffff',
                }}
                onFocus={(e) => (e.target.style.borderColor = activeFlavor.accent)}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(0,0,0,0.15)')}
              />
              <button
                type="submit"
                className="btn-primary whitespace-nowrap"
                style={{
                  background: activeFlavor.accent,
                  transition: 'background 0.4s',
                  padding: '14px 28px',
                }}
              >
                Claim 20% Off →
              </button>
            </form>
          )}
          <p
            className="mt-4"
            style={{ fontSize: '0.75rem', opacity: 0.35 }}
          >
            No spam. Unsubscribe anytime. We respect your inbox.
          </p>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <a
            href="#flavors"
            className="btn-primary"
            style={{ background: activeFlavor.accent, transition: 'background 0.4s' }}
          >
            Shop All Flavors
          </a>
          <a href="#hero" className="btn-outline">
            Back to Top ↑
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="relative z-10 pt-10 mt-12 flex flex-col md:flex-row items-center justify-between gap-6"
        style={{ borderTop: '1px solid rgba(0,0,0,0.1)' }}
      >
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 900,
            fontSize: '1.5rem',
            letterSpacing: '-0.02em',
          }}
        >
          NIRO<span style={{ color: activeFlavor.accent, transition: 'color 0.4s' }}>.</span>
        </div>

        <div className="flex gap-8">
          {['Instagram', 'Twitter', 'TikTok', 'YouTube'].map((s) => (
            <a
              key={s}
              href="#"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: '0.75rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#0a0a0a',
                opacity: 0.4,
                transition: 'opacity 0.2s',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => (e.target.style.opacity = 1)}
              onMouseLeave={(e) => (e.target.style.opacity = 0.4)}
            >
              {s}
            </a>
          ))}
        </div>

        <p style={{ fontSize: '0.75rem', opacity: 0.3 }}>
          © 2025 Niro Beverages. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
