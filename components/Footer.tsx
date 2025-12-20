'use client'

import Link from 'next/link'

// Social Icons
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )
}

function VimeoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197c1.185-1.044 2.351-2.084 3.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.493 4.797l-.013.01z"/>
    </svg>
  )
}

// Page navigation links
const pageLinks = [
  { href: '/motion', label: 'Motion' },
  { href: '/work', label: 'Stills' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

// Social links with icons
const socialLinks = [
  { href: 'https://instagram.com', icon: InstagramIcon, label: 'Instagram' },
  { href: 'https://linkedin.com', icon: LinkedInIcon, label: 'LinkedIn' },
  { href: 'https://youtube.com', icon: YouTubeIcon, label: 'YouTube' },
  { href: 'https://vimeo.com', icon: VimeoIcon, label: 'Vimeo' },
]

export function Footer() {
  return (
    <footer className="border-t border-white/10 mt-16 md:mt-20">
      <div className="px-6 md:px-12 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            {/* Page Directory */}
            <div>
              <h3
                className="text-white/60 text-sm uppercase tracking-wide mb-6"
                style={{ fontFamily: 'var(--font-host-grotesk)' }}
              >
                Pages
              </h3>
              <nav className="grid grid-cols-2 gap-x-10 gap-y-3 w-fit">
                {pageLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-white text-lg hover:opacity-70 transition-opacity w-fit"
                    style={{ fontFamily: 'var(--font-host-grotesk)' }}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Contact Info */}
            <div>
              <h3
                className="text-white/60 text-sm uppercase tracking-wide mb-6"
                style={{ fontFamily: 'var(--font-host-grotesk)' }}
              >
                Contact
              </h3>
              <div className="space-y-4">
                <a
                  href="mailto:hello@secta.com"
                  className="text-white text-lg hover:opacity-70 transition-opacity block"
                  style={{ fontFamily: 'var(--font-host-grotesk)' }}
                >
                  hello@secta.com
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
                  style={{ fontFamily: 'var(--font-host-grotesk)' }}
                >
                  Get in touch →
                </Link>
              </div>
            </div>

            {/* Social Links */}
            <div className="md:flex md:flex-col md:items-end">
              <div>
                <h3
                  className="text-white/60 text-sm uppercase tracking-wide mb-6"
                  style={{ fontFamily: 'var(--font-host-grotesk)' }}
                >
                  Follow
                </h3>
                <div className="flex gap-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:opacity-70 transition-opacity"
                      aria-label={social.label}
                    >
                      <social.icon className="w-6 h-6" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-6 border-t border-white/10">
            <p
              className="text-white/40 text-sm text-center"
              style={{ fontFamily: 'var(--font-host-grotesk)' }}
            >
              © {new Date().getFullYear()} SECTA. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

