import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { useFlavorStore } from '../store/flavorStore'

export default function Navbar() {
  const navRef = useRef()
  const { activeFlavor } = useFlavorStore()

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { yPercent: -100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.9, delay: 0.2, ease: 'power3.out' }
    )
  }, [])

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
      style={{
        padding: '20px 32px',
        background: 'rgba(248,248,246,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}
    >
      {/* Logo */}
      <a
        href="#hero"
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 900,
          fontSize: '1.6rem',
          letterSpacing: '-0.02em',
          textDecoration: 'none',
          color: '#0a0a0a',
          lineHeight: 1,
        }}
      >
        NIRO<span style={{ color: activeFlavor.accent, transition: 'color 0.4s' }}>.</span>
      </a>

      {/* Navigation links */}
      <div className="flex items-center gap-10">
        {[
          { label: 'Flavors', href: '#flavors' },
          { label: 'Nutrition', href: '#nutrition' },
        ].map(({ label, href }) => (
          <a
            key={label}
            href={href}
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: '0.8rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#0a0a0a',
              textDecoration: 'none',
              opacity: 0.6,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.target.style.opacity = 1)}
            onMouseLeave={(e) => (e.target.style.opacity = 0.6)}
          >
            {label}
          </a>
        ))}

        <a
          href="#cta"
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '0.8rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#ffffff',
            background: activeFlavor.accent,
            transition: 'background 0.4s',
            padding: '10px 22px',
            textDecoration: 'none',
          }}
        >
          Buy Now
        </a>
      </div>
    </nav>
  )
}
