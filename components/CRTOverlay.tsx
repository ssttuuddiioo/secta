'use client'

export function CRTOverlay() {
  return (
    <div className="absolute inset-0 z-[15] pointer-events-none overflow-hidden mix-blend-hard-light">
      {/* Scan lines */}
      <div 
        className="absolute inset-0"
        style={{
          // Exaggerated scanlines: darker alternating lines (0.5 opacity), stronger RGB shift (0.18/0.06/0.18)
          background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.5) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.18), rgba(0, 255, 0, 0.06), rgba(0, 0, 255, 0.18))',
          backgroundSize: '100% 4px, 6px 100%'
        }}
      />
      {/* Flicker/Vignette */}
      <div 
        className="absolute inset-0 bg-black/10"
        style={{
          // Stronger vignette
          boxShadow: 'inset 0 0 150px rgba(0,0,0,0.95)',
        }}
      />
    </div>
  )
}

