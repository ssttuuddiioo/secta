import { SchemaTypeDefinition } from 'sanity'
import heroVideo from './heroVideo'
import motionVideo from './motionVideo'
import project from './project'
import stillsProject from './stillsProject'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [heroVideo, motionVideo, project, stillsProject],
}




