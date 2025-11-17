'use client'

import { Volume2, VolumeX } from 'lucide-react'
import { useState } from 'react'

interface VideoControlsProps {
  onMuteToggle: (muted: boolean) => void
  className?: string
}

export function VideoControls({ onMuteToggle, className = '' }: VideoControlsProps) {
  const [isMuted, setIsMuted] = useState(true)

  const handleToggle = () => {
    const newMutedState = !isMuted
    setIsMuted(newMutedState)
    onMuteToggle(newMutedState)
  }

  return (
    <button
      onClick={handleToggle}
      className={`fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 min-h-[44px] min-w-[44px] p-2.5 sm:p-3 bg-black/50 hover:bg-black/70 active:bg-black/80 text-white rounded-full transition-all touch-manipulation ${className}`}
      aria-label={isMuted ? 'Unmute video' : 'Mute video'}
    >
      {isMuted ? (
        <VolumeX size={20} className="sm:w-6 sm:h-6" strokeWidth={2} />
      ) : (
        <Volume2 size={20} className="sm:w-6 sm:h-6" strokeWidth={2} />
      )}
    </button>
  )
}

