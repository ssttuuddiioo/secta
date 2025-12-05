'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { InteractiveSphere } from '@/components/InteractiveSphere'

// Sphere parameters optimized for header display
const headerSphereParams = {
  radius: 5.0,
  widthSegments: 18,
  heightSegments: 20,
  fillColor: '#FFF9DF', // Cream to match header background
  lineColor: '#FF6B35', // Orange to match branding
  innerSphereOffset: 0.15,
  cameraZoom: 4, // Lower zoom = camera further away, sphere appears smaller
  lookAtDepth: 23.0,
  horizontalStrokeWidth: 9.2,
  verticalStrokeWidth: 10.1,
  strokeOpacity: 1.0,
  mouseDelay: 0.1,
  showBackgroundOvals: false,
  backgroundOvalCount: 3,
  backgroundOvalWidth: 3.5,
  backgroundOvalHeight: 2.0,
  backgroundOvalSpacing: 0.3,
  backgroundOvalStrokeWidth: 0,
  backgroundOvalColor: '#0FFF9DF',
  showEquatorLine: false,
  showMeridianLine: false,
}

export function HeaderLogo() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <Link href="/" className="inline-flex" style={{ marginLeft: '-15px' }}>
      {/* Outer container - visible size with overflow hidden for cropping */}
      <div 
        ref={containerRef}
        className="relative h-[32px] w-[32px] sm:h-[40px] sm:w-[40px] md:h-[48px] md:w-[48px] overflow-hidden cursor-pointer"
      >
        {/* Interactive sphere - positioned behind the C logo */}
        <div 
          className="absolute z-10"
          style={{ 
            width: '180px', 
            height: '180px',
            // Position to center the sphere within the visible cropped area
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none', // Allow clicks to pass through to Link
          }}
        >
          <InteractiveSphere
            radius={headerSphereParams.radius}
            widthSegments={headerSphereParams.widthSegments}
            heightSegments={headerSphereParams.heightSegments}
            fillColor={headerSphereParams.fillColor}
            lineColor={headerSphereParams.lineColor}
            innerSphereOffset={headerSphereParams.innerSphereOffset}
            cameraZoom={headerSphereParams.cameraZoom}
            lookAtDepth={headerSphereParams.lookAtDepth}
            horizontalStrokeWidth={headerSphereParams.horizontalStrokeWidth}
            verticalStrokeWidth={headerSphereParams.verticalStrokeWidth}
            strokeOpacity={headerSphereParams.strokeOpacity}
            mouseDelay={headerSphereParams.mouseDelay}
            showBackgroundOvals={headerSphereParams.showBackgroundOvals}
            backgroundOvalCount={headerSphereParams.backgroundOvalCount}
            backgroundOvalWidth={headerSphereParams.backgroundOvalWidth}
            backgroundOvalHeight={headerSphereParams.backgroundOvalHeight}
            backgroundOvalSpacing={headerSphereParams.backgroundOvalSpacing}
            backgroundOvalStrokeWidth={headerSphereParams.backgroundOvalStrokeWidth}
            backgroundOvalColor={headerSphereParams.backgroundOvalColor}
            showEquatorLine={headerSphereParams.showEquatorLine}
            showMeridianLine={headerSphereParams.showMeridianLine}
          />
        </div>
        
        {/* Blue C logo - positioned on top to frame the sphere */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <Image 
            src="/homelogo.svg" 
            alt="SECTA" 
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </Link>
  )
}

