'use client'

import { MessageSquare, Clock, User, ExternalLink } from 'lucide-react'

export interface ReviewComment {
  _id: string
  timestamp: number
  comment: string
  author?: string
  mondayItemId?: string
  createdAt?: string
}

interface CommentsListProps {
  comments: ReviewComment[]
  onCommentClick: (timestamp: number) => void
  currentTime?: number
}

function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  // Show two decimal places for precision
  return `${mins}:${secs.toFixed(2).padStart(5, '0')}`
}

function formatDate(dateString?: string): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function CommentsList({ comments, onCommentClick, currentTime = 0 }: CommentsListProps) {
  if (comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white/40 p-8">
        <MessageSquare className="h-12 w-12 mb-4 opacity-50" />
        <p 
          className="text-center"
          style={{ fontFamily: 'var(--font-host-grotesk)' }}
        >
          No comments yet
        </p>
        <p className="text-sm text-center mt-2 text-white/30">
          Click on the video or press C to add a comment
        </p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <h3 
          className="text-white/80 uppercase tracking-wider text-sm flex items-center gap-2"
          style={{ fontFamily: 'var(--font-host-grotesk)' }}
        >
          <MessageSquare className="h-4 w-4" />
          Comments ({comments.length})
        </h3>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {comments.map((comment) => {
          const isActive = Math.abs(currentTime - comment.timestamp) < 2

          return (
            <button
              key={comment._id}
              onClick={() => onCommentClick(comment.timestamp)}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                isActive
                  ? 'bg-secta-orange/20 border-secta-orange/50'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              {/* Timestamp */}
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-3 w-3 text-secta-orange" />
                <span 
                  className="text-secta-orange font-medium text-sm"
                  style={{ fontFamily: 'var(--font-host-grotesk)' }}
                >
                  {formatTimestamp(comment.timestamp)}
                </span>
                {comment.mondayItemId && (
                  <ExternalLink className="h-3 w-3 text-white/30 ml-auto" title="Synced to Monday.com" />
                )}
              </div>

              {/* Comment Text */}
              <p className="text-white/90 text-sm leading-relaxed">
                {comment.comment}
              </p>

              {/* Meta */}
              <div className="flex items-center gap-3 mt-2 text-xs text-white/40">
                {comment.author && (
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {comment.author}
                  </span>
                )}
                {comment.createdAt && (
                  <span>{formatDate(comment.createdAt)}</span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

