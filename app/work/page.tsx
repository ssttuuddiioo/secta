'use client'

import { Header } from '@/components/Header'
import { WorkGrid } from '@/components/WorkGrid'
import { SocialIcons } from '@/components/SocialIcons'

export default function WorkPage() {
  return (
    <div className="min-h-screen bg-[#FFF9DF] flex flex-col">
      <Header />
      <div className="bg-black">
        <SocialIcons />
        <WorkGrid />
      </div>
    </div>
  )
}

