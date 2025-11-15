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
      className={`fixed bottom-6 left-6 z-50 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all ${className}`}
      aria-label={isMuted ? 'Unmute video' : 'Mute video'}
    >
      {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
    </button>
  )
}

