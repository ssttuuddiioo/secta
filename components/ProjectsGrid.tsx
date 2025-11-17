import { ProjectCard } from './ProjectCard'
import { getProjects } from '@/lib/data'

export function ProjectsGrid() {
  const projects = getProjects()

  if (projects.length === 0) {
    return (
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm sm:text-base text-gray-600">No projects found. Add some in the data file!</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-10 md:mb-12 text-center">
          Projects
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
