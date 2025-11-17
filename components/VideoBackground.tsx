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
  const [isMobile, setIsMobile] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Detect mobile and reduced motion preference
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }
    
    checkMobile()
    mediaQuery.addEventListener('change', handleReducedMotionChange)
    window.addEventListener('resize', checkMobile)
    
    return () => {
      mediaQuery.removeEventListener('change', handleReducedMotionChange)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Reset video state when URL changes
    setIsLoaded(false)
    setIsPlaying(false)
    video.style.opacity = '0'

    const handleCanPlay = () => {
      setIsLoaded(true)
      
      // Fade in video smoothly - respect reduced motion
      const fadeDuration = prefersReducedMotion ? 0.01 : isMobile ? 0.6 : 1
      
      gsap.to(video, {
        opacity: 1,
        duration: fadeDuration,
        ease: prefersReducedMotion ? 'none' : 'power2.out',
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
  }, [videoUrl, onVideoLoad, prefersReducedMotion, isMobile])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = isMuted
  }, [isMuted])

  // Mobile optimization: lazy load video when in viewport
  useEffect(() => {
    if (!isMobile || !videoRef.current) return

    const video = videoRef.current
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Video is in viewport, ensure it's playing
            video.play().catch(() => {
              // Autoplay may be blocked, that's okay
            })
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(video)

    return () => {
      observer.disconnect()
    }
  }, [isMobile, videoUrl])

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
        preload={isMobile ? 'metadata' : 'auto'} // Lighter preload on mobile
        poster="" // Can add poster image for faster perceived load
      />
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />
    </div>
  )
}
