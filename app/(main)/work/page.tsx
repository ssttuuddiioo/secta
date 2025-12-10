'use client'

import { useState } from 'react'
import { WorkGrid } from '@/components/WorkGrid'
import { SocialIcons } from '@/components/SocialIcons'
import { Footer } from '@/components/Footer'
import { ContactForm } from '@/components/ContactForm'

export default function WorkPage() {
  const [showContactForm, setShowContactForm] = useState(false)

  const handleContactToggle = () => {
    setShowContactForm(prev => !prev)
  }

  return (
    <div className="min-h-screen bg-[#FFF9DF] flex flex-col">
      <div className="bg-black flex-1">
        <SocialIcons />
        <WorkGrid />
        
        {/* Contact Form Section */}
        <div className="px-6 md:px-12 max-w-7xl mx-auto">
          <ContactForm 
            isOpen={showContactForm} 
            onToggle={handleContactToggle}
            variant="dark"
          />
        </div>
        
        <Footer 
          onContactClick={handleContactToggle}
          isContactOpen={showContactForm}
        />
      </div>
    </div>
  )
}

