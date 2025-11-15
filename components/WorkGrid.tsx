'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { WorkGridItem } from './WorkGridItem'
import { getProjects } from '@/lib/data'

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
      items.forEach((item, index) => {
        gsap.from(item, {
          opacity: 0,
          y: 60,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
          delay: index * 0.1,
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
    <section className="pb-20" style={{ paddingTop: '200px' }}>
      <div className="max-w-[1600px] mx-auto">
        <h1 
          className="text-3xl md:text-4xl font-bold text-white uppercase tracking-tight mb-8"
          style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: '50px',
          }}
        >
          Selected Projects
        </h1>
        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
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
