'use client'

import { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'

function EyeScene() {
  const groupRef = useRef<THREE.Group>(null)
  const { viewport, gl, camera } = useThree()
  
  // Store global mouse position
  const mousePos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mousePos.current = {
        x: event.clientX,
        y: event.clientY
      }
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
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

  useFrame(() => {
    if (!groupRef.current || !rectRef.current) return

    const rect = rectRef.current
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Calculate vector from center of eye to mouse
    const deltaX = mousePos.current.x - centerX
    const deltaY = mousePos.current.y - centerY

    // Convert pixel delta to 3D world units
    // For orthographic camera:
    // viewport.width corresponds to rect.width
    const scaleX = viewport.width / rect.width
    const scaleY = viewport.height / rect.height

    const x = deltaX * scaleX
    const y = -deltaY * scaleY // Invert Y because screen Y is down, 3D Y is up

    // Depth determines sensitivity.
    // If mouse is 100px away, and we put target at Z=100 (scaled), the angle is 45 deg.
    // Let's adjust Z to control how "follow-y" it is.
    // A fixed Z distance works well for "looking at a plane in front".
    const lookAtDepth = 20 // Tune this value. Larger = less rotation for same mouse movement.

    // We want the group to look at the target point
    // target = (x, y, lookAtDepth) relative to group position (0,0,0)
    groupRef.current.lookAt(x, y, lookAtDepth)
  })

  return (
    <group ref={groupRef}>
      {/* 
         Rotate sphere -90 deg on X axis.
         Original Sphere Y (Top) becomes aligned with Group Z (Forward).
         So when Group looks at target (Z points to target), Sphere Top points to target.
      */}
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <Sphere args={[2.8, 24, 24]}>
          <meshBasicMaterial color="white" wireframe transparent opacity={0.5} />
        </Sphere>
      </group>
    </group>
  )
}

export function SphereEye({ className }: { className?: string }) {
  return (
    <div className={`${className} w-24 h-24`}>
      <Canvas 
        orthographic 
        camera={{ zoom: 15, position: [0, 0, 10] }} 
        gl={{ alpha: true, antialias: true }}
      >
        <EyeScene />
      </Canvas>
    </div>
  )
}
