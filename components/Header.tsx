'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export function Header() {
  const pathname = usePathname()
  
  return (
    <header className="relative z-30 bg-[#FFF9DF]">
      {/* Logo and Navigation on same row */}
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 pt-2 sm:pt-3 md:pt-4 pb-3 sm:pb-4 md:pb-5">
        {/* Logo - C Logo - Links to home */}
        <Link
          href="/"
          className="inline-flex"
        >
          <div className="relative h-[32px] w-[32px] sm:h-[40px] sm:w-[40px] md:h-[48px] md:w-[48px]">
            <Image 
              src="/c-logo.png" 
              alt="SECTA" 
              fill
              className="object-contain"
            />
          </div>
        </Link>

        {/* Navigation - Right aligned, same row as logo */}
        <nav className="flex items-center gap-4 sm:gap-5 md:gap-6">
          <Link
            href="/motion"
            className="relative overflow-hidden bg-[#FFF9DF] group"
            style={{ 
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', 
              fontWeight: 'bold', 
              fontSize: 'clamp(16px, 2vw, 22px)',
              letterSpacing: '-0.5px',
              padding: '6px 8px'
            }}
          >
            <span className={`relative z-10 transition-colors duration-300 ${
              pathname === '/motion' ? 'text-white' : 'text-black group-hover:text-white'
            }`}>
              Motion
            </span>
            <div 
              className={`absolute bottom-0 left-0 right-0 h-full bg-[#3AAAFF] transition-all duration-300 ease-out ${
                pathname === '/motion' ? 'opacity-100' : 'translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
              }`}
              style={{ zIndex: 0 }}
            />
          </Link>
          <Link
            href="/stills"
            className="relative overflow-hidden bg-[#FFF9DF] group"
            style={{ 
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', 
              fontWeight: 'bold', 
              fontSize: 'clamp(16px, 2vw, 22px)',
              letterSpacing: '-0.5px',
              padding: '6px 8px'
            }}
          >
            <span className={`relative z-10 transition-colors duration-300 ${
              pathname === '/stills' ? 'text-white' : 'text-black group-hover:text-white'
            }`}>
              Stills
            </span>
            <div 
              className={`absolute bottom-0 left-0 right-0 h-full bg-[#C64B2C] transition-all duration-300 ease-out ${
                pathname === '/stills' ? 'opacity-100' : 'translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
              }`}
              style={{ zIndex: 0 }}
            />
          </Link>
          <Link
            href="/about"
            className="relative overflow-hidden bg-[#FFF9DF] group"
            style={{ 
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', 
              fontWeight: 'bold', 
              fontSize: 'clamp(16px, 2vw, 22px)',
              letterSpacing: '-0.5px',
              padding: '6px 8px'
            }}
          >
            <span className={`relative z-10 transition-colors duration-300 ${
              pathname === '/about' ? 'text-white' : 'text-black group-hover:text-white'
            }`}>
              About
            </span>
            <div 
              className={`absolute bottom-0 left-0 right-0 h-full bg-[#FFAF34] transition-all duration-300 ease-out ${
                pathname === '/about' ? 'opacity-100' : 'translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
              }`}
              style={{ zIndex: 0 }}
            />
          </Link>
        </nav>
      </div>

      {/* Single stroke line below */}
      <div className="w-full h-[2px] bg-black"></div>
    </header>
  )
}

