'use client'

import { useRef, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { useRouter } from 'next/navigation'
import { Tunnel3D } from '@/components/Tunnel3D'
import Image from 'next/image'

type AnimationState = 'rolling' | 'falling' | 'faded' | 'logo'

export function TunnelEntrance() {
  const router = useRouter()
  const scrollPositionRef = useRef(0)
  const targetScrollRef = useRef(0)
  const [animationState, setAnimationState] = useState<AnimationState>('rolling')
  
  // Physics constants
  const SPHERE_RADIUS = 2
  const PLANE_HALF_LENGTH = 40 // Plane is 80 units long total
  
  // Start in middle, can scroll until sphere center goes past edge
  const MAX_SCROLL = PLANE_HALF_LENGTH + SPHERE_RADIUS * 2 // Allow sphere to go over edge
  const MIN_SCROLL = -(PLANE_HALF_LENGTH + SPHERE_RADIUS * 2)
  
  // Initialize scroll position to center (0)
  useEffect(() => {
    scrollPositionRef.current = 0
    targetScrollRef.current = 0
  }, [])
  
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      
      // Only allow scrolling during rolling state
      if (animationState !== 'rolling') return
      
      // Accumulate scroll delta
      const scrollSpeed = 0.1
      targetScrollRef.current += e.deltaY * scrollSpeed
      
      // Clamp scroll position
      targetScrollRef.current = Math.max(MIN_SCROLL, Math.min(MAX_SCROLL, targetScrollRef.current))
      
      // Check if sphere has gone over the edge of the plane
      // Sphere falls when its center is beyond the plane edge
      if (Math.abs(targetScrollRef.current) > PLANE_HALF_LENGTH) {
        setAnimationState('falling')
      }
    }
    
    // Add wheel event listener with passive: false to allow preventDefault
    window.addEventListener('wheel', handleWheel, { passive: false })
    
    // Prevent touch scrolling on mobile
    const preventTouch = (e: TouchEvent) => {
      if (e.touches.length > 1) return // Allow pinch zoom
      e.preventDefault()
    }
    
    document.body.addEventListener('touchmove', preventTouch, { passive: false })
    
    return () => {
      window.removeEventListener('wheel', handleWheel)
      document.body.removeEventListener('touchmove', preventTouch)
    }
  }, [animationState])
  
  const handleEnterClick = () => {
    router.push('/penguin')
  }
  
  return (
    <div 
      id="tunnel-container"
      className="relative w-full h-[100dvh] bg-black overflow-hidden"
      style={{ 
        touchAction: 'none',
        cursor: 'default'
      }}
    >
      {/* 3D Canvas */}
      <Canvas
        camera={{ 
          position: [0, 12, 20], 
          fov: 45,
          near: 0.1,
          far: 200
        }}
        gl={{ 
          antialias: true,
          alpha: false
        }}
        onCreated={({ camera }) => {
          camera.lookAt(0, 0, 0)
        }}
      >
        <color attach="background" args={['#000000']} />
        
        {/* Fog for depth - darker */}
        <fog attach="fog" args={['#000000', 40, 120]} />
        
        {/* Lighting for sphere shading */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[5, 10, 8]} 
          intensity={1.2}
        />
        <directionalLight 
          position={[-5, 5, -8]} 
          intensity={0.4}
        />
        
        {/* The sphere + grid scene */}
        <Tunnel3D 
          scrollPositionRef={scrollPositionRef}
          targetScrollRef={targetScrollRef}
          animationState={animationState}
          setAnimationState={setAnimationState}
          sphereRadius={SPHERE_RADIUS}
        />
      </Canvas>
      
      {/* Scroll hint (fades out after scrolling starts) */}
      {Math.abs(scrollPositionRef.current) < 1 && animationState === 'rolling' && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center pointer-events-none">
          <div className="flex gap-4 text-white text-lg font-medium mb-2">
            <span className="animate-bounce">↑</span>
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>↓</span>
          </div>
          <div className="text-white text-sm tracking-wider uppercase">
            Scroll to enter
          </div>
        </div>
      )}
      
      {/* Progress indicator */}
      {animationState === 'rolling' && Math.abs(scrollPositionRef.current) > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none">
          <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden relative">
            <div 
              className="absolute left-0 h-full bg-white/30 transition-all duration-100"
              style={{ 
                width: scrollPositionRef.current < 0 
                  ? `${(Math.abs(scrollPositionRef.current) / Math.abs(MIN_SCROLL)) * 50}%`
                  : '0%',
                right: '50%'
              }}
            />
            <div 
              className="absolute left-1/2 h-full bg-white transition-all duration-100"
              style={{ 
                width: scrollPositionRef.current > 0
                  ? `${(scrollPositionRef.current / MAX_SCROLL) * 50}%`
                  : '0%'
              }}
            />
          </div>
        </div>
      )}
      
      {/* Logo and Enter Button Overlay */}
      {animationState === 'logo' && (
        <div 
          className="absolute inset-0 bg-black z-50 flex flex-col items-center justify-center"
          style={{
            animation: 'fadeInLogo 0.5s ease-out forwards'
          }}
        >
          <div className="relative w-64 h-64 mb-8">
            <Image
              src="/logo.png"
              alt="SECTA"
              fill
              className="object-contain"
              priority
            />
          </div>
          <button
            onClick={handleEnterClick}
            className="px-12 py-4 text-white text-xl tracking-wider uppercase border-2 border-white hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            Enter
          </button>
        </div>
      )}
      
      <style jsx>{`
        @keyframes fadeInLogo {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

