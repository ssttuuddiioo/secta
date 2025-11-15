'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface HeroProps {
  title?: string
  subtitle?: string
}

export function Hero({ title = 'Portfolio', subtitle = 'Creative work & projects' }: HeroProps) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (!titleRef.current || !subtitleRef.current) return

    const tl = gsap.timeline()

    tl.from(titleRef.current, {
      opacity: 0,
      y: 60,
      duration: 1,
      ease: 'power3.out',
    })
      .from(
        subtitleRef.current,
        {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: 'power3.out',
        },
        '-=0.5'
      )
  }, [])

  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 ref={titleRef} className="text-6xl md:text-8xl font-bold mb-4">
          {title}
        </h1>
        <p ref={subtitleRef} className="text-xl md:text-2xl text-gray-600">
          {subtitle}
        </p>
      </div>
    </section>
  )
}

