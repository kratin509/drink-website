import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { useFlavorStore } from '../store/flavorStore'
import { useMobile } from '../hooks/useMobile'

export default function Navbar() {
  const navRef = useRef()
  const [menuOpen, setMenuOpen] = useState(false)
  const { activeFlavor } = useFlavorStore()
  const isMobile = useMobile()

  useEffect(() => {
    gsap.fromTo(navRef.current,
      { yPercent: -100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.85, delay: 0.15, ease: 'power3.out' }
    )
  }, [])

  const links = [
    { label: 'Flavors', href: '#flavors' },
    { label: 'Nutrition', href: '#nutrition' },
  ]

  return (
    <nav ref={navRef}
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(240,238,235,0.92)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
      }}
    >
      <div className="flex items-center justify-between" style={{ padding: isMobile ? '10px 16px' : '18px 40px' }}>
        {/* Wordmark */}
        <a href="#hero" style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 900, fontStyle: 'italic',
          fontSize: isMobile ? '1.9rem' : '2rem',
          letterSpacing: '-0.02em',
          textDecoration: 'none', color: '#0a0a0a', lineHeight: 1,
        }}>
          NIRO<span style={{ color: activeFlavor.accent, transition: 'color 0.4s' }}>.</span>
        </a>

        {/* Desktop nav */}
        {!isMobile && (
          <div className="flex items-center gap-9">
            {links.map(({ label, href }) => (
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
        )}

        {/* Mobile hamburger */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', flexDirection: 'column', gap: '5px' }}
            aria-label="Toggle menu"
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: 'block', width: '24px', height: '2px',
                background: '#0a0a0a',
                transform: menuOpen
                  ? i === 0 ? 'rotate(45deg) translate(5px, 5px)'
                  : i === 1 ? 'scaleX(0)'
                  : 'rotate(-45deg) translate(5px, -5px)'
                  : 'none',
                transition: 'transform 0.25s ease',
              }} />
            ))}
          </button>
        )}
      </div>

      {/* Mobile dropdown */}
      {isMobile && menuOpen && (
        <div style={{
          background: 'rgba(240,238,235,0.98)',
          borderTop: '1px solid rgba(0,0,0,0.07)',
          padding: '20px',
          display: 'flex', flexDirection: 'column', gap: '16px',
        }}>
          {links.map(({ label, href }) => (
            <a key={label} href={href} className="eyebrow"
              onClick={() => setMenuOpen(false)}
              style={{ color: '#0a0a0a', textDecoration: 'none', opacity: 0.7, fontSize: '0.8rem' }}>
              {label}
            </a>
          ))}
          <a href="#cta" className="btn-accent"
            onClick={() => setMenuOpen(false)}
            style={{ background: activeFlavor.accent, borderColor: activeFlavor.accent, textAlign: 'center', marginTop: '4px' }}>
            Buy Now
          </a>
        </div>
      )}
    </nav>
  )
}
