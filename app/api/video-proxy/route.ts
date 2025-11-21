import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const videoUrl = searchParams.get('url')

  if (!videoUrl) {
    return NextResponse.json({ error: 'Missing video URL' }, { status: 400 })
  }

  try {
    // Fetch the video from Sanity CDN with streaming
    const response = await fetch(videoUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Range': request.headers.get('range') || '',
      },
    })

    if (!response.ok && response.status !== 206) {
      console.error('Video proxy fetch failed:', response.status, response.statusText)
      return NextResponse.json(
        { error: 'Failed to fetch video' },
        { status: response.status }
      )
    }

    // Get response headers
    const contentType = response.headers.get('content-type') || 'video/mp4'
    const contentLength = response.headers.get('content-length')
    const acceptRanges = response.headers.get('accept-ranges')

    // Stream the video response
    const videoStream = response.body

    if (!videoStream) {
      return NextResponse.json(
        { error: 'No video stream' },
        { status: 500 }
      )
    }

    // Return the video stream with CORS headers
    return new NextResponse(videoStream, {
      status: response.status,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': 'Range, Content-Type',
        'Access-Control-Expose-Headers': 'Content-Length, Content-Range',
        'Accept-Ranges': acceptRanges || 'bytes',
        ...(contentLength && { 'Content-Length': contentLength }),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Video proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to proxy video', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Range, Content-Type',
    },
  })
}

