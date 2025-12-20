import { SchemaTypeDefinition } from 'sanity'
import heroVideo from './heroVideo'
import motionVideo from './motionVideo'
import project from './project'
import stillsProject from './stillsProject'
import reviewProject from './reviewProject'
import reviewComment from './reviewComment'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [heroVideo, motionVideo, project, stillsProject, reviewProject, reviewComment],
}




