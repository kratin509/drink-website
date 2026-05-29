import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const onRaf = (time) => {
      lenis.raf(time)
      requestAnimationFrame(onRaf)
    }
    const raf = requestAnimationFrame(onRaf)

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])
}
