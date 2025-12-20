import { z } from 'zod'

const MONDAY_API_URL = 'https://api.monday.com/v2'

// Column IDs from your Monday.com board
const MONDAY_COLUMNS = {
  attachment: 'text9',        // Attachment column (for image URLs)
  timestamp: 'text_mkytq64v',
  reviewerName: 'text_mkytxc1g',
  videoLink: 'link_mkytv597',
}

// Validation schemas
export const createTaskInputSchema = z.object({
  projectTitle: z.string(),
  projectSlug: z.string().optional(),
  timestamp: z.number(),
  comment: z.string(),
  author: z.string().optional(),
  videoUrl: z.string().optional(),
  attachmentUrl: z.string().optional(),   // Client-provided image/screenshot URL
})

export type CreateTaskInput = z.infer<typeof createTaskInputSchema>

interface MondayApiResponse {
  data?: {
    create_item?: {
      id: string
    }
  }
  errors?: Array<{ message: string }>
}

// Format timestamp as MM:SS.ms (with 2 decimal places)
function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toFixed(2).padStart(5, '0')}`
}

// Create a task in Monday.com
export async function createMondayTask(input: CreateTaskInput): Promise<{ success: boolean; itemId?: string; error?: string }> {
  const apiToken = process.env.MONDAY_API_TOKEN
  const boardId = process.env.MONDAY_BOARD_ID

  if (!apiToken || !boardId) {
    return { success: false, error: 'Monday.com credentials not configured' }
  }

  const timeStr = formatTimestamp(input.timestamp)
  
  // Task name is the comment itself (truncated if too long)
  const itemName = input.comment.length > 100 
    ? input.comment.substring(0, 97) + '...' 
    : input.comment
  
  // Build video link with timestamp
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const videoLinkUrl = input.projectSlug 
    ? `${baseUrl}/review/${input.projectSlug}?t=${Math.floor(input.timestamp)}`
    : input.videoUrl || ''

  // Build column values with proper column IDs
  const columnValues: Record<string, unknown> = {
    // Timestamp column
    [MONDAY_COLUMNS.timestamp]: timeStr,
    // Reviewer name column
    [MONDAY_COLUMNS.reviewerName]: input.author || 'Anonymous',
    // Video link column (link type requires url and text)
    [MONDAY_COLUMNS.videoLink]: {
      url: videoLinkUrl,
      text: `Watch @ ${timeStr}`,
    },
    // Attachment column (image/screenshot URL)
    [MONDAY_COLUMNS.attachment]: input.attachmentUrl || '',
  }

  const columnValuesJson = JSON.stringify(columnValues)

  const query = `
    mutation {
      create_item(
        board_id: ${boardId},
        item_name: "${itemName.replace(/"/g, '\\"').replace(/\n/g, ' ')}",
        column_values: "${columnValuesJson.replace(/"/g, '\\"')}"
      ) {
        id
      }
    }
  `

  try {
    const response = await fetch(MONDAY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiToken,
        'API-Version': '2024-01',
      },
      body: JSON.stringify({ query }),
    })

    const result: MondayApiResponse = await response.json()

    if (result.errors && result.errors.length > 0) {
      console.error('Monday.com API errors:', result.errors)
      return { success: false, error: result.errors[0].message }
    }

    if (result.data?.create_item?.id) {
      return { success: true, itemId: result.data.create_item.id }
    }

    return { success: false, error: 'Unknown error creating Monday.com task' }
  } catch (error) {
    console.error('Monday.com API error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create Monday.com task' 
    }
  }
}

// Get column IDs from the board (useful for debugging/setup)
export async function getMondayBoardColumns(): Promise<{ success: boolean; columns?: Array<{ id: string; title: string; type: string }>; error?: string }> {
  const apiToken = process.env.MONDAY_API_TOKEN
  const boardId = process.env.MONDAY_BOARD_ID

  if (!apiToken || !boardId) {
    return { success: false, error: 'Monday.com credentials not configured' }
  }

  const query = `
    query {
      boards(ids: ${boardId}) {
        columns {
          id
          title
          type
        }
      }
    }
  `

  try {
    const response = await fetch(MONDAY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiToken,
        'API-Version': '2024-01',
      },
      body: JSON.stringify({ query }),
    })

    const result = await response.json()

    if (result.errors) {
      return { success: false, error: result.errors[0].message }
    }

    return { success: true, columns: result.data?.boards?.[0]?.columns || [] }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch columns' 
    }
  }
}

