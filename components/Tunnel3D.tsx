'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'

type AnimationState = 'rolling' | 'falling' | 'faded' | 'logo'

interface Tunnel3DProps {
  scrollPositionRef: React.MutableRefObject<number>
  targetScrollRef: React.MutableRefObject<number>
  animationState: AnimationState
  setAnimationState: (state: AnimationState) => void
  sphereRadius: number
}

export function Tunnel3D({ 
  scrollPositionRef, 
  targetScrollRef, 
  animationState,
  setAnimationState,
  sphereRadius 
}: Tunnel3DProps) {
  const gridGroupRef = useRef<THREE.Group>(null)
  const sphereRef = useRef<THREE.Group>(null)
  const fallTimeRef = useRef(0)
  const fadeTimeRef = useRef(0)
  const planeRef = useRef<THREE.Mesh>(null)
  
  // Create grid plane geometry with enough segments for smooth warping
  const planeGeometry = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(40, 80, 80, 160)
    geometry.rotateX(-Math.PI / 2) // Rotate to be horizontal
    return geometry
  }, [])
  
  // Smooth scrolling and animation
  useFrame((state, delta) => {
    // Lerp the actual scroll position toward the target for smooth motion
    const lerpFactor = 0.08
    scrollPositionRef.current += (targetScrollRef.current - scrollPositionRef.current) * lerpFactor
    
    if (animationState === 'rolling') {
      // Move grid toward camera (negative Z direction)
      if (gridGroupRef.current) {
        gridGroupRef.current.position.z = scrollPositionRef.current
      }
      
      // Rotate sphere based on distance traveled
      // rotation = distance / radius
      if (sphereRef.current) {
        const rotationAngle = scrollPositionRef.current / sphereRadius
        sphereRef.current.rotation.x = rotationAngle
        
        // Lower sphere slightly to sit in the warp
        const warpDepth = 0.15
        sphereRef.current.position.y = sphereRadius - warpDepth * 0.3
      }
      
      // Warp the plane under the sphere - updates dynamically as sphere moves
      if (planeRef.current) {
        const positions = planeRef.current.geometry.attributes.position
        const originalPositions = planeGeometry.attributes.position
        
        // Apply subtle warp based on sphere position
        const warpRadius = sphereRadius * 1.5 // Area of influence - maximum 1.5x sphere radius
        const warpDepth = 0.025 // Subtle depression - just a bend, not a hole
        
        // Sphere is at world position (0, sphereRadius, 0)
        // Plane has moved to position (0, 0, scrollPositionRef.current)
        // In plane's local space, sphere appears at z = -scrollPositionRef.current
        const sphereZInLocalSpace = -scrollPositionRef.current
        const sphereXInLocalSpace = 0
        
        // Update all vertices
        for (let i = 0; i < positions.count; i++) {
          const x = originalPositions.getX(i)
          const z = originalPositions.getZ(i)
          const originalY = originalPositions.getY(i)
          
          // Distance from vertex to sphere center (in plane's local coordinates)
          const dx = x - sphereXInLocalSpace
          const dz = z - sphereZInLocalSpace
          const distance = Math.sqrt(dx * dx + dz * dz)
          
          if (distance < warpRadius) {
            // Smooth falloff using smooth step function
            const t = 1 - (distance / warpRadius)
            const smoothT = t * t * (3 - 2 * t) // Smoothstep
            const warp = -warpDepth * smoothT
            positions.setY(i, originalY + warp)
          } else {
            // Reset to original position if outside warp radius
            positions.setY(i, originalY)
          }
        }
        
        positions.needsUpdate = true
        planeRef.current.geometry.computeVertexNormals()
      }
    } else if (animationState === 'falling') {
      // Gravity-based fall physics
      fallTimeRef.current += delta
      const gravity = 9.8
      const fallDistance = -0.5 * gravity * fallTimeRef.current * fallTimeRef.current
      
      if (sphereRef.current) {
        sphereRef.current.position.y = sphereRadius + fallDistance
        
        // Continue rotating as it falls
        const rotationAngle = scrollPositionRef.current / sphereRadius + fallTimeRef.current * 2
        sphereRef.current.rotation.x = rotationAngle
      }
      
      // After falling for 1 second, start fade
      if (fallTimeRef.current > 1) {
        setAnimationState('faded')
        fadeTimeRef.current = 0
      }
    } else if (animationState === 'faded') {
      // Fade scene to black
      fadeTimeRef.current += delta
      
      // Fade all materials
      if (gridGroupRef.current) {
        gridGroupRef.current.traverse((child) => {
          if (child instanceof THREE.Line || child instanceof THREE.Mesh) {
            if (child.material) {
              const material = child.material as THREE.Material & { opacity?: number }
              if (!material.transparent) {
                material.transparent = true
              }
              material.opacity = Math.max(0, 1 - fadeTimeRef.current)
            }
          }
        })
      }
      
      if (sphereRef.current) {
        sphereRef.current.traverse((child) => {
          if (child instanceof THREE.Line || child instanceof THREE.Mesh) {
            if (child.material) {
              const material = child.material as THREE.Material & { opacity?: number }
              if (!material.transparent) {
                material.transparent = true
              }
              material.opacity = Math.max(0, 1 - fadeTimeRef.current)
            }
          }
        })
      }
      
      // After 1 second fade, show logo
      if (fadeTimeRef.current > 1) {
        setAnimationState('logo')
      }
    }
  })
  
  
  return (
    <>
      {/* Deformable Grid Plane */}
      <group ref={gridGroupRef} position={[0, 0, 0]}>
        <mesh ref={planeRef} geometry={planeGeometry}>
          <meshStandardMaterial 
            color="#4169e1"
            wireframe
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Plane edges - visible borders */}
        <lineSegments>
          <edgesGeometry args={[planeGeometry]} />
          <lineBasicMaterial color="#000000" linewidth={2} />
        </lineSegments>
      </group>
      
      {/* Wireframe Sphere with Shading */}
      <group ref={sphereRef} position={[0, sphereRadius - 0.05, 0]}>
        {/* Solid sphere with shading */}
        <Sphere args={[sphereRadius, 32, 32]}>
          <meshStandardMaterial 
            color="#e0e0e0"
            roughness={0.7}
            metalness={0.2}
          />
        </Sphere>
        
        {/* Wireframe overlay - only visible edges */}
        <Sphere args={[sphereRadius + 0.01, 16, 16]}>
          <meshBasicMaterial 
            color="#000000" 
            wireframe 
            transparent
            opacity={1}
          />
        </Sphere>
      </group>
    </>
  )
}

