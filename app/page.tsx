'use client'

import { useRef, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'

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
  showBackgroundOvals: boolean
  backgroundOvalCount: number
  backgroundOvalWidth: number
  backgroundOvalHeight: number
  backgroundOvalSpacing: number
  backgroundOvalStrokeWidth: number
  backgroundOvalColor: string
  showEquatorLine: boolean
  showLogo: boolean
  logoScale: number
  logoX: number
  logoY: number
  logoOpacity: number
  // Scroll rotation params
  scrollRotationSpeed: number
  scrollRotationDamping: number
  maxTiltAngle: number
}

function EyeScene({ params }: { params: SphereParams }) {
  const groupRef = useRef<THREE.Group>(null)
  const scrollGroupRef = useRef<THREE.Group>(null)
  const { viewport, gl, camera } = useThree()

  // Update camera zoom when params change
  useEffect(() => {
    if (camera instanceof THREE.OrthographicCamera) {
      camera.zoom = params.cameraZoom
      camera.updateProjectionMatrix()
    }
  }, [camera, params.cameraZoom])
  
  // Store global mouse position (target)
  const targetMousePos = useRef({ x: 0, y: 0 })
  // Store smoothed mouse position (current)
  const smoothMousePos = useRef({ x: 0, y: 0 })
  // Track last mouse movement time
  const lastMouseMoveTime = useRef(Date.now())
  // Track if we're in idle/look-away state
  const idleState = useRef<'following' | 'returning' | 'centered'>('following')
  // Animation progress
  const animationProgress = useRef(0)
  
  // Scroll-based rotation - simple forward/backward roll
  const scrollRotation = useRef(0)
  const scrollVelocityX = useRef(0)

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      targetMousePos.current = {
        x: event.clientX,
        y: event.clientY
      }
      lastMouseMoveTime.current = Date.now()
      
      // Reset idle state if mouse moves
      if (idleState.current !== 'following') {
        idleState.current = 'following'
        animationProgress.current = 0
      }
    }
    
    // Handle scroll/wheel for rotation - simple forward/backward roll
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      // Simple: scroll down = roll forward, scroll up = roll backward
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

  // Store rect
  const rectRef = useRef<DOMRect | null>(null)
  
  const updateRect = () => {
    if (gl.domElement) {
      rectRef.current = gl.domElement.getBoundingClientRect()
    }
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

    // --- Scroll-based rotation (simple forward/backward) ---
    // Apply velocity to rotation
    scrollRotation.current += scrollVelocityX.current
    // Apply damping to velocity (friction)
    scrollVelocityX.current *= (1 - params.scrollRotationDamping)
    // Stop very small velocities
    if (Math.abs(scrollVelocityX.current) < 0.0001) scrollVelocityX.current = 0
    // Apply scroll rotation to the scroll group
    if (scrollGroupRef.current) {
      scrollGroupRef.current.rotation.x = scrollRotation.current
    }

    // Check if mouse has been idle (no movement for 0.75 seconds)
    const timeSinceLastMove = Date.now() - lastMouseMoveTime.current
    const idleThreshold = 750 // 0.75 seconds (3x longer delay)

    // Handle idle state transitions - go directly to returning to center
    if (idleState.current === 'following' && timeSinceLastMove > idleThreshold) {
      idleState.current = 'returning'
      animationProgress.current = 0
    }

    // Smooth interpolation based on mouse delay parameter
    const lerpSpeed = params.mouseDelay === 0 ? 1 : Math.min(1, delta / (params.mouseDelay + 0.001))

    // --- Mouse-based tilt (limited by maxTiltAngle) ---
    let tiltX = 0
    let tiltY = 0

    if (idleState.current === 'following') {
      // Normal mouse following
      smoothMousePos.current.x += (targetMousePos.current.x - smoothMousePos.current.x) * lerpSpeed
      smoothMousePos.current.y += (targetMousePos.current.y - smoothMousePos.current.y) * lerpSpeed
      
      const deltaX = smoothMousePos.current.x - centerX
      const deltaY = smoothMousePos.current.y - centerY
      tiltX = deltaX * scaleX
      tiltY = -deltaY * scaleY
    } else if (idleState.current === 'returning') {
      // Return to center animation (1 second)
      animationProgress.current += delta
      const duration = 1.0
      const t = Math.min(1, animationProgress.current / duration)
      // Smooth ease out
      const eased = 1 - Math.pow(1 - t, 3)
      
      const startX = smoothMousePos.current.x
      const startY = smoothMousePos.current.y
      smoothMousePos.current.x = startX + (centerX - startX) * eased
      smoothMousePos.current.y = startY + (centerY - startY) * eased
      
      const deltaX = smoothMousePos.current.x - centerX
      const deltaY = smoothMousePos.current.y - centerY
      tiltX = deltaX * scaleX
      tiltY = -deltaY * scaleY

      if (t >= 1) {
        idleState.current = 'centered'
        animationProgress.current = 0
      }
    } else if (idleState.current === 'centered') {
      // Stay centered
      smoothMousePos.current.x = centerX
      smoothMousePos.current.y = centerY
      tiltX = 0
      tiltY = 0
    }

    // Clamp tilt to max angle
    const maxTilt = params.maxTiltAngle
    const tiltMagnitude = Math.sqrt(tiltX * tiltX + tiltY * tiltY)
    if (tiltMagnitude > maxTilt) {
      const scale = maxTilt / tiltMagnitude
      tiltX *= scale
      tiltY *= scale
    }

    // Apply tilt via lookAt - this tilts the sphere based on mouse position
    groupRef.current.lookAt(tiltX, tiltY, params.lookAtDepth)
  })

  // Create sphere geometry for the fill
  const sphereGeometry = useMemo(() => {
    const widthSegs = Math.max(1, params.widthSegments)
    const heightSegs = Math.max(1, params.heightSegments)
    return new THREE.SphereGeometry(params.radius, widthSegs, heightSegs)
  }, [params.radius, params.widthSegments, params.heightSegments])

  // Create horizontal rings geometry (from height segments)
  const horizontalLinesGeometry = useMemo(() => {
    if (params.heightSegments === 0) return null
    
    const positions: number[] = []
    const numRings = params.heightSegments
    
    for (let h = 0; h <= numRings; h++) {
      const theta = (h / numRings) * Math.PI
      const sinTheta = Math.sin(theta)
      const cosTheta = Math.cos(theta)
      
      const numPoints = Math.max(32, params.widthSegments * 2)
      for (let i = 0; i < numPoints; i++) {
        const phi1 = (i / numPoints) * Math.PI * 2
        const phi2 = ((i + 1) / numPoints) * Math.PI * 2
        
        const x1 = params.radius * Math.sin(phi1) * sinTheta
        const y1 = params.radius * cosTheta
        const z1 = params.radius * Math.cos(phi1) * sinTheta
        
        const x2 = params.radius * Math.sin(phi2) * sinTheta
        const y2 = params.radius * cosTheta
        const z2 = params.radius * Math.cos(phi2) * sinTheta
        
        positions.push(x1, y1, z1, x2, y2, z2)
      }
    }
    
    const bufferGeometry = new THREE.BufferGeometry()
    bufferGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return bufferGeometry
  }, [params.radius, params.heightSegments, params.widthSegments])

  // Create vertical lines geometry (from width segments)
  const verticalLinesGeometry = useMemo(() => {
    if (params.widthSegments === 0) return null
    
    const positions: number[] = []
    const numLines = params.widthSegments
    
    for (let w = 0; w < numLines; w++) {
      const phi = (w / numLines) * Math.PI * 2
      const sinPhi = Math.sin(phi)
      const cosPhi = Math.cos(phi)
      
      const numPoints = Math.max(32, params.heightSegments * 2)
      for (let h = 0; h < numPoints; h++) {
        const theta1 = (h / numPoints) * Math.PI
        const theta2 = ((h + 1) / numPoints) * Math.PI
        
        const sinTheta1 = Math.sin(theta1)
        const cosTheta1 = Math.cos(theta1)
        const sinTheta2 = Math.sin(theta2)
        const cosTheta2 = Math.cos(theta2)
        
        const x1 = params.radius * sinPhi * sinTheta1
        const y1 = params.radius * cosTheta1
        const z1 = params.radius * cosPhi * sinTheta1
        
        const x2 = params.radius * sinPhi * sinTheta2
        const y2 = params.radius * cosTheta2
        const z2 = params.radius * cosPhi * sinTheta2
        
        positions.push(x1, y1, z1, x2, y2, z2)
      }
    }
    
    const bufferGeometry = new THREE.BufferGeometry()
    bufferGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return bufferGeometry
  }, [params.radius, params.widthSegments, params.heightSegments])

  const fillColor = useMemo(() => new THREE.Color(params.fillColor), [params.fillColor])
  const lineColor = useMemo(() => new THREE.Color(params.lineColor), [params.lineColor])

  // Create materials for horizontal and vertical lines
  const horizontalLineMaterial = useMemo(() => {
    if (params.horizontalStrokeWidth <= 0.01) {
      return new THREE.LineBasicMaterial({
        color: lineColor,
        opacity: params.strokeOpacity,
        transparent: params.strokeOpacity < 1.0,
      })
    }
    return null
  }, [lineColor, params.horizontalStrokeWidth, params.strokeOpacity])

  const verticalLineMaterial = useMemo(() => {
    if (params.verticalStrokeWidth <= 0.01) {
      return new THREE.LineBasicMaterial({
        color: lineColor,
        opacity: params.strokeOpacity,
        transparent: params.strokeOpacity < 1.0,
      })
    }
    return null
  }, [lineColor, params.verticalStrokeWidth, params.strokeOpacity])

  // Create tube material for thicker strokes
  const tubeMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: lineColor,
      opacity: params.strokeOpacity,
      transparent: params.strokeOpacity < 1.0,
    })
  }, [lineColor, params.strokeOpacity])

  // Create tubes for horizontal lines if stroke width is significant
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
        const up = new THREE.Vector3(0, 1, 0)
        const dirNormalized = direction.clone().normalize()
        const quaternion = new THREE.Quaternion().setFromUnitVectors(up, dirNormalized)
        
        tubes.push({ geometry: tubeGeometry, position: midPoint, quaternion })
      }
    }
    
    return tubes
  }, [horizontalLinesGeometry, params.horizontalStrokeWidth])

  // Create tubes for vertical lines if stroke width is significant
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
        const up = new THREE.Vector3(0, 1, 0)
        const dirNormalized = direction.clone().normalize()
        const quaternion = new THREE.Quaternion().setFromUnitVectors(up, dirNormalized)
        
        tubes.push({ geometry: tubeGeometry, position: midPoint, quaternion })
      }
    }
    
    return tubes
  }, [verticalLinesGeometry, params.verticalStrokeWidth])

  return (
    <>
      {/* Interactive sphere group - rotates to follow mouse */}
      <group ref={groupRef}>
        {/* Scroll rotation group - rotates based on scroll input */}
        <group ref={scrollGroupRef}>
        {/* 
           Rotate sphere -90 deg on X axis.
           Original Sphere Y (Top) becomes aligned with Group Z (Forward).
           So when Group looks at target (Z points to target), Sphere Top points to target.
        */}
        <group rotation={[-Math.PI / 2, 0, 0]}>
        {/* Inner black sphere - slightly smaller to ensure it's fully inside */}
        <Sphere args={[params.radius - params.innerSphereOffset, 32, 32]}>
          <meshBasicMaterial color="black" />
        </Sphere>
        {/* Outer sphere with fill color */}
        <mesh geometry={sphereGeometry}>
          <meshBasicMaterial color={fillColor} side={THREE.FrontSide} />
        </mesh>
        
        {/* Horizontal lines (rings) */}
        {horizontalLinesGeometry && (
          params.horizontalStrokeWidth > 0.01 ? (
            horizontalTubes.map((tube, idx) => (
              <mesh 
                key={`h-${idx}`} 
                geometry={tube.geometry} 
                material={tubeMaterial} 
                position={tube.position} 
                quaternion={tube.quaternion}
              />
            ))
          ) : (
            horizontalLineMaterial && (
              <lineSegments geometry={horizontalLinesGeometry} material={horizontalLineMaterial} />
            )
          )
        )}
        
        {/* Vertical lines */}
        {verticalLinesGeometry && (
          params.verticalStrokeWidth > 0.01 ? (
            verticalTubes.map((tube, idx) => (
              <mesh 
                key={`v-${idx}`} 
                geometry={tube.geometry} 
                material={tubeMaterial} 
                position={tube.position} 
                quaternion={tube.quaternion}
              />
            ))
          ) : (
            verticalLineMaterial && (
              <lineSegments geometry={verticalLinesGeometry} material={verticalLineMaterial} />
            )
          )
        )}
        </group>
        </group>
      </group>
    </>
  )
}

export default function Home() {
  const router = useRouter()
  
  // Default parameters - locked in from saved configuration
  const params: SphereParams = {
    radius: 5.0,
    widthSegments: 16,
    heightSegments: 14,
    fillColor: '#000000',
    lineColor: '#ff7b7b',
    innerSphereOffset: 0.15,
    cameraZoom: 15.5,
    lookAtDepth: 23.0,
    horizontalStrokeWidth: 8.2,
    verticalStrokeWidth: 7.1,
    strokeOpacity: 1.0,
    mouseDelay: 0.1,
    showBackgroundOvals: false,
    backgroundOvalCount: 3,
    backgroundOvalWidth: 3.5,
    backgroundOvalHeight: 2.0,
    backgroundOvalSpacing: 0.3,
    backgroundOvalStrokeWidth: 0,
    backgroundOvalColor: '#000000',
    showEquatorLine: false,
    showLogo: true,
    logoScale: 3.0,
    logoX: -20,
    logoY: 0,
    logoOpacity: 1.0,
    // Scroll rotation defaults
    scrollRotationSpeed: 3.0,
    scrollRotationDamping: 0.08,
    maxTiltAngle: 50.0,
  }

  const [showEnterButton, setShowEnterButton] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)

  // Track mouse movement and scroll to show Enter button
  useEffect(() => {
    let lastMoveTime = Date.now()
    let moveCount = 0
    const threshold = 5 // Show after 5 significant moves
    
    const handleMouseMove = () => {
      const now = Date.now()
      // Only count moves that are at least 100ms apart to avoid counting tiny jitters
      if (now - lastMoveTime > 100) {
        moveCount++
        lastMoveTime = now
        
        if (moveCount >= threshold && !showEnterButton) {
          setShowEnterButton(true)
        }
      }
    }
    
    const handleScroll = () => {
      // Show enter button on any scroll
      if (!showEnterButton) {
        setShowEnterButton(true)
      }
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('wheel', handleScroll)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('wheel', handleScroll)
    }
  }, [showEnterButton])

  const handleEnterClick = () => {
    setIsFadingOut(true)
    // Wait for fade animation to complete before navigating
    setTimeout(() => {
      router.push('/penguin')
    }, 800) // Match the fade duration
  }

  return (
    <div className="fixed inset-0 bg-black">
      {/* Fade to black overlay */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-[800ms] ease-in-out z-50 ${
          isFadingOut ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />
      {/* Logo behind the sphere - clickable */}
      {params.showLogo && (
        <div 
          className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
          style={{
            transform: `translate(${params.logoX}px, ${params.logoY}px)`,
          }}
          onClick={handleEnterClick}
        >
          <img 
            src="/SectaLogo.svg" 
            alt="Secta Logo"
            style={{
              width: `${300 * params.logoScale}px`,
              height: 'auto',
              opacity: params.logoOpacity,
            }}
          />
        </div>
      )}
      
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
          style={{ 
            transform: 'translateY(300px)',
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
          }}
        >
          Enter
        </button>
      </div>
    </div>
  )
}
