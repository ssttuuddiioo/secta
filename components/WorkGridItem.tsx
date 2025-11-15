'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import Image from 'next/image'
import Link from 'next/link'
import { Project } from '@/types/project'

interface WorkGridItemProps {
  project: Project
}

export function WorkGridItem({ project }: WorkGridItemProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const tagsRef = useRef<HTMLDivElement>(null)
  const yearRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || isMobile || !project.thumbnailVideo) return

    if (isHovered) {
      video.play().catch(() => {
        // Handle autoplay restrictions
      })
    } else {
      video.pause()
      video.currentTime = 0
    }
  }, [isHovered, isMobile, project.thumbnailVideo])

  useEffect(() => {
    if (isMobile) {
      // Show overlay on mobile
      if (overlayRef.current) {
        overlayRef.current.style.opacity = '1'
      }
      return
    }

    // Animate overlay background
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: isHovered ? 1 : 0,
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    // Animate text elements with stagger
    const textElements = [
      tagsRef,
      yearRef,
    ].filter((ref) => ref && ref.current)

    if (isHovered) {
      textElements.forEach((ref, index) => {
        if (ref.current) {
          gsap.fromTo(
            ref.current,
            {
              y: 30,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              delay: index * 0.08,
              ease: 'power3.out',
            }
          )
        }
      })
    } else {
      textElements.forEach((ref) => {
        if (ref.current) {
          gsap.to(ref.current, {
            y: 30,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
          })
        }
      })
    }
  }, [isHovered, isMobile])

  return (
    <Link
      href="/project/the-world-needs-defenders"
      className="group relative block overflow-hidden rounded-[10px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[4/3] w-full rounded-[10px] overflow-hidden">
        {isMobile ? (
          <Image
            src={project.coverImage || ''}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <>
            <Image
              src={project.coverImage || ''}
              alt={project.title}
              fill
              className="object-cover transition-opacity duration-500"
              style={{ opacity: isHovered && project.thumbnailVideo ? 0 : 1 }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {project.thumbnailVideo && (
              <video
                ref={videoRef}
                src={project.thumbnailVideo}
                loop
                muted
                playsInline
                preload="auto"
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                style={{ opacity: isHovered ? 1 : 0 }}
              />
            )}
          </>
        )}

        {/* Client name - always visible top left */}
        {project.client && (
          <div className="absolute top-3 left-3 z-10">
            <p className="text-white text-sm md:text-base font-light uppercase tracking-wide">
              {project.client}
            </p>
          </div>
        )}

        {/* Hover overlay with tags and year */}
        <div
          ref={overlayRef}
          className="absolute inset-0 flex flex-col justify-end p-2 md:p-3 pointer-events-none"
          style={{ opacity: isMobile ? 1 : 0 }}
        >
          {/* Bottom section - Tags (left) and Year (right) */}
          <div className="flex justify-between items-end">
            {/* Bottom left - Tags */}
            {project.tags && project.tags.length > 0 && (
              <div ref={tagsRef} className="flex flex-wrap gap-2" style={{ opacity: 0 }}>
                {project.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-white text-xs md:text-sm uppercase tracking-wider drop-shadow-lg"
                  >
                    {tag}
                    {project.tags && index < project.tags.length - 1 && ','}
                  </span>
                ))}
              </div>
            )}
            
            {/* Bottom right - Year */}
            {project.year && (
              <div ref={yearRef} style={{ opacity: 0 }}>
                <p className="text-white text-sm md:text-base drop-shadow-lg">
                  {project.year}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
