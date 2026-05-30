import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useFlavorStore } from '../store/flavorStore'

gsap.registerPlugin(ScrollTrigger)

const PROJECTS = [
  { title: 'The Cinematic Matrix',    tags: ['3D Interaction', 'WebGL', 'Creative Direction'], year: '2024', idx: '01' },
  { title: 'Niro D2C Experience',     tags: ['E-Commerce', 'Product Canvas', 'Kinetic Typography'], year: '2024', idx: '02' },
  { title: 'DECK Furniture Portal',   tags: ['D2C Retail', 'Brand Refresh', 'Conversion'],    year: '2023', idx: '03' },
  { title: 'Pulse Medical Suite',     tags: ['B2B Healthcare', 'UI/UX Architecture'],         year: '2023', idx: '04' },
  { title: 'Dine & Co. Digital Menu', tags: ['Hospitality', 'Experience Design'],             year: '2023', idx: '05' },
]

function ProjectCard({ p, accent }) {
  const ref = useRef()
  const onMove = e => {
    const rc = ref.current.getBoundingClientRect()
    const x = (e.clientX - rc.left - rc.width  / 2) / rc.width
    const y = (e.clientY - rc.top  - rc.height / 2) / rc.height
    gsap.to(ref.current, { rotateX: -y * 6, rotateY: x * 6, duration: 0.35, ease: 'power2.out', transformPerspective: 1000 })
  }
  const onLeave = () => gsap.to(ref.current, { rotateX: 0, rotateY: 0, duration: 0.65, ease: 'elastic.out(1, 0.6)' })

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      className="flex flex-col justify-between cursor-pointer"
      style={{ padding: '18px 20px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', border: '1px solid rgba(0,0,0,0.08)', transformStyle: 'preserve-3d' }}
    >
      <div className="flex justify-between items-start mb-2">
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '2.2rem', lineHeight: 1, color: 'rgba(0,0,0,0.06)' }}>{p.idx}</span>
        <span className="label-tag" style={{ fontSize: '0.55rem', opacity: 0.32 }}>{p.year}</span>
      </div>
      <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(0.9rem, 1.3vw, 1.3rem)', lineHeight: 1.05, letterSpacing: '-0.01em', textTransform: 'uppercase', color: '#0a0a0a', marginBottom: '8px' }}>
        {p.title}
      </h3>
      <div className="flex flex-wrap gap-1 mt-auto mb-3">
        {p.tags.map(tag => (
          <span key={tag} style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '2px 5px', background: 'rgba(0,0,0,0.06)', color: '#0a0a0a' }}>
            {tag}
          </span>
        ))}
      </div>
      <div className="flex justify-end">
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: accent || '#0a0a0a', opacity: 0.5 }}>
          View ↗
        </span>
      </div>
    </div>
  )
}

export default function PortfolioSection() {
  const sectionRef = useRef()
  const aboutRef   = useRef()
  const gridRef    = useRef()
  const photoRef   = useRef()
  const { activeFlavor } = useFlavorStore()

  const onPhotoMove = e => {
    const rc = photoRef.current.getBoundingClientRect()
    const x = (e.clientX - rc.left - rc.width  / 2) / rc.width
    const y = (e.clientY - rc.top  - rc.height / 2) / rc.height
    gsap.to(photoRef.current, { rotateX: -y * 18, rotateY: x * 18, scale: 1.03, duration: 0.45, ease: 'power2.out', transformPerspective: 900 })
  }
  const onPhotoLeave = () =>
    gsap.to(photoRef.current, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.6)' })

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(aboutRef.current,
        { opacity: 0, x: -36 },
        { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 76%' } }
      )
      gsap.fromTo(Array.from(gridRef.current?.children ?? []),
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 64%' } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="w-screen h-screen overflow-hidden flex flex-col justify-center items-start relative"
      style={{ paddingLeft: '10vw', paddingRight: '10vw' }}
    >
      {/* Bg word */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none" style={{ zIndex: 0 }}>
        <span className="vp-word text-[#0a0a0a]" style={{ fontSize: 'clamp(7rem, 22vw, 28rem)', opacity: 0.034 }}>
          WORK
        </span>
      </div>

      <div style={{ position: 'relative', zIndex: 10, width: '100%' }}>
        {/* Label */}
        <div className="flex items-center gap-3 mb-5">
          <div className="h-px w-8" style={{ background: activeFlavor.accent, transition: 'background 0.4s' }} />
          <span className="label-tag" style={{ opacity: 0.45 }}>Portfolio / Selected Projects</span>
        </div>

        <div className="grid gap-10" style={{ gridTemplateColumns: '22% 1fr', maxWidth: '80vw' }}>
          {/* Left: About + photo */}
          <div ref={aboutRef} className="flex flex-col gap-4">
            <div>
              <h2 className="headline text-[#0a0a0a] mb-3" style={{ fontSize: 'clamp(2rem, 4vw, 5rem)' }}>About</h2>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.88rem', lineHeight: 1.75, color: 'rgba(10,10,10,0.55)', maxWidth: '26ch', marginBottom: '1rem' }}>
                Creative frontend engineer & WebGL architect. Obsessed with kinetic typography and brands that move.
              </p>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.88rem', lineHeight: 1.75, color: 'rgba(10,10,10,0.4)', maxWidth: '26ch' }}>
                5+ years shipping D2C digital experiences.
              </p>
            </div>

            {/* Profile photo with asymmetric accent frame */}
            <div
              className="relative mt-auto"
              style={{ maxWidth: '180px', transformStyle: 'preserve-3d' }}
              onMouseMove={onPhotoMove}
              onMouseLeave={onPhotoLeave}
            >
              <div aria-hidden="true" className="absolute" style={{ inset: 0, border: `2px solid ${activeFlavor.accent}`, transform: 'translate(7px, 7px)', transition: 'border-color 0.4s', zIndex: 0 }} />
              <div ref={photoRef} className="relative" style={{ transformStyle: 'preserve-3d', zIndex: 1 }}>
                <img src="/image_e66955.jpg" alt="Profile" className="block w-full object-cover" style={{ aspectRatio: '3/4', filter: 'grayscale(8%) contrast(1.04)' }} draggable={false} />
                <div className="absolute bottom-0 left-0 right-0" style={{ height: '38%', background: `linear-gradient(to top, rgba(${activeFlavor.accentRgb}, 0.32), transparent)`, transition: 'background 0.4s' }} />
              </div>
              <div className="mt-2">
                <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '1rem', letterSpacing: '-0.01em', textTransform: 'uppercase' }}>Creative Lead</p>
                <p className="label-tag" style={{ opacity: 0.36, fontSize: '0.58rem' }}>Frontend · WebGL · Brand</p>
              </div>
            </div>
          </div>

          {/* Right: project grid */}
          <div ref={gridRef} className="grid gap-3" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gridTemplateRows: 'repeat(2, minmax(0, 1fr))' }}>
            {PROJECTS.map(p => (
              <ProjectCard key={p.idx} p={p} accent={activeFlavor.accent} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
