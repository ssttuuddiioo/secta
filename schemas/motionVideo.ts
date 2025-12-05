import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'motionVideo',
  title: 'Motion Video',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Video title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Branded Content', value: 'Branded Content' },
          { title: 'Scenic Video', value: 'Scenic Video' },
          { title: 'Social Media', value: 'Social Media' },
          { title: 'Reels', value: 'Reels' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'video',
      title: 'Video File',
      type: 'file',
      options: {
        accept: 'video/mp4,video/webm,video/ogg',
      },
      description: 'Upload MP4 video file (recommended: H.264 codec)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Thumbnail image (shown at 60% opacity, fades on hover)',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      description: 'Year the video was created',
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
    // New fields for project details
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
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
              description: 'Optional description shown in lightbox',
            },
          ],
          preview: {
            select: {
              media: 'image',
              description: 'description',
            },
            prepare({ media, description }) {
              return {
                title: description || 'No description',
                media,
              }
            },
          },
        },
      ],
      description: '3 picture slots for project images with optional descriptions',
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
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
              description: 'Optional description shown in lightbox',
            },
          ],
          preview: {
            select: {
              media: 'image',
              description: 'description',
            },
            prepare({ media, description }) {
              return {
                title: description || 'No description',
                media,
              }
            },
          },
        },
      ],
      description: '3 picture slots for behind-the-scenes images with optional descriptions',
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
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      media: 'thumbnail',
    },
    prepare({ title, category, media }) {
      return {
        title: title || 'Untitled',
        subtitle: category || 'No category',
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

