'use client'

import { VideoWithShader } from '@/components/VideoWithShader'
import { EffectNavigation } from '@/components/EffectNavigation'

export default function CyanotypePage() {
  const videoUrl = "/got.mp4"

  return (
    <div className="w-full h-screen bg-black relative">
      <VideoWithShader 
        videoUrl={videoUrl} 
        effect={5} // Cyanotype
        isMuted={true} 
      />
      <EffectNavigation />
    </div>
  )
}
