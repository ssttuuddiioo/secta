import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export const fadeInUp = {
  opacity: 0,
  y: 60,
  duration: 1,
  ease: 'power3.out',
}

export const staggerChildren = (delay: number = 0.1) => ({
  delay,
  stagger: {
    amount: 0.5,
  },
})

export const smoothScroll = () => {
  if (typeof window === 'undefined') return

  gsap.to('body', {
    scrollBehavior: 'smooth',
  })
}

