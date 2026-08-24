import { defineType, defineField } from 'sanity'

export const aboutPageSchema = defineType({
  name: 'aboutPage',
  title: 'About Us Page Content',
  type: 'document',
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Hero Section Title',
      type: 'string',
      initialValue: 'Our Story',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'storyTitle',
      title: 'Story Heading',
      type: 'string',
      initialValue: 'Sri Subhakari Fashions',
    }),
    defineField({
      name: 'storyParagraphs',
      title: 'Story Content Paragraphs',
      type: 'array',
      of: [{ type: 'text' }],
    }),
    defineField({
      name: 'storyImage',
      title: 'Story Feature Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'missionText',
      title: 'Mission Statement',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'visionText',
      title: 'Vision Statement',
      type: 'text',
      rows: 3,
    }),
  ],
})
