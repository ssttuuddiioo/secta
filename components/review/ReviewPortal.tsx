'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { ReviewVideoPlayer } from './ReviewVideoPlayer'
import { CommentData } from './CommentForm'
import { CommentsList, ReviewComment } from './CommentsList'
import { Send, Clock, Link, CheckCircle, Loader2 } from 'lucide-react'


interface ProjectData {
  id: string
  title: string
  client?: string
  videoUrl: string
  thumbnailUrl?: string
}

interface ReviewPortalProps {
  project: ProjectData
  reviewerName: string
  initialComments?: ReviewComment[]
}

function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toFixed(2).padStart(5, '0')}`
}

export function ReviewPortal({ project, reviewerName, initialComments = [] }: ReviewPortalProps) {
  const [comments, setComments] = useState<ReviewComment[]>(initialComments)
  const [currentTime, setCurrentTime] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  // Form state
  const [comment, setComment] = useState('')
  const [attachmentUrl, setAttachmentUrl] = useState('')
  
  // Finish review state
  const [isFinishing, setIsFinishing] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // Store video ref for seeking
  useEffect(() => {
    const video = document.querySelector('video')
    if (video) {
      videoRef.current = video
    }
  }, [])

  const handleAddComment = useCallback((timestamp: number) => {
    setCurrentTime(timestamp)
    // Focus the textarea when user triggers comment
    textareaRef.current?.focus()
  }, [])

  const handleSubmitComment = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return

    setIsSubmitting(true)
    setError(null)
    setSuccessMessage(null)

    const data: CommentData = {
      comment: comment.trim(),
      author: reviewerName,
      attachmentUrl: attachmentUrl.trim() || undefined,
    }

    try {
      const response = await fetch('/api/review/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          timestamp: currentTime,
          comment: data.comment,
          author: data.author,
          attachmentUrl: data.attachmentUrl,
        }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to submit comment')
      }

      // Add the new comment to the list
      const newComment: ReviewComment = {
        _id: responseData.comment._id,
        timestamp: currentTime,
        comment: data.comment,
        author: data.author,
        mondayItemId: responseData.monday?.itemId,
        createdAt: new Date().toISOString(),
      }

      setComments((prev) => [...prev, newComment].sort((a, b) => a.timestamp - b.timestamp))
      
      // Clear form (keep reviewer name from session)
      setComment('')
      setAttachmentUrl('')
      
      // Show success message
      setSuccessMessage('Comment added!')
      setTimeout(() => setSuccessMessage(null), 3000)

      // Show Monday.com sync status
      if (responseData.monday?.success) {
        console.log('Comment synced to Monday.com:', responseData.monday.itemId)
      } else if (responseData.monday?.error) {
        console.warn('Monday.com sync failed:', responseData.monday.error)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit comment')
    } finally {
      setIsSubmitting(false)
    }
  }, [currentTime, comment, reviewerName, attachmentUrl, project.id])

  const handleSeekToComment = useCallback((timestamp: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp
      videoRef.current.pause()
      setCurrentTime(timestamp)
    }
  }, [])

  // Handle finish review
  const handleFinishReview = useCallback(async () => {
    if (comments.length === 0) {
      setError('Please add at least one comment before finishing.')
      return
    }

    setIsFinishing(true)
    setError(null)

    try {
      const response = await fetch('/api/review/finish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectTitle: project.title,
          projectClient: project.client,
          reviewerName: reviewerName,
          comments: comments.map(c => ({
            timestamp: c.timestamp,
            comment: c.comment,
            author: c.author,
          })),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send review summary')
      }

      setIsFinished(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to finish review')
    } finally {
      setIsFinishing(false)
    }
  }, [comments, project.title, project.client, reviewerName])

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-sm border-b border-white/10 flex-shrink-0">
        <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 
              className="text-2xl text-white tracking-wider"
              style={{ fontFamily: 'var(--font-cormorant-infant)', fontWeight: 300 }}
            >
              SECTA
            </h1>
            <span className="text-white/30 hidden sm:inline">|</span>
            <div className="hidden sm:block">
              <p 
                className="text-white"
                style={{ fontFamily: 'var(--font-host-grotesk)' }}
              >
                {project.title}
              </p>
              {project.client && (
                <p className="text-white/50 text-sm">{project.client}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-white/50 text-sm flex items-center gap-2">
              <kbd className="bg-white/10 px-2 py-1 rounded text-xs">Space</kbd>
              <span className="hidden sm:inline">to comment</span>
            </div>
            
            <button
              onClick={handleFinishReview}
              disabled={isFinishing || isFinished}
              className="bg-green-600 hover:bg-green-500 disabled:bg-white/10 text-white py-2 px-4 rounded-lg flex items-center gap-2 transition-all disabled:cursor-not-allowed text-sm"
            >
              {isFinishing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="hidden sm:inline">Sending...</span>
                </>
              ) : isFinished ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Sent!</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Finish Review</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Responsive Grid */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Video + Comment Input */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Video Player */}
          <div className="flex-1 flex items-center justify-center p-4 min-h-0">
            <div className="w-full h-full">
              <ReviewVideoPlayer
                videoUrl={project.videoUrl}
                poster={project.thumbnailUrl}
                comments={comments}
                onAddComment={handleAddComment}
                onTimeUpdate={setCurrentTime}
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Comment Input Area - Always visible */}
          <div className="flex-shrink-0 border-t border-white/10 bg-zinc-900/80 backdrop-blur-sm p-6">
            <form onSubmit={handleSubmitComment} className="max-w-4xl mx-auto">
              {/* Live Timestamp Display */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-secta-orange">
                    <Clock className="h-4 w-4" />
                    <span 
                      className="font-mono text-lg"
                      style={{ fontFamily: 'var(--font-host-grotesk)' }}
                    >
                      {formatTimestamp(currentTime)}
                    </span>
                  </div>
                  <span className="text-white/50 text-sm">
                    Reviewing as <span className="text-white">{reviewerName}</span>
                  </span>
                </div>
                
                {successMessage && (
                  <span className="text-green-400 text-sm animate-pulse">{successMessage}</span>
                )}
                {error && (
                  <span className="text-red-400 text-sm">{error}</span>
                )}
              </div>

              {/* Comment Row */}
              <div className="flex gap-3">
                {/* Main Input Area */}
                <div className="flex-1 space-y-2">
                  <textarea
                    ref={textareaRef}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add your feedback at this timestamp..."
                    disabled={isSubmitting}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white placeholder-white/40 focus:outline-none focus:border-secta-orange/50 resize-none disabled:opacity-50"
                    rows={4}
                  />
                  
                  {/* Reference Link Field - Always visible */}
                  <div className="flex items-center gap-2">
                    <Link className="h-4 w-4 text-white/40 flex-shrink-0" />
                    <input
                      type="url"
                      value={attachmentUrl}
                      onChange={(e) => setAttachmentUrl(e.target.value)}
                      placeholder="Enter reference link (optional)"
                      disabled={isSubmitting}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white placeholder-white/40 focus:outline-none focus:border-secta-orange/50 text-sm disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !comment.trim()}
                  className="self-start bg-secta-orange hover:bg-secta-orange/90 disabled:bg-white/10 text-white py-3 px-6 rounded-lg flex items-center gap-2 transition-all disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span 
                        className="hidden sm:inline"
                        style={{ fontFamily: 'var(--font-host-grotesk)' }}
                      >
                        Submit
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Comments Sidebar */}
        <aside className="w-full lg:w-80 xl:w-96 bg-zinc-900/50 border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col max-h-[40vh] lg:max-h-none overflow-hidden">
          <CommentsList
            comments={comments}
            onCommentClick={handleSeekToComment}
            currentTime={currentTime}
          />
        </aside>
      </main>

      {/* Footer */}
      <footer className="flex-shrink-0 border-t border-white/10 bg-black py-4 px-6">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between text-white/40 text-xs">
          <p>© {new Date().getFullYear()} SECTA. All rights reserved.</p>
          <p>Private review link — please do not share</p>
        </div>
      </footer>

      {/* Completion Overlay */}
      {isFinished && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8 max-w-md text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            
            <h2 
              className="text-3xl text-white mb-2"
              style={{ fontFamily: 'var(--font-cormorant-infant)', fontWeight: 300 }}
            >
              Review Complete!
            </h2>
            
            <p className="text-white/60 mb-6">
              Thank you, {reviewerName}. Your feedback has been sent to the SECTA team.
            </p>
            
            <div className="bg-white/5 rounded-lg p-4 mb-6">
              <p className="text-white/40 text-sm mb-1">Summary</p>
              <p className="text-white text-lg">{comments.length} comment{comments.length !== 1 ? 's' : ''} submitted</p>
              <p className="text-white/50 text-sm mt-1">for {project.title}</p>
            </div>
            
            <p className="text-white/40 text-sm">
              You can close this window now.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
