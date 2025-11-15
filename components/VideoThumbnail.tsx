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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || isMobile) return

    if (isHovered || isActive) {
      video.play().catch(() => {
        // Handle autoplay restrictions
      })
    } else {
      video.pause()
      video.currentTime = 0
    }
  }, [isHovered, isActive, isMobile])

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative group cursor-pointer transition-all duration-300 ${
        isActive ? 'scale-105 opacity-100' : 'opacity-70 hover:opacity-100'
      }`}
    >
      <div className="relative w-32 h-20 md:w-40 md:h-24 overflow-hidden rounded-lg">
        {isMobile ? (
          <Image
            src={thumbnailImage}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 128px, 160px"
          />
        ) : (
          <>
            <Image
              src={thumbnailImage}
              alt={title}
              fill
              className="object-cover transition-opacity duration-300"
              style={{ opacity: isHovered || isActive ? 0 : 1 }}
              sizes="(max-width: 768px) 128px, 160px"
            />
            <video
              ref={videoRef}
              src={videoUrl}
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              style={{ opacity: isHovered || isActive ? 1 : 0 }}
            />
          </>
        )}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
      </div>
      <p className="mt-2 text-white text-xs md:text-sm text-center font-medium">{title}</p>
    </button>
  )
}

