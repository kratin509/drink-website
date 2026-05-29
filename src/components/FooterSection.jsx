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
        { opacity: 0, y: 80 },
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
        { opacity: 0, y: 40 },
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
        { scale: 1.02, duration: 0.15, yoyo: true, repeat: 1 }
      )
    }
  }

  return (
    <footer
      id="cta"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#f8f8f6] pt-32 pb-16 px-8 md:px-16"
    >
      {/* Large decorative text */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="font-display font-black text-[25vw] leading-none tracking-tighter"
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            color: `rgba(${activeFlavor.accentRgb}, 0.05)`,
            transition: 'color 0.4s',
          }}
        >
          NIRO
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Tagline */}
        <div ref={taglineRef}>
          <h2
            className="headline-fill text-[#0a0a0a] mb-4"
            style={{ fontSize: 'clamp(3rem, 10vw, 9rem)' }}
          >
            READY TO
          </h2>
          <h2
            className="headline-fill mb-12"
            style={{ fontSize: 'clamp(3rem, 10vw, 9rem)', color: activeFlavor.accent, transition: 'color 0.4s' }}
          >
            PUSH?
          </h2>
          <p className="text-[#0a0a0a]/60 text-xl mb-16 max-w-md mx-auto" style={{ fontFamily: "'Barlow', sans-serif" }}>
            Be first to know when new flavors drop. Get 20% off your first case.
          </p>
        </div>

        {/* Email form */}
        <div ref={formRef} className="mb-20">
          {submitted ? (
            <div
              className="font-display text-4xl font-black uppercase tracking-tight py-8"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", color: activeFlavor.accent }}
            >
              You're In. Get Ready. ↗
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-6 py-4 text-base border-2 border-black/20 bg-white outline-none focus:border-current transition-colors"
                style={{ fontFamily: "'Barlow', sans-serif", '--tw-ring-color': activeFlavor.accent }}
                onFocus={(e) => (e.target.style.borderColor = activeFlavor.accent)}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(0,0,0,0.2)')}
              />
              <button
                type="submit"
                className="btn-primary whitespace-nowrap px-8 py-4"
                style={{ background: activeFlavor.accent, transition: 'background 0.4s' }}
              >
                Claim My 20% →
              </button>
            </form>
          )}
          <p className="mt-4 text-xs opacity-40">
            No spam. Unsubscribe anytime. We respect your inbox.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-20">
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
      <div className="relative z-10 border-t-2 border-black/10 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div
          className="font-display font-black text-2xl tracking-tighter"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          NIRO<span style={{ color: activeFlavor.accent }}>.</span>
        </div>

        <div className="flex gap-8">
          {['Instagram', 'Twitter', 'TikTok', 'YouTube'].map((s) => (
            <a
              key={s}
              href="#"
              className="font-display text-xs tracking-widest uppercase opacity-50 hover:opacity-100 transition-opacity"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}
            >
              {s}
            </a>
          ))}
        </div>

        <p className="text-xs opacity-30" style={{ fontFamily: "'Barlow', sans-serif" }}>
          © 2025 Niro Beverages. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
