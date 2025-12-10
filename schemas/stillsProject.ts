import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'stillsProject',
  title: 'Stills Project',
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
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Thumbnail image for the project (shown in grid)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
      description: 'Client name',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Project description',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'All photos for this project gallery (unlimited)',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      description: 'Year the project was completed',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Display order (lower numbers appear first)',
      initialValue: 0,
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
  ],
  preview: {
    select: {
      title: 'title',
      client: 'client',
      media: 'thumbnail',
    },
    prepare({ title, client, media }) {
      return {
        title: title || 'Untitled',
        subtitle: client || 'No client',
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


