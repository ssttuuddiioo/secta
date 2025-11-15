'use client'

import { Project } from '@/types/project'

interface ProjectHeaderProps {
  project: Project
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <div className="w-full">
      {/* Three Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_2fr] gap-8 md:gap-12 lg:gap-16">
        {/* Left Column */}
        <div className="space-y-8">
          {project.client && (
            <div>
              <p className="text-orange-500 text-xs uppercase tracking-wide mb-2">CLIENT</p>
              <p className="text-white text-base uppercase">{project.client}</p>
            </div>
          )}
          
          {project.category && (
            <div>
              <p className="text-orange-500 text-xs uppercase tracking-wide mb-2">CATEGORY</p>
              <p className="text-white text-base uppercase">{project.category}</p>
            </div>
          )}
        </div>

        {/* Middle Column */}
        <div className="space-y-8">
          {project.tags && project.tags.length > 0 && (
            <div>
              <p className="text-orange-500 text-xs uppercase tracking-wide mb-2">SERVICE</p>
              <div className="space-y-1">
                {project.tags.slice(0, 2).map((tag, index) => (
                  <p key={index} className="text-white text-base uppercase">{tag}</p>
                ))}
              </div>
            </div>
          )}
          
          {project.collaborators && project.collaborators.length > 0 && (
            <div>
              <p className="text-orange-500 text-xs uppercase tracking-wide mb-2">COLLABORATORS</p>
              <div className="space-y-1">
                {project.collaborators.map((collab, index) => (
                  <p key={index} className="text-white text-base uppercase">{collab}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Description */}
        <div className="space-y-6">
          {project.description && (
            <div>
              <p className="text-orange-500 text-sm uppercase tracking-wide mb-4">
                &quot;{project.description}&quot;
              </p>
            </div>
          )}
          
          {project.longDescription && (
            <div className="space-y-4">
              {project.longDescription.split('\n\n').slice(0, 1).map((paragraph, index) => (
                <p key={index} className="text-white text-sm leading-relaxed uppercase">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

