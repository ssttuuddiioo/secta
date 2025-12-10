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
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (Rule) =>
                      Rule.uri({
                        scheme: ['http', 'https', 'mailto', 'tel'],
                      }),
                  },
                  {
                    name: 'openInNewTab',
                    type: 'boolean',
                    title: 'Open in new tab',
                    initialValue: true,
                  },
                ],
              },
            ],
          },
        },
      ],
      description: 'Brief description with optional links (select text and click link icon)',
    }),
    // Project Links section
    defineField({
      name: 'showProjectLinks',
      title: 'Show Project Links',
      type: 'boolean',
      description: 'Toggle to show/hide Project Links section',
      initialValue: false,
    }),
    defineField({
      name: 'projectLinks',
      title: 'Project Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Link Title',
              type: 'string',
              description: 'e.g. "View on Vimeo", "Client Website"',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) =>
                Rule.required().uri({
                  scheme: ['http', 'https', 'mailto', 'tel'],
                }),
            },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'url',
            },
          },
        },
      ],
      description: 'List of project-related links',
      hidden: ({ parent }) => !parent?.showProjectLinks,
    }),
    // Challenge/Solution with toggle
    defineField({
      name: 'showChallengeSolution',
      title: 'Show Challenge/Solution',
      type: 'boolean',
      description: 'Toggle to show/hide Challenge/Solution section',
      initialValue: false,
    }),
    defineField({
      name: 'challengeSolution',
      title: 'Challenge/Solution',
      type: 'text',
      description: 'Describe the challenge and solution',
      hidden: ({ parent }) => !parent?.showChallengeSolution,
    }),
    // Credits with toggle
    defineField({
      name: 'showCredits',
      title: 'Show Credits',
      type: 'boolean',
      description: 'Toggle to show/hide Credits section',
      initialValue: false,
    }),
    defineField({
      name: 'credits',
      title: 'Credits',
      type: 'text',
      description: 'Credits for the project',
      hidden: ({ parent }) => !parent?.showCredits,
    }),
    // Results/Impact with toggle
    defineField({
      name: 'showResultsImpact',
      title: 'Show Results/Impact',
      type: 'boolean',
      description: 'Toggle to show/hide Results/Impact section',
      initialValue: false,
    }),
    defineField({
      name: 'resultsImpact',
      title: 'Results/Impact',
      type: 'text',
      description: 'Results and impact of the project',
      hidden: ({ parent }) => !parent?.showResultsImpact,
    }),
    // Project Images with toggle
    defineField({
      name: 'showProjectImages',
      title: 'Show Project Images',
      type: 'boolean',
      description: 'Toggle to show/hide Project Images section',
      initialValue: false,
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
              description: 'Images are displayed at original aspect ratio (vertical photos stay vertical)',
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
      description: 'Up to 10 project images with optional descriptions',
      validation: (Rule) => Rule.max(10),
      hidden: ({ parent }) => !parent?.showProjectImages,
    }),
    // Behind-the-Scenes with toggle
    defineField({
      name: 'showBehindTheScenes',
      title: 'Show Behind-the-Scenes',
      type: 'boolean',
      description: 'Toggle to show/hide Behind-the-Scenes section',
      initialValue: false,
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
              description: 'Images are displayed at original aspect ratio (vertical photos stay vertical)',
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
      description: 'Up to 3 behind-the-scenes images with optional descriptions',
      validation: (Rule) => Rule.max(3),
      hidden: ({ parent }) => !parent?.showBehindTheScenes,
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

