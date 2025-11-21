'use client'

import { useRef, useEffect, useMemo, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'

interface InteractiveSphereParams {
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
  showMeridianLine?: boolean
  className?: string
}

const defaultParams: Required<InteractiveSphereParams> = {
  radius: 4.4,
  widthSegments: 25,
  heightSegments: 25,
  fillColor: '#ff0000',
  lineColor: '#000000',
  innerSphereOffset: 0.07,
  cameraZoom: 13.0,
  lookAtDepth: 23.0,
  horizontalStrokeWidth: 0,
  verticalStrokeWidth: 0,
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
  showMeridianLine: false,
  className: '',
}

function EyeScene({ params }: { params: Required<InteractiveSphereParams> }) {
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
  const backgroundOvalLineColor = useMemo(() => new THREE.Color(params.backgroundOvalColor), [params.backgroundOvalColor])

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
        color: backgroundOvalLineColor,
        opacity: params.strokeOpacity,
        transparent: params.strokeOpacity < 1.0,
      })
    }
    return new THREE.LineBasicMaterial({
      color: backgroundOvalLineColor,
      opacity: params.strokeOpacity,
      transparent: params.strokeOpacity < 1.0,
    })
  }, [backgroundOvalLineColor, params.backgroundOvalStrokeWidth, params.strokeOpacity])

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

  // Equator line geometry - horizontal line that splits the ovals
  const equatorLineGeometry = useMemo(() => {
    if (!params.showEquatorLine || !params.showBackgroundOvals) return null
    
    // Calculate the width of the largest oval
    const maxScale = 1 + ((params.backgroundOvalCount - 1) * params.backgroundOvalSpacing)
    const maxWidth = params.backgroundOvalWidth * maxScale
    
    // Create a horizontal line at y=0 (equator) spanning the width
    const positions: number[] = [
      -maxWidth, 0, 0,  // Start point
      maxWidth, 0, 0    // End point
    ]
    
    const bufferGeometry = new THREE.BufferGeometry()
    bufferGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return bufferGeometry
  }, [
    params.showEquatorLine,
    params.showBackgroundOvals,
    params.backgroundOvalCount,
    params.backgroundOvalSpacing,
    params.backgroundOvalWidth
  ])

  // Equator line tube for thick strokes
  const equatorLineTube = useMemo(() => {
    if (!params.showEquatorLine || !params.showBackgroundOvals || params.backgroundOvalStrokeWidth <= 0.01) return null
    
    // Calculate the width of the largest oval
    const maxScale = 1 + ((params.backgroundOvalCount - 1) * params.backgroundOvalSpacing)
    const maxWidth = params.backgroundOvalWidth * maxScale
    const strokeRadius = params.backgroundOvalStrokeWidth * 0.01
    
    const start = new THREE.Vector3(-maxWidth, 0, 0)
    const end = new THREE.Vector3(maxWidth, 0, 0)
    const direction = new THREE.Vector3().subVectors(end, start)
    const length = direction.length()
    
    if (length > 0.001) {
      const tubeGeometry = new THREE.CylinderGeometry(strokeRadius, strokeRadius, length, 6, 1)
      const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
      const up = new THREE.Vector3(0, 1, 0)
      const dirNormalized = direction.clone().normalize()
      const quaternion = new THREE.Quaternion().setFromUnitVectors(up, dirNormalized)
      
      return { geometry: tubeGeometry, position: midPoint, quaternion }
    }
    
    return null
  }, [
    params.showEquatorLine,
    params.showBackgroundOvals,
    params.backgroundOvalCount,
    params.backgroundOvalSpacing,
    params.backgroundOvalWidth,
    params.backgroundOvalStrokeWidth
  ])

  // Meridian line geometry - vertical line that splits the ovals
  const meridianLineGeometry = useMemo(() => {
    if (!params.showMeridianLine || !params.showBackgroundOvals) return null
    
    // Calculate the height of the largest oval
    const maxScale = 1 + ((params.backgroundOvalCount - 1) * params.backgroundOvalSpacing)
    const maxHeight = params.backgroundOvalHeight * maxScale
    
    // Create a vertical line at x=0 (meridian) spanning the height
    const positions: number[] = [
      0, -maxHeight, 0,  // Start point
      0, maxHeight, 0    // End point
    ]
    
    const bufferGeometry = new THREE.BufferGeometry()
    bufferGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return bufferGeometry
  }, [
    params.showMeridianLine,
    params.showBackgroundOvals,
    params.backgroundOvalCount,
    params.backgroundOvalSpacing,
    params.backgroundOvalHeight
  ])

  // Meridian line tube for thick strokes
  const meridianLineTube = useMemo(() => {
    if (!params.showMeridianLine || !params.showBackgroundOvals || params.backgroundOvalStrokeWidth <= 0.01) return null
    
    // Calculate the height of the largest oval
    const maxScale = 1 + ((params.backgroundOvalCount - 1) * params.backgroundOvalSpacing)
    const maxHeight = params.backgroundOvalHeight * maxScale
    const strokeRadius = params.backgroundOvalStrokeWidth * 0.01
    
    const start = new THREE.Vector3(0, -maxHeight, 0)
    const end = new THREE.Vector3(0, maxHeight, 0)
    const direction = new THREE.Vector3().subVectors(end, start)
    const length = direction.length()
    
    if (length > 0.001) {
      const tubeGeometry = new THREE.CylinderGeometry(strokeRadius, strokeRadius, length, 6, 1)
      const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
      const up = new THREE.Vector3(0, 1, 0)
      const dirNormalized = direction.clone().normalize()
      const quaternion = new THREE.Quaternion().setFromUnitVectors(up, dirNormalized)
      
      return { geometry: tubeGeometry, position: midPoint, quaternion }
    }
    
    return null
  }, [
    params.showMeridianLine,
    params.showBackgroundOvals,
    params.backgroundOvalCount,
    params.backgroundOvalSpacing,
    params.backgroundOvalHeight,
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
          
          {/* Equator line - horizontal line that splits the ovals */}
          {params.showEquatorLine && equatorLineGeometry && (
            params.backgroundOvalStrokeWidth > 0.01 && equatorLineTube ? (
              <mesh
                geometry={equatorLineTube.geometry}
                material={backgroundOvalMaterial}
                position={equatorLineTube.position}
                quaternion={equatorLineTube.quaternion}
              />
            ) : (
              <lineSegments
                geometry={equatorLineGeometry}
                material={backgroundOvalMaterial}
              />
            )
          )}
          
          {/* Meridian line - vertical line that splits the ovals */}
          {params.showMeridianLine && meridianLineGeometry && (
            params.backgroundOvalStrokeWidth > 0.01 && meridianLineTube ? (
              <mesh
                geometry={meridianLineTube.geometry}
                material={backgroundOvalMaterial}
                position={meridianLineTube.position}
                quaternion={meridianLineTube.quaternion}
              />
            ) : (
              <lineSegments
                geometry={meridianLineGeometry}
                material={backgroundOvalMaterial}
              />
            )
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

export function InteractiveSphere(props: InteractiveSphereParams) {
  const mergedParams = useMemo(() => {
    // Ensure showEquatorLine is always defined
    return { ...defaultParams, ...props, showEquatorLine: props.showEquatorLine ?? defaultParams.showEquatorLine }
  }, [props])
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 200, height: 200 })
  
  // Update container size on mount and resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setContainerSize({ width: rect.width, height: rect.height })
      }
    }
    
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])
  
  // Adjust camera zoom to fit content within container
  // The sphere page uses full viewport, so we scale zoom for smaller containers
  const adjustedZoom = useMemo(() => {
    // Assume sphere page viewport is approximately 1920px wide
    const baseViewportWidth = 1920
    const containerWidth = containerSize.width || 200
    
    // For orthographic camera: zoom determines world-space viewport size
    // To show the same world content in a smaller screen space, we need lower zoom
    // (lower zoom = larger world viewport = content appears smaller but fits better)
    const scaleFactor = containerWidth / baseViewportWidth
    
    // Scale the zoom proportionally - smaller container = lower zoom to fit same content
    return mergedParams.cameraZoom * scaleFactor
  }, [mergedParams.cameraZoom, containerSize.width])
  
  return (
    <div 
      ref={containerRef} 
      className={`${mergedParams.className}`}
      style={{ 
        width: '100%', 
        height: '100%', 
        overflow: 'visible',
        position: 'relative'
      }}
    >
      <Canvas 
        orthographic 
        camera={{ zoom: adjustedZoom, position: [0, 0, 10] }} 
        gl={{ alpha: true, antialias: true }}
        style={{ overflow: 'visible' }}
      >
        <EyeScene params={mergedParams} />
      </Canvas>
    </div>
  )
}

