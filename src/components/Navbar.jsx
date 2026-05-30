import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { useFlavorStore } from '../store/flavorStore'

export default function Navbar() {
  const navRef = useRef()
  const { activeFlavor } = useFlavorStore()

  useEffect(() => {
    gsap.fromTo(navRef.current,
      { yPercent: -100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.85, delay: 0.15, ease: 'power3.out' }
    )
  }, [])

  return (
    <nav ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
      style={{
        padding: '18px 40px',
        background: 'rgba(240,238,235,0.82)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
      }}
    >
      {/* Wordmark */}
      <a href="#hero" style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontWeight: 900, fontStyle: 'italic',
        fontSize: '1.55rem', letterSpacing: '-0.02em',
        textDecoration: 'none', color: '#0a0a0a', lineHeight: 1,
      }}>
        NIRO<span style={{ color: activeFlavor.accent, transition: 'color 0.4s' }}>.</span>
      </a>

      {/* Nav links */}
      <div className="flex items-center gap-9">
        {[{ label: 'Flavors', href: '#flavors' }, { label: 'Nutrition', href: '#nutrition' }].map(({ label, href }) => (
          <a key={label} href={href} className="eyebrow"
            style={{ color: '#0a0a0a', textDecoration: 'none', opacity: 0.48, transition: 'opacity 0.2s', fontSize: '0.7rem' }}
            onMouseEnter={e => (e.target.style.opacity = 1)}
            onMouseLeave={e => (e.target.style.opacity = 0.48)}>
            {label}
          </a>
        ))}
        <a href="#cta" className="btn-accent" style={{ background: activeFlavor.accent, borderColor: activeFlavor.accent, transition: 'background 0.4s, border-color 0.4s', padding: '9px 22px', fontSize: '0.72rem' }}>
          Buy Now
        </a>
      </div>
    </nav>
  )
}
