import { defineType, defineField } from 'sanity'

export const testimonialSchema = defineType({
  name: 'testimonial',
  title: 'Testimonials',
  type: 'document',
  fields: [
    defineField({
      name: 'customer_name',
      title: 'Customer Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'review',
      title: 'Review Text',
      type: 'text',
      rows: 4,
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Star Rating (1 to 5)',
      type: 'number',
      initialValue: 5,
      validation: (Rule: any) => Rule.required().min(1).max(5),
    }),
    defineField({
      name: 'image',
      title: 'Customer Photo',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {
      title: 'customer_name',
      subtitle: 'review',
      media: 'image',
    },
  },
})
