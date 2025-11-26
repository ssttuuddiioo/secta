'use client'

import { VideoWithShader } from '@/components/VideoWithShader'
import { EffectNavigation } from '@/components/EffectNavigation'

export default function ScreenPrintPage() {
  const videoUrl = "/got.mp4"

  return (
    <div className="w-full h-screen bg-black relative">
      <VideoWithShader 
        videoUrl={videoUrl} 
        effect={4} // Screen Print
        isMuted={true} 
      />
      <EffectNavigation />
    </div>
  )
}
