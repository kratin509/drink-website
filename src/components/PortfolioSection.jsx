import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useFlavorStore } from '../store/flavorStore'

gsap.registerPlugin(ScrollTrigger)

const PROJECTS = [
  {
    title: 'The Cinematic Matrix',
    tags:  ['3D Interaction', 'WebGL', 'Creative Direction'],
    year:  '2024',
    idx:   '01',
  },
  {
    title: 'Niro D2C Experience',
    tags:  ['E-Commerce', 'Product Canvas', 'Kinetic Typography'],
    year:  '2024',
    idx:   '02',
  },
  {
    title: 'DECK Furniture Portal',
    tags:  ['D2C Retail', 'Brand Refresh', 'Conversion Optimization'],
    year:  '2023',
    idx:   '03',
  },
  {
    title: 'Pulse Medical Suite',
    tags:  ['B2B Healthcare', 'UI/UX Architecture'],
    year:  '2023',
    idx:   '04',
  },
  {
    title: 'Dine & Co. Digital Menu',
    tags:  ['Hospitality', 'Experience Design'],
    year:  '2023',
    idx:   '05',
  },
]

function ProjectCard({ p, accent }) {
  const ref = useRef()
  const handleMouseMove = e => {
    const rc = ref.current.getBoundingClientRect()
    const x  = (e.clientX - rc.left - rc.width  / 2) / rc.width
    const y  = (e.clientY - rc.top  - rc.height / 2) / rc.height
    gsap.to(ref.current, { rotateX: -y * 6, rotateY: x * 6, duration: 0.35, ease: 'power2.out', transformPerspective: 1000 })
  }
  const handleMouseLeave = () =>
    gsap.to(ref.current, { rotateX: 0, rotateY: 0, duration: 0.65, ease: 'elastic.out(1, 0.6)' })

  return (
    <div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      className="proj-card flex flex-col justify-between p-5 bg-white cursor-pointer"
      style={{ border: '1px solid rgba(0,0,0,0.08)', transformStyle: 'preserve-3d' }}
    >
      {/* Top: index + year */}
      <div className="flex justify-between items-start mb-3">
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '2.5rem', lineHeight: 1, color: `rgba(0,0,0,0.06)` }}>
          {p.idx}
        </span>
        <span className="label-tag" style={{ fontSize: '0.58rem', opacity: 0.35 }}>{p.year}</span>
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontWeight: 900,
        fontSize: 'clamp(1rem, 1.4vw, 1.45rem)',
        lineHeight: 1.05,
        letterSpacing: '-0.01em',
        textTransform: 'uppercase',
        color: '#0a0a0a',
        marginBottom: '10px',
      }}>
        {p.title}
      </h3>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mt-auto">
        {p.tags.map(tag => (
          <span key={tag} style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '0.58rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '2px 6px',
            background: `rgba(${accent ? '220,38,38' : '0,0,0'},.07)`,
            color: accent || '#0a0a0a',
          }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Bottom: view arrow */}
      <div className="flex justify-end mt-3">
        <span style={{
          fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
          fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase',
          color: accent || '#0a0a0a', opacity: 0.5,
        }}>
          View ↗
        </span>
      </div>
    </div>
  )
}

export default function PortfolioSection() {
  const sectionRef = useRef()
  const bgRef      = useRef()
  const photoRef   = useRef()
  const aboutRef   = useRef()
  const gridRef    = useRef()
  const { activeFlavor } = useFlavorStore()

  /* Photo parallax tilt ─────────────────────────────────────────────────── */
  const handlePhotoMove = e => {
    const rc  = photoRef.current.getBoundingClientRect()
    const x   = (e.clientX - rc.left - rc.width  / 2) / rc.width
    const y   = (e.clientY - rc.top  - rc.height / 2) / rc.height
    gsap.to(photoRef.current, {
      rotateX: -y * 18,
      rotateY:  x * 18,
      scale: 1.03,
      duration: 0.45,
      ease: 'power2.out',
      transformPerspective: 900,
    })
  }
  const handlePhotoLeave = () =>
    gsap.to(photoRef.current, {
      rotateX: 0, rotateY: 0, scale: 1,
      duration: 0.8, ease: 'elastic.out(1, 0.6)',
    })

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        yPercent: -12, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
      gsap.fromTo(aboutRef.current,
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 76%' } }
      )
      gsap.fromTo(Array.from(gridRef.current?.children ?? []),
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.65, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 66%' } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="portfolio" ref={sectionRef} className="section-frame" style={{ background: 'var(--page-bg)' }}>

      {/* ── z-10: bg word ───────────────────────────────────────────────── */}
      <div ref={bgRef} aria-hidden="true"
        className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden select-none pointer-events-none">
        <span className="vp-word text-[#0a0a0a]" style={{ fontSize: 'clamp(7rem, 22vw, 28rem)', opacity: 0.038 }}>
          WORK
        </span>
      </div>

      {/* ── z-20: UI ────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-20 flex flex-col px-8 md:px-16 lg:px-24 pt-10 pb-8">

        {/* Label */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px w-8" style={{ background: activeFlavor.accent, transition: 'background 0.4s' }} />
          <span className="label-tag" style={{ opacity: 0.45 }}>Portfolio / Selected Projects</span>
        </div>

        {/* Body: left about col + right project grid */}
        <div className="grid grid-cols-[28%_1fr] gap-10 flex-1 min-h-0">

          {/* ── Left: About + Profile photo ──────────────────────────── */}
          <div ref={aboutRef} className="flex flex-col justify-between">
            <div>
              <h2 className="headline text-[#0a0a0a] mb-4" style={{ fontSize: 'clamp(2.5rem, 5vw, 5.5rem)' }}>
                About
              </h2>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.9rem', lineHeight: 1.75, color: 'rgba(10,10,10,0.55)', maxWidth: '28ch', marginBottom: '1.5rem' }}>
                Creative frontend engineer & WebGL architect. Obsessed with
                kinetic typography, immersive 3D, and brands that move.
              </p>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.9rem', lineHeight: 1.75, color: 'rgba(10,10,10,0.42)', maxWidth: '28ch' }}>
                5+ years shipping D2C digital experiences across retail,
                healthcare, and hospitality.
              </p>
            </div>

            {/* Profile photo — asymmetric frame + parallax tilt */}
            <div
              className="relative mt-auto"
              style={{ width: '100%', maxWidth: '220px', transformStyle: 'preserve-3d' }}
              onMouseMove={handlePhotoMove}
              onMouseLeave={handlePhotoLeave}
            >
              {/* Offset accent border (behind image) */}
              <div
                aria-hidden="true"
                className="absolute"
                style={{
                  inset: 0,
                  border: `2px solid ${activeFlavor.accent}`,
                  transform: 'translate(8px, 8px)',
                  transition: 'border-color 0.4s',
                  zIndex: 0,
                }}
              />

              {/* Photo frame */}
              <div
                ref={photoRef}
                className="relative"
                style={{ transformStyle: 'preserve-3d', zIndex: 1 }}
              >
                <img
                  src="/image_e66955.jpg"
                  alt="Profile"
                  className="block w-full object-cover"
                  style={{ aspectRatio: '3/4', filter: 'grayscale(8%) contrast(1.04)' }}
                  draggable={false}
                />
                {/* Overlay tint strip at bottom */}
                <div
                  className="absolute bottom-0 left-0 right-0"
                  style={{
                    height: '40%',
                    background: `linear-gradient(to top, rgba(${activeFlavor.accentRgb}, 0.35), transparent)`,
                    transition: 'background 0.4s',
                  }}
                />
              </div>

              {/* Name + role badge */}
              <div className="mt-3">
                <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '1.1rem', letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
                  Creative Lead
                </p>
                <p className="label-tag" style={{ opacity: 0.38, fontSize: '0.6rem' }}>Frontend · WebGL · Brand</p>
              </div>
            </div>
          </div>

          {/* ── Right: 5-project grid (3 + 2 layout) ─────────────────── */}
          <div ref={gridRef} className="grid grid-cols-3 grid-rows-2 gap-4 content-stretch min-h-0">
            {PROJECTS.map(p => (
              <ProjectCard key={p.idx} p={p} accent={activeFlavor.accent} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
