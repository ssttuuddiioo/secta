'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function EffectNavigation() {
  const pathname = usePathname()
  
  const links = [
    { name: 'Tritone', path: '/tritone' },
    { name: 'Split Tone', path: '/split-tone' },
    { name: 'Solarization', path: '/solarization' },
    { name: 'Screen Print', path: '/screen-print' },
    { name: 'Cyanotype', path: '/cyanotype' },
  ]

  return (
    <div className="absolute bottom-10 left-0 right-0 z-50 flex justify-center items-center gap-4 flex-wrap px-4">
      {links.map((link) => {
        const isActive = pathname === link.path
        return (
          <Link 
            key={link.path} 
            href={link.path}
            className={`
              px-4 py-2 text-xs md:text-sm font-mono tracking-wider border transition-all duration-300
              ${isActive 
                ? 'bg-white text-black border-white font-bold' 
                : 'text-white border-white/30 hover:border-white hover:bg-white/10'
              }
            `}
          >
            {link.name.toUpperCase()}
          </Link>
        )
      })}
    </div>
  )
}



