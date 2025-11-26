'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// Placeholder video data - will be replaced with Sanity data
const placeholderVideos = [
  {
    id: 1,
    title: 'Branded Content Example',
    category: 'Branded Content',
    thumbnail: '/placeholder-video-1.jpg',
    videoUrl: '/video-1.mp4'
  },
  {
    id: 2,
    title: 'Scenic Video Example',
    category: 'Scenic Video',
    thumbnail: '/placeholder-video-2.jpg',
    videoUrl: '/video-2.mp4'
  },
  {
    id: 3,
    title: 'Social Media Example',
    category: 'Social Media',
    thumbnail: '/placeholder-video-3.jpg',
    videoUrl: '/video-3.mp4'
  },
  {
    id: 4,
    title: 'Reels Example',
    category: 'Reels',
    thumbnail: '/placeholder-video-4.jpg',
    videoUrl: '/video-4.mp4'
  },
]

const categories = ['Branded Content', 'Scenic Video', 'Social Media', 'Branded Content', 'Reels']

export function MotionPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // Filter videos based on active category (placeholder logic)
  const filteredVideos = activeCategory 
    ? placeholderVideos.filter(video => video.category === activeCategory)
    : placeholderVideos

  return (
    <div className="min-h-screen bg-[#FFF9DF] flex flex-col">
      {/* Header Section */}
      <header className="relative z-30 bg-[#FFF9DF] flex flex-col" style={{ minHeight: 'clamp(100px, calc(15vh - 50px), 150px)' }}>
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 pt-2 sm:pt-3 md:pt-4 pb-4 sm:pb-5 md:pb-6">
          {/* Logo - C Logo - 1.3x bigger */}
          <Link 
            href="/"
            className="inline-flex"
          >
            <div className="relative h-[39px] w-[39px] sm:h-[52px] sm:w-[52px] md:h-[65px] md:w-[65px]">
              <Image 
                src="/c-logo.png" 
                alt="SECTA" 
                fill
                className="object-contain"
              />
            </div>
          </Link>
        </div>

        {/* Two horizontal black stroke lines with navigation between them */}
        <div className="relative mt-auto">
          {/* First stroke line */}
          <div className="w-full h-[2px] bg-black relative z-20"></div>
          
          {/* Space between lines with navigation */}
          <div className="relative h-[50px] sm:h-[55px] md:h-[60px] bg-[#FFF9DF]">
            {/* Navigation - Right aligned between the lines */}
            <nav className="absolute right-4 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 flex items-center gap-6 sm:gap-8 md:gap-12 z-10">
              <Link
                href="/motion"
                className="relative overflow-hidden bg-[#FFF9DF] group"
                style={{ 
                  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', 
                  fontWeight: 'bold', 
                  fontSize: 'clamp(21px, 3vw, 30px)',
                  letterSpacing: '-0.5px',
                  padding: '10px'
                }}
              >
                <span className="relative z-10 text-white transition-colors duration-300">
                  Motion
                </span>
                <div 
                  className="absolute bottom-0 left-0 right-0 h-full bg-[#3AAAFF] transition-transform duration-300 ease-out"
                  style={{ zIndex: 0 }}
                />
              </Link>
              <Link
                href="/stills"
                className="relative overflow-hidden bg-[#FFF9DF] group"
                style={{ 
                  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', 
                  fontWeight: 'bold', 
                  fontSize: 'clamp(21px, 3vw, 30px)',
                  letterSpacing: '-0.5px',
                  padding: '10px'
                }}
              >
                <span className="relative z-10 text-black group-hover:text-white transition-colors duration-300">
                  Stills
                </span>
                <div 
                  className="absolute bottom-0 left-0 right-0 h-full bg-[#C64B2C] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
                  style={{ zIndex: 0 }}
                />
              </Link>
              <Link
                href="/about"
                className="relative overflow-hidden bg-[#FFF9DF] group"
                style={{ 
                  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', 
                  fontWeight: 'bold', 
                  fontSize: 'clamp(21px, 3vw, 30px)',
                  letterSpacing: '-0.5px',
                  padding: '10px'
                }}
              >
                <span className="relative z-10 text-black group-hover:text-white transition-colors duration-300">
                  About
                </span>
                <div 
                  className="absolute bottom-0 left-0 right-0 h-full bg-[#FFAF34] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
                  style={{ zIndex: 0 }}
                />
              </Link>
            </nav>
          </div>
          
          {/* Second stroke line */}
          <div className="w-full h-[2px] bg-black relative z-20"></div>
        </div>
      </header>

      {/* Main Content Area - Burgundy Background for Everything Below Header */}
      <div className="flex-1 bg-[#C64B2C]">
        {/* Hero Section */}
        <section className="px-10 py-12 md:py-16 lg:py-20">
          {/* Large Title */}
          <h1 
            className="text-white mb-8 md:mb-12"
            style={{ 
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', 
              fontWeight: 'bold',
              fontSize: 'clamp(32px, 5vw, 64px)',
              lineHeight: '1.2',
              letterSpacing: '-0.5px'
            }}
          >
            Cinematic storytelling for brands, from hero reels to platform-specific content. We capture, edit, and produce video that stops the scroll and drives engagement.
          </h1>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3 md:gap-4">
            {categories.map((category, index) => (
              <button
                key={`${category}-${index}`}
                onClick={() => setActiveCategory(activeCategory === category ? null : category)}
                className="px-6 py-3 rounded-full border-2 transition-all duration-300"
                style={{
                  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                  fontWeight: 'bold',
                  fontSize: 'clamp(14px, 2vw, 18px)',
                  borderColor: '#FFFFFF',
                  backgroundColor: activeCategory === category ? '#FFAF34' : 'transparent',
                  color: activeCategory === category ? '#000000' : '#FFFFFF',
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Video Gallery Section - 2 Columns with 40px padding */}
        <section className="px-10 pb-12 md:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {filteredVideos.map((video) => (
                <div 
                  key={video.id}
                  className="group relative aspect-video bg-black rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                >
                  {/* Placeholder for video thumbnail */}
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
                </div>
              ))}
          </div>

          {/* Show message if no videos match filter */}
          {filteredVideos.length === 0 && (
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

