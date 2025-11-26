'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { VideoWithShader } from '@/components/VideoWithShader'
import { DotGridOverlay } from '@/components/DotGridOverlay'
import { Volume2, VolumeX, Settings } from 'lucide-react'

export function PenguinLandingPage() {
  const [isMuted, setIsMuted] = useState(true)
  const [shaderEffect, setShaderEffect] = useState(1) // Tritone effect
  const [showControls, setShowControls] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [videoKey, setVideoKey] = useState(0)
  
  // Configurable parameters for video
  const [videoUrl, setVideoUrl] = useState("/got.mp4")
  
  // Video adjustment parameters
  const [videoParams, setVideoParams] = useState({
    contrast: 1.3,
    brightness: 0.95,
    saturation: 1.0,
    hue: 0,
    overlayOpacity: 0.3,
    overlayColor: '#C64B2C', // RGB(198, 75, 44)
    overlayBlendMode: 'multiply' as const,
    halftoneSize: 2.5,
    posterizationLevels: 5,
    grainAmount: 0.03,
    edgeRoughness: 0.15
  })

  // Fetch video URL from Sanity on mount
  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        const response = await fetch('/api/hero-video')
        if (response.ok) {
          const data = await response.json()
          if (data.videoUrl) {
            setVideoUrl(data.videoUrl)
          }
        }
      } catch (error) {
        console.warn('⚠️ Failed to fetch video from Sanity:', error)
      }
    }
    fetchVideoUrl()
  }, [])

  // Callback from VideoWithShader when video effect is ready
  const handleVideoReady = () => {
    console.log('✅ Video shader is ready, fading in page')
    // Small additional delay to ensure everything is rendered
    setTimeout(() => {
      setIsLoaded(true)
    }, 300)
  }

  // Reset loaded state when shader effect changes
  useEffect(() => {
    console.log('🔄 Shader effect changed, resetting loaded state')
    setIsLoaded(false)
    setVideoKey(prev => prev + 1)
  }, [shaderEffect])

  // Fallback: If video doesn't load within 3 seconds, show the page anyway
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (!isLoaded) {
        console.warn('⚠️ Video load timeout, showing page anyway')
        setIsLoaded(true)
      }
    }, 3000)
    return () => clearTimeout(fallbackTimer)
  }, [isLoaded, videoKey])

  // Keyboard shortcut: 'c' to toggle controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'c' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault()
        setShowControls(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="h-screen bg-[#FFF9DF] flex flex-col overflow-hidden relative">
      {/* Loading overlay - starts black (from fade), stays until video is ready */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-700 ease-in-out ${
          isLoaded ? 'opacity-0 pointer-events-none z-[-1]' : 'opacity-100 z-50'
        }`}
      />
      {/* Header Section - Responsive height */}
      <header className="relative z-30 bg-[#FFF9DF] flex flex-col" style={{ minHeight: 'clamp(100px, calc(15vh - 50px), 150px)' }}>
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 pt-2 sm:pt-3 md:pt-4 pb-4 sm:pb-5 md:pb-6">
          {/* Logo - Top Left - Responsive - 1.3x bigger */}
          <Link 
            href="/"
            className="inline-flex"
          >
            <div className="relative h-[39px] w-[156px] sm:h-[52px] sm:w-[208px] md:h-[65px] md:w-[260px]">
              <Image 
                src="/penguinlogo.png" 
                alt="SECTA" 
                fill
                className="object-contain object-left"
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
            {/* Navigation - Right aligned between the lines - 10px padding */}
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
                <span className="relative z-10 text-black group-hover:text-white transition-colors duration-300">
                  Motion
                </span>
                <div 
                  className="absolute bottom-0 left-0 right-0 h-full bg-[#3AAAFF] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
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

      {/* Tagline Band - With dynamic right padding (100px-500px based on screen size) */}
      <div className="relative z-20 bg-[#FFF9DF]">
        <div className="pl-10 py-10" style={{ paddingRight: 'clamp(100px, 25vw, 500px)' }}>
          <h1 
            className="text-black leading-tight text-left"
            style={{ 
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', 
              fontWeight: 'bold',
              fontSize: 'clamp(40px, 8vw, 96px)',
              letterSpacing: '-0.5px'
            }}
          >
            We make graphics and visual content for social and experiential.
          </h1>
        </div>
        {/* Bold orange/red stroke directly below text - full width - 3x taller */}
        <div className="absolute bottom-0 w-full h-[9px] sm:h-[12px] bg-[#C64B2C]"></div>
      </div>

      {/* Hero Video Section - Remaining viewport */}
      <div className="relative overflow-hidden flex-1" style={{ backgroundColor: '#5A3629' }}>
        {/* Video Background - Adjustable filters */}
        <div 
          className="absolute inset-0 z-0" 
          style={{ 
            filter: `contrast(${videoParams.contrast}) brightness(${videoParams.brightness}) saturate(${videoParams.saturation}) hue-rotate(${videoParams.hue}deg)`
          }}
        >
          <VideoWithShader 
            key={`video-${videoKey}`}
            videoUrl={videoUrl}
            effect={shaderEffect}
            isMuted={isMuted}
            onReady={handleVideoReady}
          />
        </div>

        {/* Color tint overlay - Adjustable */}
        <div 
          className="absolute inset-0 z-5 pointer-events-none"
          style={{ 
            backgroundColor: videoParams.overlayColor,
            opacity: videoParams.overlayOpacity,
            mixBlendMode: videoParams.overlayBlendMode
          }}
        ></div>

        {/* Dot Grid Overlay */}
        <DotGridOverlay 
          dotSize={0.3}
          spacing={6}
          opacity={0.15}
          dotColor="rgba(255, 255, 255, 0.63)"
        />

        {/* Coarse Halftone Pattern - Risograph/Newspaper Style */}
        <div 
          className="absolute inset-0 z-15 pointer-events-none opacity-[0.3] mix-blend-multiply"
          style={{
            backgroundImage: `radial-gradient(circle, black 30%, transparent 90%), radial-gradient(circle, black 30%, transparent 30%)`,
            backgroundSize: '5px 5px',
            backgroundPosition: '0 0, 4px 4px',
            backgroundRepeat: 'repeat'
          }}
        />
        
        {/* Additional noise layer for gritty, photocopied texture */}
        <div 
          className="absolute inset-0 z-16 pointer-events-none opacity-[0.15]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Video Controls Panel - Press 'c' to toggle */}
        {showControls && (
          <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-white text-sm w-80 max-h-[90vh] overflow-y-auto z-50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Video Controls</h2>
              <button
                onClick={() => setShowControls(false)}
                className="text-white/60 hover:text-white text-xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* Effect Selection */}
              <div>
                <h3 className="text-xs uppercase tracking-wider text-white/60 mb-2">Shader Effect</h3>
                <select
                  value={shaderEffect}
                  onChange={(e) => setShaderEffect(parseInt(e.target.value))}
                  className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-sm"
                >
                  <option value={0}>None</option>
                  <option value={1}>Tritone</option>
                  <option value={2}>Split-tone</option>
                  <option value={3}>Solarization</option>
                  <option value={4}>Screen Print</option>
                  <option value={5}>Cyanotype</option>
                </select>
              </div>

              {/* Video Filters */}
              <div>
                <h3 className="text-xs uppercase tracking-wider text-white/60 mb-2">Video Filters</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs mb-1">
                      Contrast: {videoParams.contrast.toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.05"
                      value={videoParams.contrast}
                      onChange={(e) => setVideoParams({...videoParams, contrast: parseFloat(e.target.value)})}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">
                      Brightness: {videoParams.brightness.toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="1.5"
                      step="0.05"
                      value={videoParams.brightness}
                      onChange={(e) => setVideoParams({...videoParams, brightness: parseFloat(e.target.value)})}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">
                      Saturation: {videoParams.saturation.toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.05"
                      value={videoParams.saturation}
                      onChange={(e) => setVideoParams({...videoParams, saturation: parseFloat(e.target.value)})}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">
                      Hue Rotate: {videoParams.hue}°
                    </label>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      step="5"
                      value={videoParams.hue}
                      onChange={(e) => setVideoParams({...videoParams, hue: parseInt(e.target.value)})}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Overlay Settings */}
              <div>
                <h3 className="text-xs uppercase tracking-wider text-white/60 mb-2">Color Overlay</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs mb-1">
                      Color: {videoParams.overlayColor}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={videoParams.overlayColor}
                        onChange={(e) => setVideoParams({...videoParams, overlayColor: e.target.value})}
                        className="w-12 h-8 rounded cursor-pointer bg-transparent border border-white/20"
                      />
                      <input
                        type="text"
                        value={videoParams.overlayColor}
                        onChange={(e) => {
                          const value = e.target.value
                          if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                            setVideoParams({...videoParams, overlayColor: value})
                          }
                        }}
                        placeholder="#C64B2C"
                        maxLength={7}
                        className="flex-1 bg-white/10 border border-white/20 rounded px-3 py-1.5 text-sm font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs mb-1">
                      Opacity: {videoParams.overlayOpacity.toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={videoParams.overlayOpacity}
                      onChange={(e) => setVideoParams({...videoParams, overlayOpacity: parseFloat(e.target.value)})}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Blend Mode</label>
                    <select
                      value={videoParams.overlayBlendMode}
                      onChange={(e) => setVideoParams({...videoParams, overlayBlendMode: e.target.value as any})}
                      className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-sm"
                    >
                      <option value="normal">Normal</option>
                      <option value="multiply">Multiply</option>
                      <option value="screen">Screen</option>
                      <option value="overlay">Overlay</option>
                      <option value="soft-light">Soft Light</option>
                      <option value="hard-light">Hard Light</option>
                      <option value="color">Color</option>
                      <option value="color-dodge">Color Dodge</option>
                      <option value="color-burn">Color Burn</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Effect Parameters (for Cyanotype) */}
              {shaderEffect === 5 && (
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-white/60 mb-2">Halftone Settings</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs mb-1">
                        Halftone Size: {videoParams.halftoneSize.toFixed(1)}
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="0.5"
                        value={videoParams.halftoneSize}
                        onChange={(e) => setVideoParams({...videoParams, halftoneSize: parseFloat(e.target.value)})}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">
                        Posterization Levels: {videoParams.posterizationLevels}
                      </label>
                      <input
                        type="range"
                        min="2"
                        max="8"
                        step="1"
                        value={videoParams.posterizationLevels}
                        onChange={(e) => setVideoParams({...videoParams, posterizationLevels: parseInt(e.target.value)})}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">
                        Grain Amount: {videoParams.grainAmount.toFixed(2)}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="0.2"
                        step="0.01"
                        value={videoParams.grainAmount}
                        onChange={(e) => setVideoParams({...videoParams, grainAmount: parseFloat(e.target.value)})}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">
                        Edge Roughness: {videoParams.edgeRoughness.toFixed(2)}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="0.5"
                        step="0.05"
                        value={videoParams.edgeRoughness}
                        onChange={(e) => setVideoParams({...videoParams, edgeRoughness: parseFloat(e.target.value)})}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Info */}
              <div className="pt-3 border-t border-white/20">
                <p className="text-xs text-white/40">Press 'C' to toggle controls</p>
              </div>
            </div>
          </div>
        )}

        {/* Mute/Unmute button - bottom left - Responsive */}
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8 z-20 p-2 hover:opacity-70 transition-opacity duration-300 cursor-pointer mix-blend-difference"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          ) : (
            <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          )}
        </button>

        {/* Video Controls Toggle Button - bottom right */}
        <button 
          onClick={() => setShowControls(!showControls)}
          className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-20 p-2 hover:opacity-70 transition-opacity duration-300 cursor-pointer mix-blend-difference"
          aria-label="Toggle video controls"
        >
          <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>
      </div>
    </div>
  )
}
