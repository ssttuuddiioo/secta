'use client'

export function CRTOverlay() {
  return (
    <div className="absolute inset-0 z-[15] pointer-events-none overflow-hidden mix-blend-hard-light">
      {/* Scan lines */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
          backgroundSize: '100% 4px, 3px 100%'
        }}
      />
      {/* Flicker/Vignette */}
      <div 
        className="absolute inset-0 bg-black/10"
        style={{
          boxShadow: 'inset 0 0 100px rgba(0,0,0,0.9)',
        }}
      />
    </div>
  )
}

