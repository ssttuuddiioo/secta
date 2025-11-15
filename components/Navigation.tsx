'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavigationProps {
  logo?: string
}

export function Navigation({ logo = 'SECTA' }: NavigationProps) {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 flex items-center justify-between">
      {/* Logo - SECTA top left */}
      <Link 
        href="/" 
        className="text-white hover:opacity-80 transition-opacity"
        style={{ 
          fontFamily: 'var(--font-cormorant-infant)',
          fontSize: '100px',
          fontWeight: 300,
          lineHeight: 1
        }}
      >
        {logo}
      </Link>
      
      {/* Navigation buttons top right */}
      <div className="flex items-center gap-2 md:gap-3">
        <Link
          href="/work"
          className="w-[150px] h-10 md:h-12 rounded-full border-2 border-white flex items-center justify-center text-white hover:bg-white/10 transition-all"
          style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: '24px',
          }}
        >
          Work
        </Link>
        <Link
          href="/about"
          className="w-[150px] h-10 md:h-12 rounded-full border-2 border-white flex items-center justify-center text-white hover:bg-white/10 transition-all"
          style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: '24px',
          }}
        >
          About
        </Link>
        <Link
          href="/contact"
          className="w-[150px] h-10 md:h-12 rounded-full border-2 border-white flex items-center justify-center text-white hover:bg-white/10 transition-all"
          style={{
            fontFamily: 'var(--font-host-grotesk)',
            fontSize: '24px',
          }}
        >
          Contact
        </Link>
      </div>
    </nav>
  )
}
