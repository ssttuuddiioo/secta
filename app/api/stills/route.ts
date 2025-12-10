import { NextResponse } from 'next/server'
import { getStillsProjects } from '@/lib/sanity'

export async function GET() {
  try {
    const projects = await getStillsProjects()
    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Error fetching stills projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stills projects' },
      { status: 500 }
    )
  }
}


