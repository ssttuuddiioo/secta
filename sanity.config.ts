import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schema } from './schemas'

export default defineConfig({
  name: 'default',
  title: 'SECTA Portfolio',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'b57ph2jj',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  plugins: [structureTool()],

  schema: {
    types: schema.types,
  },
  
  basePath: '/studio',
})

