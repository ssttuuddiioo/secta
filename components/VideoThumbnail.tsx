'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

interface VideoThumbnailProps {
  title: string
  thumbnailImage: string
  videoUrl: string
  isActive: boolean
  onClick: () => void
}

export function VideoThumbnail({
  title,
  thumbnailImage,
  videoUrl,
  isActive,
  onClick,
}: VideoThumbnailProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // Detect touch device
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0)
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || isMobile || isTouch) return

    if (isHovered || isActive) {
      video.play().catch(() => {
        // Handle autoplay restrictions
      })
    } else {
      video.pause()
      video.currentTime = 0
    }
  }, [isHovered, isActive, isMobile, isTouch])

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => !isTouch && setIsHovered(true)}
      onMouseLeave={() => !isTouch && setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
      className={`relative group cursor-pointer transition-all duration-300 touch-manipulation ${
        isActive ? 'scale-105 opacity-100' : 'opacity-70 hover:opacity-100 active:opacity-100'
      }`}
      aria-label={`Select video: ${title}`}
    >
      <div className="relative w-28 h-20 sm:w-32 sm:h-20 md:w-40 md:h-24 lg:w-44 lg:h-28 overflow-hidden rounded-lg">
        {isMobile || isTouch ? (
          <Image
            src={thumbnailImage}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 112px, (max-width: 768px) 128px, (max-width: 1024px) 160px, 176px"
            priority={isActive}
          />
        ) : (
          <>
            <Image
              src={thumbnailImage}
              alt={title}
              fill
              className="object-cover transition-opacity duration-300"
              style={{ opacity: isHovered || isActive ? 0 : 1 }}
              sizes="(max-width: 640px) 112px, (max-width: 768px) 128px, (max-width: 1024px) 160px, 176px"
            />
            <video
              ref={videoRef}
              src={videoUrl}
              loop
              muted
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
              style={{ opacity: isHovered || isActive ? 1 : 0 }}
            />
          </>
        )}
        <div className={`absolute inset-0 transition-colors ${
          isActive ? 'bg-black/20' : 'bg-black/30 group-hover:bg-black/20'
        }`} />
        {isActive && (
          <div className="absolute inset-0 border-2 border-white rounded-lg" />
        )}
      </div>
      <p className="mt-1.5 sm:mt-2 text-white text-xs sm:text-sm text-center font-medium leading-tight px-1">
        {title}
      </p>
    </button>
  )
}


