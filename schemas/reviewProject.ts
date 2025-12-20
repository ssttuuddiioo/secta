import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'reviewProject',
  title: 'Review Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Project Title',
      type: 'string',
      description: 'Name of the project for review',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly identifier (used in review link)',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'client',
      title: 'Client Name',
      type: 'string',
      description: 'Client or reviewer name',
    }),
    defineField({
      name: 'password',
      title: 'Access Password',
      type: 'string',
      description: 'Password required to access the review',
      validation: (Rule) => Rule.required().min(4),
    }),
    defineField({
      name: 'video',
      title: 'Video File',
      type: 'file',
      options: {
        accept: 'video/mp4,video/webm,video/ogg',
      },
      description: 'The video file for review',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Optional thumbnail for the video',
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Whether this review is currently accessible',
      initialValue: true,
    }),
    defineField({
      name: 'notes',
      title: 'Internal Notes',
      type: 'text',
      description: 'Internal notes (not visible to client)',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      client: 'client',
      isActive: 'isActive',
      media: 'thumbnail',
    },
    prepare({ title, client, isActive, media }) {
      return {
        title: title || 'Untitled',
        subtitle: `${client || 'No client'} • ${isActive ? '🟢 Active' : '🔴 Inactive'}`,
        media,
      }
    },
  },
})


