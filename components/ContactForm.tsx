'use client'

import { useState } from 'react'

interface ContactFormProps {
  isOpen: boolean
  onToggle: () => void
  variant?: 'dark' | 'light'
}

export function ContactForm({ isOpen, onToggle, variant = 'dark' }: ContactFormProps) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const isDark = variant === 'dark'
  const bgColor = isDark ? 'bg-black/20' : 'bg-white/20'
  const textColor = isDark ? 'text-white' : 'text-black'
  const borderColor = isDark ? 'border-white/30' : 'border-black/30'
  const focusBorderColor = isDark ? 'focus:border-white' : 'focus:border-black'
  const placeholderColor = isDark ? 'placeholder:text-white/40' : 'placeholder:text-black/40'
  const labelColor = isDark ? 'text-white/60' : 'text-black/60'
  const labelFocusColor = isDark ? 'group-focus-within:text-white' : 'group-focus-within:text-black'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await fetch('https://formspree.io/f/meoyzkdq', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, 
        body: JSON.stringify(formData) 
      })
      if (response.ok) { 
        setSubmitStatus('success')
        setFormData({ name: '', email: '', message: '' })
      } else { 
        setSubmitStatus('error')
      }
    } catch { 
      setSubmitStatus('error')
    } finally { 
      setIsSubmitting(false)
    }
  }

  return (
    <div 
      className={`grid transition-all duration-500 ease-out ${
        isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
      }`}
    >
      <div className="overflow-hidden">
        <div className={`${bgColor} backdrop-blur-sm rounded-lg p-6 md:p-8 mb-8`}>
          {submitStatus === 'success' ? (
            <div className="text-center py-8">
              <div className={`w-14 h-14 mx-auto mb-4 rounded-full ${isDark ? 'bg-white' : 'bg-black'} flex items-center justify-center`}>
                <svg className={`w-7 h-7 ${isDark ? 'text-black' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p 
                className={`${textColor} text-xl font-bold mb-1`}
                style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
              >
                Message sent!
              </p>
              <p 
                className={`${isDark ? 'text-white/70' : 'text-black/70'}`}
                style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
              >
                We'll be in touch soon.
              </p>
              <button
                onClick={() => {
                  setSubmitStatus('idle')
                  onToggle()
                }}
                className={`mt-4 ${isDark ? 'text-white/60 hover:text-white' : 'text-black/60 hover:text-black'} text-sm transition-colors`}
                style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name & Email row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="group">
                  <label 
                    htmlFor="contact-name" 
                    className={`block ${labelColor} text-xs uppercase tracking-wider font-bold mb-2 ${labelFocusColor} transition-colors`}
                    style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                  >
                    Name
                  </label>
                  <input 
                    type="text" 
                    id="contact-name" 
                    name="name" 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    required 
                    className={`w-full px-0 py-2 bg-transparent border-b-2 ${borderColor} ${textColor} focus:outline-none ${focusBorderColor} transition-colors ${placeholderColor}`}
                    style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                    placeholder="Your name"
                  />
                </div>
                <div className="group">
                  <label 
                    htmlFor="contact-email" 
                    className={`block ${labelColor} text-xs uppercase tracking-wider font-bold mb-2 ${labelFocusColor} transition-colors`}
                    style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                  >
                    Email
                  </label>
                  <input 
                    type="email" 
                    id="contact-email" 
                    name="email" 
                    value={formData.email} 
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                    required 
                    className={`w-full px-0 py-2 bg-transparent border-b-2 ${borderColor} ${textColor} focus:outline-none ${focusBorderColor} transition-colors ${placeholderColor}`}
                    style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              {/* Message */}
              <div className="group">
                <label 
                  htmlFor="contact-message" 
                  className={`block ${labelColor} text-xs uppercase tracking-wider font-bold mb-2 ${labelFocusColor} transition-colors`}
                  style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                >
                  Message
                </label>
                <textarea 
                  id="contact-message" 
                  name="message" 
                  value={formData.message} 
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })} 
                  required 
                  rows={3} 
                  className={`w-full px-0 py-2 bg-transparent border-b-2 ${borderColor} ${textColor} focus:outline-none ${focusBorderColor} transition-colors resize-none ${placeholderColor}`}
                  style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                  placeholder="Tell us about your project..."
                />
              </div>
              
              {/* Error message */}
              {submitStatus === 'error' && (
                <p className={`${textColor} text-sm flex items-center gap-2`}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Something went wrong. Please try again.
                </p>
              )}
              
              {/* Submit button */}
              <button 
                type="submit" 
                disabled={isSubmitting} 
                className={`px-8 py-3 ${isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90'} font-bold uppercase tracking-wider text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-3 group rounded`}
                style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

