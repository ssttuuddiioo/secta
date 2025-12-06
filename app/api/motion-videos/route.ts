import { NextResponse } from 'next/server'
import { getMotionVideos } from '@/lib/sanity'

export async function GET() {
  try {
    const videos = await getMotionVideos()
    return NextResponse.json({ videos })
  } catch (error) {
    console.error('Error fetching motion videos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch motion videos' },
      { status: 500 }
    )
  }
}


