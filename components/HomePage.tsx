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
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const currentProject = projects[currentVideoIndex]
  const currentVideoUrl = currentProject?.videoUrl || ''

  const handleThumbnailClick = (index: number) => {
    if (index === currentVideoIndex || isTransitioning) return
    
    setIsTransitioning(true)
    
    // Shorter delay on mobile for snappier feel
    const delay = isMobile ? 200 : 300
    
    setTimeout(() => {
      setCurrentVideoIndex(index)
      setIsTransitioning(false)
    }, delay)
  }

  const handleMuteToggle = (muted: boolean) => {
    setIsMuted(muted)
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <VideoBackground
        key={currentVideoIndex}
        videoUrl={currentVideoUrl}
        isMuted={isMuted}
      />
      
      <Navigation />
      
      <VideoControls onMuteToggle={handleMuteToggle} />
      <SocialIcons />
      
      {/* Bottom section with video thumbnails - responsive spacing */}
      <div className="fixed bottom-3 sm:bottom-4 md:bottom-6 left-0 right-0 z-40 px-3 sm:px-4 md:px-6 lg:px-12">
        <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 overflow-x-auto pb-2 sm:pb-3 md:pb-4 scrollbar-hide snap-x snap-mandatory">
          {projects.map((project: Project, index: number) => (
            <div key={project.id} className="snap-start flex-shrink-0">
              <VideoThumbnail
                title={project.title}
                thumbnailImage={project.coverImage || ''}
                videoUrl={project.thumbnailVideo || project.videoUrl || ''}
                isActive={index === currentVideoIndex}
                onClick={() => handleThumbnailClick(index)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

