'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Project } from '@/types/project'

interface SimilarProjectsProps {
  currentProject: Project
  allProjects: Project[]
}

export function SimilarProjects({ currentProject, allProjects }: SimilarProjectsProps) {
  // Get 2 similar projects (excluding current project)
  const similarProjects = allProjects
    .filter((project) => project.id !== currentProject.id)
    .slice(0, 2)

  if (similarProjects.length === 0) {
    return null
  }

  return (
    <section className="mt-32 mb-20">
      <div className="px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-light text-white uppercase tracking-tight mb-12"
            style={{
              fontFamily: 'var(--font-cormorant-infant)',
              fontWeight: 300,
            }}
          >
            Similar Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {similarProjects.map((project) => (
              <Link
                key={project.id}
                href={`/project/${project.slug}`}
                className="group relative block overflow-hidden rounded-[10px]"
              >
                <div className="relative aspect-[4/3] w-full rounded-[10px] overflow-hidden">
                  <Image
                    src={project.coverImage || ''}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                    {project.client && (
                      <p className="text-white text-sm md:text-base font-light uppercase tracking-wide mb-2">
                        {project.client}
                      </p>
                    )}
                    <h3
                      className="text-white text-xl md:text-2xl font-light uppercase tracking-tight"
                      style={{
                        fontFamily: 'var(--font-cormorant-infant)',
                        fontWeight: 300,
                      }}
                    >
                      {project.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}




