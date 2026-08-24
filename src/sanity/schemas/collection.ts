import { defineType, defineField } from 'sanity'

export const collectionSchema = defineType({
  name: 'collection',
  title: 'Collections / Sections',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Collection Title',
      description: 'e.g. Featured Sarees, New Arrivals, Best Sellers, Festival Collections',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'URL identifier e.g. featured-sarees, new-arrivals, best-sellers, festival-collections',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'badge',
      title: 'Badge Text',
      description: 'e.g. ⭐ Handpicked, 🆕 Just Arrived, 🏆 Top Rated, 🎊 Festival Ready',
      type: 'string',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle / Description',
      description: 'Brief description shown under the section heading on homepage or shop',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'image',
      title: 'Cover / Banner Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      description: 'Numeric order for sorting collections on homepage and navigation (e.g. 1, 2, 3...)',
      type: 'number',
      initialValue: 1,
    }),
    defineField({
      name: 'showOnHomepage',
      title: 'Show on Homepage',
      description: 'Whether to render this collection as a dedicated section on the homepage',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'viewAllLabel',
      title: 'View All Button Label',
      description: 'e.g. View All Sarees, Shop Festival Wear, See All New Arrivals',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current',
      media: 'image',
    },
  },
})
