'use client'

import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { gsap } from 'gsap'
import { Header } from './Header'

interface MotionVideo {
  _id: string
  title: string
  category: string
  thumbnailUrl?: string
  videoUrl: string
  year?: string
  client?: string
  role?: string
  briefDescription?: string
  challengeSolution?: string
  projectImages?: Array<{ url?: string }>
  credits?: string
  behindTheScenes?: Array<{ url?: string }>
  resultsImpact?: string
  categoryTags?: string[]
}

// Placeholder video data - fallback if Sanity fails
const placeholderVideos: MotionVideo[] = []

const categories = ['Branded Content', 'Scenic Video', 'Social Media', 'Reels']

// Motion Video Card Component
function MotionVideoCard({ 
  video, 
  index, 
  onVideoClick 
}: { 
  video: MotionVideo
  index: number
  onVideoClick: (video: MotionVideo, position: 'left' | 'right') => void
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Determine if this tile is in left or right column (for 2-column grid)
  const isLeftColumn = index % 2 === 0
  const position = isLeftColumn ? 'left' : 'right'

  const handleClick = () => {
    onVideoClick(video, position)
  }

  // IntersectionObserver to preload videos that are visible or near viewport
  useEffect(() => {
    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true)
            observer.disconnect()
          }
        })
      },
      { rootMargin: '200px' }
    )

    observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [])

  // Handle hover play/pause
  useEffect(() => {
    if (!videoRef.current || !shouldLoad) return

    if (isHovered) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {})
    } else {
      videoRef.current.pause()
    }
  }, [isHovered, shouldLoad])

  return (
    <div
      ref={containerRef}
      className="group relative aspect-video bg-black overflow-hidden cursor-pointer"
      style={{
        borderRadius: '4px',
        cursor: isHovered ? `url('/click-small.png') 12 12, pointer` : 'pointer'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Thumbnail Image */}
      {video.thumbnailUrl && (
        <div className="absolute inset-0 z-10 transition-opacity duration-300" style={{ opacity: isHovered ? 0 : 0.6 }}>
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      )}

      {/* Video Player - Native HTML5 Video */}
      {shouldLoad && video.videoUrl && (
        <div
          className={`absolute inset-0 z-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          style={{ overflow: 'hidden' }}
        >
          <video
            ref={videoRef}
            src={video.videoUrl}
            loop
            muted
            playsInline
            preload="auto"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '120%',
              height: '120%',
              transform: 'translate(-50%, -50%) scale(1.2)',
              objectFit: 'cover',
              minWidth: '100%',
              minHeight: '100%'
            }}
          />
        </div>
      )}

      {/* Info Overlay - Shows on hover */}
      <div className={`absolute inset-0 z-20 flex flex-col justify-end p-6 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <div className="text-white">
          <h3
            className="text-xl font-bold mb-2"
            style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
          >
            {video.title}
          </h3>
          <div className="flex gap-4 text-sm text-gray-200">
            {video.year && (
              <span style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
                {video.year}
              </span>
            )}
            {video.client && (
              <span style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
                {video.client}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Fallback placeholder if no thumbnail */}
      {!video.thumbnailUrl && !isHovered && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-white text-center p-8">
            <div className="text-6xl mb-4">▶</div>
            <h3
              className="text-xl font-bold mb-2"
              style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
            >
              {video.title}
            </h3>
            <p
              className="text-sm text-gray-400"
              style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
            >
              {video.category}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// Category Button Component with GSAP underline animation
function CategoryButton({ 
  label, 
  isActive, 
  onClick, 
  direction 
}: { 
  label: string
  isActive: boolean
  onClick: () => void
  direction: 'left' | 'right' | null
}) {
  const underlineRef = useRef<HTMLDivElement>(null)
  const wasActiveRef = useRef(isActive)

  useLayoutEffect(() => {
    if (!underlineRef.current) return

    const wasActive = wasActiveRef.current
    wasActiveRef.current = isActive

    // Kill any existing animations
    gsap.killTweensOf(underlineRef.current)

    if (isActive && !wasActive) {
      // Animate in
      const origin = direction === 'left' ? 'right' : 'left'
      gsap.set(underlineRef.current, { scaleX: 0, transformOrigin: origin })
      
      requestAnimationFrame(() => {
        gsap.to(underlineRef.current, {
          scaleX: 1,
          duration: 0.3,
          ease: 'power2.out',
          immediateRender: false
        })
      })
    } else if (!isActive && wasActive) {
      // Animate out
      const origin = direction === 'left' ? 'left' : 'right'
      gsap.set(underlineRef.current, { transformOrigin: origin })
      
      requestAnimationFrame(() => {
        gsap.to(underlineRef.current, {
          scaleX: 0,
          duration: 0.3,
          ease: 'power2.out',
          immediateRender: false
        })
      })
    } else if (isActive) {
      // Already active, ensure visible
      gsap.set(underlineRef.current, { scaleX: 1 })
    } else {
      // Not active, ensure hidden
      gsap.set(underlineRef.current, { scaleX: 0 })
    }
  }, [isActive, direction])

  return (
    <button
      onClick={onClick}
      className="relative"
      style={{
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        fontWeight: 'bold',
        fontSize: 'clamp(14px, 2vw, 18px)',
        color: '#FFFFFF',
        textDecoration: 'none',
        transition: 'font-weight 0.2s'
      }}
    >
      {label}
      <div
        ref={underlineRef}
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-white"
        style={{ transformOrigin: 'left' }}
      />
    </button>
  )
}

// Video Detail Popup Component
function VideoDetailPopup({ 
  video, 
  position, 
  isOpen, 
  onClose 
}: { 
  video: MotionVideo
  position: 'left' | 'right'
  isOpen: boolean
  onClose: () => void
}) {
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!popupRef.current || !video) return

    const slideFrom = position === 'left' ? '-100%' : '100%'
    const slideTo = position === 'left' ? '-100%' : '100%'

    if (isOpen) {
      // Slide in from the appropriate side
      gsap.set(popupRef.current, { x: slideFrom, opacity: 0 })
      
      gsap.to(popupRef.current, {
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out'
      })
    } else {
      // Slide out
      gsap.to(popupRef.current, {
        x: slideTo,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in'
      })
    }
  }, [isOpen, position, video])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 z-40"
        onClick={onClose}
      />
      {/* Popup */}
      <div
        ref={popupRef}
        className={`fixed top-0 bottom-0 w-full max-w-2xl bg-[#C64B2C] z-50 overflow-y-auto ${
          position === 'left' ? 'left-0' : 'right-0'
        }`}
      >
        <div className="p-8 md:p-12">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white hover:opacity-70 transition-opacity"
            style={{
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: '24px',
              fontWeight: 'bold'
            }}
          >
            ×
          </button>

          {/* Video Content */}
          <div className="mt-8 space-y-8">
            {/* Title and Meta */}
            <div>
              <h2 
                className="text-white text-3xl md:text-4xl font-bold mb-4"
                style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
              >
                {video.title}
              </h2>
              
              {(video.year || video.client || video.role) && (
                <div className="flex flex-wrap gap-6 text-white mb-6">
                  {video.year && (
                    <span style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
                      {video.year}
                    </span>
                  )}
                  {video.client && (
                    <span style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
                      {video.client}
                    </span>
                  )}
                  {video.role && (
                    <span style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
                      {video.role}
                    </span>
                  )}
                </div>
              )}

              {/* Category Tags */}
              {video.categoryTags && video.categoryTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {video.categoryTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white/20 text-white rounded-full text-sm"
                      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Video Player */}
            {video.videoUrl && (
              <div className="relative aspect-video bg-black rounded mb-8 overflow-hidden">
                <video
                  src={video.videoUrl}
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Brief Description */}
            {video.briefDescription && (
              <div>
                <h3 
                  className="text-white text-xl font-bold mb-3"
                  style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                >
                  Brief Description
                </h3>
                <p 
                  className="text-white/90 leading-relaxed"
                  style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                >
                  {video.briefDescription}
                </p>
              </div>
            )}

            {/* Challenge/Solution */}
            {video.challengeSolution && (
              <div>
                <h3 
                  className="text-white text-xl font-bold mb-3"
                  style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                >
                  Challenge/Solution
                </h3>
                <p 
                  className="text-white/90 leading-relaxed"
                  style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                >
                  {video.challengeSolution}
                </p>
              </div>
            )}

            {/* Project Images */}
            {video.projectImages && video.projectImages.length > 0 && (
              <div>
                <h3 
                  className="text-white text-xl font-bold mb-4"
                  style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                >
                  Project Images
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {video.projectImages.map((img, idx) => (
                    img.url && (
                      <div key={idx} className="relative aspect-video bg-black rounded overflow-hidden">
                        <Image
                          src={img.url}
                          alt={`${video.title} - Project Image ${idx + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Credits */}
            {video.credits && (
              <div>
                <h3 
                  className="text-white text-xl font-bold mb-3"
                  style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                >
                  Credits
                </h3>
                <p 
                  className="text-white/90 leading-relaxed whitespace-pre-line"
                  style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                >
                  {video.credits}
                </p>
              </div>
            )}

            {/* Behind-the-Scenes */}
            {video.behindTheScenes && video.behindTheScenes.length > 0 && (
              <div>
                <h3 
                  className="text-white text-xl font-bold mb-4"
                  style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                >
                  Behind-the-Scenes
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {video.behindTheScenes.map((img, idx) => (
                    img.url && (
                      <div key={idx} className="relative aspect-video bg-black rounded overflow-hidden">
                        <Image
                          src={img.url}
                          alt={`${video.title} - Behind the Scenes ${idx + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Results/Impact */}
            {video.resultsImpact && (
              <div>
                <h3 
                  className="text-white text-xl font-bold mb-3"
                  style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                >
                  Results/Impact
                </h3>
                <p 
                  className="text-white/90 leading-relaxed"
                  style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                >
                  {video.resultsImpact}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export function MotionPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [videos, setVideos] = useState<MotionVideo[]>(placeholderVideos)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<MotionVideo | null>(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [popupPosition, setPopupPosition] = useState<'left' | 'right'>('right')
  const videoGridRef = useRef<HTMLDivElement>(null)
  const hasAnimatedInitial = useRef(false)
  const previousActiveIndexRef = useRef<number | null>(null)
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right' | null>(null)

  // Fetch videos from Sanity
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/motion-videos')
        if (response.ok) {
          const data = await response.json()
          if (data.videos && data.videos.length > 0) {
            setVideos(data.videos)
          }
        }
      } catch (error) {
        console.warn('⚠️ Failed to fetch motion videos from Sanity:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchVideos()
  }, [])

  // Helper function to get button index
  const getButtonIndex = (category: string | null): number => {
    if (category === null) return 0 // "See All"
    return categories.findIndex(c => c === category) + 1
  }

  // Handle category change with direction tracking
  const handleCategoryChange = (newCategory: string | null) => {
    const currentIndex = getButtonIndex(activeCategory)
    const newIndex = getButtonIndex(newCategory)
    
    // Skip if clicking the same button (toggling off)
    if (activeCategory === newCategory) {
      previousActiveIndexRef.current = null
      setActiveCategory(null)
      setAnimationDirection(null)
      return
    }
    
    // Determine direction based on previous position
    let direction: 'left' | 'right' | null = null
    if (previousActiveIndexRef.current !== null) {
      if (newIndex > previousActiveIndexRef.current) {
        direction = 'right' // Moving right (animate left to right)
      } else if (newIndex < previousActiveIndexRef.current) {
        direction = 'left' // Moving left (animate right to left)
      }
    } else {
      // First click - default to left to right
      direction = 'right'
    }
    
    // Update state synchronously but optimize animation timing
    setAnimationDirection(direction)
    previousActiveIndexRef.current = newIndex
    setActiveCategory(newCategory)
  }

  // Handle video click
  const handleVideoClick = (video: MotionVideo, position: 'left' | 'right') => {
    // Popup appears on opposite side of tile
    const popupSide = position === 'left' ? 'right' : 'left'
    setPopupPosition(popupSide)
    setSelectedVideo(video)
    setIsPopupOpen(true)
  }

  // Handle popup close
  const handleClosePopup = () => {
    setIsPopupOpen(false)
    // Reset selected video after animation
    setTimeout(() => {
      setSelectedVideo(null)
    }, 400)
  }

  // Filter videos based on active category
  const filteredVideos = activeCategory 
    ? videos.filter(video => video.category === activeCategory)
    : videos

  // Initial page load animation
  useEffect(() => {
    if (!videoGridRef.current || hasAnimatedInitial.current) return

    const videoElements = Array.from(videoGridRef.current.children)
    if (videoElements.length === 0) return

    // Set initial state - start from below and transparent
    gsap.set(videoElements, { opacity: 0, y: 40 })

    // Animate in with stagger on initial load
    requestAnimationFrame(() => {
      gsap.to(videoElements, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.1,
        onComplete: () => {
          hasAnimatedInitial.current = true
        }
      })
    })
  }, [videos])

  // Animate video grid when category changes (after initial load)
  useEffect(() => {
    if (!videoGridRef.current || !hasAnimatedInitial.current) return

    const videoElements = Array.from(videoGridRef.current.children)
    if (videoElements.length === 0) return

    // Kill any existing animations on these elements
    gsap.killTweensOf(videoElements)

    // Set initial state
    gsap.set(videoElements, { opacity: 0, y: 20 })

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      // Animate in with stagger
      gsap.to(videoElements, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
        stagger: 0.06
      })
    })

    return () => {
      gsap.killTweensOf(videoElements)
    }
  }, [filteredVideos])

  return (
    <div className="min-h-screen bg-[#FFF9DF] flex flex-col">
      <Header />

      {/* Main Content Area - Burgundy Background for Everything Below Header */}
      <div className="flex-1 bg-[#C64B2C]">
        {/* Hero Section */}
        <section className="px-5 pt-6 pb-4 md:pt-8 md:pb-6 lg:pt-10 lg:pb-8">
          {/* Large Title */}
          <h1 
            className="text-white mb-8 md:mb-12"
            style={{ 
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', 
              fontWeight: 'bold',
              fontSize: 'clamp(21px, 3.3vw, 43px)',
              lineHeight: '1.2',
              letterSpacing: '-0.5px'
            }}
          >
            Cinematic storytelling for brands, from hero reels to platform-specific content. We capture, edit, and produce video that stops the scroll and drives engagement.
          </h1>

          {/* Filter Buttons - Text links with animated underline */}
          <div className="flex flex-wrap gap-4 md:gap-6 mb-4">
            <CategoryButton
              label="See All"
              isActive={activeCategory === null}
              onClick={() => handleCategoryChange(null)}
              direction={animationDirection}
            />
            {categories.map((category) => (
              <CategoryButton
                key={category}
                label={category}
                isActive={activeCategory === category}
                onClick={() => handleCategoryChange(category)}
                direction={animationDirection}
              />
            ))}
          </div>
        </section>

        {/* Video Gallery Section - 2 Columns with 10px gap */}
        <section className="px-5 pb-12 md:pb-16">
          <div ref={videoGridRef} className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '10px' }}>
              {filteredVideos.map((video, index) => (
                <MotionVideoCard 
                  key={video._id} 
                  video={video} 
                  index={index}
                  onVideoClick={handleVideoClick}
                />
              ))}
          </div>

          {/* Video Detail Popup */}
          {selectedVideo && (
            <VideoDetailPopup
              video={selectedVideo}
              position={popupPosition}
              isOpen={isPopupOpen}
              onClose={handleClosePopup}
            />
          )}

          {/* Show message if no videos match filter */}
          {filteredVideos.length === 0 && !isLoading && (
            <div className="text-center py-20">
              <p 
                className="text-white text-xl"
                style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
              >
                No videos found for this category.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
