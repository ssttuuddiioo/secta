'use client'

import { VideoWithShader } from '@/components/VideoWithShader'
import { EffectNavigation } from '@/components/EffectNavigation'

export default function TritonePage() {
  // Testing with public video first to rule out CORS
  const videoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  // const videoUrl = "https://cdn.sanity.io/files/b57ph2jj/production/91541da2e6b04031a7b5bd07c5ed980c4d7a411d.mp4"

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
