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
    <Link href="/" className="inline-flex items-center gap-2" style={{ marginLeft: '-8px' }}>
      {/* Sphere container - cropped circle */}
      <div 
        ref={containerRef}
        className="relative h-[32px] w-[32px] sm:h-[40px] sm:w-[40px] md:h-[48px] md:w-[48px] overflow-hidden cursor-pointer"
      >
        {/* Interactive sphere */}
        <div 
          className="absolute z-10"
          style={{ 
            width: '180px', 
            height: '180px',
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
      
      {/* SECTA Logo - Blue (#3AAAFF) */}
      <div className="relative h-[24px] sm:h-[28px] md:h-[32px] w-auto">
        <Image 
          src="/SectaLogo.svg" 
          alt="SECTA" 
          width={120}
          height={32}
          className="h-full w-auto"
          style={{
            // Filter to convert black SVG to #3AAAFF blue
            filter: 'brightness(0) saturate(100%) invert(57%) sepia(89%) saturate(1721%) hue-rotate(186deg) brightness(101%) contrast(104%)',
          }}
          priority
        />
      </div>
    </Link>
  )
}

