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

interface StillImage {
  _id: string
  title: string
  category: string
  imageUrl: string
  aspectRatio: 'portrait' | 'landscape' | 'square'
  location?: string
  year?: string
  client?: string
  description?: string
  projectImages?: string[]
}

const defaultCategories = ['Landscape', 'Architecture', 'Nature', 'Abstract']

export function StillsPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [images, setImages] = useState<StillImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>(defaultCategories)
  const [selectedProject, setSelectedProject] = useState<StillImage | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const galleryRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)

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
              
              // Collect all category tags from this project
              if (project.categoryTags && Array.isArray(project.categoryTags)) {
                project.categoryTags.forEach((tag: string) => {
                  if (tag && tag.trim()) {
                    allCategoryTags.add(tag.trim())
                  }
                })
              }
              
              // Use first category tag or default to 'Nature'
              const category = project.categoryTags && project.categoryTags.length > 0
                ? project.categoryTags[0]
                : 'Nature'
              
              return {
                _id: project._id,
                title: project.title,
                category: category,
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
            if (uniqueCategories.length > 0) {
              setCategories(uniqueCategories)
            } else {
              // Fallback to default categories if no tags found
              setCategories(defaultCategories)
            }
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

  // Filter images based on active category
  const filteredImages = activeCategory 
    ? images.filter(img => img.category === activeCategory)
    : images

  return (
    <div className="min-h-screen bg-[#3AAAFF] flex flex-col">
      <Header />

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

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-4 md:gap-6 mb-4">
            <button
              onClick={() => setActiveCategory(null)}
              className={`relative overflow-hidden bg-[#3AAAFF] group px-4 py-2 ${
                activeCategory === null ? 'text-white' : 'text-white/80'
              }`}
              style={{ 
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', 
                fontWeight: 'bold', 
                fontSize: 'clamp(16px, 2vw, 22px)',
                letterSpacing: '-0.5px'
              }}
            >
              <span className="relative z-10">See All</span>
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`relative overflow-hidden bg-[#3AAAFF] group px-4 py-2 ${
                  activeCategory === category ? 'text-white' : 'text-white/80'
                }`}
                style={{ 
                  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', 
                  fontWeight: 'bold', 
                  fontSize: 'clamp(16px, 2vw, 22px)',
                  letterSpacing: '-0.5px'
                }}
              >
                <span className="relative z-10">{category}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Masonry Gallery Section */}
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
          ) : (
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

      <Footer />
    </div>
  )
}
