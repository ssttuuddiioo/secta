export interface Project {
  id: string
  title: string
  slug: string
  description?: string
  longDescription?: string
  client?: string
  category?: string
  tags?: string[] // e.g., ['experiential', 'commercial', 'event']
  year?: string
  coverImage?: string
  gallery?: string[]
  videoUrl?: string
  thumbnailVideo?: string
  videoFile?: string
  videoPoster?: string
  featured?: boolean
  order?: number
  projectUrl?: string
  collaborators?: string[]
  media?: Array<{
    type: 'image' | 'video'
    url: string
    title?: string
    description?: string
  }>
}
