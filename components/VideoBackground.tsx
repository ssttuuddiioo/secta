'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'

interface VideoBackgroundProps {
  videoUrl: string
  isMuted?: boolean
  onVideoLoad?: () => void
}

export function VideoBackground({ videoUrl, isMuted = true, onVideoLoad }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  
  const isVimeo = videoUrl.includes('vimeo.com') || videoUrl.includes('player.vimeo.com')

  // Parse Vimeo ID
  const getVimeoId = useCallback((url: string) => {
    const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/) || url.match(/vimeo\.com\/(\d+)/)
    return match ? match[1] : null
  }, [])

  const vimeoId = isVimeo ? getVimeoId(videoUrl) : null

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

  // Handle direct video file logic
  useEffect(() => {
    if (isVimeo) return
    
    const video = videoRef.current
    if (!video) return

    // Reset video state when URL changes
    video.style.opacity = '0'

    const handleCanPlay = () => {
      // Fade in video smoothly
      const fadeDuration = prefersReducedMotion ? 0.01 : isMobile ? 0.6 : 1
      
      gsap.to(video, {
        opacity: 1,
        duration: fadeDuration,
        ease: prefersReducedMotion ? 'none' : 'power2.out',
        onComplete: () => {
          onVideoLoad?.()
        },
      })
    }

    const handleLoadedData = () => {
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
  }, [videoUrl, onVideoLoad, prefersReducedMotion, isMobile, isVimeo])

  // Handle mute state for direct video
  useEffect(() => {
    if (isVimeo || !videoRef.current) return
    videoRef.current.muted = isMuted
  }, [isMuted, isVimeo])

  // Mobile optimization for direct video
  useEffect(() => {
    if (isVimeo || !isMobile || !videoRef.current) return

    const video = videoRef.current
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {})
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [isMobile, videoUrl, isVimeo])

  // Handle Vimeo mute messages
  useEffect(() => {
    if (!isVimeo || !iframeRef.current) return

    const iframe = iframeRef.current
    const targetOrigin = '*'
    
    const message = JSON.stringify({
      method: 'setVolume',
      value: isMuted ? 0 : 1
    })
    
    if (iframe.contentWindow) {
      iframe.contentWindow.postMessage(message, targetOrigin)
    }
  }, [isMuted, isVimeo])

  if (isVimeo && vimeoId) {
    return (
      <div ref={containerRef} className="fixed inset-0 w-full h-full z-0 bg-black overflow-hidden">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ 
            // Force 16:9 aspect ratio that covers the screen
            // This CSS combination ensures the element is always large enough to cover the viewport
            width: '100vw',
            height: '56.25vw', /* 100 * 9 / 16 */
            minHeight: '100vh',
            minWidth: '177.78vh', /* 100 * 16 / 9 */
          }}
        > 
          <iframe
            ref={iframeRef}
            src={`https://player.vimeo.com/video/${vimeoId}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1&api=1`}
            className="w-full h-full object-cover scale-[1.1]" // Slight scale to hide any edge artifacts
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            title="Background Video"
          />
        </div>
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      </div>
    )
  }

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full z-0 bg-black">
      <video
        ref={videoRef}
        src={videoUrl}
        autoPlay
        loop
        playsInline
        muted={isMuted}
        className="w-full h-full object-cover"
        preload={isMobile ? 'metadata' : 'auto'}
      />
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />
    </div>
  )
}
