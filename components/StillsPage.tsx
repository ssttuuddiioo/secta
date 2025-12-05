'use client'

import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { Header } from './Header'
import { Footer } from './Footer'
import { ContactForm } from './ContactForm'

interface StillImage {
  _id: string
  title: string
  category: string
  imageUrl: string
  aspectRatio: 'portrait' | 'landscape' | 'square'
  location?: string
  year?: string
  description?: string
  projectImages?: string[] // Additional images from the same project
}

// Placeholder images from Unsplash with varying aspect ratios
const placeholderImages: StillImage[] = [
  { _id: '1', title: 'Bee on Flower', category: 'Nature', imageUrl: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&q=80', aspectRatio: 'portrait', description: 'A macro photograph capturing the delicate interaction between a honeybee and a white flower. Shot in natural light to emphasize the intricate details of the bee\'s wings and the flower\'s petals.', projectImages: ['https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=1200&q=80', 'https://images.unsplash.com/photo-1568526381923-caf3fd520382?w=1200&q=80', 'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=1200&q=80'] },
  { _id: '2', title: 'Brooklyn Bridge', category: 'Architecture', imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80', aspectRatio: 'landscape', description: 'An iconic view of the Brooklyn Bridge at golden hour, showcasing the architectural beauty of this historic landmark against the Manhattan skyline.', projectImages: ['https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&q=80', 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1200&q=80'] },
  { _id: '3', title: 'Bamboo Path', category: 'Nature', imageUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&q=80', aspectRatio: 'portrait', description: 'A serene pathway through a dense bamboo forest in Kyoto, Japan. The towering bamboo stalks create a natural cathedral of green.', projectImages: ['https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=1200&q=80'] },
  { _id: '4', title: 'Daisy Field', category: 'Nature', imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80', aspectRatio: 'landscape', description: 'A vast field of wild daisies swaying gently in the summer breeze. This image captures the simple beauty of nature in full bloom.' },
  { _id: '5', title: 'Mountain Lake', category: 'Landscape', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', aspectRatio: 'landscape', description: 'Crystal clear alpine waters reflecting the majestic peaks above. Shot at dawn to capture the perfect mirror reflection.', projectImages: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80', 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80'] },
  { _id: '6', title: 'Birds in Flight', category: 'Nature', imageUrl: 'https://images.unsplash.com/photo-1480044965905-02098d419e96?w=800&q=80', aspectRatio: 'landscape', description: 'Pelicans soaring gracefully against an overcast sky. A study in motion and natural elegance.' },
  { _id: '7', title: 'Historic Building', category: 'Architecture', imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', aspectRatio: 'landscape', description: 'A beautifully preserved historic facade showcasing classical architectural elements and craftsmanship from a bygone era.' },
  { _id: '8', title: 'Crow Portrait', category: 'Nature', imageUrl: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&q=80', aspectRatio: 'portrait', description: 'An intimate portrait of a crow, revealing the intelligence and character in its eyes. Shot with a shallow depth of field to isolate the subject.' },
  { _id: '9', title: 'Beach Driftwood', category: 'Landscape', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', aspectRatio: 'landscape', description: 'Weathered driftwood resting on pristine white sand, telling stories of ocean journeys and the passage of time.' },
  { _id: '10', title: 'Flower Bud', category: 'Nature', imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80', aspectRatio: 'portrait', description: 'The quiet promise of a flower about to bloom. A meditation on potential and the beauty of anticipation.' },
  { _id: '11', title: 'Modern Architecture', category: 'Architecture', imageUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80', aspectRatio: 'portrait', description: 'Bold geometric patterns of contemporary architecture. The interplay of light and shadow creates a dynamic visual rhythm.', projectImages: ['https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80', 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1200&q=80'] },
  { _id: '12', title: 'City Skyline', category: 'Landscape', imageUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&q=80', aspectRatio: 'landscape', description: 'The urban landscape at twilight, when city lights begin to sparkle against the fading sky.' },
  { _id: '13', title: 'Abstract Lights', category: 'Abstract', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', aspectRatio: 'landscape', description: 'An exploration of light, color, and motion. Long exposure techniques transform ordinary lights into abstract art.' },
  { _id: '14', title: 'Castle on Hill', category: 'Architecture', imageUrl: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800&q=80', aspectRatio: 'landscape', description: 'A fairytale castle perched dramatically on a hilltop, evoking centuries of history and legend.' },
  { _id: '15', title: 'Deer in Mist', category: 'Nature', imageUrl: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?w=800&q=80', aspectRatio: 'landscape', description: 'A solitary deer emerging from the morning mist. A fleeting moment of wild beauty captured in soft, ethereal light.' },
  { _id: '16', title: 'Succulent Detail', category: 'Nature', imageUrl: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80', aspectRatio: 'square', description: 'The geometric perfection of a succulent plant. Nature\'s own sacred geometry rendered in shades of green.' },
  { _id: '17', title: 'Lake Tahoe', category: 'Landscape', imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80', aspectRatio: 'landscape', description: 'The legendary clarity of Lake Tahoe\'s waters, framed by pine forests and granite peaks. A testament to nature\'s pristine beauty.' },
  { _id: '18', title: 'NYC Skyline', category: 'Landscape', imageUrl: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=800&q=80', aspectRatio: 'landscape', description: 'The iconic New York City skyline, a symbol of ambition and the endless possibilities of urban life.' },
  { _id: '19', title: 'Ornate Gate', category: 'Architecture', imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80', aspectRatio: 'portrait', description: 'Intricate ironwork of a historic gate, where craftsmanship and artistry meet functional design.' },
  { _id: '20', title: 'Torii Gates', category: 'Architecture', imageUrl: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=800&q=80', aspectRatio: 'portrait', description: 'The famous vermillion torii gates of Fushimi Inari Shrine in Kyoto, creating a mesmerizing tunnel of sacred architecture.', projectImages: ['https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=1200&q=80', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80', 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=80'] },
]

const categories = ['Landscape', 'Architecture', 'Nature', 'Abstract']

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

    gsap.killTweensOf(underlineRef.current)

    if (isActive && !wasActive) {
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
      gsap.set(underlineRef.current, { scaleX: 1 })
    } else {
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

// Masonry Image Card Component with layered effects like homepage video
function MasonryImageCard({ 
  image, 
  onImageClick 
}: { 
  image: StillImage
  onImageClick: (image: StillImage) => void
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleClick = () => {
    onImageClick(image)
  }

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden cursor-pointer group"
      role="button"
      tabIndex={0}
      aria-label={`View ${image.title} project`}
      style={{
        borderRadius: '8px',
        cursor: isHovered ? `url('/click-small.png') 12 12, pointer` : 'pointer',
        breakInside: 'avoid',
        marginBottom: '10px',
        transition: 'box-shadow 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: isHovered 
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.4)' 
          : '0 4px 12px -2px rgba(0, 0, 0, 0.15)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick() }}
    >
      <div className="relative w-full overflow-hidden" style={{ borderRadius: '8px' }}>
        {/* Base Image with CSS filters - desaturated by default, pops on hover */}
        <div
          style={{
            filter: isHovered 
              ? 'contrast(1) brightness(1) saturate(1)' 
              : 'contrast(1.1) brightness(0.95) saturate(0.75)',
            transition: 'filter 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <Image
            src={image.imageUrl}
            alt={image.title}
            width={800}
            height={image.aspectRatio === 'portrait' ? 1200 : image.aspectRatio === 'square' ? 800 : 600}
            className="w-full h-auto object-cover"
            style={{ 
              borderRadius: '8px',
              opacity: imageLoaded ? 1 : 0,
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              transition: 'opacity 0.4s ease, transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onLoad={() => setImageLoaded(true)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        {/* Loading placeholder */}
        {!imageLoaded && (
          <div 
            className="absolute inset-0 bg-white/10 animate-pulse"
            style={{ borderRadius: '8px' }}
          />
        )}

        {/* Overlay layers - only visible after image loads */}
        {imageLoaded && (
          <>
            {/* Layer 1: Color Tint Overlay (multiply blend) */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{ 
                borderRadius: '8px',
                backgroundColor: '#3AAAFF',
                mixBlendMode: 'multiply',
                opacity: isHovered ? 0 : 0.25,
                transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            />

            {/* Layer 2: Dot Grid Pattern */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{ 
                borderRadius: '8px',
                backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                backgroundSize: '6px 6px',
                opacity: isHovered ? 0 : 0.2,
                transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            />

            {/* Layer 3: Halftone/Risograph Pattern */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{ 
                borderRadius: '8px',
                backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.8) 1px, transparent 1px)`,
                backgroundSize: '4px 4px',
                mixBlendMode: 'multiply',
                opacity: isHovered ? 0 : 0.15,
                transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            />

            {/* Layer 4: Subtle vignette */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{ 
                borderRadius: '8px',
                background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)',
                opacity: isHovered ? 0 : 0.5,
                transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            />
          </>
        )}
      </div>

      {/* Hover Info Overlay - slides up */}
      <div 
        className="absolute inset-0 flex flex-col justify-end p-5"
        style={{ 
          borderRadius: '8px',
          background: isHovered 
            ? 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)'
            : 'transparent',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), background 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <div
          style={{
            transform: isHovered ? 'translateY(0)' : 'translateY(16px)',
            opacity: isHovered ? 1 : 0,
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            transitionDelay: isHovered ? '0.15s' : '0s'
          }}
        >
          <h3
            className="text-white text-lg font-bold mb-1 drop-shadow-lg"
            style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
          >
            {image.title}
          </h3>
          <div 
            className="flex gap-3 text-sm text-white/90"
            style={{
              transform: isHovered ? 'translateY(0)' : 'translateY(8px)',
              opacity: isHovered ? 1 : 0,
              transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              transitionDelay: isHovered ? '0.2s' : '0s'
            }}
          >
            <span style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
              {image.category}
            </span>
            {image.location && (
              <span style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
                {image.location}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Generate placeholder gallery images for a project
function generateProjectGallery(baseImage: StillImage): string[] {
  // Generate 23 varied Unsplash images based on category - using reliable image IDs
  const categoryImages: Record<string, string[]> = {
    'Nature': [
      '1441974231531-c6227db76b6e', '1470071459604-3b5ec3a7fe05', '1469474968028-56623f02e42e',
      '1447752875215-b2761acb3c5d', '1433086966358-54859d0ed716', '1482938289607-e9573fc25ebb',
      '1472214103451-9374bd1c798e', '1465146344425-f00d5f5c8f07', '1501785888041-af3ef285b470', 
      '1518495973542-4542c06a5843', '1475924156734-496f6cac6ec1', '1509316975850-ff9c5deb0cd9', 
      '1504567961542-e24d9439a724', '1426604966848-d7adac402bff', '1439853949127-fa647f28b7ce', 
      '1470252649378-9c29740c9fa8', '1464822759023-fed622ff2c3b', '1506905925346-21bda4d32df4', 
      '1519681393784-d120267933ba', '1454496522488-7a8e488e8606', '1468276311594-df7cb65d8df6', 
      '1485470733090-0aae1788d5af', '1490750967868-88aa4486c946'
    ],
    'Architecture': [
      '1486325212027-8081e485255e', '1545558014-8692077e9b5c', '1487958449943-2429e8be8625',
      '1479839672679-a46483c0e7c8', '1431576901776-e539bd916ba2', '1488972685288-c3fd157d7c7a',
      '1518005020951-eccb494ad742', '1493397212122-2b85dda8106b', '1512917774080-9991f1c4c750', 
      '1464938050520-ef2571e293c3', '1496568816309-51d7c20e3b21', '1519710164239-da123dc03ef4',
      '1502005229762-cf1b2da7c5d6', '1504384308090-c894fdcc538d', '1481026469463-66327c86e544', 
      '1477959858617-67f85cf4f1df', '1460317442991-0ec209397118', '1486406146926-c627a92ad1ab',
      '1449844908441-8829872d2607', '1416331108676-a22ccb276e35', '1480714378408-67cf0d13bc1b',
      '1478860409698-8707f313ee8b', '1496442226666-8d4d0e62e6e9'
    ],
    'Landscape': [
      '1506905925346-21bda4d32df4', '1464822759023-fed622ff2c3b', '1519681393784-d120267933ba',
      '1454496522488-7a8e488e8606', '1468276311594-df7cb65d8df6', '1485470733090-0aae1788d5af',
      '1472214103451-9374bd1c798e', '1465146344425-f00d5f5c8f07', '1501785888041-af3ef285b470', 
      '1518495973542-4542c06a5843', '1475924156734-496f6cac6ec1', '1509316975850-ff9c5deb0cd9', 
      '1504567961542-e24d9439a724', '1426604966848-d7adac402bff', '1439853949127-fa647f28b7ce', 
      '1470252649378-9c29740c9fa8', '1441974231531-c6227db76b6e', '1470071459604-3b5ec3a7fe05', 
      '1469474968028-56623f02e42e', '1447752875215-b2761acb3c5d', '1433086966358-54859d0ed716', 
      '1482938289607-e9573fc25ebb', '1507525428034-b723cf961d3e'
    ],
    'Abstract': [
      '1550684376-efcbd6e3f031', '1557672172-298e090bd0f1', '1518640467707-6811f4a6ab73', 
      '1558591710-4b4a1ae0f04d', '1553356084-58ef4a67b2a7', '1579546929518-9e396f3cc809',
      '1557682250-6a9b6c5e8e82', '1558470598-a5dda9640f68', '1557682224-5b8590cd9ec5',
      '1558591710-4b4a1ae0f04d', '1553356084-58ef4a67b2a7', '1579546929518-9e396f3cc809',
      '1557682250-6a9b6c5e8e82', '1558470598-a5dda9640f68', '1557682224-5b8590cd9ec5',
      '1550684376-efcbd6e3f031', '1557672172-298e090bd0f1', '1518640467707-6811f4a6ab73',
      '1558591710-4b4a1ae0f04d', '1553356084-58ef4a67b2a7', '1579546929518-9e396f3cc809',
      '1557682250-6a9b6c5e8e82', '1558470598-a5dda9640f68'
    ]
  }
  
  const images = categoryImages[baseImage.category] || categoryImages['Nature']
  return images.slice(0, 23).map(id => `https://images.unsplash.com/photo-${id}?w=800&q=80`)
}

// Project Detail Side Panel Component
function ProjectDetailPanel({
  image,
  isOpen,
  onClose,
}: {
  image: StillImage | null
  isOpen: boolean
  onClose: () => void
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxImage) {
          setLightboxImage(null)
        } else {
          onClose()
        }
      }
      // Arrow key navigation in lightbox
      if (lightboxImage && image) {
        const galleryImages = generateProjectGallery(image)
        if (e.key === 'ArrowRight') {
          const nextIndex = (lightboxIndex + 1) % galleryImages.length
          setLightboxIndex(nextIndex)
          setLightboxImage(galleryImages[nextIndex])
        }
        if (e.key === 'ArrowLeft') {
          const prevIndex = (lightboxIndex - 1 + galleryImages.length) % galleryImages.length
          setLightboxIndex(prevIndex)
          setLightboxImage(galleryImages[prevIndex])
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose, lightboxImage, lightboxIndex, image])

  useEffect(() => {
    if (!panelRef.current || !backdropRef.current) return

    if (isOpen) {
      // Animate backdrop
      gsap.fromTo(backdropRef.current, 
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      )
      // Animate panel sliding in
      gsap.fromTo(panelRef.current,
        { x: '100%' },
        { x: '0%', duration: 0.5, ease: 'power3.out' }
      )
      // Stagger content elements
      if (contentRef.current) {
        const elements = contentRef.current.querySelectorAll('.animate-in')
        gsap.fromTo(elements,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, delay: 0.3, ease: 'power2.out' }
        )
      }
      // Animate gallery images
      if (galleryRef.current) {
        const images = galleryRef.current.querySelectorAll('.gallery-image')
        gsap.fromTo(images,
          { opacity: 0, y: 30, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.03, delay: 0.4, ease: 'power2.out' }
        )
      }
    }
  }, [isOpen])

  // Reset lightbox when panel closes
  useEffect(() => {
    if (!isOpen) {
      setLightboxImage(null)
      setLightboxIndex(0)
    }
  }, [isOpen])

  const handleClose = () => {
    if (!panelRef.current || !backdropRef.current) {
      onClose()
      return
    }

    // Animate out
    gsap.to(panelRef.current, {
      x: '100%',
      duration: 0.35,
      ease: 'power3.in'
    })
    gsap.to(backdropRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: onClose
    })
  }

  const handleImageClick = (imgUrl: string, idx: number) => {
    setLightboxImage(imgUrl)
    setLightboxIndex(idx)
  }

  if (!isOpen || !image) return null

  // Generate 23 gallery images for the project
  const galleryImages = generateProjectGallery(image)

  return (
    <>
      {/* Backdrop */}
      <div 
        ref={backdropRef}
        className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Side Panel - 80% width */}
      <div 
        ref={panelRef}
        className="fixed top-0 right-0 h-full z-[101] bg-[#0a0a0a] shadow-2xl overflow-hidden"
        style={{ width: '80vw' }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Scrollable content */}
        <div ref={contentRef} className="h-full overflow-y-auto">
          {/* Header with Title and Description */}
          <div className="px-8 md:px-12 lg:px-16 pt-8 pb-6">
            {/* Category tag */}
            <div className="animate-in">
              <span 
                className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#3AAAFF] text-white rounded-full"
                style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
              >
                {image.category}
              </span>
            </div>

            {/* Title */}
            <h2 
              className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight animate-in"
              style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
            >
              {image.title}
            </h2>

            {/* Location/Year if available */}
            {(image.location || image.year) && (
              <p 
                className="mt-3 text-white/50 text-base animate-in"
                style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
              >
                {image.location && image.location}
                {image.location && image.year && ' · '}
                {image.year && image.year}
              </p>
            )}

            {/* Description */}
            {image.description && (
              <p 
                className="mt-4 text-white/70 text-lg leading-relaxed max-w-3xl animate-in"
                style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
              >
                {image.description}
              </p>
            )}
          </div>

          {/* Masonry Gallery - 2 columns */}
          <div 
            ref={galleryRef}
            className="px-8 md:px-12 lg:px-16 pb-12"
          >
            <div
              style={{
                columnCount: 2,
                columnGap: '16px',
              }}
            >
              {galleryImages.map((imgUrl, idx) => (
                <div 
                  key={idx} 
                  className="gallery-image mb-4 overflow-hidden rounded-lg cursor-pointer"
                  style={{ breakInside: 'avoid' }}
                  onClick={() => handleImageClick(imgUrl, idx)}
                >
                  <Image
                    src={imgUrl}
                    alt={`${image.title} - Image ${idx + 1}`}
                    width={600}
                    height={idx % 3 === 0 ? 900 : idx % 3 === 1 ? 600 : 750}
                    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                    sizes="40vw"
                  />
                </div>
              ))}
            </div>

            {/* Image count */}
            <p 
              className="mt-8 text-white/40 text-sm text-center"
              style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
            >
              {galleryImages.length} images in this project
            </p>
          </div>
        </div>

        {/* Lightbox inside panel */}
        {lightboxImage && (
          <div 
            className="absolute inset-0 z-20 bg-black/95 flex items-center justify-center"
            onClick={() => setLightboxImage(null)}
          >
            {/* Close lightbox button */}
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Previous button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                const prevIndex = (lightboxIndex - 1 + galleryImages.length) % galleryImages.length
                setLightboxIndex(prevIndex)
                setLightboxImage(galleryImages[prevIndex])
              }}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Image */}
            <div 
              className="relative max-w-[90%] max-h-[90%]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightboxImage.replace('w=800', 'w=1600')}
                alt={`${image.title} - Image ${lightboxIndex + 1}`}
                width={1600}
                height={1200}
                className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-lg"
                priority
              />
              
              {/* Image counter */}
              <p 
                className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm bg-black/50 px-4 py-2 rounded-full"
                style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
              >
                {lightboxIndex + 1} / {galleryImages.length}
              </p>
            </div>

            {/* Next button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                const nextIndex = (lightboxIndex + 1) % galleryImages.length
                setLightboxIndex(nextIndex)
                setLightboxImage(galleryImages[nextIndex])
              }}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export function StillsPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [images] = useState<StillImage[]>(placeholderImages)
  const [selectedImage, setSelectedImage] = useState<StillImage | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const galleryRef = useRef<HTMLDivElement>(null)
  const hasAnimatedInitial = useRef(false)
  const previousActiveIndexRef = useRef<number | null>(null)
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right' | null>(null)

  const handleContactToggle = () => {
    setShowContactForm(prev => !prev)
  }

  // Helper function to get button index
  const getButtonIndex = (category: string | null): number => {
    if (category === null) return 0
    return categories.findIndex(c => c === category) + 1
  }

  // Handle category change with direction tracking
  const handleCategoryChange = (newCategory: string | null) => {
    const currentIndex = getButtonIndex(activeCategory)
    const newIndex = getButtonIndex(newCategory)
    
    if (activeCategory === newCategory) {
      previousActiveIndexRef.current = null
      setActiveCategory(null)
      setAnimationDirection(null)
      return
    }
    
    let direction: 'left' | 'right' | null = null
    if (previousActiveIndexRef.current !== null) {
      if (newIndex > previousActiveIndexRef.current) {
        direction = 'right'
      } else if (newIndex < previousActiveIndexRef.current) {
        direction = 'left'
      }
    } else {
      direction = 'right'
    }
    
    setAnimationDirection(direction)
    previousActiveIndexRef.current = newIndex
    setActiveCategory(newCategory)
  }

  // Filter images based on active category
  const filteredImages = activeCategory 
    ? images.filter(img => img.category === activeCategory)
    : images

  // Handle image click - open lightbox
  const handleImageClick = (image: StillImage) => {
    const index = filteredImages.findIndex(img => img._id === image._id)
    setSelectedImage(image)
    setSelectedIndex(index)
    setIsLightboxOpen(true)
  }

  // Lightbox navigation
  const handleNextImage = () => {
    const nextIndex = (selectedIndex + 1) % filteredImages.length
    setSelectedIndex(nextIndex)
    setSelectedImage(filteredImages[nextIndex])
  }

  const handlePrevImage = () => {
    const prevIndex = (selectedIndex - 1 + filteredImages.length) % filteredImages.length
    setSelectedIndex(prevIndex)
    setSelectedImage(filteredImages[prevIndex])
  }

  const handleCloseLightbox = () => {
    setIsLightboxOpen(false)
    setTimeout(() => {
      setSelectedImage(null)
    }, 300)
  }

  // Helper: Group elements by their visual column position
  const getColumnGroups = (elements: NodeListOf<Element>) => {
    const items = Array.from(elements)
    if (items.length === 0) return []
    
    // Get left positions and group by column
    const positions = items.map((el, index) => ({
      el,
      index,
      left: el.getBoundingClientRect().left,
      top: el.getBoundingClientRect().top
    }))
    
    // Find unique column positions (with small tolerance for rounding)
    const columnLefts: number[] = []
    positions.forEach(item => {
      const existing = columnLefts.find(left => Math.abs(left - item.left) < 10)
      if (!existing) columnLefts.push(item.left)
    })
    columnLefts.sort((a, b) => a - b)
    
    // Group items by column, sorted by top position within each column
    const columns: Element[][] = columnLefts.map(() => [])
    positions.forEach(item => {
      const colIndex = columnLefts.findIndex(left => Math.abs(left - item.left) < 10)
      if (colIndex !== -1) columns[colIndex].push(item.el)
    })
    
    // Sort each column by vertical position
    columns.forEach(col => {
      col.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)
    })
    
    return columns
  }

  // Initial page load animation - columns animate together, items cascade within
  useEffect(() => {
    if (!galleryRef.current || hasAnimatedInitial.current) return

    const imageElements = galleryRef.current.querySelectorAll('.masonry-item')
    if (imageElements.length === 0) return

    // Set initial state - dramatic with slight random offsets per item
    Array.from(imageElements).forEach((el, i) => {
      const randomRotate = (Math.random() - 0.5) * 8 // -4 to 4 degrees
      const randomX = (Math.random() - 0.5) * 30 // -15 to 15px
      gsap.set(el, { 
        opacity: 0, 
        y: 100 + Math.random() * 40, // 100-140px
        x: randomX,
        scale: 0.8,
        rotation: randomRotate,
        filter: 'blur(10px)',
        transformOrigin: 'center center'
      })
    })

    requestAnimationFrame(() => {
      const columns = getColumnGroups(imageElements)
      
      // Create master timeline
      const tl = gsap.timeline({
        onComplete: () => {
          hasAnimatedInitial.current = true
          gsap.set(imageElements, { clearProps: 'filter,rotation,x' })
        }
      })

      // Animate all columns at the same time, but stagger within each column
      columns.forEach((columnItems) => {
        columnItems.forEach((el, indexInColumn) => {
          tl.to(el, {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            rotation: 0,
            filter: 'blur(0px)',
            duration: 0.8,
            ease: 'power3.out',
          }, indexInColumn * 0.12) // Offset within column only
        })
      })
    })
  }, [images])

  // Animate gallery when category changes - columns sync, cascade within
  useEffect(() => {
    if (!galleryRef.current || !hasAnimatedInitial.current) return

    const imageElements = galleryRef.current.querySelectorAll('.masonry-item')
    if (imageElements.length === 0) return

    gsap.killTweensOf(imageElements)
    
    // Set initial state with slight offsets
    Array.from(imageElements).forEach((el) => {
      const randomRotate = (Math.random() - 0.5) * 6
      const randomX = (Math.random() - 0.5) * 20
      gsap.set(el, { 
        opacity: 0, 
        y: 60 + Math.random() * 20,
        x: randomX,
        scale: 0.88,
        rotation: randomRotate,
        filter: 'blur(6px)'
      })
    })

    requestAnimationFrame(() => {
      const columns = getColumnGroups(imageElements)
      
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(imageElements, { clearProps: 'filter,rotation,x' })
        }
      })

      // All columns start together, items within each column cascade down
      columns.forEach((columnItems) => {
        columnItems.forEach((el, indexInColumn) => {
          tl.to(el, {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            rotation: 0,
            filter: 'blur(0px)',
            duration: 0.55,
            ease: 'back.out(1.4)',
          }, indexInColumn * 0.08) // Vertical stagger within column
        })
      })
    })

    return () => {
      gsap.killTweensOf(imageElements)
    }
  }, [filteredImages])

  return (
    <div className="min-h-screen bg-[#FFF9DF] flex flex-col">
      <Header />

      {/* Main Content Area - Blue Background */}
      <div className="flex-1 bg-[#3AAAFF]">
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

        {/* Masonry Gallery Section */}
        <section className="px-5 pb-12 md:pb-16">
          <div 
            ref={galleryRef}
            className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4"
            style={{ columnGap: '10px' }}
          >
            {filteredImages.map((image) => (
              <div key={image._id} className="masonry-item">
                <MasonryImageCard 
                  image={image}
                  onImageClick={handleImageClick}
                />
              </div>
            ))}
          </div>

          {/* Show message if no images match filter */}
          {filteredImages.length === 0 && (
            <div className="text-center py-20">
              <p 
                className="text-white text-xl"
                style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
              >
                No images found for this category.
              </p>
            </div>
          )}
        </section>

        {/* Project Detail Side Panel */}
        <ProjectDetailPanel
          image={selectedImage}
          isOpen={isLightboxOpen}
          onClose={handleCloseLightbox}
        />

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

