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
}

function EyeScene({ params }: { params: SphereParams }) {
  const groupRef = useRef<THREE.Group>(null)
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
  const idleState = useRef<'following' | 'wandering' | 'returning' | 'centered'>('following')
  // Target for look-away animation
  const lookAwayTarget = useRef({ x: 0, y: 0 })
  // Animation progress
  const animationProgress = useRef(0)
  // Wandering sequence tracking
  const wanderSequence = useRef<Array<{ x: number; y: number; duration: number }>>([])
  const currentWanderIndex = useRef(0)
  const wanderCount = useRef(0)
  const currentWanderDuration = useRef(0.8)

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
        currentWanderIndex.current = 0
        wanderSequence.current = []
      }
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

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

    // Check if mouse has been idle (no movement for 0.25 seconds)
    const timeSinceLastMove = Date.now() - lastMouseMoveTime.current
    const idleThreshold = 250 // 0.25 seconds

    // Handle idle state transitions - start wandering sequence
    if (idleState.current === 'following' && timeSinceLastMove > idleThreshold) {
      idleState.current = 'wandering'
      animationProgress.current = 0
      currentWanderIndex.current = 0
      // Generate exactly 3 wander points
      wanderCount.current = 3
      wanderSequence.current = []
      
      const currentX = smoothMousePos.current.x - centerX
      const currentY = smoothMousePos.current.y - centerY
      const baseAngle = Math.atan2(currentY, currentX)
      
      for (let i = 0; i < wanderCount.current; i++) {
        // Create wandering points with less erratic movement
        // Smaller angle variation and more controlled distances
        const angleVariation = (Math.random() - 0.5) * Math.PI * 0.8 // Reduced from 1.5
        const angle = baseAngle + Math.PI + angleVariation + (i * Math.PI * 0.25)
        const distance = 50 + Math.random() * 40 // Reduced from 80-140 to 50-90
        // Variable duration between 0.8 and 1.4 seconds for natural variation
        const duration = 0.8 + Math.random() * 0.6
        wanderSequence.current.push({
          x: centerX + Math.cos(angle) * distance,
          y: centerY + Math.sin(angle) * distance,
          duration: duration
        })
      }
      
      // Set first target and duration
      lookAwayTarget.current = {
        x: wanderSequence.current[0].x,
        y: wanderSequence.current[0].y
      }
      currentWanderDuration.current = wanderSequence.current[0].duration
    }

    // Smooth interpolation based on mouse delay parameter
    const lerpSpeed = params.mouseDelay === 0 ? 1 : Math.min(1, delta / (params.mouseDelay + 0.001))

    let targetX = 0
    let targetY = 0

    if (idleState.current === 'following') {
      // Normal mouse following
      smoothMousePos.current.x += (targetMousePos.current.x - smoothMousePos.current.x) * lerpSpeed
      smoothMousePos.current.y += (targetMousePos.current.y - smoothMousePos.current.y) * lerpSpeed
      
      const deltaX = smoothMousePos.current.x - centerX
      const deltaY = smoothMousePos.current.y - centerY
      targetX = deltaX * scaleX
      targetY = -deltaY * scaleY
    } else if (idleState.current === 'wandering') {
      // Wandering animation - slower, smoother movements with variable duration
      animationProgress.current += delta
      const duration = currentWanderDuration.current
      const t = Math.min(1, animationProgress.current / duration)
      // Smoother ease-in-out for less erratic movement
      const eased = t < 0.5 
        ? 2 * t * t 
        : 1 - Math.pow(-2 * t + 2, 2) / 2
      
      // Get start position (previous target or current position)
      const startX = currentWanderIndex.current === 0 
        ? smoothMousePos.current.x 
        : wanderSequence.current[currentWanderIndex.current - 1]?.x || smoothMousePos.current.x
      const startY = currentWanderIndex.current === 0 
        ? smoothMousePos.current.y 
        : wanderSequence.current[currentWanderIndex.current - 1]?.y || smoothMousePos.current.y
      
      smoothMousePos.current.x = startX + (lookAwayTarget.current.x - startX) * eased
      smoothMousePos.current.y = startY + (lookAwayTarget.current.y - startY) * eased
      
      const deltaX = smoothMousePos.current.x - centerX
      const deltaY = smoothMousePos.current.y - centerY
      targetX = deltaX * scaleX
      targetY = -deltaY * scaleY

      // Move to next wander point or start returning
      if (t >= 1) {
        currentWanderIndex.current++
        if (currentWanderIndex.current < wanderSequence.current.length) {
          // Continue to next wander point with its specific duration
          const nextWander = wanderSequence.current[currentWanderIndex.current]
          lookAwayTarget.current = {
            x: nextWander.x,
            y: nextWander.y
          }
          currentWanderDuration.current = nextWander.duration
          animationProgress.current = 0
        } else {
          // Finished wandering, return to center
          idleState.current = 'returning'
          animationProgress.current = 0
        }
      }
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
      targetX = deltaX * scaleX
      targetY = -deltaY * scaleY

      if (t >= 1) {
        idleState.current = 'centered'
        animationProgress.current = 0
      }
    } else if (idleState.current === 'centered') {
      // Stay centered
      smoothMousePos.current.x = centerX
      smoothMousePos.current.y = centerY
      targetX = 0
      targetY = 0
    }

    // Look at the target point
    groupRef.current.lookAt(targetX, targetY, params.lookAtDepth)
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
      
      const numPoints = Math.max(32, params.widthSegments * 2) // Smooth curves
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
      
      const numPoints = Math.max(32, params.heightSegments * 2) // Smooth curves
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
    return null // Will use tubes instead
  }, [lineColor, params.horizontalStrokeWidth, params.strokeOpacity])

  const verticalLineMaterial = useMemo(() => {
    if (params.verticalStrokeWidth <= 0.01) {
      return new THREE.LineBasicMaterial({
        color: lineColor,
        opacity: params.strokeOpacity,
        transparent: params.strokeOpacity < 1.0,
      })
    }
    return null // Will use tubes instead
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

  // Create background oval geometries
  const backgroundOvals = useMemo(() => {
    if (!params.showBackgroundOvals) return []
    
    const ovals: THREE.BufferGeometry[] = []
    
    for (let i = 0; i < params.backgroundOvalCount; i++) {
      const scale = 1 + (i * params.backgroundOvalSpacing)
      const width = params.backgroundOvalWidth * scale
      const height = params.backgroundOvalHeight * scale
      const segments = 64 // Smooth curves
      const positions: number[] = []
      
      // Create ellipse points
      for (let j = 0; j < segments; j++) {
        const angle1 = (j / segments) * Math.PI * 2
        const angle2 = ((j + 1) / segments) * Math.PI * 2
        
        const x1 = width * Math.cos(angle1)
        const y1 = height * Math.sin(angle1)
        const z1 = 0
        
        const x2 = width * Math.cos(angle2)
        const y2 = height * Math.sin(angle2)
        const z2 = 0
        
        positions.push(x1, y1, z1, x2, y2, z2)
      }
      
      const bufferGeometry = new THREE.BufferGeometry()
      bufferGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
      ovals.push(bufferGeometry)
    }
    
    return ovals
  }, [
    params.showBackgroundOvals,
    params.backgroundOvalCount,
    params.backgroundOvalWidth,
    params.backgroundOvalHeight,
    params.backgroundOvalSpacing
  ])

  // Background oval material
  const backgroundOvalMaterial = useMemo(() => {
    if (params.backgroundOvalStrokeWidth > 0.01) {
      return new THREE.MeshBasicMaterial({
        color: lineColor,
        opacity: params.strokeOpacity,
        transparent: params.strokeOpacity < 1.0,
      })
    }
    return new THREE.LineBasicMaterial({
      color: lineColor,
      opacity: params.strokeOpacity,
      transparent: params.strokeOpacity < 1.0,
    })
  }, [lineColor, params.backgroundOvalStrokeWidth, params.strokeOpacity])

  // Background oval tubes for thick strokes
  const backgroundOvalTubes = useMemo(() => {
    if (!params.showBackgroundOvals || params.backgroundOvalStrokeWidth <= 0.01) return []
    
    const tubes: Array<{ geometry: THREE.BufferGeometry; position: THREE.Vector3; quaternion: THREE.Quaternion }> = []
    const strokeRadius = params.backgroundOvalStrokeWidth * 0.01
    
    for (let i = 0; i < params.backgroundOvalCount; i++) {
      const scale = 1 + (i * params.backgroundOvalSpacing)
      const width = params.backgroundOvalWidth * scale
      const height = params.backgroundOvalHeight * scale
      const segments = 64
      
      for (let j = 0; j < segments; j++) {
        const angle1 = (j / segments) * Math.PI * 2
        const angle2 = ((j + 1) / segments) * Math.PI * 2
        
        const x1 = width * Math.cos(angle1)
        const y1 = height * Math.sin(angle1)
        const z1 = 0
        
        const x2 = width * Math.cos(angle2)
        const y2 = height * Math.sin(angle2)
        const z2 = 0
        
        const start = new THREE.Vector3(x1, y1, z1)
        const end = new THREE.Vector3(x2, y2, z2)
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
    }
    
    return tubes
  }, [
    params.showBackgroundOvals,
    params.backgroundOvalCount,
    params.backgroundOvalWidth,
    params.backgroundOvalHeight,
    params.backgroundOvalSpacing,
    params.backgroundOvalStrokeWidth
  ])

  return (
    <>
      {/* Background ovals - rendered first so they appear behind, flat in XY plane, NOT interactive */}
      {params.showBackgroundOvals && (
        <group position={[0, 0, -0.1]}>
          {params.backgroundOvalStrokeWidth > 0.01 ? (
            backgroundOvalTubes.map((tube, idx) => (
              <mesh
                key={`oval-tube-${idx}`}
                geometry={tube.geometry}
                material={backgroundOvalMaterial}
                position={tube.position}
                quaternion={tube.quaternion}
              />
            ))
          ) : (
            backgroundOvals.map((ovalGeometry, idx) => (
              <lineSegments
                key={`oval-${idx}`}
                geometry={ovalGeometry}
                material={backgroundOvalMaterial}
              />
            ))
          )}
        </group>
      )}
      
      {/* Interactive sphere group - rotates to follow mouse */}
      <group ref={groupRef}>
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
    </>
  )
}

export default function Sphere2Page() {
  const router = useRouter()
  
  // Default parameters - locked in from saved configuration
  const defaultParams: SphereParams = {
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
  }

  // Load saved parameters from localStorage (using separate key for sphere2)
  const loadSavedParams = (): SphereParams => {
    if (typeof window === 'undefined') return defaultParams
    const saved = localStorage.getItem('sphere2Params')
    if (saved) {
      try {
        return { ...defaultParams, ...JSON.parse(saved) }
      } catch {
        return defaultParams
      }
    }
    return defaultParams
  }

  const [params, setParams] = useState<SphereParams>(defaultParams)
  const [showControls, setShowControls] = useState(true)
  const [hasSavedParams, setHasSavedParams] = useState(false)
  const [showEnterButton, setShowEnterButton] = useState(false)
  const [mouseMoveCount, setMouseMoveCount] = useState(0)
  const [isFadingOut, setIsFadingOut] = useState(false)

  // Load saved parameters on mount
  useEffect(() => {
    const saved = loadSavedParams()
    if (saved !== defaultParams) {
      setParams(saved)
      setHasSavedParams(true)
      // Log saved parameters to console
      console.log('📦 Loaded saved parameters (sphere2):', saved)
    } else {
      // Log current params if no saved ones
      console.log('📦 Current parameters (sphere2):', params)
    }
  }, [])

  // Track mouse movement to show Enter button
  useEffect(() => {
    let lastMoveTime = Date.now()
    let moveCount = 0
    const threshold = 10 // Show after 10 significant moves
    
    const handleMouseMove = () => {
      const now = Date.now()
      // Only count moves that are at least 100ms apart to avoid counting tiny jitters
      if (now - lastMoveTime > 100) {
        moveCount++
        setMouseMoveCount(moveCount)
        lastMoveTime = now
        
        if (moveCount >= threshold && !showEnterButton) {
          setShowEnterButton(true)
        }
      }
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [showEnterButton])

  const updateParam = (key: keyof SphereParams, value: number | string | boolean) => {
    setParams((prev) => {
      const updated = { ...prev, [key]: value }
      // Auto-save to localStorage for real-time sync
      try {
        localStorage.setItem('sphere2Params', JSON.stringify(updated))
        // Trigger custom event for same-tab sync
        window.dispatchEvent(new CustomEvent('sphere2ParamsUpdated', { detail: updated }))
      } catch (error) {
        console.warn('Failed to auto-save:', error)
      }
      return updated
    })
  }

  // Listen for updates from landing page or other components
  useEffect(() => {
    const handleUpdate = (e: CustomEvent) => {
      setParams(e.detail)
      setHasSavedParams(true)
    }
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sphere2Params' && e.newValue) {
        try {
          const newParams = { ...defaultParams, ...JSON.parse(e.newValue) }
          setParams(newParams)
          setHasSavedParams(true)
        } catch {
          // Ignore parse errors
        }
      }
    }
    window.addEventListener('sphere2ParamsUpdated', handleUpdate as EventListener)
    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('sphere2ParamsUpdated', handleUpdate as EventListener)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const saveParams = () => {
    try {
      localStorage.setItem('sphere2Params', JSON.stringify(params))
      setHasSavedParams(true)
      // Trigger storage event for cross-tab sync
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'sphere2Params',
        newValue: JSON.stringify(params)
      }))
      // Show a subtle notification instead of alert
      const notification = document.createElement('div')
      notification.textContent = '✓ Saved'
      notification.className = 'fixed top-20 right-4 bg-green-500/90 text-white px-4 py-2 rounded text-sm z-50'
      document.body.appendChild(notification)
      setTimeout(() => notification.remove(), 2000)
    } catch (error) {
      alert('Failed to save parameters')
    }
  }

  const resetParams = () => {
    if (confirm('Reset all parameters to defaults?')) {
      setParams(defaultParams)
      localStorage.removeItem('sphere2Params')
      setHasSavedParams(false)
    }
  }

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

      {/* Control Panel */}
      {showControls && (
        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-white text-sm w-64 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Controls (Sphere2)</h2>
            <button
              onClick={() => setShowControls(false)}
              className="text-white/60 hover:text-white"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            {/* Geometry */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-white/60 mb-2">Geometry</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs mb-1">
                    Radius: {params.radius.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={params.radius}
                    onChange={(e) => updateParam('radius', parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">
                    Width Segments (Vertical Lines): {params.widthSegments}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="1"
                    value={params.widthSegments}
                    onChange={(e) => updateParam('widthSegments', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-white/40 mt-1">
                    {params.widthSegments === 0 ? 'Hidden' : `${params.widthSegments} vertical lines`}
                  </p>
                </div>
                <div>
                  <label className="block text-xs mb-1">
                    Height Segments (Horizontal Rings): {params.heightSegments}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="1"
                    value={params.heightSegments}
                    onChange={(e) => updateParam('heightSegments', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-white/40 mt-1">
                    {params.heightSegments === 0 ? 'Hidden' : `${params.heightSegments} horizontal rings`}
                  </p>
                </div>
                <div>
                  <label className="block text-xs mb-1">
                    Inner Sphere Offset: {params.innerSphereOffset.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="0.5"
                    step="0.01"
                    value={params.innerSphereOffset}
                    onChange={(e) => updateParam('innerSphereOffset', parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Colors */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-white/60 mb-2">Colors</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs mb-1">Fill Color</label>
                  <input
                    type="color"
                    value={params.fillColor}
                    onChange={(e) => updateParam('fillColor', e.target.value)}
                    className="w-full h-8 rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">Line Color</label>
                  <input
                    type="color"
                    value={params.lineColor}
                    onChange={(e) => updateParam('lineColor', e.target.value)}
                    className="w-full h-8 rounded"
                  />
                </div>
              </div>
            </div>

            {/* Stroke */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-white/60 mb-2">Stroke</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs mb-1">
                    Horizontal Stroke Width: {params.horizontalStrokeWidth.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="0.1"
                    value={params.horizontalStrokeWidth}
                    onChange={(e) => updateParam('horizontalStrokeWidth', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-white/40 mt-1">
                    {params.horizontalStrokeWidth <= 0.01 ? 'Thin lines' : 'Thick tubes'}
                  </p>
                </div>
                <div>
                  <label className="block text-xs mb-1">
                    Vertical Stroke Width: {params.verticalStrokeWidth.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="0.1"
                    value={params.verticalStrokeWidth}
                    onChange={(e) => updateParam('verticalStrokeWidth', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-white/40 mt-1">
                    {params.verticalStrokeWidth <= 0.01 ? 'Thin lines' : 'Thick tubes'}
                  </p>
                </div>
                <div>
                  <label className="block text-xs mb-1">
                    Stroke Opacity: {params.strokeOpacity.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={params.strokeOpacity}
                    onChange={(e) => updateParam('strokeOpacity', parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Background Ovals */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-white/60 mb-2">Background Ovals</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="showBackgroundOvals"
                    checked={params.showBackgroundOvals}
                    onChange={(e) => updateParam('showBackgroundOvals', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="showBackgroundOvals" className="text-xs">
                    Show Background Ovals
                  </label>
                </div>
                {params.showBackgroundOvals && (
                  <>
                    <div>
                      <label className="block text-xs mb-1">
                        Oval Count: {params.backgroundOvalCount}
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={params.backgroundOvalCount}
                        onChange={(e) => updateParam('backgroundOvalCount', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">
                        Oval Width: {params.backgroundOvalWidth.toFixed(2)}
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="8"
                        step="0.1"
                        value={params.backgroundOvalWidth}
                        onChange={(e) => updateParam('backgroundOvalWidth', parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">
                        Oval Height: {params.backgroundOvalHeight.toFixed(2)}
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="5"
                        step="0.1"
                        value={params.backgroundOvalHeight}
                        onChange={(e) => updateParam('backgroundOvalHeight', parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">
                        Oval Spacing: {params.backgroundOvalSpacing.toFixed(2)}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={params.backgroundOvalSpacing}
                        onChange={(e) => updateParam('backgroundOvalSpacing', parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">
                        Oval Stroke Width: {params.backgroundOvalStrokeWidth.toFixed(2)}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        step="0.1"
                        value={params.backgroundOvalStrokeWidth}
                        onChange={(e) => updateParam('backgroundOvalStrokeWidth', parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <p className="text-xs text-white/40 mt-1">
                        {params.backgroundOvalStrokeWidth <= 0.01 ? 'Thin lines' : 'Thick tubes'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs mb-1">Oval Stroke Color</label>
                      <input
                        type="color"
                        value={params.backgroundOvalColor}
                        onChange={(e) => updateParam('backgroundOvalColor', e.target.value)}
                        className="w-full h-8 rounded"
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/20">
                      <input
                        type="checkbox"
                        id="showEquatorLine"
                        checked={params.showEquatorLine}
                        onChange={(e) => updateParam('showEquatorLine', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <label htmlFor="showEquatorLine" className="text-xs">
                        Show Equator Line
                      </label>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Logo Controls */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-white/60 mb-2">Logo</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="showLogo"
                    checked={params.showLogo}
                    onChange={(e) => updateParam('showLogo', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="showLogo" className="text-xs">
                    Show Logo
                  </label>
                </div>
                {params.showLogo && (
                  <>
                    <div>
                      <label className="block text-xs mb-1">
                        Logo Scale: {params.logoScale.toFixed(2)}
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="3"
                        step="0.05"
                        value={params.logoScale}
                        onChange={(e) => updateParam('logoScale', parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">
                        Logo X Position: {params.logoX}px
                      </label>
                      <input
                        type="range"
                        min="-500"
                        max="500"
                        step="5"
                        value={params.logoX}
                        onChange={(e) => updateParam('logoX', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">
                        Logo Y Position: {params.logoY}px
                      </label>
                      <input
                        type="range"
                        min="-500"
                        max="500"
                        step="5"
                        value={params.logoY}
                        onChange={(e) => updateParam('logoY', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">
                        Logo Opacity: {params.logoOpacity.toFixed(2)}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={params.logoOpacity}
                        onChange={(e) => updateParam('logoOpacity', parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Camera & Interaction */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-white/60 mb-2">Camera & Interaction</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs mb-1">
                    Camera Zoom: {params.cameraZoom.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="0.5"
                    value={params.cameraZoom}
                    onChange={(e) => updateParam('cameraZoom', parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">
                    Look Sensitivity: {params.lookAtDepth.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="1"
                    value={params.lookAtDepth}
                    onChange={(e) => updateParam('lookAtDepth', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">
                    Mouse Delay: {params.mouseDelay.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.01"
                    value={params.mouseDelay}
                    onChange={(e) => updateParam('mouseDelay', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-white/40 mt-1">
                    {params.mouseDelay === 0 ? 'Instant' : params.mouseDelay < 0.5 ? 'Smooth' : 'Very slow'}
                  </p>
                </div>
              </div>
            </div>

            {/* Save & Reset */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-white/60 mb-2">Settings</h3>
              {hasSavedParams && (
                <p className="text-xs text-green-400 mb-2">✓ Parameters saved</p>
              )}
              <div className="flex gap-2 mb-2">
                <button
                  onClick={saveParams}
                  className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded px-3 py-2 text-xs transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={resetParams}
                  className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded px-3 py-2 text-xs transition-colors"
                >
                  Reset
                </button>
              </div>
              <button
                onClick={() => {
                  const saved = localStorage.getItem('sphere2Params')
                  if (saved) {
                    const params = JSON.parse(saved)
                    console.log('📦 Current saved parameters (sphere2):', params)
                    const display = Object.entries(params)
                      .map(([key, value]) => `${key}: ${typeof value === 'number' ? (value % 1 === 0 ? value.toString() : value.toFixed(2)) : value}`)
                      .join('\n')
                    alert('Current saved parameters:\n\n' + display + '\n\n(Also logged to console)')
                  } else {
                    alert('No saved parameters found')
                  }
                }}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded px-3 py-2 text-xs transition-colors text-white/60"
              >
                Show Saved Params
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle button when controls are hidden */}
      {!showControls && (
        <button
          onClick={() => setShowControls(true)}
          className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 text-white text-sm hover:bg-black/90"
        >
          Show Controls
        </button>
      )}
    </div>
  )
}

