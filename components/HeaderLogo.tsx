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
    <Link href="/" className="inline-flex items-center" style={{ marginLeft: '-8px' }}>
      {/* Logo container with sphere overlay */}
      <div className="relative" ref={containerRef}>
        {/* SECTA Logo - Blue (#3AAAFF) - 1.3x bigger */}
        <div className="relative h-[36px] sm:h-[42px] md:h-[57px] w-auto">
          <Image 
            src="/SectaLogo.svg" 
            alt="SECTA" 
            width={203}
            height={55}
            className="h-full w-auto"
            style={{
              // Filter to convert black SVG to #3AAAFF blue
              filter: 'brightness(0) saturate(100%) invert(57%) sepia(89%) saturate(1721%) hue-rotate(186deg) brightness(101%) contrast(104%)',
            }}
            priority
          />
        </div>
        
        {/* Sphere overlay - positioned inside the C, hidden on mobile */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 hidden md:block"
          style={{ 
            left: '115px', // Move sphere 100px to the right to sit inside the C
            width: '20px',
            height: '20px',
            zIndex: 10,
          }}
        >
          {/* Interactive sphere */}
          <div 
            className="absolute"
            style={{ 
              width: '100px', 
              height: '100px',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
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
        </div>
      </div>
    </Link>
  )
}

