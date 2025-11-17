'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

interface NavigationProps {
  logo?: string
}

export function Navigation({ logo = 'SECTA' }: NavigationProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      // Close mobile menu when resizing to desktop
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const navLinks = [
    { href: '/work', label: 'Work' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-12 py-4 sm:py-6 flex items-center justify-between">
      {/* Logo - SECTA top left */}
      <Link 
        href="/" 
        className="text-white hover:opacity-80 transition-opacity min-h-[44px] min-w-[44px] flex items-center"
        style={{ 
          fontFamily: 'var(--font-cormorant-infant)',
          fontSize: 'clamp(2rem, 8vw, 6.25rem)', // Responsive: 32px mobile → 100px desktop
          fontWeight: 300,
          lineHeight: 1
        }}
      >
        {logo}
      </Link>
      
      {/* Desktop Navigation buttons */}
      <div className="hidden md:flex items-center gap-2 lg:gap-3">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="min-w-[120px] md:min-w-[150px] h-10 md:h-12 lg:h-12 rounded-full border-2 border-white flex items-center justify-center text-white hover:bg-white/10 active:bg-white/20 transition-all touch-manipulation"
            style={{
              fontFamily: 'var(--font-host-grotesk)',
              fontSize: 'clamp(0.875rem, 1.5vw, 1.5rem)', // Responsive: 14px → 24px
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-white hover:bg-white/10 active:bg-white/20 rounded-full transition-all touch-manipulation"
        aria-label="Toggle menu"
        aria-expanded={isMobileMenuOpen}
      >
        {isMobileMenuOpen ? (
          <X size={24} strokeWidth={2} />
        ) : (
          <Menu size={24} strokeWidth={2} />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/95 z-40 md:hidden">
          <div className="flex flex-col items-center justify-center h-full gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="w-[200px] min-h-[56px] rounded-full border-2 border-white flex items-center justify-center text-white hover:bg-white/10 active:bg-white/20 transition-all touch-manipulation"
                style={{
                  fontFamily: 'var(--font-host-grotesk)',
                  fontSize: '1.25rem', // 20px on mobile
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
