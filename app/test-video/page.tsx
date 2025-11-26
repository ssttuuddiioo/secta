'use client'

import { VideoWithShader } from '@/components/VideoWithShader'

export default function TestVideoPage() {
  // Hardcoded video URL for testing
  const videoUrl = "/got.mp4"

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



