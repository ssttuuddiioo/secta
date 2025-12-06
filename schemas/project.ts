import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Project title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      description: 'URL-friendly identifier',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'Your role in this project',
    }),
    defineField({
      name: 'briefDescription',
      title: 'Brief Description',
      type: 'text',
      description: 'Brief description of the project',
    }),
    defineField({
      name: 'challengeSolution',
      title: 'Challenge/Solution',
      type: 'text',
      description: 'Optional: Describe the challenge and solution',
    }),
    defineField({
      name: 'projectImages',
      title: 'Project Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: '3 picture slots for project images',
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: 'credits',
      title: 'Credits',
      type: 'text',
      description: 'Credits for the project',
    }),
    defineField({
      name: 'behindTheScenes',
      title: 'Behind-the-Scenes',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: '3 picture slots for behind-the-scenes images',
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: 'resultsImpact',
      title: 'Results/Impact',
      type: 'text',
      description: 'Results and impact of the project',
    }),
    defineField({
      name: 'categoryTags',
      title: 'Category Tags',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Category tags for filtering and organization',
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      description: 'Year the project was completed',
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
      description: 'Client name',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Display order (lower numbers appear first)',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'year',
      media: 'projectImages.0',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'Untitled',
        subtitle: subtitle || 'No year',
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
})


