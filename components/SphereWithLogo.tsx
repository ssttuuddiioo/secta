'use client'

import { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'

interface SphereWithLogoParams {
  radius?: number
  widthSegments?: number
  heightSegments?: number
  fillColor?: string
  lineColor?: string
  innerSphereOffset?: number
  cameraZoom?: number
  lookAtDepth?: number
  horizontalStrokeWidth?: number
  verticalStrokeWidth?: number
  strokeOpacity?: number
  mouseDelay?: number
  showBackgroundOvals?: boolean
  backgroundOvalCount?: number
  backgroundOvalWidth?: number
  backgroundOvalHeight?: number
  backgroundOvalSpacing?: number
  backgroundOvalStrokeWidth?: number
  backgroundOvalColor?: string
  showEquatorLine?: boolean
  showLogo?: boolean
  logoScale?: number
  logoX?: number
  logoY?: number
  logoOpacity?: number
  className?: string
}

const defaultParams = {
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

function EyeScene({ params }: { params: Required<SphereWithLogoParams> }) {
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
        const angleVariation = (Math.random() - 0.5) * Math.PI * 0.8
        const angle = baseAngle + Math.PI + angleVariation + (i * Math.PI * 0.25)
        const distance = 50 + Math.random() * 40
        const duration = 0.8 + Math.random() * 0.6
        wanderSequence.current.push({
          x: centerX + Math.cos(angle) * distance,
          y: centerY + Math.sin(angle) * distance,
          duration: duration
        })
      }
      
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
      // Wandering animation
      animationProgress.current += delta
      const duration = currentWanderDuration.current
      const t = Math.min(1, animationProgress.current / duration)
      const eased = t < 0.5 
        ? 2 * t * t 
        : 1 - Math.pow(-2 * t + 2, 2) / 2
      
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

      if (t >= 1) {
        currentWanderIndex.current++
        if (currentWanderIndex.current < wanderSequence.current.length) {
          const nextWander = wanderSequence.current[currentWanderIndex.current]
          lookAwayTarget.current = {
            x: nextWander.x,
            y: nextWander.y
          }
          currentWanderDuration.current = nextWander.duration
          animationProgress.current = 0
        } else {
          idleState.current = 'returning'
          animationProgress.current = 0
        }
      }
    } else if (idleState.current === 'returning') {
      // Return to center animation (1 second)
      animationProgress.current += delta
      const duration = 1.0
      const t = Math.min(1, animationProgress.current / duration)
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

  // Create horizontal rings geometry
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

  // Create vertical lines geometry
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
    <group ref={groupRef}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        {/* Inner black sphere */}
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
  )
}

export function SphereWithLogo(props: SphereWithLogoParams) {
  const mergedParams = useMemo(() => {
    return { ...defaultParams, ...props }
  }, [props])

  return (
    <div className={`relative w-full h-full ${mergedParams.className || ''}`}>
      {/* Logo behind the sphere */}
      {mergedParams.showLogo && (
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            transform: `translate(${mergedParams.logoX}px, ${mergedParams.logoY}px)`,
          }}
        >
          <img 
            src="/SectaLogo.svg" 
            alt="Secta Logo"
            style={{
              width: `${300 * mergedParams.logoScale}px`,
              height: 'auto',
              opacity: mergedParams.logoOpacity,
            }}
          />
        </div>
      )}
      
      <Canvas 
        orthographic 
        camera={{ zoom: mergedParams.cameraZoom, position: [0, 0, 10] }} 
        gl={{ alpha: true, antialias: true }}
      >
        <EyeScene params={mergedParams} />
      </Canvas>
    </div>
  )
}

