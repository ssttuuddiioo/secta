'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

interface VideoBackgroundProps {
  videoUrl: string
  isMuted?: boolean
  onVideoLoad?: () => void
}

export function VideoBackground({ videoUrl, isMuted = true, onVideoLoad }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Reset video state when URL changes
    setIsLoaded(false)
    setIsPlaying(false)
    video.style.opacity = '0'

    const handleCanPlay = () => {
      setIsLoaded(true)
      
      // Fade in video smoothly
      gsap.to(video, {
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
        onComplete: () => {
          setIsPlaying(true)
          onVideoLoad?.()
        },
      })
    }

    const handleLoadedData = () => {
      // Start playing when enough data is loaded
      video.play().catch((error) => {
        console.warn('Video autoplay failed:', error)
      })
    }

    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('loadeddata', handleLoadedData)
    
    return () => {
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('loadeddata', handleLoadedData)
    }
  }, [videoUrl, onVideoLoad])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = isMuted
  }, [isMuted])

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full z-0">
      <video
        ref={videoRef}
        src={videoUrl}
        autoPlay
        loop
        playsInline
        muted={isMuted}
        className="w-full h-full object-cover"
        preload="auto"
      />
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />
    </div>
  )
}
