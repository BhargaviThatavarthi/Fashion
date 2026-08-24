import { defineType, defineField } from 'sanity'

export const youtubeVideoSchema = defineType({
  name: 'youtubeVideo',
  title: 'YouTube Videos',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Video Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'video_id',
      title: 'YouTube Video ID (e.g. dQw4w9WgXcQ)',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Custom Thumbnail (Optional)',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'video_id',
      media: 'thumbnail',
    },
  },
})
