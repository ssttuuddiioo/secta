'use client'

interface DotGridOverlayProps {
  dotColor?: string
  dotSize?: number // size of the dot itself in px (radius approx)
  spacing?: number // spacing between dots in px
  opacity?: number
}

export function DotGridOverlay({ 
  dotColor = 'rgba(255, 255, 255, 0.15)', 
  dotSize = 1, 
  spacing = 24,
  opacity = 0.5
}: DotGridOverlayProps) {
  return (
    <div 
      className="absolute inset-0 z-10 pointer-events-none transition-all duration-300"
      style={{
        backgroundImage: `radial-gradient(${dotColor} ${dotSize}px, transparent ${dotSize}px)`,
        backgroundSize: `${spacing}px ${spacing}px`,
        opacity: opacity
      }}
    />
  )
}
