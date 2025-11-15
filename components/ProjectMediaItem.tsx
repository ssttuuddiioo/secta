'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ProjectVideoPlayer } from './ProjectVideoPlayer'

interface ProjectMediaItemProps {
  media: {
    type: 'image' | 'video'
    url: string
    title?: string
    description?: string
  }
}

export function ProjectMediaItem({ media }: ProjectMediaItemProps) {
  return (
    <div className="w-full mb-6">
      {media.type === 'video' ? (
        <div className="w-full mb-4">
          <ProjectVideoPlayer videoUrl={media.url} />
        </div>
      ) : (
        <div className="relative w-full mb-4">
          <Image
            src={media.url}
            alt={media.title || 'Project media'}
            width={800}
            height={600}
            className="w-full h-auto object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}
      
      {media.title && (
        <h3 className="text-white text-lg md:text-xl font-light uppercase tracking-wide mb-2">
          {media.title}
        </h3>
      )}
      
      {media.description && (
        <p className="text-white/80 text-sm md:text-base leading-relaxed">
          {media.description}
        </p>
      )}
    </div>
  )
}

