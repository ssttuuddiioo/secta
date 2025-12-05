'use client'

import { useRef, useEffect, useMemo, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { VideoWithShader } from '@/components/VideoWithShader'
import { DotGridOverlay } from '@/components/DotGridOverlay'
import { Header } from '@/components/Header'
import { Volume2, VolumeX } from 'lucide-react'

interface SphereParams {
  radius: number
  widthSegments: number
  heightSegments: number
  fillColor: string
  lineColor: string
  innerSphereOffset: number
  cameraZoom: number
  lookAtDepth: number
  horizontalStrokeWidth: number
  verticalStrokeWidth: number
  strokeOpacity: number
  mouseDelay: number
  showLogo: boolean
  logoScale: number
  logoX: number
  logoY: number
  logoOpacity: number
  scrollRotationSpeed: number
  scrollRotationDamping: number
  maxTiltAngle: number
}

function EyeScene({ params }: { params: SphereParams }) {
  const groupRef = useRef<THREE.Group>(null)
  const scrollGroupRef = useRef<THREE.Group>(null)
  const { viewport, gl, camera } = useThree()

  useEffect(() => {
    if (camera instanceof THREE.OrthographicCamera) {
      camera.zoom = params.cameraZoom
      camera.updateProjectionMatrix()
    }
  }, [camera, params.cameraZoom])
  
  const targetMousePos = useRef({ x: 0, y: 0 })
  const smoothMousePos = useRef({ x: 0, y: 0 })
  const lastMouseMoveTime = useRef(Date.now())
  const idleState = useRef<'following' | 'returning' | 'centered'>('following')
  const animationProgress = useRef(0)
  const scrollRotation = useRef(0)
  const scrollVelocityX = useRef(0)

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      targetMousePos.current = { x: event.clientX, y: event.clientY }
      lastMouseMoveTime.current = Date.now()
      if (idleState.current !== 'following') {
        idleState.current = 'following'
        animationProgress.current = 0
      }
    }
    
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      const scrollAmount = -event.deltaY * params.scrollRotationSpeed * 0.00005
      scrollVelocityX.current += scrollAmount
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('wheel', handleWheel)
    }
  }, [params.scrollRotationSpeed])

  const rectRef = useRef<DOMRect | null>(null)
  const updateRect = () => {
    if (gl.domElement) rectRef.current = gl.domElement.getBoundingClientRect()
  }

  useEffect(() => {
    updateRect()
    window.addEventListener('resize', updateRect)
    window.addEventListener('scroll', updateRect)
    return () => {
      window.removeEventListener('resize', updateRect)
      window.removeEventListener('scroll', updateRect)
    }
  }, [gl.domElement])

  useFrame((state, delta) => {
    if (!groupRef.current || !rectRef.current) return

    const rect = rectRef.current
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const scaleX = viewport.width / rect.width
    const scaleY = viewport.height / rect.height

    scrollRotation.current += scrollVelocityX.current
    scrollVelocityX.current *= (1 - params.scrollRotationDamping)
    if (Math.abs(scrollVelocityX.current) < 0.0001) scrollVelocityX.current = 0
    if (scrollGroupRef.current) {
      scrollGroupRef.current.rotation.x = scrollRotation.current
    }

    const timeSinceLastMove = Date.now() - lastMouseMoveTime.current
    const idleThreshold = 750

    if (idleState.current === 'following' && timeSinceLastMove > idleThreshold) {
      idleState.current = 'returning'
      animationProgress.current = 0
    }

    const lerpSpeed = params.mouseDelay === 0 ? 1 : Math.min(1, delta / (params.mouseDelay + 0.001))

    let tiltX = 0
    let tiltY = 0

    if (idleState.current === 'following') {
      smoothMousePos.current.x += (targetMousePos.current.x - smoothMousePos.current.x) * lerpSpeed
      smoothMousePos.current.y += (targetMousePos.current.y - smoothMousePos.current.y) * lerpSpeed
      const deltaX = smoothMousePos.current.x - centerX
      const deltaY = smoothMousePos.current.y - centerY
      tiltX = deltaX * scaleX
      tiltY = -deltaY * scaleY
    } else if (idleState.current === 'returning') {
      animationProgress.current += delta
      const t = Math.min(1, animationProgress.current / 1.0)
      const eased = 1 - Math.pow(1 - t, 3)
      smoothMousePos.current.x += (centerX - smoothMousePos.current.x) * eased
      smoothMousePos.current.y += (centerY - smoothMousePos.current.y) * eased
      const deltaX = smoothMousePos.current.x - centerX
      const deltaY = smoothMousePos.current.y - centerY
      tiltX = deltaX * scaleX
      tiltY = -deltaY * scaleY
      if (t >= 1) {
        idleState.current = 'centered'
        animationProgress.current = 0
      }
    } else if (idleState.current === 'centered') {
      smoothMousePos.current.x = centerX
      smoothMousePos.current.y = centerY
    }

    const maxTilt = params.maxTiltAngle
    const tiltMagnitude = Math.sqrt(tiltX * tiltX + tiltY * tiltY)
    if (tiltMagnitude > maxTilt) {
      const scale = maxTilt / tiltMagnitude
      tiltX *= scale
      tiltY *= scale
    }

    groupRef.current.lookAt(tiltX, tiltY, params.lookAtDepth)
  })

  const sphereGeometry = useMemo(() => {
    return new THREE.SphereGeometry(params.radius, Math.max(1, params.widthSegments), Math.max(1, params.heightSegments))
  }, [params.radius, params.widthSegments, params.heightSegments])

  const horizontalLinesGeometry = useMemo(() => {
    if (params.heightSegments === 0) return null
    const positions: number[] = []
    for (let h = 0; h <= params.heightSegments; h++) {
      const theta = (h / params.heightSegments) * Math.PI
      const sinTheta = Math.sin(theta)
      const cosTheta = Math.cos(theta)
      const numPoints = Math.max(32, params.widthSegments * 2)
      for (let i = 0; i < numPoints; i++) {
        const phi1 = (i / numPoints) * Math.PI * 2
        const phi2 = ((i + 1) / numPoints) * Math.PI * 2
        positions.push(
          params.radius * Math.sin(phi1) * sinTheta, params.radius * cosTheta, params.radius * Math.cos(phi1) * sinTheta,
          params.radius * Math.sin(phi2) * sinTheta, params.radius * cosTheta, params.radius * Math.cos(phi2) * sinTheta
        )
      }
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return geo
  }, [params.radius, params.heightSegments, params.widthSegments])

  const verticalLinesGeometry = useMemo(() => {
    if (params.widthSegments === 0) return null
    const positions: number[] = []
    for (let w = 0; w < params.widthSegments; w++) {
      const phi = (w / params.widthSegments) * Math.PI * 2
      const sinPhi = Math.sin(phi)
      const cosPhi = Math.cos(phi)
      const numPoints = Math.max(32, params.heightSegments * 2)
      for (let h = 0; h < numPoints; h++) {
        const theta1 = (h / numPoints) * Math.PI
        const theta2 = ((h + 1) / numPoints) * Math.PI
        positions.push(
          params.radius * sinPhi * Math.sin(theta1), params.radius * Math.cos(theta1), params.radius * cosPhi * Math.sin(theta1),
          params.radius * sinPhi * Math.sin(theta2), params.radius * Math.cos(theta2), params.radius * cosPhi * Math.sin(theta2)
        )
      }
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return geo
  }, [params.radius, params.widthSegments, params.heightSegments])

  const fillColor = useMemo(() => new THREE.Color(params.fillColor), [params.fillColor])
  const lineColor = useMemo(() => new THREE.Color(params.lineColor), [params.lineColor])

  const tubeMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: lineColor }), [lineColor])

  const horizontalTubes = useMemo(() => {
    if (!horizontalLinesGeometry || params.horizontalStrokeWidth <= 0.01) return []
    const positions = horizontalLinesGeometry.attributes.position
    const tubes: Array<{ geometry: THREE.BufferGeometry; position: THREE.Vector3; quaternion: THREE.Quaternion }> = []
    const strokeRadius = params.horizontalStrokeWidth * 0.01
    for (let i = 0; i < positions.count; i += 2) {
      const start = new THREE.Vector3(positions.getX(i), positions.getY(i), positions.getZ(i))
      const end = new THREE.Vector3(positions.getX(i + 1), positions.getY(i + 1), positions.getZ(i + 1))
      const direction = new THREE.Vector3().subVectors(end, start)
      const length = direction.length()
      if (length > 0.001) {
        const tubeGeometry = new THREE.CylinderGeometry(strokeRadius, strokeRadius, length, 6, 1)
        const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
        const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize())
        tubes.push({ geometry: tubeGeometry, position: midPoint, quaternion })
      }
    }
    return tubes
  }, [horizontalLinesGeometry, params.horizontalStrokeWidth])

  const verticalTubes = useMemo(() => {
    if (!verticalLinesGeometry || params.verticalStrokeWidth <= 0.01) return []
    const positions = verticalLinesGeometry.attributes.position
    const tubes: Array<{ geometry: THREE.BufferGeometry; position: THREE.Vector3; quaternion: THREE.Quaternion }> = []
    const strokeRadius = params.verticalStrokeWidth * 0.01
    for (let i = 0; i < positions.count; i += 2) {
      const start = new THREE.Vector3(positions.getX(i), positions.getY(i), positions.getZ(i))
      const end = new THREE.Vector3(positions.getX(i + 1), positions.getY(i + 1), positions.getZ(i + 1))
      const direction = new THREE.Vector3().subVectors(end, start)
      const length = direction.length()
      if (length > 0.001) {
        const tubeGeometry = new THREE.CylinderGeometry(strokeRadius, strokeRadius, length, 6, 1)
        const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
        const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize())
        tubes.push({ geometry: tubeGeometry, position: midPoint, quaternion })
      }
    }
    return tubes
  }, [verticalLinesGeometry, params.verticalStrokeWidth])

  return (
    <group ref={groupRef}>
      <group ref={scrollGroupRef}>
        <group rotation={[-Math.PI / 2, 0, 0]}>
          <Sphere args={[params.radius - params.innerSphereOffset, 32, 32]}>
            <meshBasicMaterial color="black" />
          </Sphere>
          <mesh geometry={sphereGeometry}>
            <meshBasicMaterial color={fillColor} side={THREE.FrontSide} />
          </mesh>
          {horizontalLinesGeometry && params.horizontalStrokeWidth > 0.01 && horizontalTubes.map((tube, idx) => (
            <mesh key={`h-${idx}`} geometry={tube.geometry} material={tubeMaterial} position={tube.position} quaternion={tube.quaternion} />
          ))}
          {verticalLinesGeometry && params.verticalStrokeWidth > 0.01 && verticalTubes.map((tube, idx) => (
            <mesh key={`v-${idx}`} geometry={tube.geometry} material={tubeMaterial} position={tube.position} quaternion={tube.quaternion} />
          ))}
        </group>
      </group>
    </group>
  )
}

export default function Home() {
  // Sphere params
  const params: SphereParams = {
    radius: 5.0, widthSegments: 16, heightSegments: 14, fillColor: '#000000', lineColor: '#ff7b7b',
    innerSphereOffset: 0.15, cameraZoom: 15.5, lookAtDepth: 23.0, horizontalStrokeWidth: 8.2, verticalStrokeWidth: 7.1,
    strokeOpacity: 1.0, mouseDelay: 0.1, showLogo: true, logoScale: 3.0, logoX: -20, logoY: 0, logoOpacity: 1.0,
    scrollRotationSpeed: 3.0, scrollRotationDamping: 0.08, maxTiltAngle: 50.0,
  }

  // State for intro/main transition
  const [hasEntered, setHasEntered] = useState(false)
  const [showEnterButton, setShowEnterButton] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [hasCheckedSession, setHasCheckedSession] = useState(false)
  
  // Check sessionStorage on mount - skip sphere if already seen this session
  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem('hasSeenSphereIntro')
    if (hasSeenIntro === 'true') {
      setHasEntered(true)
    }
    setHasCheckedSession(true)
  }, [])
  
  // Main content state
  const [isMuted, setIsMuted] = useState(true)
  const [shaderEffect, setShaderEffect] = useState(1)
  const [isVideoLoaded, setIsVideoLoaded] = useState(true) // Start as true - no black loading screen
  const [videoKey, setVideoKey] = useState(0)
  const [videoUrl, setVideoUrl] = useState("/got.mp4")
  const [shouldPreloadVideo, setShouldPreloadVideo] = useState(false)
  
  // Contact form state
  const [showContactForm, setShowContactForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Video params
  const [videoParams] = useState({
    contrast: 1.3, brightness: 0.95, saturation: 1.0, hue: 0,
    overlayOpacity: 0.3, overlayColor: '#C64B2C', overlayBlendMode: 'multiply' as const,
  })

  // Preload video URL from Sanity immediately and start preloading video
  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        const response = await fetch('/api/hero-video')
        if (response.ok) {
          const data = await response.json()
          if (data.videoUrl) {
            setVideoUrl(data.videoUrl)
            // If already entered (returning visitor), preload immediately
            // Otherwise, start preloading after a short delay (while user is on sphere)
            const hasSeenIntro = sessionStorage.getItem('hasSeenSphereIntro')
            if (hasSeenIntro === 'true') {
              setShouldPreloadVideo(true)
            } else {
              setTimeout(() => setShouldPreloadVideo(true), 500)
            }
          }
        }
      } catch (error) {
        console.warn('Failed to fetch video from Sanity:', error)
      }
    }
    fetchVideoUrl()
    // Also start preloading after 1 second even if API fails
    const preloadTimer = setTimeout(() => setShouldPreloadVideo(true), 1000)
    return () => clearTimeout(preloadTimer)
  }, [])

  // Show enter button after mouse moves or scroll
  useEffect(() => {
    if (hasEntered) return
    let moveCount = 0
    let lastMoveTime = Date.now()
    const threshold = 5
    
    const handleMouseMove = () => {
      const now = Date.now()
      if (now - lastMoveTime > 100) {
        moveCount++
        lastMoveTime = now
        if (moveCount >= threshold && !showEnterButton) setShowEnterButton(true)
      }
    }
    const handleScroll = () => {
      if (!showEnterButton) setShowEnterButton(true)
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('wheel', handleScroll)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('wheel', handleScroll)
    }
  }, [showEnterButton, hasEntered])

  // Video ready callback
  const handleVideoReady = () => {
    console.log('Video ready')
  }

  // Handle enter click
  const handleEnterClick = () => {
    setIsTransitioning(true)
    // Save to sessionStorage so sphere doesn't show again this session
    sessionStorage.setItem('hasSeenSphereIntro', 'true')
    setTimeout(() => {
      setHasEntered(true)
    }, 600) // Sphere transition duration
  }

  // Don't render anything until we've checked sessionStorage
  if (!hasCheckedSession) {
    return <div className="min-h-screen bg-[#FFF9DF]" />
  }

  return (
    <div className="min-h-screen bg-[#FFF9DF]">
      {/* ============ SPHERE INTRO ============ */}
      {/* Only render sphere if user hasn't entered yet */}
      {!hasEntered && (
        <div 
          className={`fixed inset-0 bg-black transition-opacity duration-[600ms] ease-out ${
            isTransitioning ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          style={{ zIndex: 40 }}
        >
          {/* Logo behind sphere */}
          {params.showLogo && (
            <div 
              className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
              style={{ transform: `translate(${params.logoX}px, ${params.logoY}px)` }}
              onClick={handleEnterClick}
            >
              <img 
                src="/SectaLogo.svg" 
                alt="Secta Logo"
                style={{ width: `${300 * params.logoScale}px`, height: 'auto', opacity: params.logoOpacity }}
              />
            </div>
          )}
          
          {/* Sphere Canvas */}
          <Canvas 
            orthographic 
            camera={{ zoom: params.cameraZoom, position: [0, 0, 10] }} 
            gl={{ alpha: true, antialias: true }}
            className="relative z-20"
          >
            <EyeScene params={params} />
          </Canvas>

          {/* Enter Button */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <button
              onClick={handleEnterClick}
              className={`pointer-events-auto text-white text-lg font-bold tracking-wider uppercase hover:opacity-70 transition-opacity duration-1000 ${
                showEnterButton ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ transform: 'translateY(300px)', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
            >
              Enter
            </button>
          </div>
        </div>
      )}

      {/* ============ MAIN CONTENT ============ */}
      <div>
        <div className="bg-[#FFF9DF] flex flex-col relative">
          {/* Above the Fold */}
          <div className="h-screen flex flex-col">
            {/* Header and Tagline */}
            <div className="relative bg-[#FFF9DF] flex flex-col">
              <Header />
              <div className="relative z-20 bg-[#FFF9DF]">
                <div className="px-5 py-3 md:py-4 lg:py-5">
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
                <div className="w-full h-[9px] sm:h-[12px] bg-[#C64B2C]"></div>
              </div>
            </div>

            {/* Hero Video Section */}
            <div className="relative overflow-hidden flex-1" style={{ backgroundColor: '#5A3629' }}>
              <div 
                className="absolute inset-0 z-0" 
                style={{ 
                  filter: `contrast(${videoParams.contrast}) brightness(${videoParams.brightness}) saturate(${videoParams.saturation}) hue-rotate(${videoParams.hue}deg)`
                }}
              >
                {/* Preload video while on sphere intro, show when entered */}
                {(shouldPreloadVideo || hasEntered) && (
                  <VideoWithShader 
                    key={`video-${videoKey}`}
                    videoUrl={videoUrl}
                    effect={shaderEffect}
                    isMuted={isMuted}
                    onReady={handleVideoReady}
                  />
                )}
              </div>

              <div 
                className="absolute inset-0 z-5 pointer-events-none"
                style={{ 
                  backgroundColor: videoParams.overlayColor,
                  opacity: videoParams.overlayOpacity,
                  mixBlendMode: videoParams.overlayBlendMode
                }}
              />

              <DotGridOverlay dotSize={0.3} spacing={6} opacity={0.15} dotColor="rgba(255, 255, 255, 0.63)" />

              <div 
                className="absolute inset-0 z-15 pointer-events-none opacity-[0.3] mix-blend-multiply"
                style={{
                  backgroundImage: `radial-gradient(circle, black 30%, transparent 90%), radial-gradient(circle, black 30%, transparent 30%)`,
                  backgroundSize: '5px 5px',
                  backgroundPosition: '0 0, 4px 4px',
                }}
              />

              {/* Mute button */}
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8 z-20 p-2 hover:opacity-70 transition-opacity cursor-pointer mix-blend-difference"
              >
                {isMuted ? <VolumeX className="w-5 h-5 sm:w-6 sm:h-6 text-white" /> : <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
              </button>

            </div>
          </div>

          {/* Footer */}
          <footer id="contact-footer" className="bg-[#C64B2C] relative overflow-hidden">
            {/* Decorative geometric elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-black/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10 px-5 py-12 md:py-16">
              {/* Main CTA */}
              <div className="mb-8 md:mb-12">
                <h2 
                  className="text-[#FFF9DF] font-bold leading-none tracking-tight"
                  style={{ 
                    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                    fontSize: 'clamp(36px, 8vw, 80px)',
                  }}
                >
                  Let's create<br />something together.
                </h2>
                <button 
                  onClick={() => { 
                    const opening = !showContactForm
                    setShowContactForm(opening)
                    if (submitStatus !== 'idle') setSubmitStatus('idle')
                    if (opening) {
                      // Start scrolling immediately
                      document.getElementById('contact-footer')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      // Then scroll to absolute bottom after form expands
                      setTimeout(() => {
                        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
                      }, 600)
                    }
                  }}
                  className="mt-6 md:mt-8 group inline-flex items-center gap-3 text-[#FFF9DF] font-bold uppercase tracking-widest hover:gap-5 transition-all duration-300"
                  style={{ 
                    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                    fontSize: 'clamp(14px, 2vw, 18px)',
                  }}
                >
                  <span>{showContactForm ? 'Close' : 'Get in touch'}</span>
                  <svg 
                    className={`w-5 h-5 transition-transform duration-300 ${showContactForm ? 'rotate-45' : 'group-hover:translate-x-1'}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    {showContactForm ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    )}
                  </svg>
                </button>
              </div>
              
              {/* Inline Contact Form - Animated */}
              <div 
                className={`grid transition-all duration-500 ease-out ${
                  showContactForm ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 md:p-8 mb-8 md:mb-12">
                    {submitStatus === 'success' ? (
                      <div className="text-center py-8">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#FFF9DF] flex items-center justify-center">
                          <svg className="w-7 h-7 text-[#C64B2C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p 
                          className="text-[#FFF9DF] text-xl font-bold mb-1"
                          style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                        >
                          Message sent!
                        </p>
                        <p 
                          className="text-[#FFF9DF]/70"
                          style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                        >
                          We'll be in touch soon.
                        </p>
                      </div>
                    ) : (
                      <form 
                        onSubmit={async (e) => {
                          e.preventDefault()
                          setIsSubmitting(true)
                          try {
                            const response = await fetch('https://formspree.io/f/meoyzkdq', { 
                              method: 'POST', 
                              headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, 
                              body: JSON.stringify(formData) 
                            })
                            if (response.ok) { 
                              setSubmitStatus('success')
                              setFormData({ name: '', email: '', message: '' })
                            } else { 
                              setSubmitStatus('error')
                            }
                          } catch { 
                            setSubmitStatus('error')
                          } finally { 
                            setIsSubmitting(false)
                          }
                        }}
                        className="space-y-5"
                      >
                        {/* Name & Email row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="group">
                            <label 
                              htmlFor="footer-name" 
                              className="block text-[#FFF9DF]/60 text-xs uppercase tracking-wider font-bold mb-2 group-focus-within:text-[#FFF9DF] transition-colors"
                              style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                            >
                              Name
                            </label>
                            <input 
                              type="text" 
                              id="footer-name" 
                              name="name" 
                              value={formData.name} 
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                              required 
                              className="w-full px-0 py-2 bg-transparent border-b-2 border-[#FFF9DF]/30 text-[#FFF9DF] focus:outline-none focus:border-[#FFF9DF] transition-colors placeholder:text-[#FFF9DF]/40"
                              style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                              placeholder="Your name"
                            />
                          </div>
                          <div className="group">
                            <label 
                              htmlFor="footer-email" 
                              className="block text-[#FFF9DF]/60 text-xs uppercase tracking-wider font-bold mb-2 group-focus-within:text-[#FFF9DF] transition-colors"
                              style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                            >
                              Email
                            </label>
                            <input 
                              type="email" 
                              id="footer-email" 
                              name="email" 
                              value={formData.email} 
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                              required 
                              className="w-full px-0 py-2 bg-transparent border-b-2 border-[#FFF9DF]/30 text-[#FFF9DF] focus:outline-none focus:border-[#FFF9DF] transition-colors placeholder:text-[#FFF9DF]/40"
                              style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                              placeholder="your@email.com"
                            />
                          </div>
                        </div>
                        
                        {/* Message */}
                        <div className="group">
                          <label 
                            htmlFor="footer-message" 
                            className="block text-[#FFF9DF]/60 text-xs uppercase tracking-wider font-bold mb-2 group-focus-within:text-[#FFF9DF] transition-colors"
                            style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                          >
                            Message
                          </label>
                          <textarea 
                            id="footer-message" 
                            name="message" 
                            value={formData.message} 
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })} 
                            required 
                            rows={3} 
                            className="w-full px-0 py-2 bg-transparent border-b-2 border-[#FFF9DF]/30 text-[#FFF9DF] focus:outline-none focus:border-[#FFF9DF] transition-colors resize-none placeholder:text-[#FFF9DF]/40"
                            style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                            placeholder="Tell us about your project..."
                          />
                        </div>
                        
                        {/* Error message */}
                        {submitStatus === 'error' && (
                          <p className="text-[#FFF9DF] text-sm flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Something went wrong. Please try again.
                          </p>
                        )}
                        
                        {/* Submit button */}
                        <button 
                          type="submit" 
                          disabled={isSubmitting} 
                          className="px-8 py-3 bg-[#FFF9DF] text-[#C64B2C] font-bold uppercase tracking-wider text-sm hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-3 group"
                          style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                        >
                          {isSubmitting ? (
                            <>
                              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Sending...
                            </>
                          ) : (
                            <>
                              Send Message
                              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Bottom row */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pt-8 border-t border-[#FFF9DF]/20">
                <div className="flex flex-col gap-2">
                  <span className="text-[#FFF9DF]/60 text-xs uppercase tracking-widest" style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>Follow us</span>
                  <div className="flex gap-6">
                    <a 
                      href="https://instagram.com" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[#FFF9DF] hover:text-white transition-colors font-bold"
                      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontSize: 'clamp(16px, 2vw, 20px)' }}
                    >
                      Instagram
                    </a>
                    <a 
                      href="https://linkedin.com" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[#FFF9DF] hover:text-white transition-colors font-bold"
                      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontSize: 'clamp(16px, 2vw, 20px)' }}
                    >
                      LinkedIn
                    </a>
                  </div>
                </div>
                
                <p 
                  className="text-[#FFF9DF]/60"
                  style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontSize: 'clamp(12px, 1.2vw, 14px)' }}
                >
                  © {new Date().getFullYear()} SECTA. All rights reserved.
                </p>
              </div>
            </div>
          </footer>

        </div>
      </div>
    </div>
  )
}
