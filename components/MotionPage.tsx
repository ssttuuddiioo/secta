'use client'

import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { gsap } from 'gsap'
import { Header } from './Header'
import { Footer } from './Footer'
import { ContactForm } from './ContactForm'

interface ImageWithDescription {
  url?: string
  description?: string
}

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
  projectImages?: ImageWithDescription[]
  credits?: string
  behindTheScenes?: ImageWithDescription[]
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

// Lightbox Component for fullscreen image viewing
function Lightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev
}: {
  images: ImageWithDescription[]
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}) {
  const lightboxRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const hasOpenedRef = useRef(false)
  const [contentOpacity, setContentOpacity] = useState(1)
  const [displayedIndex, setDisplayedIndex] = useState(currentIndex)

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose, onNext, onPrev])

  // Animate lightbox open - only when opening
  useEffect(() => {
    if (!lightboxRef.current) return

    if (isOpen && !hasOpenedRef.current) {
      hasOpenedRef.current = true
      setDisplayedIndex(currentIndex)
      setContentOpacity(1)
      
      gsap.fromTo(lightboxRef.current, 
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: 'power2.out' }
      )
      
      if (contentRef.current) {
        gsap.fromTo(contentRef.current,
          { scale: 0.95, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' }
        )
      }
    }
    
    if (!isOpen) {
      hasOpenedRef.current = false
    }
  }, [isOpen, currentIndex])

  // Smooth crossfade when changing images
  useEffect(() => {
    if (!isOpen || !hasOpenedRef.current) return
    if (displayedIndex === currentIndex) return

    // Fade out
    setContentOpacity(0)
    
    // After fade out, update image and fade in
    const timeout = setTimeout(() => {
      setDisplayedIndex(currentIndex)
      setContentOpacity(1)
    }, 150)

    return () => clearTimeout(timeout)
  }, [currentIndex, isOpen, displayedIndex])

  if (!isOpen) return null

  const currentImage = images[displayedIndex]
  if (!currentImage?.url) return null

  return (
    <div 
      ref={lightboxRef}
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors z-10"
        style={{ fontSize: '32px', fontWeight: 'bold' }}
      >
        ×
      </button>

      {/* Image counter */}
      {images.length > 1 && (
        <div 
          className="absolute top-6 left-6 text-white/60 text-sm"
          style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
        >
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Previous button */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev() }}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors p-4"
          style={{ fontSize: '48px', fontWeight: '300' }}
        >
          ‹
        </button>
      )}

      {/* Image + Description container with smooth crossfade */}
      <div 
        ref={contentRef}
        className="flex flex-col items-center max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
        style={{
          opacity: contentOpacity,
          transition: 'opacity 150ms ease-out'
        }}
      >
        {/* Image */}
        <Image
          src={currentImage.url}
          alt={currentImage.description || `Image ${displayedIndex + 1}`}
          width={1600}
          height={900}
          className="object-contain max-w-full max-h-[75vh] w-auto h-auto rounded-lg"
          priority
        />
        
        {/* Description - only shown if present */}
        {currentImage.description && (
          <p 
            className="mt-4 text-white/90 text-center text-base md:text-lg max-w-2xl px-4"
            style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
          >
            {currentImage.description}
          </p>
        )}
      </div>

      {/* Next button */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext() }}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors p-4"
          style={{ fontSize: '48px', fontWeight: '300' }}
        >
          ›
        </button>
      )}
    </div>
  )
}

// Project Images Gallery with special 3-image layout
function ProjectImagesGallery({
  images,
  title,
  onImageClick
}: {
  images: ImageWithDescription[]
  title: string
  onImageClick: (index: number) => void
}) {
  const validImages = images.filter(img => img.url)
  
  if (validImages.length === 0) return null

  // Special layout for exactly 3 images: 1 large + 2 smaller below
  if (validImages.length === 3) {
    return (
      <div className="space-y-4 md:space-y-6">
        {/* Large image on top */}
        <div 
          className="relative aspect-video bg-black rounded-lg overflow-hidden cursor-pointer group"
          onClick={() => onImageClick(0)}
        >
          <Image
            src={validImages[0].url!}
            alt={`${title} - Project Image 1`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 800px"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-lg font-medium">
              View
            </span>
          </div>
        </div>
        {/* Two smaller images below */}
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {validImages.slice(1, 3).map((img, idx) => (
            <div 
              key={idx + 1}
              className="relative aspect-video bg-black rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => onImageClick(idx + 1)}
            >
              <Image
                src={img.url!}
                alt={`${title} - Project Image ${idx + 2}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 400px"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-lg font-medium">
                  View
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Default grid layout for other counts
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {validImages.map((img, idx) => (
        <div 
          key={idx}
          className="relative aspect-video bg-black rounded-lg overflow-hidden cursor-pointer group"
          onClick={() => onImageClick(idx)}
        >
          <Image
            src={img.url!}
            alt={`${title} - Project Image ${idx + 1}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 400px"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-lg font-medium">
              View
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

// Category Buttons with sliding underline that travels between tags
function CategoryButtons({ 
  categories,
  activeCategory,
  onCategoryChange
}: { 
  categories: string[]
  activeCategory: string | null
  onCategoryChange: (category: string | null) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const underlineRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<Map<string | null, HTMLButtonElement>>(new Map())
  const isFirstRender = useRef(true)

  // All items including "See All" (represented as null)
  const allItems: (string | null)[] = [null, ...categories]

  useLayoutEffect(() => {
    if (!containerRef.current || !underlineRef.current) return

    const activeButton = buttonRefs.current.get(activeCategory)
    
    if (activeButton) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const buttonRect = activeButton.getBoundingClientRect()
      
      const left = buttonRect.left - containerRect.left
      const width = buttonRect.width

      if (isFirstRender.current) {
        // No animation on first render
        gsap.set(underlineRef.current, { 
          left, 
          width,
          opacity: 1
        })
        isFirstRender.current = false
      } else {
        // Animate underline sliding to new position
        gsap.to(underlineRef.current, {
          left,
          width,
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out'
        })
      }
    } else {
      // No active category, hide underline
      gsap.to(underlineRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out'
      })
    }
  }, [activeCategory, categories])

  const setButtonRef = (key: string | null, el: HTMLButtonElement | null) => {
    if (el) {
      buttonRefs.current.set(key, el)
    } else {
      buttonRefs.current.delete(key)
    }
  }

  return (
    <div ref={containerRef} className="relative flex flex-wrap gap-4 md:gap-6 mb-4">
      {allItems.map((item) => (
        <button
          key={item ?? 'see-all'}
          ref={(el) => setButtonRef(item, el)}
          onClick={() => onCategoryChange(item)}
          className="relative pb-1"
          style={{
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
            fontWeight: 'bold',
            fontSize: 'clamp(14px, 2vw, 18px)',
            color: '#FFFFFF',
            textDecoration: 'none'
          }}
        >
          {item ?? 'See All'}
        </button>
      ))}
      {/* Shared sliding underline */}
      <div
        ref={underlineRef}
        className="absolute bottom-0 h-[2px] bg-white pointer-events-none"
        style={{ opacity: 0 }}
      />
    </div>
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
  
  // Lightbox state for project images
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [lightboxImages, setLightboxImages] = useState<ImageWithDescription[]>([])

  const openLightbox = (images: ImageWithDescription[], index: number) => {
    setLightboxImages(images)
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % lightboxImages.length)
  }

  const prevImage = () => {
    setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length)
  }

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
      {/* Popup - 80% viewport width */}
      <div
        ref={popupRef}
        className={`fixed top-0 bottom-0 w-[80vw] bg-[#C64B2C] z-50 overflow-y-auto ${
          position === 'left' ? 'left-0' : 'right-0'
        }`}
      >
        <div className="px-6 pt-3 pb-6 sm:px-8 sm:pt-4 sm:pb-8 md:px-12 md:pt-6 md:pb-12 lg:px-16 lg:pt-8 lg:pb-16">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 md:top-8 md:right-8 text-white hover:opacity-70 transition-opacity"
            style={{
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: '28px',
              fontWeight: 'bold'
            }}
          >
            ×
          </button>

          {/* Video Content */}
          <div className="mt-5 md:mt-6 space-y-10 md:space-y-12">
            {/* Title and Meta */}
            <div>
              <h2 
                className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6"
                style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
              >
                {video.title}
              </h2>
              
              {(video.year || video.client || video.role) && (
                <div className="flex flex-wrap gap-4 md:gap-8 text-white text-base md:text-lg mb-6 md:mb-8">
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
                <div className="flex flex-wrap gap-2 md:gap-3 mb-6 md:mb-8">
                  {video.categoryTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 md:px-4 py-1 md:py-1.5 bg-white/20 text-white rounded-full text-sm md:text-base"
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
              <div className="relative rounded-lg mb-10 md:mb-12 overflow-hidden">
                <video
                  src={video.videoUrl}
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto"
                />
              </div>
            )}

            {/* Brief Description */}
            {video.briefDescription && (
              <div>
                <h3 
                  className="text-white text-xl md:text-2xl font-bold mb-3 md:mb-4"
                  style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                >
                  Brief Description
                </h3>
                <p 
                  className="text-white/90 leading-relaxed text-base md:text-lg max-w-prose"
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
                  className="text-white text-xl md:text-2xl font-bold mb-3 md:mb-4"
                  style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                >
                  Challenge/Solution
                </h3>
                <p 
                  className="text-white/90 leading-relaxed text-base md:text-lg max-w-prose"
                  style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                >
                  {video.challengeSolution}
                </p>
              </div>
            )}

            {/* Project Images - with lightbox and special 3-image layout */}
            {video.projectImages && video.projectImages.length > 0 && (
              <div>
                <h3 
                  className="text-white text-xl md:text-2xl font-bold mb-4 md:mb-6"
                  style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                >
                  Project Images
                </h3>
                <ProjectImagesGallery
                  images={video.projectImages}
                  title={video.title}
                  onImageClick={(index) => openLightbox(video.projectImages!, index)}
                />
              </div>
            )}

            {/* Credits */}
            {video.credits && (
              <div>
                <h3 
                  className="text-white text-xl md:text-2xl font-bold mb-3 md:mb-4"
                  style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                >
                  Credits
                </h3>
                <p 
                  className="text-white/90 leading-relaxed text-base md:text-lg whitespace-pre-line max-w-prose"
                  style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                >
                  {video.credits}
                </p>
              </div>
            )}

            {/* Behind-the-Scenes - with lightbox and special 3-image layout */}
            {video.behindTheScenes && video.behindTheScenes.length > 0 && (
              <div>
                <h3 
                  className="text-white text-xl md:text-2xl font-bold mb-4 md:mb-6"
                  style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                >
                  Behind-the-Scenes
                </h3>
                <ProjectImagesGallery
                  images={video.behindTheScenes}
                  title={`${video.title} - Behind the Scenes`}
                  onImageClick={(index) => openLightbox(video.behindTheScenes!, index)}
                />
              </div>
            )}

            {/* Results/Impact */}
            {video.resultsImpact && (
              <div>
                <h3 
                  className="text-white text-xl md:text-2xl font-bold mb-3 md:mb-4"
                  style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                >
                  Results/Impact
                </h3>
                <p 
                  className="text-white/90 leading-relaxed text-base md:text-lg max-w-prose"
                  style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                >
                  {video.resultsImpact}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox for enlarged images */}
      <Lightbox
        images={lightboxImages}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onNext={nextImage}
        onPrev={prevImage}
      />
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
  const [showContactForm, setShowContactForm] = useState(false)
  const videoGridRef = useRef<HTMLDivElement>(null)
  const hasAnimatedInitial = useRef(false)
  const previousActiveIndexRef = useRef<number | null>(null)
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right' | null>(null)

  const handleContactToggle = () => {
    setShowContactForm(prev => !prev)
  }

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

          {/* Filter Buttons - Text links with sliding underline */}
          <CategoryButtons
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
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

        {/* Contact Form Section */}
        <div className="px-5 md:px-12">
          <ContactForm 
            isOpen={showContactForm} 
            onToggle={handleContactToggle}
            variant="dark"
          />
        </div>

        {/* Footer */}
        <Footer 
          onContactClick={handleContactToggle}
          isContactOpen={showContactForm}
        />
      </div>
    </div>
  )
}
