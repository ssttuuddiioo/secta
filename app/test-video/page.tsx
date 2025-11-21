'use client'

import { VideoWithShader } from '@/components/VideoWithShader'

export default function TestVideoPage() {
  // Hardcoded video URL for testing
  const videoUrl = "https://cdn.sanity.io/files/b57ph2jj/production/91541da2e6b04031a7b5bd07c5ed980c4d7a411d.mp4"

  return (
    <div className="w-full h-screen bg-black relative">
      <VideoWithShader 
        videoUrl={videoUrl} 
        effect={1} // Force effect enabled
        isMuted={true} 
      />
      
      <div className="absolute bottom-10 left-10 z-50 font-mono text-white text-sm">
        PERMANENT SOLARIZE EFFECT
      </div>
    </div>
  )
}


