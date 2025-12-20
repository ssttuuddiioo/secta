'use client'

import { useState } from 'react'
import { Lock, ArrowRight, AlertCircle, User } from 'lucide-react'

interface PasswordGateProps {
  projectTitle?: string
  clientName?: string
  onVerify: (password: string, reviewerName: string) => Promise<boolean>
  isLoading?: boolean
  error?: string | null
}

export function PasswordGate({ 
  projectTitle, 
  clientName, 
  onVerify, 
  isLoading = false,
  error = null 
}: PasswordGateProps) {
  const [password, setPassword] = useState('')
  const [reviewerName, setReviewerName] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    
    if (!reviewerName.trim()) {
      setLocalError('Please enter your name')
      return
    }
    
    if (!password.trim()) {
      setLocalError('Please enter the password')
      return
    }

    const success = await onVerify(password, reviewerName.trim())
    if (!success) {
      setLocalError('Invalid password')
      setPassword('')
    }
  }

  const displayError = error || localError

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 
            className="text-4xl md:text-5xl text-white tracking-wider"
            style={{ fontFamily: 'var(--font-cormorant-infant)', fontWeight: 300 }}
          >
            SECTA
          </h1>
          <div className="mt-2 h-px w-16 mx-auto bg-gradient-to-r from-transparent via-secta-orange to-transparent" />
        </div>

        {/* Project Info */}
        <div className="text-center mb-8">
          <p className="text-white/60 text-sm uppercase tracking-widest mb-2">
            Video Review
          </p>
          {projectTitle && (
            <h2 
              className="text-2xl md:text-3xl text-white"
              style={{ fontFamily: 'var(--font-cormorant-infant)', fontWeight: 300 }}
            >
              {projectTitle}
            </h2>
          )}
          {clientName && (
            <p className="text-white/50 mt-1">{clientName}</p>
          )}
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-white/40" />
            </div>
            <input
              type="text"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="Your name"
              disabled={isLoading}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-4 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-secta-orange/50 focus:ring-1 focus:ring-secta-orange/50 transition-all disabled:opacity-50"
              autoFocus
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-white/40" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              disabled={isLoading}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-4 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-secta-orange/50 focus:ring-1 focus:ring-secta-orange/50 transition-all disabled:opacity-50"
            />
          </div>

          {displayError && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{displayError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !reviewerName.trim()}
            className="w-full bg-secta-orange hover:bg-secta-orange/90 text-white py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <span className="animate-pulse">Verifying...</span>
            ) : (
              <>
                <span 
                  className="uppercase tracking-wider"
                  style={{ fontFamily: 'var(--font-host-grotesk)' }}
                >
                  Enter Review
                </span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-white/30 text-xs mt-12">
          This is a private review link. Please do not share.
        </p>
      </div>
    </div>
  )
}

