import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'reviewComment',
  title: 'Review Comment',
  type: 'document',
  fields: [
    defineField({
      name: 'project',
      title: 'Review Project',
      type: 'reference',
      to: [{ type: 'reviewProject' }],
      description: 'The review project this comment belongs to',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'timestamp',
      title: 'Timestamp (seconds)',
      type: 'number',
      description: 'Video timestamp in seconds',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'comment',
      title: 'Comment',
      type: 'text',
      description: 'The feedback or comment content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author Name',
      type: 'string',
      description: 'Name of the person who left the comment',
    }),
    defineField({
      name: 'mondayItemId',
      title: 'Monday.com Item ID',
      type: 'string',
      description: 'ID of the corresponding task in Monday.com',
      readOnly: true,
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      description: 'When the comment was created',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      comment: 'comment',
      timestamp: 'timestamp',
      author: 'author',
      projectTitle: 'project.title',
    },
    prepare({ comment, timestamp, author, projectTitle }) {
      const mins = Math.floor((timestamp || 0) / 60)
      const secs = Math.floor((timestamp || 0) % 60)
      const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`
      
      return {
        title: `@ ${timeStr} - ${(comment || '').substring(0, 50)}...`,
        subtitle: `${author || 'Anonymous'} • ${projectTitle || 'Unknown project'}`,
      }
    },
  },
  orderings: [
    {
      title: 'Timestamp',
      name: 'timestampAsc',
      by: [{ field: 'timestamp', direction: 'asc' }],
    },
    {
      title: 'Newest First',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
  ],
})


