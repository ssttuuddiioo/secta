'use client'

import { Navigation } from '@/components/Navigation'
import { WorkGrid } from '@/components/WorkGrid'
import { SocialIcons } from '@/components/SocialIcons'

export default function WorkPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <SocialIcons />
      <WorkGrid />
    </div>
  )
}

