'use client'

import { useState } from 'react'
import { Play, X } from 'lucide-react'

interface VideoPlayerProps {
  videoUrl?: string
  videoFile?: string
  className?: string
}

export function VideoPlayer({ videoUrl, videoFile, className = '' }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  if (!videoUrl && !videoFile) {
    return null
  }

  const getVideoSrc = () => {
    if (videoUrl) {
      // Handle YouTube/Vimeo embeds
      if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        const videoId = videoUrl.includes('youtu.be')
          ? videoUrl.split('/').pop()?.split('?')[0]
          : new URL(videoUrl).searchParams.get('v')
        return `https://www.youtube.com/embed/${videoId}`
      }
      if (videoUrl.includes('vimeo.com')) {
        const videoId = videoUrl.split('/').pop()
        return `https://player.vimeo.com/video/${videoId}`
      }
      return videoUrl
    }
    return videoFile
  }

  const videoSrc = getVideoSrc()

  if (isPlaying && videoSrc) {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsPlaying(false)}
          className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
        >
          <X size={20} />
        </button>
        <div className="aspect-video">
          {videoUrl && (videoUrl.includes('youtube.com') || videoUrl.includes('vimeo.com')) ? (
            <iframe
              src={videoSrc}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video src={videoSrc} controls className="w-full h-full" autoPlay />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`relative group cursor-pointer ${className}`} onClick={() => setIsPlaying(true)}>
      <div className="aspect-video bg-gray-900 flex items-center justify-center">
        <div className="text-white">
          <Play size={64} className="group-hover:scale-110 transition-transform" />
        </div>
      </div>
    </div>
  )
}
