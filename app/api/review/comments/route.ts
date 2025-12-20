import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/lib/sanity'
import { createClient } from 'next-sanity'
import { z } from 'zod'
import { createMondayTask } from '@/lib/monday'

// Write client for mutations
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'b57ph2jj',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-11-20',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Need write token for mutations
})

const getCommentsSchema = z.object({
  projectId: z.string().min(1),
})

const createCommentSchema = z.object({
  projectId: z.string().min(1),
  timestamp: z.number().min(0),
  comment: z.string().min(1),
  author: z.string().optional(),
  attachmentUrl: z.string().optional(),
})

// GET - Fetch comments for a project
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    const query = `*[_type == "reviewComment" && project._ref == $projectId] | order(timestamp asc) {
      _id,
      timestamp,
      comment,
      author,
      mondayItemId,
      createdAt
    }`

    const comments = await client.fetch(query, { projectId })

    return NextResponse.json({ comments })
  } catch (error) {
    console.error('Get comments error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

// POST - Create a new comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, timestamp, comment, author, attachmentUrl } = createCommentSchema.parse(body)

    // Get project details for Monday.com task
    const projectQuery = `*[_type == "reviewProject" && _id == $projectId][0]{
      title,
      "slug": slug.current,
      "videoUrl": video.asset->url
    }`
    const project = await client.fetch(projectQuery, { projectId })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Create task in Monday.com
    const mondayResult = await createMondayTask({
      projectTitle: project.title,
      projectSlug: project.slug,
      timestamp,
      comment,
      author,
      videoUrl: project.videoUrl,
      attachmentUrl,
    })

    // Create comment in Sanity
    // Note: This requires a write token. For now, we'll create without Sanity mutation
    // and just return the comment data. In production, add SANITY_API_TOKEN to env.
    const newComment = {
      _type: 'reviewComment',
      project: { _type: 'reference', _ref: projectId },
      timestamp,
      comment,
      author: author || 'Anonymous',
      mondayItemId: mondayResult.itemId || null,
      createdAt: new Date().toISOString(),
    }

    // Try to create in Sanity if we have a write token
    let savedComment = null
    if (process.env.SANITY_API_TOKEN) {
      try {
        savedComment = await writeClient.create(newComment)
      } catch (sanityError) {
        console.error('Sanity write error:', sanityError)
        // Continue anyway - Monday.com task was created
      }
    }

    return NextResponse.json({
      success: true,
      comment: savedComment || { ...newComment, _id: `temp-${Date.now()}` },
      monday: {
        success: mondayResult.success,
        itemId: mondayResult.itemId,
        error: mondayResult.error,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create comment error:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}

