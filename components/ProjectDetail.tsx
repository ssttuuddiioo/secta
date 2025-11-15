'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import { ProjectVideoPlayer } from './ProjectVideoPlayer'
import { ProjectHeader } from './ProjectHeader'
import { ProjectMediaItem } from './ProjectMediaItem'
import { Footer } from './Footer'
import { Project } from '@/types/project'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface ProjectDetailProps {
  project: Project
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!containerRef.current || !isMounted) return

    const elements = Array.from(containerRef.current.querySelectorAll('[data-animate]')) as HTMLElement[]
    
    // Set initial visibility - ensure all content is visible
    elements.forEach((element) => {
      element.style.opacity = '1'
      element.style.transform = 'translateY(0)'
    })

    // Animate in if GSAP is available
    // Elements start visible, then animate when scrolled into view
    try {
      elements.forEach((element, index) => {
        // Set initial state (visible)
        gsap.set(element, {
          opacity: 1,
          y: 0,
        })
        
        // Only animate if element is not already in view
        const rect = element.getBoundingClientRect()
        const isInView = rect.top < window.innerHeight * 0.8
        
        if (!isInView) {
          // Set starting position for animation
          gsap.set(element, {
            opacity: 0,
            y: 60,
          })
          
          // Animate in when scrolled into view
          gsap.to(element, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
            delay: index * 0.1,
          })
        }
      })
    } catch (error) {
      // If GSAP fails, ensure content is visible
      elements.forEach((element) => {
        element.style.opacity = '1'
        element.style.transform = 'translateY(0)'
      })
    }
  }, [isMounted])

  return (
    <div ref={containerRef} className="pb-20" style={{ paddingTop: '180px' }}>
      <div className="w-full px-6 md:px-12">
        {/* Header Section with Title, Description, Collaborators, Tags - Hidden on narrow screens */}
        <div className="hidden lg:block max-w-7xl mx-auto mb-16" data-animate style={{ opacity: isMounted ? undefined : 1 }}>
          <ProjectHeader project={project} />
        </div>

        {/* Main Video - Full Width */}
        {project.videoUrl && (
          <div className="w-full mb-20" data-animate style={{ opacity: isMounted ? undefined : 1 }}>
            <ProjectVideoPlayer videoUrl={project.videoUrl} poster={project.videoPoster || project.coverImage} />
          </div>
        )}

        {/* Header Section - Shown below video on narrow screens */}
        <div className="lg:hidden w-full mb-16" data-animate style={{ opacity: isMounted ? undefined : 1 }}>
          <ProjectHeader project={project} />
        </div>

        {/* Media Gallery - Masonry Layout */}
        {project.media && project.media.length > 0 && (
          <div className="max-w-7xl mx-auto">
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 md:gap-8">
              {project.media.map((item, index) => (
                <div key={index} data-animate style={{ opacity: isMounted ? undefined : 1 }} className="break-inside-avoid mb-6 md:mb-8">
                  <ProjectMediaItem media={item} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fallback: Regular Gallery */}
        {(!project.media || project.media.length === 0) && project.gallery && project.gallery.length > 0 && (
          <div className="max-w-7xl mx-auto space-y-12">
            {project.gallery.map((image, index) => (
              <div key={index} className="relative w-full aspect-video bg-gray-900" data-animate style={{ opacity: isMounted ? undefined : 1 }}>
                <Image
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
