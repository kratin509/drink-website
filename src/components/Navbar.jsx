import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { useFlavorStore } from '../store/flavorStore'

export default function Navbar() {
  const navRef = useRef(null)
  const { activeFlavor } = useFlavorStore()

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { yPercent: -100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: 'power3.out' }
    )
  }, [])

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 mix-blend-multiply"
    >
      {/* Logo */}
      <a
        href="#hero"
        className="font-display text-3xl tracking-tighter leading-none text-[#0a0a0a]"
        style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900 }}
      >
        NIRO
        <span style={{ color: activeFlavor.accent }}>.</span>
      </a>

      {/* Links */}
      <div className="flex items-center gap-8">
        <a
          href="#flavors"
          className="font-display text-sm tracking-widest uppercase text-[#0a0a0a] hover:opacity-60 transition-opacity"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}
        >
          Flavors
        </a>
        <a
          href="#nutrition"
          className="font-display text-sm tracking-widest uppercase text-[#0a0a0a] hover:opacity-60 transition-opacity"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}
        >
          Nutrition
        </a>
        <a
          href="#cta"
          className="btn-primary text-sm py-2 px-6"
          style={{ background: activeFlavor.accent, transition: 'background 0.4s' }}
        >
          Buy Now
        </a>
      </div>
    </nav>
  )
}
