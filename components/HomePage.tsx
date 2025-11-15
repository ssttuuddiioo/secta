'use client'

import { useState, useEffect } from 'react'
import { Navigation } from './Navigation'
import { VideoBackground } from './VideoBackground'
import { VideoThumbnail } from './VideoThumbnail'
import { VideoControls } from './VideoControls'
import { SocialIcons } from './SocialIcons'
import { getFeaturedProjects } from '@/lib/data'
import { Project } from '@/types/project'

export function HomePage() {
  const projects = getFeaturedProjects()
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isMuted, setIsMuted] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const currentProject = projects[currentVideoIndex]
  const currentVideoUrl = currentProject?.videoUrl || ''

  const handleThumbnailClick = (index: number) => {
    if (index === currentVideoIndex || isTransitioning) return
    
    setIsTransitioning(true)
    
    // Small delay for smooth transition
    setTimeout(() => {
      setCurrentVideoIndex(index)
      setIsTransitioning(false)
    }, 300)
  }

  const handleMuteToggle = (muted: boolean) => {
    setIsMuted(muted)
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <VideoBackground
        key={currentVideoIndex}
        videoUrl={currentVideoUrl}
        isMuted={isMuted}
      />
      
      <Navigation />
      
      <VideoControls onMuteToggle={handleMuteToggle} />
      <SocialIcons />
      
      {/* Bottom section with video thumbnails */}
      <div className="fixed bottom-6 left-0 right-0 z-40 px-6 md:px-12">
        <div className="flex items-center justify-center gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {projects.map((project: Project, index: number) => (
            <VideoThumbnail
              key={project.id}
              title={project.title}
              thumbnailImage={project.coverImage || ''}
              videoUrl={project.thumbnailVideo || project.videoUrl || ''}
              isActive={index === currentVideoIndex}
              onClick={() => handleThumbnailClick(index)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

