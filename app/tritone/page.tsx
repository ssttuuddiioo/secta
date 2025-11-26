'use client'

import { VideoWithShader } from '@/components/VideoWithShader'
import { EffectNavigation } from '@/components/EffectNavigation'

export default function TritonePage() {
  const videoUrl = "/got.mp4"

  return (
    <div className="w-full h-screen bg-black relative">
      <VideoWithShader 
        videoUrl={videoUrl} 
        effect={1} // Tritone
        isMuted={true} 
      />
      <EffectNavigation />
    </div>
  )
}
