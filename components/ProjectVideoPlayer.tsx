'use client'

import { useState, useRef } from 'react'
import { Play } from 'lucide-react'

interface ProjectVideoPlayerProps {
  videoUrl: string
  poster?: string
  className?: string
}

export function ProjectVideoPlayer({ videoUrl, poster, className = '' }: ProjectVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  return (
    <div
      className={`relative w-full ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full aspect-video bg-black">
            <video
              ref={videoRef}
              src={videoUrl}
              poster={poster}
              controls={isPlaying}
              className="w-full h-full object-cover"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
        
        {!isPlaying && (
          <button
            onClick={handlePlay}
            className={`absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity cursor-pointer ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="text-white text-center">
              <p 
                className="text-xl md:text-2xl uppercase tracking-wide"
                style={{
                  fontFamily: 'var(--font-cormorant-infant)',
                  fontWeight: 300,
                }}
              >
                Play Video
              </p>
            </div>
          </button>
        )}
      </div>
    </div>
  )
}

