import { NextResponse } from 'next/server'
import { getHeroVideo } from '@/lib/sanity'

export async function GET() {
  try {
    const heroVideo = await getHeroVideo()
    
    if (!heroVideo?.videoUrl) {
      return NextResponse.json(
        { error: 'No hero video found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      videoUrl: heroVideo.videoUrl,
      title: heroVideo.title,
      thumbnailUrl: heroVideo.thumbnailUrl,
    })
  } catch (error) {
    console.error('Error fetching hero video:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hero video' },
      { status: 500 }
    )
  }
}


