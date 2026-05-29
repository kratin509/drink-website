import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useScrollState() {
  const [scrollState, setScrollState] = useState({ section: 0, progress: 0, raw: 0 })

  useEffect(() => {
    const sections = ['#hero', '#flavors', '#nutrition', '#cta']
    const sectionEls = sections.map((s) => document.querySelector(s)).filter(Boolean)

    if (!sectionEls.length) return

    const triggers = sectionEls.map((el, i) =>
      ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setScrollState((p) => ({ ...p, section: i })),
        onEnterBack: () => setScrollState((p) => ({ ...p, section: i })),
      })
    )

    // Progress tracker for section 1
    const progressTrigger = ScrollTrigger.create({
      trigger: '#flavors',
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        setScrollState((p) => ({ ...p, progress: self.progress, raw: self.progress }))
      },
    })

    return () => {
      triggers.forEach((t) => t.kill())
      progressTrigger.kill()
    }
  }, [])

  return scrollState
}
