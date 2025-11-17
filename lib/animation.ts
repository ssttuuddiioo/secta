import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Detect mobile and reduced motion preference
const getAnimationConfig = () => {
  if (typeof window === 'undefined') {
    return { isMobile: false, prefersReducedMotion: false }
  }
  
  const isMobile = window.innerWidth < 768
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  
  return { isMobile, prefersReducedMotion }
}

// Mobile-optimized fade in up animation
export const fadeInUp = (customDuration?: number) => {
  const { isMobile, prefersReducedMotion } = getAnimationConfig()
  
  if (prefersReducedMotion) {
    return {
      opacity: 1,
      y: 0,
      duration: 0.01,
      ease: 'none',
    }
  }
  
  const duration = customDuration ?? (isMobile ? 0.6 : 1)
  const yOffset = isMobile ? 40 : 60
  
  return {
    opacity: 0,
    y: yOffset,
    duration,
    ease: 'power3.out',
  }
}

// Mobile-optimized stagger configuration
export const staggerChildren = (delay: number = 0.1) => {
  const { isMobile, prefersReducedMotion } = getAnimationConfig()
  
  if (prefersReducedMotion) {
    return {
      delay: 0,
      stagger: {
        amount: 0,
      },
    }
  }
  
  const adjustedDelay = isMobile ? delay * 0.7 : delay
  const staggerAmount = isMobile ? 0.3 : 0.5
  
  return {
    delay: adjustedDelay,
    stagger: {
      amount: staggerAmount,
    },
  }
}

// Smooth scroll with mobile optimization
export const smoothScroll = () => {
  if (typeof window === 'undefined') return
  
  const { prefersReducedMotion } = getAnimationConfig()
  
  if (prefersReducedMotion) {
    return
  }

  gsap.to('body', {
    scrollBehavior: 'smooth',
  })
}

// Mobile-optimized scroll trigger configuration
export const getScrollTriggerConfig = (trigger: string | Element, options?: {
  start?: string
  end?: string
  toggleActions?: string
}) => {
  const { isMobile, prefersReducedMotion } = getAnimationConfig()
  
  if (prefersReducedMotion) {
    return {
      trigger,
      start: 'top bottom',
      toggleActions: 'play none none none',
      once: true,
    }
  }
  
  return {
    trigger,
    start: options?.start ?? (isMobile ? 'top 85%' : 'top 80%'),
    end: options?.end,
    toggleActions: options?.toggleActions ?? 'play none none none',
    once: true, // Better performance - only animate once
  }
}

// Helper to check if animations should be reduced
export const shouldReduceMotion = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Helper to check if device is mobile
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}


