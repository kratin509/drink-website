import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useFlavorStore } from '../store/flavorStore'

gsap.registerPlugin(ScrollTrigger)

const TESTIMONIALS = [
  {
    handle: '@fitz_lifts',
    text: 'Swapped my pre-workout for Niro 3 months ago. PRs every week.',
    followers: '42.1K',
    platform: 'IG',
    avatar: '💪',
    accent: '#dc2626',
    accentRgb: '220, 38, 38',
  },
  {
    handle: '@coffeeandcodes',
    text: 'Zero crash, 6 hours of clean focus. This is what functional caffeine feels like.',
    followers: '18.9K',
    platform: 'X',
    avatar: '⚡',
    accent: '#ca8a04',
    accentRgb: '202, 138, 4',
  },
  {
    handle: '@ultrarunner_maya',
    text: '200km ultra + Niro Dark Chocolate = the only fuel I trust.',
    followers: '91.4K',
    platform: 'IG',
    avatar: '🏔',
    accent: '#78350f',
    accentRgb: '120, 53, 15',
  },
  {
    handle: '@gym.aesthetics',
    text: 'The branding alone made me buy it. The taste made me subscribe.',
    followers: '330K',
    platform: 'TT',
    avatar: '🎯',
    accent: '#dc2626',
    accentRgb: '220, 38, 38',
  },
  {
    handle: '@dr_nutrifit',
    text: '20g protein + 150mg caffeine in a can is a genuinely impressive formula.',
    followers: '55.2K',
    platform: 'IG',
    avatar: '🔬',
    accent: '#ca8a04',
    accentRgb: '202, 138, 4',
  },
  {
    handle: '@nightshift.nurse',
    text: 'Kept me going through 12-hour shifts. The zero sugar part is not a lie.',
    followers: '28.7K',
    platform: 'X',
    avatar: '🌙',
    accent: '#78350f',
    accentRgb: '120, 53, 15',
  },
]

function SocialCard({ card }) {
  const ref = useRef()

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height
    gsap.to(ref.current, {
      rotateX: -y * 10,
      rotateY: x * 10,
      duration: 0.3,
      ease: 'power2.out',
      transformPerspective: 900,
    })
  }

  const handleMouseLeave = () => {
    gsap.to(ref.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.6)',
    })
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex flex-col bg-white cursor-default"
      style={{
        padding: '28px',
        border: '1px solid rgba(255,255,255,0.08)',
        transformStyle: 'preserve-3d',
        transition: 'box-shadow 0.2s',
      }}
    >
      {/* Platform badge + avatar row */}
      <div className="flex justify-between items-center mb-5">
        <span className="text-3xl">{card.avatar}</span>
        <span
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '0.65rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            padding: '4px 8px',
            background: `rgba(${card.accentRgb}, 0.15)`,
            color: card.accent,
          }}
        >
          {card.platform}
        </span>
      </div>

      {/* Quote */}
      <blockquote
        className="flex-1 mb-6 leading-relaxed"
        style={{
          fontFamily: "'Barlow', sans-serif",
          fontSize: '0.95rem',
          color: '#1a1a1a',
        }}
      >
        "{card.text}"
      </blockquote>

      {/* Handle + followers */}
      <div
        className="flex justify-between items-center pt-4"
        style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}
      >
        <span
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '0.9rem',
            color: card.accent,
          }}
        >
          {card.handle}
        </span>
        <span style={{ fontSize: '0.75rem', opacity: 0.4 }}>{card.followers}</span>
      </div>

      {/* Accent corner triangle */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-7 h-7"
        style={{
          background: card.accent,
          clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
        }}
      />
    </div>
  )
}

export default function SocialProofSection() {
  const sectionRef = useRef()
  const headRef = useRef()
  const gridRef = useRef()
  const statsRef = useRef()
  const { activeFlavor } = useFlavorStore()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      )
      gsap.fromTo(
        Array.from(gridRef.current.children),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 80%' },
        }
      )
      gsap.fromTo(
        statsRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: statsRef.current, start: 'top 85%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-28 overflow-hidden"
      style={{ background: '#0a0a0a' }}
    >
      <div className="px-8 md:px-16 lg:px-24">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-12">
          <div className="w-8 h-px" style={{ background: activeFlavor.accent }} />
          <span
            className="text-xs tracking-[0.25em] uppercase"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              color: 'rgba(255,255,255,0.35)',
            }}
          >
            The Community / Real Athletes
          </span>
        </div>

        {/* Heading */}
        <div ref={headRef} className="mb-16">
          <h2
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(3.5rem, 9vw, 9rem)',
              lineHeight: 0.88,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: '#ffffff',
            }}
          >
            The Niro
          </h2>
          <h2
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(3.5rem, 9vw, 9rem)',
              lineHeight: 0.88,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: activeFlavor.accent,
              transition: 'color 0.4s',
              marginBottom: '24px',
            }}
          >
            Effect
          </h2>
          <p
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: '1.05rem',
              color: 'rgba(255,255,255,0.4)',
              maxWidth: '38ch',
            }}
          >
            50,000+ athletes, coders, nurses, and night owls trust Niro to push further.
          </p>
        </div>

        {/* Cards grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16"
        >
          {TESTIMONIALS.map((card) => (
            <SocialCard key={card.handle} card={card} />
          ))}
        </div>

        {/* Stats row */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-14"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          {[
            { val: '50K+', label: 'Subscribers' },
            { val: '4.9★', label: 'Avg Rating' },
            { val: '3', label: 'Live Flavors' },
            { val: '0g', label: 'Sugar Added' },
          ].map(({ val, label }) => (
            <div key={label} className="text-center">
              <div
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 900,
                  fontSize: 'clamp(2.5rem, 4vw, 4rem)',
                  lineHeight: 1,
                  color: '#ffffff',
                  marginBottom: '6px',
                }}
              >
                {val}
              </div>
              <div
                style={{
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em',
                  color: 'rgba(255,255,255,0.35)',
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
