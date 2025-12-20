'use client'

import { useState } from 'react'
import { X, Send, Clock, Image, ChevronDown, ChevronUp } from 'lucide-react'

export interface CommentData {
  comment: string
  author?: string
  attachmentUrl?: string
}

interface CommentFormProps {
  timestamp: number
  onSubmit: (data: CommentData) => Promise<void>
  onClose: () => void
  isSubmitting?: boolean
}

function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  // Show two decimal places for precision
  return `${mins}:${secs.toFixed(2).padStart(5, '0')}`
}

export function CommentForm({ timestamp, onSubmit, onClose, isSubmitting = false }: CommentFormProps) {
  const [comment, setComment] = useState('')
  const [author, setAuthor] = useState('')
  const [attachmentUrl, setAttachmentUrl] = useState('')
  const [showOptional, setShowOptional] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return

    await onSubmit({
      comment: comment.trim(),
      author: author.trim() || undefined,
      attachmentUrl: attachmentUrl.trim() || undefined,
    })
    setComment('')
    setAttachmentUrl('')
  }

  return (
    <div className="bg-zinc-900/95 backdrop-blur-sm border border-white/10 rounded-xl p-4 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-secta-orange">
          <Clock className="h-4 w-4" />
          <span 
            className="font-medium"
            style={{ fontFamily: 'var(--font-host-grotesk)' }}
          >
            @ {formatTimestamp(timestamp)}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-white/40 hover:text-white transition-colors p-1"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Comment Input */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add your feedback..."
          disabled={isSubmitting}
          className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white placeholder-white/40 focus:outline-none focus:border-secta-orange/50 resize-none disabled:opacity-50"
          rows={3}
          autoFocus
        />

        {/* Author Input */}
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Your name (optional)"
          disabled={isSubmitting}
          className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-white placeholder-white/40 focus:outline-none focus:border-secta-orange/50 text-sm disabled:opacity-50"
        />

        {/* Toggle Optional Fields */}
        <button
          type="button"
          onClick={() => setShowOptional(!showOptional)}
          className="flex items-center gap-2 text-white/50 hover:text-white/70 text-sm transition-colors"
        >
          {showOptional ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          <span>Add screenshot</span>
        </button>

        {/* Optional Fields */}
        {showOptional && (
          <div className="space-y-3 pt-2 border-t border-white/10">
            {/* Attachment URL */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Image className="h-4 w-4 text-white/40" />
              </div>
              <input
                type="url"
                value={attachmentUrl}
                onChange={(e) => setAttachmentUrl(e.target.value)}
                placeholder="Screenshot URL (Dropbox, Google Drive, etc.)"
                disabled={isSubmitting}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-secta-orange/50 text-sm disabled:opacity-50"
              />
            </div>

            <p className="text-white/30 text-xs">
              Tip: Upload your screenshot to Dropbox/Google Drive and paste the share link
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !comment.trim()}
          className="w-full bg-secta-orange hover:bg-secta-orange/90 disabled:bg-white/10 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="animate-pulse">Submitting...</span>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span style={{ fontFamily: 'var(--font-host-grotesk)' }}>
                Submit Comment
              </span>
            </>
          )}
        </button>
      </form>

      <p className="text-white/30 text-xs mt-3 text-center">
        Comments are saved and sent to the production team
      </p>
    </div>
  )
}

