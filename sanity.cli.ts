import { defineCliConfig } from 'sanity/cli'
import { config } from 'dotenv'

// Load .env.local file (only runs in Node.js, not browser)
if (typeof window === 'undefined') {
  config()
}

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'b57ph2jj',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  },
})

