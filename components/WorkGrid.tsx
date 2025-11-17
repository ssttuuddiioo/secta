'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { WorkGridItem } from './WorkGridItem'
import { getProjects } from '@/lib/data'
import { fadeInUp, getScrollTriggerConfig, staggerChildren } from '@/lib/animation'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function WorkGrid() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const projects = getProjects()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!containerRef.current || !isMounted) return

    const items = containerRef.current.querySelectorAll('[data-grid-item]')
    
    // Set initial visibility
    items.forEach((item) => {
      const el = item as HTMLElement
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    })

    // Animate in if GSAP is available
    try {
      const animationConfig = fadeInUp(0.8)
      const staggerConfig = staggerChildren(0.1)
      
      items.forEach((item, index) => {
        const scrollConfig = getScrollTriggerConfig(item)
        
        gsap.from(item, {
          ...animationConfig,
          scrollTrigger: scrollConfig,
          delay: index * staggerConfig.delay,
        })
      })
    } catch (error) {
      // If GSAP fails, ensure items are visible
      items.forEach((item) => {
        const el = item as HTMLElement
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      })
    }
  }, [isMounted])

  return (
    <section className="pb-12 sm:pb-16 md:pb-20 pt-24 sm:pt-32 md:pt-48 lg:pt-52">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12">
        <h1 
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white uppercase tracking-tight mb-6 sm:mb-8"
          style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: 'clamp(1.875rem, 5vw, 3.125rem)', // Responsive: 30px → 50px
          }}
        >
          Selected Projects
        </h1>
        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6"
        >
          {projects.map((project) => (
            <div key={project.id} data-grid-item style={{ opacity: isMounted ? 1 : 1 }}>
              <WorkGridItem project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
