'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { VideoWithShader } from '@/components/VideoWithShader'
import { DotGridOverlay } from '@/components/DotGridOverlay'
import { InteractiveSphere } from '@/components/InteractiveSphere'
import { Volume2, VolumeX, Settings, X } from 'lucide-react'
import { Header } from './Header'

export function PenguinLandingPage() {
  const [isMuted, setIsMuted] = useState(true)
  const [shaderEffect, setShaderEffect] = useState(1) // Tritone effect
  const [showControls, setShowControls] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [videoKey, setVideoKey] = useState(0)
  
  // Contact form state
  const [showContactForm, setShowContactForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  
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
    <div className="bg-[#FFF9DF] flex flex-col relative">
      {/* Loading overlay - starts black (from fade), stays until video is ready */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-700 ease-in-out ${
          isLoaded ? 'opacity-0 pointer-events-none z-[-1]' : 'opacity-100 z-50'
        }`}
      />
      
      {/* Above the Fold - Exactly 100vh */}
      <div className="h-screen flex flex-col">
        {/* Top Section - Header and Tagline */}
        <div className="relative bg-[#FFF9DF] flex flex-col">
          <Header />

          {/* Tagline Band - With same padding as MotionPage */}
          <div className="relative z-20 bg-[#FFF9DF]">
            <div className="px-5 pt-1 pb-3 md:pt-2 md:pb-4 lg:pt-2 lg:pb-5">
              <h1 
                className="text-black leading-tight text-left"
                style={{ 
                  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', 
                  fontWeight: 'bold', 
                  fontSize: 'clamp(25px, 5vw, 65px)',
                  letterSpacing: '-0.5px',
                  lineHeight: '1.1'
                }}
              >
                <span className="block">We make graphics and visual content for social and experiential.</span>
              </h1>
            </div>
            {/* Bold orange/red stroke directly below text - full width */}
            <div className="w-full h-[9px] sm:h-[12px] bg-[#C64B2C]"></div>
          </div>
        </div>

        {/* Hero Video Section - Fills remaining viewport height */}
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

      {/* Footer - Always below the fold (scroll to see) */}
      <footer className="bg-[#FFF9DF] py-8 md:py-12 px-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p 
              className="text-black"
              style={{ 
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSize: 'clamp(14px, 1.5vw, 18px)'
              }}
            >
              © {new Date().getFullYear()} SECTA. All rights reserved.
            </p>
          </div>
          <nav className="flex gap-6">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-black hover:text-[#C64B2C] transition-colors"
              style={{ 
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSize: 'clamp(14px, 1.5vw, 18px)'
              }}
            >
              Instagram
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-black hover:text-[#C64B2C] transition-colors"
              style={{ 
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSize: 'clamp(14px, 1.5vw, 18px)'
              }}
            >
              LinkedIn
            </a>
            <button 
              onClick={() => setShowContactForm(true)}
              className="text-black hover:text-[#C64B2C] transition-colors cursor-pointer"
              style={{ 
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSize: 'clamp(14px, 1.5vw, 18px)',
                background: 'none',
                border: 'none'
              }}
            >
              Contact
            </button>
          </nav>
        </div>
      </footer>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60"
            onClick={() => {
              setShowContactForm(false)
              setSubmitStatus('idle')
            }}
          />
          
          {/* Modal */}
          <div className="relative bg-[#FFF9DF] w-full max-w-lg mx-4 p-8 md:p-10 rounded-lg shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => {
                setShowContactForm(false)
                setSubmitStatus('idle')
              }}
              className="absolute top-4 right-4 text-black hover:opacity-70 transition-opacity"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 
              className="text-2xl md:text-3xl font-bold text-black mb-6"
              style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
            >
              Get in Touch
            </h2>

            {submitStatus === 'success' ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">✓</div>
                <p 
                  className="text-black text-lg"
                  style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                >
                  Thank you! We'll be in touch soon.
                </p>
                <button
                  onClick={() => {
                    setShowContactForm(false)
                    setSubmitStatus('idle')
                    setFormData({ name: '', email: '', message: '' })
                  }}
                  className="mt-6 px-6 py-2 bg-[#C64B2C] text-white rounded hover:opacity-90 transition-opacity"
                  style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                >
                  Close
                </button>
              </div>
            ) : (
              <form 
                action="https://formspree.io/f/meoyzkdq"
                method="POST"
                onSubmit={async (e) => {
                  e.preventDefault()
                  setIsSubmitting(true)
                  
                  try {
                    const response = await fetch('https://formspree.io/f/meoyzkdq', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                      },
                      body: JSON.stringify(formData)
                    })
                    
                    if (response.ok) {
                      setSubmitStatus('success')
                      setFormData({ name: '', email: '', message: '' })
                    } else {
                      setSubmitStatus('error')
                    }
                  } catch (error) {
                    setSubmitStatus('error')
                  } finally {
                    setIsSubmitting(false)
                  }
                }}
                className="space-y-5"
              >
                <div>
                  <label 
                    htmlFor="name" 
                    className="block text-black text-sm font-bold mb-2"
                    style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-black/20 rounded bg-white text-black focus:outline-none focus:border-[#C64B2C] transition-colors"
                    style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label 
                    htmlFor="email" 
                    className="block text-black text-sm font-bold mb-2"
                    style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-black/20 rounded bg-white text-black focus:outline-none focus:border-[#C64B2C] transition-colors"
                    style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label 
                    htmlFor="message" 
                    className="block text-black text-sm font-bold mb-2"
                    style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-black/20 rounded bg-white text-black focus:outline-none focus:border-[#C64B2C] transition-colors resize-none"
                    style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                    placeholder="Tell us about your project..."
                  />
                </div>

                {submitStatus === 'error' && (
                  <p className="text-red-600 text-sm">
                    Something went wrong. Please try again.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#C64B2C] text-white font-bold rounded hover:opacity-90 transition-opacity disabled:opacity-50"
                  style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
