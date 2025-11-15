'use client'

import { Navigation } from '@/components/Navigation'
import { WorkGrid } from '@/components/WorkGrid'
import { SocialIcons } from '@/components/SocialIcons'

export default function WorkPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <SocialIcons />
      <div className="pt-24 pb-12 px-6 md:px-12">
        <div className="max-w-[1600px] mx-auto">
          <WorkGrid />
        </div>
      </div>
    </div>
  )
}

