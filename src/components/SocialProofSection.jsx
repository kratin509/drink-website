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
    color: '#dc2626',
  },
  {
    handle: '@coffeeandcodes',
    text: 'Zero crash, 6 hours of clean focus. This is what functional caffeine feels like.',
    followers: '18.9K',
    platform: 'X',
    avatar: '⚡',
    color: '#ca8a04',
  },
  {
    handle: '@ultrarunner_maya',
    text: '200km ultra + Niro Dark Chocolate = the only fuel I trust.',
    followers: '91.4K',
    platform: 'IG',
    avatar: '🏔',
    color: '#78350f',
  },
  {
    handle: '@gym.aesthetics',
    text: 'The branding alone made me buy it. The taste made me subscribe.',
    followers: '330K',
    platform: 'TT',
    avatar: '🎯',
    color: '#dc2626',
  },
  {
    handle: '@dr_nutrifit',
    text: '20g protein + 150mg caffeine in a can is genuinely impressive formula.',
    followers: '55.2K',
    platform: 'IG',
    avatar: '🔬',
    color: '#ca8a04',
  },
  {
    handle: '@nightshift.nurse',
    text: 'Kept me going through 12-hour shifts. The zero sugar part is not a lie.',
    followers: '28.7K',
    platform: 'X',
    avatar: '🌙',
    color: '#78350f',
  },
]

function SocialCard({ card, index }) {
  const ref = useRef()

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height
    gsap.to(ref.current, {
      rotateX: -y * 12,
      rotateY: x * 12,
      duration: 0.3,
      ease: 'power2.out',
      transformPerspective: 800,
    })
  }

  const handleMouseLeave = () => {
    gsap.to(ref.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.6)',
    })
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="social-card bg-white p-6 border border-black/10 cursor-default"
      style={{
        transform: `translateY(${index % 2 === 0 ? '0' : '24px'})`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Platform badge */}
      <div className="flex justify-between items-start mb-4">
        <div
          className="text-3xl"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
        >
          {card.avatar}
        </div>
        <span
          className="font-display text-xs px-2 py-1 font-black uppercase tracking-wider"
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            background: `rgba(${card.color.replace('#', '').match(/.{2}/g).map(h => parseInt(h, 16)).join(',')}, 0.1)`,
            color: card.color,
          }}
        >
          {card.platform}
        </span>
      </div>

      {/* Quote */}
      <blockquote
        className="text-[#0a0a0a] text-base leading-relaxed mb-4"
        style={{ fontFamily: "'Barlow', sans-serif" }}
      >
        "{card.text}"
      </blockquote>

      {/* Handle + followers */}
      <div className="flex justify-between items-center mt-auto pt-4 border-t border-black/10">
        <span
          className="font-display font-bold text-sm"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", color: card.color }}
        >
          {card.handle}
        </span>
        <span className="text-xs opacity-40">{card.followers} followers</span>
      </div>

      {/* Accent corner */}
      <div
        className="absolute top-0 right-0 w-8 h-8"
        style={{ background: card.color, clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
      />
    </div>
  )
}

export default function SocialProofSection() {
  const sectionRef = useRef()
  const headRef = useRef()
  const gridRef = useRef()
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
        gridRef.current.children,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 80%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-24 px-8 md:px-16 overflow-hidden"
      style={{ background: '#0a0a0a' }}
    >
      {/* Section label */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-px" style={{ background: activeFlavor.accent }} />
        <span
          className="font-display text-xs tracking-widest uppercase text-white/40"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}
        >
          The Community / Real Athletes
        </span>
      </div>

      {/* Heading */}
      <div ref={headRef} className="mb-16">
        <h2
          className="headline-fill text-white"
          style={{ fontSize: 'clamp(3rem, 9vw, 9rem)' }}
        >
          THE NIRO
        </h2>
        <h2
          className="headline-fill"
          style={{ fontSize: 'clamp(3rem, 9vw, 9rem)', color: activeFlavor.accent, transition: 'color 0.4s' }}
        >
          EFFECT
        </h2>
        <p className="text-white/40 max-w-md mt-6" style={{ fontFamily: "'Barlow', sans-serif" }}>
          50,000+ athletes, coders, nurses, and night owls trust Niro to push further.
        </p>
      </div>

      {/* Grid */}
      <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
        {TESTIMONIALS.map((card, i) => (
          <SocialCard key={card.handle} card={card} index={i} />
        ))}
      </div>

      {/* Stats bar */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 border-t border-white/10">
        {[
          { val: '50K+', label: 'Subscribers' },
          { val: '4.9★', label: 'Avg Rating' },
          { val: '3', label: 'Live Flavors' },
          { val: '0g', label: 'Sugar Added' },
        ].map(({ val, label }) => (
          <div key={label} className="text-center">
            <div
              className="font-display font-black text-5xl text-white leading-none mb-2"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              {val}
            </div>
            <div className="text-white/40 text-sm uppercase tracking-wider">{label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
