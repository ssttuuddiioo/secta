import { notFound } from 'next/navigation'
import { Navigation } from '@/components/Navigation'
import { ProjectDetail } from '@/components/ProjectDetail'
import { SocialIcons } from '@/components/SocialIcons'
import { getProjectBySlug } from '@/lib/data'

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <SocialIcons />
      <ProjectDetail project={project} />
    </div>
  )
}

