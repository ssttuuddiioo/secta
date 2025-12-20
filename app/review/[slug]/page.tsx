'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { PasswordGate, ReviewPortal, ReviewComment } from '@/components/review'

interface ProjectData {
  id: string
  title: string
  client?: string
  videoUrl: string
  thumbnailUrl?: string
}

export default function ReviewPage() {
  const params = useParams()
  const slug = params.slug as string

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [project, setProject] = useState<ProjectData | null>(null)
  const [reviewerName, setReviewerName] = useState<string>('')
  const [comments, setComments] = useState<ReviewComment[]>([])

  // Check for existing session in localStorage
  useEffect(() => {
    const sessionData = localStorage.getItem(`review-session-${slug}`)
    if (sessionData) {
      try {
        const { project: savedProject, reviewerName: savedName, timestamp } = JSON.parse(sessionData)
        // Session valid for 24 hours
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          setProject(savedProject)
          setReviewerName(savedName || '')
          setIsAuthenticated(true)
          // Fetch comments
          fetchComments(savedProject.id)
        } else {
          localStorage.removeItem(`review-session-${slug}`)
        }
      } catch {
        localStorage.removeItem(`review-session-${slug}`)
      }
    }
  }, [slug])

  const fetchComments = async (projectId: string) => {
    try {
      const response = await fetch(`/api/review/comments?projectId=${projectId}`)
      const data = await response.json()
      if (data.comments) {
        setComments(data.comments)
      }
    } catch (err) {
      console.error('Failed to fetch comments:', err)
    }
  }

  const handleVerify = useCallback(async (password: string, name: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/review/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Verification failed')
        return false
      }

      // Save session with reviewer name
      const projectData: ProjectData = {
        id: data.project.id,
        title: data.project.title,
        client: data.project.client,
        videoUrl: data.project.videoUrl,
        thumbnailUrl: data.project.thumbnailUrl,
      }

      localStorage.setItem(`review-session-${slug}`, JSON.stringify({
        project: projectData,
        reviewerName: name,
        timestamp: Date.now(),
      }))

      setProject(projectData)
      setReviewerName(name)
      setIsAuthenticated(true)

      // Fetch comments
      await fetchComments(projectData.id)

      return true
    } catch (err) {
      setError('Failed to verify. Please try again.')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [slug])

  // Show password gate if not authenticated
  if (!isAuthenticated || !project) {
    return (
      <PasswordGate
        projectTitle={undefined}
        clientName={undefined}
        onVerify={handleVerify}
        isLoading={isLoading}
        error={error}
      />
    )
  }

  // Show review portal
  return (
    <ReviewPortal
      project={project}
      reviewerName={reviewerName}
      initialComments={comments}
    />
  )
}

