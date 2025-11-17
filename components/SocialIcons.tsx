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
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col gap-3 sm:gap-4">
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="min-h-[44px] min-w-[44px] flex items-center justify-center text-white hover:opacity-80 active:opacity-70 transition-opacity touch-manipulation"
        aria-label="LinkedIn"
      >
        <Linkedin size={20} className="sm:w-6 sm:h-6" strokeWidth={1.5} fill="none" />
      </a>
      <a
        href={videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="min-h-[44px] min-w-[44px] flex items-center justify-center text-white hover:opacity-80 active:opacity-70 transition-opacity touch-manipulation"
        aria-label="Video"
      >
        <Video size={20} className="sm:w-6 sm:h-6" strokeWidth={1.5} fill="none" />
      </a>
      <a
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="min-h-[44px] min-w-[44px] flex items-center justify-center text-white hover:opacity-80 active:opacity-70 transition-opacity touch-manipulation"
        aria-label="Instagram"
      >
        <Instagram size={20} className="sm:w-6 sm:h-6" strokeWidth={1.5} fill="none" />
      </a>
    </div>
  )
}

