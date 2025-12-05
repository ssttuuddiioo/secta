'use client'

import { useRef, useEffect, useMemo, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { VideoWithShader } from '@/components/VideoWithShader'
import { DotGridOverlay } from '@/components/DotGridOverlay'
import { Header } from '@/components/Header'
import { Volume2, VolumeX, Settings, X } from 'lucide-react'

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
  
  // Main content state
  const [isMuted, setIsMuted] = useState(true)
  const [shaderEffect, setShaderEffect] = useState(1)
  const [showControls, setShowControls] = useState(false)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [videoKey, setVideoKey] = useState(0)
  const [videoUrl, setVideoUrl] = useState("/got.mp4")
  
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

  // Preload video URL from Sanity immediately
  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        const response = await fetch('/api/hero-video')
        if (response.ok) {
          const data = await response.json()
          if (data.videoUrl) setVideoUrl(data.videoUrl)
        }
      } catch (error) {
        console.warn('Failed to fetch video from Sanity:', error)
      }
    }
    fetchVideoUrl()
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

  // Keyboard shortcut: 'c' to toggle controls (when in main view)
  useEffect(() => {
    if (!hasEntered) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'c' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault()
        setShowControls(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [hasEntered])

  // Video ready callback
  const handleVideoReady = () => {
    setTimeout(() => setIsVideoLoaded(true), 300)
  }

  // Fallback timer for video
  useEffect(() => {
    if (!hasEntered) return
    const timer = setTimeout(() => {
      if (!isVideoLoaded) setIsVideoLoaded(true)
    }, 3000)
    return () => clearTimeout(timer)
  }, [hasEntered, isVideoLoaded, videoKey])

  // Handle enter click
  const handleEnterClick = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setHasEntered(true)
    }, 600) // Sphere transition duration
  }

  return (
    <div className="min-h-screen bg-black">
      {/* ============ SPHERE INTRO ============ */}
      <div 
        className={`fixed inset-0 bg-black transition-all duration-[600ms] ease-out ${
          isTransitioning || hasEntered ? 'opacity-0 scale-75 pointer-events-none' : 'opacity-100 scale-100'
        }`}
        style={{ zIndex: hasEntered ? -1 : 40 }}
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

      {/* ============ MAIN CONTENT ============ */}
      <div 
        className={`transition-opacity duration-[600ms] ease-out ${
          hasEntered ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Loading overlay for video */}
        {hasEntered && (
          <div 
            className={`fixed inset-0 bg-black transition-opacity duration-700 ease-in-out ${
              isVideoLoaded ? 'opacity-0 pointer-events-none z-[-1]' : 'opacity-100 z-50'
            }`}
          />
        )}

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
                {hasEntered && (
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

              {/* Settings button */}
              <button 
                onClick={() => setShowControls(!showControls)}
                className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-20 p-2 hover:opacity-70 transition-opacity cursor-pointer mix-blend-difference"
              >
                <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </button>

              {/* Video Controls Panel */}
              {showControls && (
                <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-white text-sm w-80 max-h-[90vh] overflow-y-auto z-50">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Video Controls</h2>
                    <button onClick={() => setShowControls(false)} className="text-white/60 hover:text-white text-xl">×</button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xs uppercase tracking-wider text-white/60 mb-2">Shader Effect</h3>
                      <select
                        value={shaderEffect}
                        onChange={(e) => { setShaderEffect(parseInt(e.target.value)); setVideoKey(prev => prev + 1); setIsVideoLoaded(false); }}
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
                    <p className="text-xs text-white/40">Press 'C' to toggle controls</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <footer className="bg-[#FFF9DF] py-8 md:py-12 px-5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <p className="text-black" style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontSize: 'clamp(14px, 1.5vw, 18px)' }}>
                © {new Date().getFullYear()} SECTA. All rights reserved.
              </p>
              <nav className="flex gap-6">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-black hover:text-[#C64B2C] transition-colors" style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontSize: 'clamp(14px, 1.5vw, 18px)' }}>Instagram</a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-black hover:text-[#C64B2C] transition-colors" style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontSize: 'clamp(14px, 1.5vw, 18px)' }}>LinkedIn</a>
                <button onClick={() => setShowContactForm(true)} className="text-black hover:text-[#C64B2C] transition-colors cursor-pointer bg-transparent border-none" style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontSize: 'clamp(14px, 1.5vw, 18px)' }}>Contact</button>
              </nav>
            </div>
          </footer>

          {/* Contact Form Modal */}
          {showContactForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/60" onClick={() => { setShowContactForm(false); setSubmitStatus('idle'); }} />
              <div className="relative bg-[#FFF9DF] w-full max-w-lg mx-4 p-8 md:p-10 rounded-lg shadow-2xl">
                <button onClick={() => { setShowContactForm(false); setSubmitStatus('idle'); }} className="absolute top-4 right-4 text-black hover:opacity-70 transition-opacity">
                  <X className="w-6 h-6" />
                </button>
                <h2 className="text-2xl md:text-3xl font-bold text-black mb-6" style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>Get in Touch</h2>
                {submitStatus === 'success' ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">✓</div>
                    <p className="text-black text-lg" style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>Thank you! We'll be in touch soon.</p>
                    <button onClick={() => { setShowContactForm(false); setSubmitStatus('idle'); setFormData({ name: '', email: '', message: '' }); }} className="mt-6 px-6 py-2 bg-[#C64B2C] text-white rounded hover:opacity-90 transition-opacity" style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>Close</button>
                  </div>
                ) : (
                  <form 
                    onSubmit={async (e) => {
                      e.preventDefault()
                      setIsSubmitting(true)
                      try {
                        const response = await fetch('https://formspree.io/f/meoyzkdq', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(formData) })
                        if (response.ok) { setSubmitStatus('success'); setFormData({ name: '', email: '', message: '' }); } else { setSubmitStatus('error'); }
                      } catch { setSubmitStatus('error'); }
                      finally { setIsSubmitting(false); }
                    }}
                    className="space-y-5"
                  >
                    <div>
                      <label htmlFor="name" className="block text-black text-sm font-bold mb-2" style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>Name</label>
                      <input type="text" id="name" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-4 py-3 border-2 border-black/20 rounded bg-white text-black focus:outline-none focus:border-[#C64B2C] transition-colors" placeholder="Your name" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-black text-sm font-bold mb-2" style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>Email</label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="w-full px-4 py-3 border-2 border-black/20 rounded bg-white text-black focus:outline-none focus:border-[#C64B2C] transition-colors" placeholder="your@email.com" />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-black text-sm font-bold mb-2" style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>Message</label>
                      <textarea id="message" name="message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required rows={4} className="w-full px-4 py-3 border-2 border-black/20 rounded bg-white text-black focus:outline-none focus:border-[#C64B2C] transition-colors resize-none" placeholder="Tell us about your project..." />
                    </div>
                    {submitStatus === 'error' && <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>}
                    <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-[#C64B2C] text-white font-bold rounded hover:opacity-90 transition-opacity disabled:opacity-50" style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>{isSubmitting ? 'Sending...' : 'Send Message'}</button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
