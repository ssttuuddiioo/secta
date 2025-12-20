import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/lib/sanity'
import { z } from 'zod'

const verifySchema = z.object({
  slug: z.string().min(1),
  password: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, password } = verifySchema.parse(body)

    // Query the review project by slug
    const query = `*[_type == "reviewProject" && slug.current == $slug && isActive == true][0]{
      _id,
      title,
      client,
      password,
      "videoUrl": video.asset->url,
      "thumbnailUrl": thumbnail.asset->url
    }`

    const project = await client.fetch(query, { slug })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found or inactive' },
        { status: 404 }
      )
    }

    // Verify password
    if (project.password !== password) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    // Create a simple session token (in production, use proper JWT)
    const sessionToken = Buffer.from(`${project._id}:${Date.now()}`).toString('base64')

    // Return project data (without password)
    return NextResponse.json({
      success: true,
      sessionToken,
      project: {
        id: project._id,
        title: project.title,
        client: project.client,
        videoUrl: project.videoUrl,
        thumbnailUrl: project.thumbnailUrl,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Review verify error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


