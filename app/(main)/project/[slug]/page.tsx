import { notFound } from 'next/navigation'
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
    <div className="min-h-screen bg-[#FFF9DF] flex flex-col">
      <div className="bg-black">
        <SocialIcons />
        <ProjectDetail project={project} />
      </div>
    </div>
  )
}

