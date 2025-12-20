'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, MessageSquare } from 'lucide-react'
import { ReviewComment } from './CommentsList'

interface ReviewVideoPlayerProps {
  videoUrl: string
  poster?: string
  comments: ReviewComment[]
  onAddComment: (timestamp: number) => void
  onTimeUpdate?: (time: number) => void
  className?: string
}

function formatTimestamp(seconds: number, precise: boolean = false): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (precise) {
    // Show two decimal places for precision
    return `${mins}:${secs.toFixed(2).padStart(5, '0')}`
  }
  return `${mins}:${Math.floor(secs).toString().padStart(2, '0')}`
}

export function ReviewVideoPlayer({
  videoUrl,
  poster,
  comments,
  onAddComment,
  onTimeUpdate,
  className = '',
}: ReviewVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [isHovering, setIsHovering] = useState(false)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault()
          // Pause and open comment form
          if (videoRef.current && !videoRef.current.paused) {
            videoRef.current.pause()
          }
          onAddComment(currentTime)
          break
        case 'c':
          e.preventDefault()
          if (videoRef.current && !videoRef.current.paused) {
            videoRef.current.pause()
          }
          onAddComment(currentTime)
          break
        case 'm':
          e.preventDefault()
          toggleMute()
          break
        case 'f':
          e.preventDefault()
          toggleFullscreen()
          break
        case 'arrowleft':
          e.preventDefault()
          seek(currentTime - 5)
          break
        case 'arrowright':
          e.preventDefault()
          seek(currentTime + 5)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentTime, onAddComment])

  // Hide controls after inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout

    const resetTimeout = () => {
      setShowControls(true)
      clearTimeout(timeout)
      if (isPlaying && !isHovering) {
        timeout = setTimeout(() => setShowControls(false), 3000)
      }
    }

    window.addEventListener('mousemove', resetTimeout)
    return () => {
      window.removeEventListener('mousemove', resetTimeout)
      clearTimeout(timeout)
    }
  }, [isPlaying, isHovering])

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
  }, [isPlaying])

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }, [isMuted])

  const toggleFullscreen = useCallback(() => {
    if (!videoRef.current) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      videoRef.current.requestFullscreen()
    }
  }, [])

  const seek = useCallback((time: number) => {
    if (!videoRef.current) return
    videoRef.current.currentTime = Math.max(0, Math.min(time, duration))
  }, [duration])

  const handleTimeUpdate = () => {
    if (!videoRef.current) return
    setCurrentTime(videoRef.current.currentTime)
    onTimeUpdate?.(videoRef.current.currentTime)
  }

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return
    setDuration(videoRef.current.duration)
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !videoRef.current) return
    const rect = progressRef.current.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    seek(pos * duration)
  }

  const handleVideoClick = () => {
    if (!videoRef.current) return
    videoRef.current.pause()
    onAddComment(currentTime)
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div 
      className={`relative bg-black group ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={videoUrl}
        poster={poster}
        className="w-full h-full object-contain cursor-pointer"
        onClick={handleVideoClick}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        playsInline
      />

      {/* Click to comment overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
          <div className="text-white text-center">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-60" />
            <p 
              className="text-sm opacity-60"
              style={{ fontFamily: 'var(--font-host-grotesk)' }}
            >
              Click to add comment at {formatTimestamp(currentTime)}
            </p>
          </div>
        </div>
      )}

      {/* Controls */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Progress Bar */}
        <div
          ref={progressRef}
          className="relative h-1 bg-white/20 rounded-full cursor-pointer mb-4 group/progress"
          onClick={handleProgressClick}
        >
          {/* Progress Fill */}
          <div 
            className="absolute left-0 top-0 h-full bg-secta-orange rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />

          {/* Comment Markers */}
          {comments.map((comment) => {
            const pos = duration > 0 ? (comment.timestamp / duration) * 100 : 0
            return (
              <button
                key={comment._id}
                onClick={(e) => {
                  e.stopPropagation()
                  seek(comment.timestamp)
                }}
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-secta-orange rounded-full transform -translate-x-1/2 hover:scale-150 transition-transform z-10"
                style={{ left: `${pos}%` }}
                title={`@ ${formatTimestamp(comment.timestamp)}: ${comment.comment.substring(0, 50)}...`}
              />
            )
          })}

          {/* Hover indicator */}
          <div className="absolute top-0 h-full w-full opacity-0 group-hover/progress:opacity-100">
            <div 
              className="absolute top-0 h-full bg-white/30 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="text-white hover:text-secta-orange transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </button>

            {/* Mute/Unmute */}
            <button
              onClick={toggleMute}
              className="text-white hover:text-secta-orange transition-colors"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>

            {/* Time Display */}
            <span 
              className="text-white/70 text-sm"
              style={{ fontFamily: 'var(--font-host-grotesk)' }}
            >
              {formatTimestamp(currentTime)} / {formatTimestamp(duration)}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Add Comment Button */}
            <button
              onClick={() => {
                videoRef.current?.pause()
                onAddComment(currentTime)
              }}
              className="flex items-center gap-2 text-white hover:text-secta-orange transition-colors"
              aria-label="Add comment"
            >
              <MessageSquare className="h-5 w-5" />
              <span 
                className="text-sm hidden sm:inline"
                style={{ fontFamily: 'var(--font-host-grotesk)' }}
              >
                Comment (C)
              </span>
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-secta-orange transition-colors"
              aria-label="Fullscreen"
            >
              <Maximize className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

