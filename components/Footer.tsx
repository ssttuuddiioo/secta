'use client'

import { useState } from 'react'

export function Footer() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    // Simulate form submission (replace with actual API call)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSubmitStatus('success')
      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <footer className="border-t border-white/10 mt-32">
      <div className="px-6 md:px-12 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            {/* Contact Form */}
            <div>
              <h2
                className="text-3xl md:text-4xl font-light text-white uppercase tracking-tight mb-8"
                style={{
                  fontFamily: 'var(--font-cormorant-infant)',
                  fontWeight: 300,
                }}
              >
                Get in Touch
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Name"
                    required
                    className="w-full bg-transparent border-b border-white/30 text-white placeholder-white/50 py-3 focus:outline-none focus:border-white transition-colors"
                    style={{
                      fontFamily: 'var(--font-host-grotesk)',
                    }}
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                    className="w-full bg-transparent border-b border-white/30 text-white placeholder-white/50 py-3 focus:outline-none focus:border-white transition-colors"
                    style={{
                      fontFamily: 'var(--font-host-grotesk)',
                    }}
                  />
                </div>
                <div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Message"
                    required
                    rows={4}
                    className="w-full bg-transparent border-b border-white/30 text-white placeholder-white/50 py-3 focus:outline-none focus:border-white transition-colors resize-none"
                    style={{
                      fontFamily: 'var(--font-host-grotesk)',
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-8 py-4 bg-white text-black text-lg font-medium rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    fontFamily: 'var(--font-host-grotesk)',
                  }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
                {submitStatus === 'success' && (
                  <p className="text-green-400 text-sm">Message sent successfully!</p>
                )}
                {submitStatus === 'error' && (
                  <p className="text-red-400 text-sm">Something went wrong. Please try again.</p>
                )}
              </form>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col justify-center">
              <div className="space-y-6">
                <div>
                  <p
                    className="text-white/60 text-sm uppercase tracking-wide mb-2"
                    style={{
                      fontFamily: 'var(--font-host-grotesk)',
                    }}
                  >
                    Email
                  </p>
                  <a
                    href="mailto:hello@secta.com"
                    className="text-white text-lg hover:opacity-80 transition-opacity"
                    style={{
                      fontFamily: 'var(--font-host-grotesk)',
                    }}
                  >
                    hello@secta.com
                  </a>
                </div>
                <div>
                  <p
                    className="text-white/60 text-sm uppercase tracking-wide mb-2"
                    style={{
                      fontFamily: 'var(--font-host-grotesk)',
                    }}
                  >
                    Follow
                  </p>
                  <div className="flex gap-4">
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:opacity-80 transition-opacity"
                      style={{
                        fontFamily: 'var(--font-host-grotesk)',
                      }}
                    >
                      LinkedIn
                    </a>
                    <a
                      href="https://youtube.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:opacity-80 transition-opacity"
                      style={{
                        fontFamily: 'var(--font-host-grotesk)',
                      }}
                    >
                      YouTube
                    </a>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:opacity-80 transition-opacity"
                      style={{
                        fontFamily: 'var(--font-host-grotesk)',
                      }}
                    >
                      Instagram
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-6 border-t border-white/10">
            <p
              className="text-white/40 text-sm text-center"
              style={{
                fontFamily: 'var(--font-host-grotesk)',
              }}
            >
              © {new Date().getFullYear()} SECTA. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

