'use client'

import { usePathname } from 'next/navigation'
import { Linkedin, Video, Instagram } from 'lucide-react'

interface SocialIconsProps {
  linkedinUrl?: string
  videoUrl?: string
  instagramUrl?: string
}

export function SocialIcons({
  linkedinUrl = 'https://linkedin.com',
  videoUrl = 'https://youtube.com',
  instagramUrl = 'https://instagram.com',
}: SocialIconsProps) {
  const pathname = usePathname()
  
  // Only show on home page
  if (pathname !== '/') {
    return null
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white hover:opacity-80 transition-opacity"
        aria-label="LinkedIn"
      >
        <Linkedin size={24} strokeWidth={1.5} fill="none" />
      </a>
      <a
        href={videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white hover:opacity-80 transition-opacity"
        aria-label="Video"
      >
        <Video size={24} strokeWidth={1.5} fill="none" />
      </a>
      <a
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white hover:opacity-80 transition-opacity"
        aria-label="Instagram"
      >
        <Instagram size={24} strokeWidth={1.5} fill="none" />
      </a>
    </div>
  )
}

