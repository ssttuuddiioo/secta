'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HeaderLogo } from '@/components/HeaderLogo'

interface HeaderProps {
  isLightboxOpen?: boolean
  onExitLightbox?: () => void
}

export function Header({ isLightboxOpen = false, onExitLightbox }: HeaderProps = {}) {
  const pathname = usePathname()
  const isArchivePage = pathname === '/archive'
  
  return (
    <header className={`relative z-50 ${isArchivePage ? 'bg-white' : 'bg-[#FFF9DF]'}`}>
      {/* Logo and Navigation on same row */}
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 pt-2 sm:pt-3 md:pt-4 pb-3 sm:pb-4 md:pb-5">
        {/* Interactive Logo - Links to home */}
        <HeaderLogo />

        {/* Navigation - Right aligned, same row as logo */}
        <nav className="flex items-center gap-2 sm:gap-4 md:gap-6">
          <Link
            href="/motion"
            className={`relative overflow-hidden group ${isArchivePage ? 'bg-white' : 'bg-[#FFF9DF]'}`}
            style={{ 
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', 
              fontWeight: 'bold', 
              fontSize: 'clamp(18px, 2.3vw, 25px)',
              letterSpacing: '-0.5px',
              padding: '7px 9px'
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
            className={`relative overflow-hidden group ${isArchivePage ? 'bg-white' : 'bg-[#FFF9DF]'}`}
            style={{ 
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', 
              fontWeight: 'bold', 
              fontSize: 'clamp(18px, 2.3vw, 25px)',
              letterSpacing: '-0.5px',
              padding: '7px 9px'
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
            className={`relative overflow-hidden group ${isArchivePage ? 'bg-white' : 'bg-[#FFF9DF]'}`}
            style={{ 
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', 
              fontWeight: 'bold', 
              fontSize: 'clamp(18px, 2.3vw, 25px)',
              letterSpacing: '-0.5px',
              padding: '7px 9px'
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
          {isLightboxOpen && onExitLightbox ? (
            <button
              onClick={onExitLightbox}
              className={`relative overflow-hidden group ${isArchivePage ? 'bg-white' : 'bg-[#FFF9DF]'}`}
              style={{ 
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', 
                fontWeight: 'bold', 
                fontSize: 'clamp(18px, 2.3vw, 25px)',
                letterSpacing: '-0.5px',
                padding: '7px 9px'
              }}
            >
              <span className={`relative z-10 transition-colors duration-300 ${
                pathname === '/archive' ? 'text-white' : 'text-black group-hover:text-white'
              }`}>
                Index
              </span>
              <div 
                className={`absolute bottom-0 left-0 right-0 h-full bg-black transition-all duration-300 ease-out ${
                  pathname === '/archive' ? 'opacity-100' : 'translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
                }`}
                style={{ zIndex: 0 }}
              />
            </button>
          ) : (
            <Link
              href="/archive"
              className={`relative overflow-hidden group ${isArchivePage ? 'bg-white' : 'bg-[#FFF9DF]'}`}
              style={{ 
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', 
                fontWeight: 'bold', 
                fontSize: 'clamp(18px, 2.3vw, 25px)',
                letterSpacing: '-0.5px',
                padding: '7px 9px'
              }}
            >
              <span className={`relative z-10 transition-colors duration-300 ${
                pathname === '/archive' ? 'text-white' : 'text-black group-hover:text-white'
              }`}>
                Index
              </span>
              <div 
                className={`absolute bottom-0 left-0 right-0 h-full bg-black transition-all duration-300 ease-out ${
                  pathname === '/archive' ? 'opacity-100' : 'translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
                }`}
                style={{ zIndex: 0 }}
              />
            </Link>
          )}
        </nav>
      </div>

      {/* Single stroke line below - hidden on archive page */}
      {!isArchivePage && (
        <div className="w-full h-[2px] bg-black"></div>
      )}
    </header>
  )
}

