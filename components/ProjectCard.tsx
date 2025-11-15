'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import Link from 'next/link'
import { Project } from '@/types/project'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cardRef.current) return

    gsap.from(cardRef.current, {
      opacity: 0,
      y: 60,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: cardRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    })
  }, [])

  return (
    <div ref={cardRef} className="group cursor-pointer">
      <Link href={`/project/${project.slug}`}>
        <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-[4/3] mb-4">
          {project.coverImage ? (
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
        </div>
        <h3 className="text-xl font-semibold mb-2 group-hover:text-gray-600 transition-colors">
          {project.title}
        </h3>
        {project.category && (
          <p className="text-sm text-gray-500 uppercase tracking-wide">{project.category}</p>
        )}
        {project.description && (
          <p className="text-gray-600 mt-2 line-clamp-2">{project.description}</p>
        )}
      </Link>
    </div>
  )
}
