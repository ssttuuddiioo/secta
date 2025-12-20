'use client'

import { useState, useRef, useEffect, useLayoutEffect, useMemo } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Footer } from './Footer'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface StillImage {
  _id: string
  title: string
  categoryTags: string[]
  imageUrl: string
  aspectRatio: 'portrait' | 'landscape' | 'square'
  location?: string
  year?: string
  client?: string
  description?: string
  projectImages?: string[]
}

// Extended interface for index view images with random sizing
interface IndexImage extends StillImage {
  size: 'small' | 'medium' | 'large' | 'xlarge'
  scale: number
  projectGallery: string[]
}

const defaultCategories: string[] = []

// Category Buttons with sliding underline that travels between tags
function CategoryButtons({ 
  categories,
  activeCategory,
  onCategoryChange,
  viewMode,
  onIndexClick
}: { 
  categories: string[]
  activeCategory: string | null
  onCategoryChange: (category: string | null) => void
  viewMode: 'grid' | 'index'
  onIndexClick: () => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const underlineRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<Map<string | null, HTMLButtonElement>>(new Map())
  const isFirstRender = useRef(true)

  // All items including "See All" (represented as null)
  const allItems: (string | null)[] = [null, ...categories]

  useLayoutEffect(() => {
    if (!containerRef.current || !underlineRef.current) return

    // Hide sliding underline when in index (archive) mode - Archive has its own underline
    if (viewMode === 'index') {
      gsap.to(underlineRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out'
      })
      return
    }

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
  }, [activeCategory, categories, viewMode])

  const setButtonRef = (key: string | null, el: HTMLButtonElement | null) => {
    if (el) {
      buttonRefs.current.set(key, el)
    } else {
      buttonRefs.current.delete(key)
    }
  }

  return (
    <div ref={containerRef} className="relative flex flex-wrap items-center gap-4 md:gap-6 mb-4">
      {/* See All button */}
      <button
        key="see-all"
        ref={(el) => setButtonRef(null, el)}
        onClick={() => onCategoryChange(null)}
        className="relative pb-1"
        style={{
          fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
          fontWeight: 'bold',
          fontSize: 'clamp(14px, 2vw, 18px)',
          color: '#FFFFFF',
          textDecoration: 'none'
        }}
      >
        All Projects
      </button>
      
      {/* Index Button - next to See All */}
      <button
        onClick={onIndexClick}
        className="relative pb-1"
        style={{ 
          fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', 
          fontWeight: 'bold', 
          fontSize: 'clamp(14px, 2vw, 18px)',
          color: '#FFFFFF',
          textDecoration: viewMode === 'index' ? 'underline' : 'none',
          textUnderlineOffset: '4px'
        }}
      >
        Archive
      </button>
      
      {/* Category buttons */}
      {categories.map((item) => (
        <button
          key={item}
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
          {item}
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

// Get base width for index view images with random scale applied
function getBaseWidth(size?: 'small' | 'medium' | 'large' | 'xlarge', scale?: number) {
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
  
  const scaleFactor = scale || 1.0
  return Math.round(baseWidth * scaleFactor)
}

export function StillsPage() {
  // View mode: 'grid' for normal category view, 'index' for archive-style view
  const [viewMode, setViewMode] = useState<'grid' | 'index'>('grid')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [images, setImages] = useState<StillImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>(defaultCategories)
  const [selectedProject, setSelectedProject] = useState<StillImage | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const galleryRef = useRef<HTMLDivElement>(null)
  const indexGalleryRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)
  
  // Lightbox state for index view
  const [selectedIndexImage, setSelectedIndexImage] = useState<IndexImage | null>(null)
  const [currentProjectIndex, setCurrentProjectIndex] = useState<number>(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isOnLeftSide, setIsOnLeftSide] = useState(false)
  const [showCursor, setShowCursor] = useState(false)
  const [navDirection, setNavDirection] = useState<'left' | 'right'>('right')
  const lightboxRef = useRef<HTMLDivElement>(null)
  const lightboxImageRef = useRef<HTMLDivElement>(null)

  // Fetch stills projects from Sanity
  useEffect(() => {
    const fetchStillsProjects = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/stills')
        if (response.ok) {
          const data = await response.json()
          if (data.projects && Array.isArray(data.projects)) {
            // Collect all category tags from all projects
            const allCategoryTags = new Set<string>()
            
            const mappedImages: StillImage[] = data.projects.map((project: any) => {
              // Determine aspect ratio - default to landscape
              let aspectRatio: 'portrait' | 'landscape' | 'square' = 'landscape'
              
              // Collect all category tags from this project for the filter buttons
              const projectTags: string[] = []
              if (project.categoryTags && Array.isArray(project.categoryTags)) {
                project.categoryTags.forEach((tag: string) => {
                  if (tag && tag.trim()) {
                    allCategoryTags.add(tag.trim())
                    projectTags.push(tag.trim())
                  }
                })
              }
              
              return {
                _id: project._id,
                title: project.title,
                categoryTags: projectTags,
                imageUrl: project.thumbnailUrl || '',
                aspectRatio: aspectRatio,
                year: project.year,
                client: project.client,
                description: project.description,
                projectImages: project.gallery || []
              }
            })
            setImages(mappedImages)
            
            // Use all unique category tags from all projects for filter buttons
            const uniqueCategories = Array.from(allCategoryTags).sort()
            setCategories(uniqueCategories)
          }
        }
      } catch (error) {
        console.error('Failed to fetch stills projects:', error)
        setImages([])
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchStillsProjects()
  }, [])

  // Create shuffled index images with random sizes (memoized to avoid reshuffling on re-renders)
  const indexImages = useMemo<IndexImage[]>(() => {
    if (images.length === 0) return []
    
    const sizes: Array<'small' | 'medium' | 'large' | 'xlarge'> = ['small', 'medium', 'large', 'xlarge']
    const allIndexImages: IndexImage[] = []
    
    images.forEach((project) => {
      // Collect all images for this project (thumbnail + gallery)
      const projectGallery: string[] = []
      
      if (project.imageUrl) {
        projectGallery.push(project.imageUrl)
      }
      
      if (project.projectImages && Array.isArray(project.projectImages)) {
        project.projectImages.forEach((imgUrl: string) => {
          if (imgUrl && !projectGallery.includes(imgUrl)) {
            projectGallery.push(imgUrl)
          }
        })
      }
      
      // Add thumbnail as first entry
      if (project.imageUrl) {
        allIndexImages.push({
          ...project,
          size: sizes[Math.floor(Math.random() * sizes.length)],
          scale: 0.9 + Math.random() * 0.35,
          projectGallery
        })
      }
      
      // Add all gallery images
      if (project.projectImages && Array.isArray(project.projectImages)) {
        project.projectImages.forEach((imgUrl: string) => {
          if (imgUrl) {
            allIndexImages.push({
              ...project,
              _id: `${project._id}-gallery-${imgUrl}`,
              imageUrl: imgUrl,
              size: sizes[Math.floor(Math.random() * sizes.length)],
              scale: 0.9 + Math.random() * 0.35,
              projectGallery
            })
          }
        })
      }
    })
    
    // Shuffle images for irregular grid effect
    return allIndexImages.sort(() => Math.random() - 0.5)
  }, [images])

  // Scroll-triggered animations
  useEffect(() => {
    if (!galleryRef.current || images.length === 0) return

    const imageElements = galleryRef.current.querySelectorAll('.masonry-item')
    if (imageElements.length === 0) return

    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.vars.trigger && galleryRef.current?.contains(trigger.vars.trigger as Node)) {
        trigger.kill()
      }
    })

    imageElements.forEach((el, index) => {
      const randomY = 50 + Math.random() * 50
      const randomRotate = (Math.random() - 0.5) * 5
      const randomScale = 0.85 + Math.random() * 0.15
      
      gsap.fromTo(el,
        {
          opacity: 0,
          y: randomY,
          rotation: randomRotate,
          scale: randomScale,
        },
        {
          opacity: 1,
          y: 0,
          rotation: 0,
          scale: 1,
          duration: 0.8 + Math.random() * 0.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true,
          },
          delay: index * 0.03,
        }
      )
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [images])

  const handleImageClick = (image: StillImage) => {
    setSelectedProject(image)
    setIsSidebarOpen(true)
  }

  const handleCloseSidebar = () => {
    // Animate sidebar out
    if (sidebarRef.current) {
      gsap.to(sidebarRef.current, {
        x: '100%',
        duration: 0.4,
        ease: 'power3.inOut',
        onComplete: () => {
          setIsSidebarOpen(false)
          setSelectedProject(null)
        }
      })
    } else {
      setIsSidebarOpen(false)
      setSelectedProject(null)
    }
  }

  // Animate sidebar in when it opens
  useEffect(() => {
    if (isSidebarOpen && sidebarRef.current) {
      // Animate sidebar panel
      gsap.fromTo(sidebarRef.current,
        { x: '100%' },
        { x: '0%', duration: 0.4, ease: 'power3.out' }
      )
      
      // Animate content elements with stagger
      const contentElements = sidebarRef.current.querySelectorAll('.sidebar-animate')
      gsap.fromTo(contentElements,
        { 
          opacity: 0, 
          y: 30 
        },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.5, 
          ease: 'power3.out',
          stagger: 0.08,
          delay: 0.2
        }
      )

      // Animate gallery images separately with more dramatic stagger
      const galleryImages = sidebarRef.current.querySelectorAll('.sidebar-gallery-item')
      gsap.fromTo(galleryImages,
        { 
          opacity: 0, 
          scale: 0.9,
          y: 20
        },
        { 
          opacity: 1, 
          scale: 1,
          y: 0,
          duration: 0.4, 
          ease: 'power2.out',
          stagger: 0.06,
          delay: 0.4
        }
      )
    }
  }, [isSidebarOpen, selectedProject])

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSidebarOpen) {
        handleCloseSidebar()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isSidebarOpen])

  // ===== INDEX VIEW HANDLERS =====
  
  const handleIndexClick = () => {
    setViewMode('index')
    setActiveCategory(null)
  }

  const handleCategoryChange = (category: string | null) => {
    setActiveCategory(category)
    setViewMode('grid')
  }

  const handleIndexImageClick = (image: IndexImage) => {
    setSelectedIndexImage(image)
    // Find index of clicked image within its project gallery
    if (image.projectGallery) {
      const index = image.projectGallery.findIndex(url => url === image.imageUrl)
      setCurrentProjectIndex(index >= 0 ? index : 0)
    } else {
      setCurrentProjectIndex(0)
    }
    setIsLightboxOpen(true)
  }

  const handleCloseLightbox = () => {
    setIsLightboxOpen(false)
    setTimeout(() => {
      setSelectedIndexImage(null)
      setCurrentProjectIndex(0)
    }, 300)
  }

  const handleNextProjectImage = () => {
    if (!selectedIndexImage || !selectedIndexImage.projectGallery) return
    setNavDirection('right')
    const nextIndex = (currentProjectIndex + 1) % selectedIndexImage.projectGallery.length
    setCurrentProjectIndex(nextIndex)
    setSelectedIndexImage({
      ...selectedIndexImage,
      imageUrl: selectedIndexImage.projectGallery[nextIndex]
    })
  }

  const handlePrevProjectImage = () => {
    if (!selectedIndexImage || !selectedIndexImage.projectGallery) return
    setNavDirection('left')
    const prevIndex = (currentProjectIndex - 1 + selectedIndexImage.projectGallery.length) % selectedIndexImage.projectGallery.length
    setCurrentProjectIndex(prevIndex)
    setSelectedIndexImage({
      ...selectedIndexImage,
      imageUrl: selectedIndexImage.projectGallery[prevIndex]
    })
  }

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen || !selectedIndexImage) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseLightbox()
      } else if (e.key === 'ArrowRight' && selectedIndexImage?.projectGallery) {
        setNavDirection('right')
        const nextIndex = (currentProjectIndex + 1) % selectedIndexImage.projectGallery.length
        setCurrentProjectIndex(nextIndex)
        setSelectedIndexImage({
          ...selectedIndexImage,
          imageUrl: selectedIndexImage.projectGallery[nextIndex]
        })
      } else if (e.key === 'ArrowLeft' && selectedIndexImage?.projectGallery) {
        setNavDirection('left')
        const prevIndex = (currentProjectIndex - 1 + selectedIndexImage.projectGallery.length) % selectedIndexImage.projectGallery.length
        setCurrentProjectIndex(prevIndex)
        setSelectedIndexImage({
          ...selectedIndexImage,
          imageUrl: selectedIndexImage.projectGallery[prevIndex]
        })
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isLightboxOpen, selectedIndexImage, currentProjectIndex])

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

    const xOffset = navDirection === 'right' ? 40 : -40
    
    gsap.fromTo(
      lightboxImageRef.current,
      { opacity: 0, x: xOffset },
      { opacity: 1, x: 0, duration: 1, ease: 'power2.out' }
    )
  }, [currentProjectIndex, isLightboxOpen, navDirection])

  // Scroll-triggered animations for index view
  useEffect(() => {
    if (!indexGalleryRef.current || indexImages.length === 0 || viewMode !== 'index') return

    const imageElements = indexGalleryRef.current.querySelectorAll('.archive-item')
    if (imageElements.length === 0) return

    // Clean up any existing ScrollTriggers
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.vars.trigger && indexGalleryRef.current?.contains(trigger.vars.trigger as Node)) {
        trigger.kill()
      }
    })

    // Set initial state for all images
    Array.from(imageElements).forEach((el) => {
      const randomY = 50 + Math.random() * 50
      const randomRotate = (Math.random() - 0.5) * 5
      const randomScale = 0.85 + Math.random() * 0.15
      
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
        duration: 0.8 + Math.random() * 0.4,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true,
        },
        delay: (index % 10) * 0.05,
      })
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger && indexGalleryRef.current?.contains(trigger.vars.trigger as Node)) {
          trigger.kill()
        }
      })
    }
  }, [indexImages, viewMode])

  // Filter images based on active category (check if any tag matches)
  const filteredImages = activeCategory 
    ? images.filter(img => img.categoryTags.includes(activeCategory))
    : images

  return (
    <div className="min-h-screen bg-[#3AAAFF] flex flex-col">

      {/* Main Content Area */}
      <div className="flex-1">
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
            Capturing moments that tell stories. From sweeping landscapes to intimate details, our photography explores the world through a lens of curiosity and craft.
          </h1>

          {/* Filter Buttons - Text links with sliding underline */}
          <CategoryButtons
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
            viewMode={viewMode}
            onIndexClick={handleIndexClick}
          />
        </section>

        {/* Masonry Gallery Section - Conditional based on viewMode */}
        <section className="px-5 pb-12 md:pb-16">
          {isLoading ? (
            <div className="text-center py-20">
              <p 
                className="text-white text-xl"
                style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
              >
                Loading stills...
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            /* Grid View - Normal category-based masonry */
            <>
              <div 
                ref={galleryRef}
                className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4"
                style={{ columnGap: '10px' }}
              >
                {filteredImages.map((image) => (
                  <div key={image._id} className="masonry-item">
                    <div 
                      className="relative mb-2.5 cursor-pointer group overflow-hidden rounded-lg"
                      onClick={() => handleImageClick(image)}
                    >
                      <Image
                        src={image.imageUrl}
                        alt={image.title}
                        width={800}
                        height={600}
                        className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                        style={{ 
                          aspectRatio: image.aspectRatio === 'portrait' ? '3/4' : image.aspectRatio === 'square' ? '1/1' : '4/3'
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
                    </div>
                  </div>
                ))}
              </div>

              {filteredImages.length === 0 && !isLoading && (
                <div className="text-center py-20">
                  <p 
                    className="text-white text-xl"
                    style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                  >
                    No images found for this category.
                  </p>
                </div>
              )}
            </>
          ) : (
            /* Index View - Shuffled masonry with varied sizes */
            <>
              {indexImages.length === 0 ? (
                <div className="text-center py-20">
                  <p 
                    className="text-white text-xl"
                    style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                  >
                    No images found in index.
                  </p>
                </div>
              ) : (
                <div 
                  ref={indexGalleryRef}
                  className="columns-1 sm:columns-2 md:columns-3 lg:columns-4"
                  style={{ columnGap: 'clamp(100px, 12.5vw, 200px)' }}
                >
                  {indexImages.map((image) => {
                    const baseWidth = getBaseWidth(image.size, image.scale)
                    return (
                      <div 
                        key={image._id} 
                        className="archive-item break-inside-avoid cursor-pointer group"
                        style={{ marginBottom: 'clamp(100px, 12.5vw, 200px)' }}
                        onClick={() => handleIndexImageClick(image)}
                      >
                        <div className="relative overflow-hidden">
                          <Image
                            src={image.imageUrl}
                            alt={image.description || image.title || 'Archive image'}
                            width={baseWidth}
                            height={0}
                            className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, 50vw"
                            style={{ height: 'auto' }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {/* Project Sidebar */}
      {isSidebarOpen && selectedProject && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseSidebar}
          />
          
          {/* Sidebar Panel */}
          <div 
            ref={sidebarRef}
            className="fixed top-0 right-0 h-full w-full lg:w-[80%] z-50 bg-[#3AAAFF] overflow-y-auto"
            style={{ transform: 'translateX(100%)' }}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseSidebar}
              className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="p-8 pt-20">
              {/* Title */}
              <h2 
                className="sidebar-animate text-white mb-2"
                style={{ 
                  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', 
                  fontWeight: 'bold',
                  fontSize: 'clamp(28px, 4vw, 42px)',
                  lineHeight: '1.1',
                  letterSpacing: '-1px'
                }}
              >
                {selectedProject.title}
              </h2>

              {/* Client & Year */}
              {(selectedProject.client || selectedProject.year) && (
                <p 
                  className="sidebar-animate text-white/70 mb-6"
                  style={{ 
                    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                    fontSize: '14px'
                  }}
                >
                  {selectedProject.client}{selectedProject.client && selectedProject.year && ' · '}{selectedProject.year}
                </p>
              )}

              {/* Description */}
              {selectedProject.description && (
                <p 
                  className="sidebar-animate text-white/90 mb-10 leading-relaxed"
                  style={{ 
                    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                    fontSize: '16px',
                    lineHeight: '1.7'
                  }}
                >
                  {selectedProject.description}
                </p>
              )}

              {/* Gallery Images */}
              {selectedProject.projectImages && selectedProject.projectImages.length > 0 && (
                <div className="space-y-4">
                  <h3 
                    className="sidebar-animate text-white/70 uppercase tracking-wide mb-4"
                    style={{ 
                      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  >
                    Gallery
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedProject.projectImages.map((imgUrl, index) => (
                      <div 
                        key={index} 
                        className="sidebar-gallery-item relative rounded-lg overflow-hidden"
                      >
                        <Image
                          src={imgUrl}
                          alt={`${selectedProject.title} - Image ${index + 1}`}
                          width={800}
                          height={600}
                          className="w-full h-auto"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Show thumbnail if no gallery images */}
              {(!selectedProject.projectImages || selectedProject.projectImages.length === 0) && (
                <div className="sidebar-gallery-item relative rounded-lg overflow-hidden">
                  <Image
                    src={selectedProject.imageUrl}
                    alt={selectedProject.title}
                    width={800}
                    height={600}
                    className="w-full h-auto"
                  />
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Lightbox for Index View */}
      {isLightboxOpen && selectedIndexImage && selectedIndexImage.projectGallery && (
        <div 
          ref={lightboxRef}
          className="fixed inset-0 z-50 bg-white flex flex-col h-screen"
          onClick={handleCloseLightbox}
          style={{ paddingTop: '60px' }}
        >
          {/* Custom cursor that follows mouse - hidden on mobile */}
          {selectedIndexImage.projectGallery.length > 1 && !showCursor && (
            <div
              className="fixed pointer-events-none z-50 text-black hidden md:block"
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
            className={`flex-1 flex items-center justify-center relative ${showCursor ? 'cursor-auto' : 'cursor-auto md:cursor-none'}`}
            style={{ paddingBottom: '0' }}
            onClick={(e) => {
              if (selectedIndexImage.projectGallery && selectedIndexImage.projectGallery.length > 1) {
                e.stopPropagation()
                if (isOnLeftSide) {
                  handlePrevProjectImage()
                } else {
                  handleNextProjectImage()
                }
              }
            }}
          >
            {/* Hero Image - centered, scaled for mobile to fit thumbnails in view */}
            <div 
              ref={lightboxImageRef}
              className="relative px-4 md:px-0"
              style={{ maxHeight: 'calc(100vh - 280px)' }}
            >
              <Image
                src={selectedIndexImage.imageUrl}
                alt={selectedIndexImage.description || selectedIndexImage.title || 'Archive image'}
                width={1200}
                height={900}
                className="w-auto h-auto object-contain max-w-[88vw] md:max-w-[64vw]"
                style={{ maxHeight: 'calc(100vh - 280px)' }}
                priority
                unoptimized
              />
            </div>
          </div>

          {/* Bottom Section - description and thumbnails - always visible */}
          <div 
            className="bg-white pt-2 pb-4 md:pb-6 px-4 md:px-6 flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={() => setShowCursor(true)}
            onMouseLeave={() => setShowCursor(false)}
            style={{ cursor: 'auto' }}
          >
            <div className="flex flex-col items-center mx-auto max-w-2xl">
              {/* Project Description - between image and thumbnails */}
              {selectedIndexImage.description && (
                <p
                  className="text-black/80 text-center mb-4 md:mb-[50px]"
                  style={{
                    fontFamily: 'Courier New, monospace',
                    fontSize: '11px',
                    lineHeight: '1.5',
                  }}
                >
                  {selectedIndexImage.description}
                </p>
              )}

              {/* Thumbnails row */}
              {selectedIndexImage.projectGallery.length > 1 && (
                <div className="flex gap-2 md:gap-3 justify-center items-center flex-wrap" id="thumbnail-row">
                  {selectedIndexImage.projectGallery.map((imgUrl: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentProjectIndex(idx)
                        setSelectedIndexImage({
                          ...selectedIndexImage,
                          imageUrl: imgUrl
                        })
                      }}
                      className={`flex-shrink-0 relative overflow-hidden rounded-md transition-all duration-300 cursor-pointer ${
                        idx === currentProjectIndex 
                          ? 'ring-2 ring-black' 
                          : 'opacity-50 hover:opacity-100'
                      }`}
                      style={{ width: '40px', height: '28px' }}
                    >
                      <Image
                        src={imgUrl}
                        alt={`${selectedIndexImage.title || 'Project'} - Image ${idx + 1}`}
                        width={40}
                        height={28}
                        className="w-full h-full object-cover"
                        sizes="40px"
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
