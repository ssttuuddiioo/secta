import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/meoyzkdq'
const MONDAY_BOARD_URL = 'https://studiostudio-squad.monday.com/boards/18392822569'

const finishReviewSchema = z.object({
  projectTitle: z.string(),
  projectClient: z.string().optional(),
  reviewerName: z.string(),
  comments: z.array(z.object({
    timestamp: z.number(),
    comment: z.string(),
    author: z.string().optional(),
  })),
})

function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = (seconds % 60).toFixed(2).padStart(5, '0')
  return `${mins}:${secs}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectTitle, projectClient, reviewerName, comments } = finishReviewSchema.parse(body)

    if (comments.length === 0) {
      return NextResponse.json(
        { error: 'Please add at least one comment before finishing.' },
        { status: 400 }
      )
    }

    // Generate formatted summary
    const commentsList = comments
      .map((c, i) => `${i + 1}. [${formatTimestamp(c.timestamp)}] ${c.comment}${c.author ? ` — ${c.author}` : ''}`)
      .join('\n\n')

    const summary = `
VIDEO REVIEW SUMMARY
====================

Project: ${projectTitle}
${projectClient ? `Client: ${projectClient}` : ''}
Reviewer: ${reviewerName}
Date: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Total Comments: ${comments.length}

Monday.com Board: ${MONDAY_BOARD_URL}

---

COMMENTS:

${commentsList}

---

Review completed by ${reviewerName}.
    `.trim()

    // Send to Formspree
    const formspreeResponse = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        _subject: `Video Review Complete: ${projectTitle} — ${reviewerName}`,
        project: projectTitle,
        reviewer: reviewerName,
        totalComments: comments.length,
        mondayBoard: MONDAY_BOARD_URL,
        message: summary,
      }),
    })

    if (!formspreeResponse.ok) {
      const errorText = await formspreeResponse.text()
      console.error('Formspree error:', errorText)
      return NextResponse.json(
        { error: 'Failed to send review summary' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Finish review error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

