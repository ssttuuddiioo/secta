import { SchemaTypeDefinition } from 'sanity'
import heroVideo from './heroVideo'
import motionVideo from './motionVideo'
import project from './project'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [heroVideo, motionVideo, project],
}




