'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Header } from './Header'
import { Footer } from './Footer'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface ArchiveImage {
  id: string
  url: string
  projectTitle?: string
  description?: string
  projectId?: string // Project ID to group images
  projectGallery?: string[] // All images from the same project
  client?: string // Client name
  size?: 'small' | 'medium' | 'large' | 'xlarge'
  scale?: number // Random scale factor between 0.9 and 1.25 (10% smaller to 25% bigger)
}

export function ArchivePage() {
  const [images, setImages] = useState<ArchiveImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<ArchiveImage | null>(null)
  const [currentProjectIndex, setCurrentProjectIndex] = useState<number>(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isOnLeftSide, setIsOnLeftSide] = useState(false)
  const [showCursor, setShowCursor] = useState(false)
  const [navDirection, setNavDirection] = useState<'left' | 'right'>('right')
  const galleryRef = useRef<HTMLDivElement>(null)
  const lightboxRef = useRef<HTMLDivElement>(null)
  const lightboxImageRef = useRef<HTMLDivElement>(null)

  // Fetch all images from stills projects only
  useEffect(() => {
    const fetchAllImages = async () => {
      try {
        // Collect all images from stills projects only
        const allImages: ArchiveImage[] = []
        
        // Fetch stills projects from Sanity
        const stillsResponse = await fetch('/api/stills')
        if (stillsResponse.ok) {
          const stillsData = await stillsResponse.json()
          if (stillsData.projects && Array.isArray(stillsData.projects)) {
            stillsData.projects.forEach((project: any) => {
              // Collect all images for this project (thumbnail + gallery)
              const projectImages: string[] = []
              
              if (project.thumbnailUrl) {
                projectImages.push(project.thumbnailUrl)
              }
              
              if (project.gallery && Array.isArray(project.gallery)) {
                project.gallery.forEach((imgUrl: string) => {
                  if (imgUrl && !projectImages.includes(imgUrl)) {
                    projectImages.push(imgUrl)
                  }
                })
              }
              
              // Add thumbnail if it exists
              if (project.thumbnailUrl) {
                allImages.push({
                  id: `stills-${project._id}-thumbnail`,
                  url: project.thumbnailUrl,
                  projectTitle: project.title,
                  description: project.description,
                  projectId: project._id,
                  projectGallery: projectImages
                })
              }
              
              // Add all gallery images
              if (project.gallery && Array.isArray(project.gallery)) {
                project.gallery.forEach((imgUrl: string, idx: number) => {
                  if (imgUrl) {
                    allImages.push({
                      id: `stills-${project._id}-gallery-${idx}`,
                      url: imgUrl,
                      projectTitle: project.title,
                      description: project.description,
                      projectId: project._id,
                      projectGallery: projectImages
                    })
                  }
                })
              }
            })
          }
        } else {
          console.warn('Failed to fetch stills projects:', stillsResponse.status)
        }
        
        // Assign random sizes to images for varied layout
        const sizes: Array<'small' | 'medium' | 'large' | 'xlarge'> = ['small', 'medium', 'large', 'xlarge']
        const imagesWithSizes = allImages.map((img) => ({
          ...img,
          size: sizes[Math.floor(Math.random() * sizes.length)] as 'small' | 'medium' | 'large' | 'xlarge',
          // Random scale between 0.9 (10% smaller) and 1.25 (25% bigger)
          scale: 0.9 + Math.random() * 0.35
        }))
        
        // Shuffle images for irregular grid effect
        const shuffled = imagesWithSizes.sort(() => Math.random() - 0.5)
        setImages(shuffled)
      } catch (error) {
        console.error('Failed to fetch archive images:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchAllImages()
  }, [])

  // Scroll-triggered animations using GSAP ScrollTrigger
  useEffect(() => {
    if (!galleryRef.current || images.length === 0) return

    const imageElements = galleryRef.current.querySelectorAll('.archive-item')
    if (imageElements.length === 0) return

    // Clean up any existing ScrollTriggers
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.vars.trigger && galleryRef.current?.contains(trigger.vars.trigger as Node)) {
        trigger.kill()
      }
    })

    // Set initial state for all images
    Array.from(imageElements).forEach((el) => {
      const randomY = 50 + Math.random() * 50
      const randomRotate = (Math.random() - 0.5) * 5
      const randomScale = 0.85 + Math.random() * 0.15 // 0.85 to 1.0
      
      gsap.set(el, { 
        opacity: 0, 
        y: randomY,
        rotation: randomRotate,
        scale: randomScale
      })
    })

    // Animate each image as it scrolls into view
    imageElements.forEach((el, index) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        rotation: 0,
        scale: 1,
        duration: 0.8 + Math.random() * 0.4, // 0.8 to 1.2 seconds
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true,
        },
        delay: (index % 10) * 0.05, // Stagger based on position
      })
    })

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger && galleryRef.current?.contains(trigger.vars.trigger as Node)) {
          trigger.kill()
        }
      })
    }
  }, [images])

  const handleImageClick = (image: ArchiveImage) => {
    setSelectedImage(image)
    // Find index of clicked image within its project gallery
    if (image.projectGallery) {
      const index = image.projectGallery.findIndex(url => url === image.url)
      setCurrentProjectIndex(index >= 0 ? index : 0)
    } else {
      setCurrentProjectIndex(0)
    }
    setIsLightboxOpen(true)
  }

  const handleCloseLightbox = () => {
    setIsLightboxOpen(false)
    setTimeout(() => {
      setSelectedImage(null)
      setCurrentProjectIndex(0)
    }, 300)
  }

  const handleNextProjectImage = () => {
    if (!selectedImage || !selectedImage.projectGallery) return
    setNavDirection('right')
    const nextIndex = (currentProjectIndex + 1) % selectedImage.projectGallery.length
    setCurrentProjectIndex(nextIndex)
    // Update selected image URL to match the new index
    setSelectedImage({
      ...selectedImage,
      url: selectedImage.projectGallery[nextIndex]
    })
  }

  const handlePrevProjectImage = () => {
    if (!selectedImage || !selectedImage.projectGallery) return
    setNavDirection('left')
    const prevIndex = (currentProjectIndex - 1 + selectedImage.projectGallery.length) % selectedImage.projectGallery.length
    setCurrentProjectIndex(prevIndex)
    // Update selected image URL to match the new index
    setSelectedImage({
      ...selectedImage,
      url: selectedImage.projectGallery[prevIndex]
    })
  }

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen || !selectedImage) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseLightbox()
      } else if (e.key === 'ArrowRight' && selectedImage?.projectGallery) {
        setNavDirection('right')
        const nextIndex = (currentProjectIndex + 1) % selectedImage.projectGallery.length
        setCurrentProjectIndex(nextIndex)
        setSelectedImage({
          ...selectedImage,
          url: selectedImage.projectGallery[nextIndex]
        })
      } else if (e.key === 'ArrowLeft' && selectedImage?.projectGallery) {
        setNavDirection('left')
        const prevIndex = (currentProjectIndex - 1 + selectedImage.projectGallery.length) % selectedImage.projectGallery.length
        setCurrentProjectIndex(prevIndex)
        setSelectedImage({
          ...selectedImage,
          url: selectedImage.projectGallery[prevIndex]
        })
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isLightboxOpen, selectedImage, currentProjectIndex])

  // Mouse tracking for lightbox cursor
  useEffect(() => {
    if (!isLightboxOpen) return

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
      setIsOnLeftSide(e.clientX < window.innerWidth / 2)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isLightboxOpen])

  // Animate lightbox image on change
  useEffect(() => {
    if (!lightboxImageRef.current || !isLightboxOpen) return

    // Animate in from the direction of navigation
    const xOffset = navDirection === 'right' ? 40 : -40
    
    gsap.fromTo(
      lightboxImageRef.current,
      { 
        opacity: 0, 
        x: xOffset
      },
      { 
        opacity: 1, 
        x: 0,
        duration: 1, 
        ease: 'power2.out' 
      }
    )
  }, [currentProjectIndex, isLightboxOpen, navDirection])

  // Get base width for images with random scale applied
  // Height will be determined by image's natural aspect ratio
  const getBaseWidth = (size?: 'small' | 'medium' | 'large' | 'xlarge', scale?: number) => {
    let baseWidth: number
    
    switch (size) {
      case 'small':
        baseWidth = 400
        break
      case 'medium':
        baseWidth = 500
        break
      case 'large':
        baseWidth = 600
        break
      case 'xlarge':
        baseWidth = 700
        break
      default:
        baseWidth = 500
    }
    
    // Apply random scale (default to 1.0 if not provided)
    const scaleFactor = scale || 1.0
    return Math.round(baseWidth * scaleFactor)
  }

  return (
    <div className="min-h-screen bg-[#FEFEFE] flex flex-col">
      <Header isLightboxOpen={isLightboxOpen} onExitLightbox={handleCloseLightbox} />

      {/* Main Content */}
      <div className="flex-1">
        {/* Masonry Gallery */}
        <section className="px-5 pb-6 md:px-8 md:pb-8 lg:px-12 lg:pb-12" style={{ paddingTop: '150px' }}>
          {isLoading ? (
            <div className="text-center py-20">
              <p 
                className="text-black/60 text-lg"
                style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
              >
                Loading index...
              </p>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-20">
              <p 
                className="text-black/60 text-lg"
                style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
              >
                No images found in index.
              </p>
            </div>
          ) : (
            <div 
              ref={galleryRef}
              className="columns-1 sm:columns-2 md:columns-3 lg:columns-4"
              style={{ columnGap: 'clamp(100px, 12.5vw, 200px)' }}
            >
              {images.map((image) => {
                const baseWidth = getBaseWidth(image.size, image.scale)
                return (
                  <div 
                    key={image.id} 
                    className="archive-item break-inside-avoid cursor-pointer group"
                    style={{ marginBottom: 'clamp(100px, 12.5vw, 200px)' }}
                    onClick={() => handleImageClick(image)}
                  >
                    <div className="relative overflow-hidden">
                      <Image
                        src={image.url}
                        alt={image.description || image.projectTitle || 'Archive image'}
                        width={baseWidth}
                        height={0}
                        className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, 50vw"
                        style={{ height: 'auto' }}
                      />
                      {/* Subtle overlay on hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>

      {/* Lightbox */}
      {isLightboxOpen && selectedImage && selectedImage.projectGallery && (
        <div 
          ref={lightboxRef}
          className="fixed inset-0 z-40 bg-white flex flex-col"
          onClick={handleCloseLightbox}
          style={{ paddingTop: '80px' }}
        >
          {/* Custom cursor that follows mouse */}
          {selectedImage.projectGallery.length > 1 && !showCursor && (
            <div
              className="fixed pointer-events-none z-50 text-black"
              style={{
                left: mousePos.x,
                top: mousePos.y,
                transform: 'translate(-50%, -50%)',
                fontFamily: 'Courier New, monospace',
                fontSize: '14px',
              }}
            >
              {isOnLeftSide ? '← back' : 'next →'}
            </div>
          )}

          {/* Main image area - centered with lots of whitespace */}
          <div 
            className="flex-1 flex items-center justify-center relative"
            style={{ cursor: showCursor ? 'auto' : 'none', paddingBottom: '0' }}
            onClick={(e) => {
              if (selectedImage.projectGallery && selectedImage.projectGallery.length > 1) {
                e.stopPropagation()
                if (isOnLeftSide) {
                  handlePrevProjectImage()
                } else {
                  handleNextProjectImage()
                }
              }
            }}
          >
            {/* Hero Image - centered, original size */}
            <div 
              ref={lightboxImageRef}
              className="relative"
              style={{ maxHeight: 'calc((100vh - 200px) * 0.75)' }}
            >
              <Image
                src={selectedImage.url}
                alt={selectedImage.description || selectedImage.projectTitle || 'Archive image'}
                width={1200}
                height={900}
                className="w-auto h-auto object-contain"
                style={{ maxHeight: 'calc((100vh - 200px) * 0.75)', maxWidth: '64vw' }}
                priority
                unoptimized
              />
            </div>
          </div>

          {/* Bottom Section - description and thumbnails */}
          <div 
            className="bg-white pt-2 pb-6 px-6"
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={() => setShowCursor(true)}
            onMouseLeave={() => setShowCursor(false)}
            style={{ cursor: 'auto' }}
          >
            <div className="flex flex-col items-center mx-auto max-w-2xl">
              {/* Project Description - between image and thumbnails */}
              {selectedImage.description && (
                <p
                  className="text-black/80 text-center"
                  style={{
                    fontFamily: 'Courier New, monospace',
                    fontSize: '12px',
                    lineHeight: '1.6',
                    marginBottom: '50px'
                  }}
                >
                  {selectedImage.description}
                </p>
              )}

              {/* Thumbnails row */}
              {selectedImage.projectGallery.length > 1 && (
                <div className="flex gap-3 justify-center items-center" id="thumbnail-row">
                  {selectedImage.projectGallery.map((imgUrl: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentProjectIndex(idx)
                        setSelectedImage({
                          ...selectedImage,
                          url: imgUrl
                        })
                      }}
                      className={`flex-shrink-0 relative overflow-hidden rounded-md transition-all duration-300 cursor-pointer ${
                        idx === currentProjectIndex 
                          ? 'ring-2 ring-black' 
                          : 'opacity-50 hover:opacity-100'
                      }`}
                      style={{ width: '48px', height: '32px' }}
                    >
                      <Image
                        src={imgUrl}
                        alt={`${selectedImage.projectTitle || 'Project'} - Image ${idx + 1}`}
                        width={48}
                        height={32}
                        className="w-full h-full object-cover"
                        sizes="48px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer - hidden when lightbox is open */}
      {!isLightboxOpen && <Footer />}
    </div>
  )
}

