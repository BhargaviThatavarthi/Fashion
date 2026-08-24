import { defineType, defineField } from 'sanity'

export const heroBannerSchema = defineType({
  name: 'heroBanner',
  title: 'Homepage Hero Banner',
  type: 'document',
  fields: [
    defineField({
      name: 'brandTitle',
      title: 'Brand Title (Calligraphy Script)',
      type: 'string',
      initialValue: 'Sri Subhakari Fashions',
    }),
    defineField({
      name: 'brandSubtitle',
      title: 'Brand Subtitle',
      type: 'string',
      initialValue: 'New Collection',
    }),
    defineField({
      name: 'headline',
      title: 'Main Headline',
      type: 'string',
      initialValue: 'ELEGANCE',
    }),
    defineField({
      name: 'subheadline',
      title: 'Sub Headline',
      type: 'string',
      initialValue: 'IN EVERY THREAD',
    }),
    defineField({
      name: 'features',
      title: 'Feature Taglines',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'description',
      title: 'Main Description Paragraph',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'buttonText',
      title: 'CTA Button Text',
      type: 'string',
      initialValue: 'SHOP NOW',
    }),
    defineField({
      name: 'buttonLink',
      title: 'CTA Button Link',
      type: 'string',
      initialValue: '/shop',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Galaxy Dress Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'stats',
      title: 'Trust Stat Badges',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'statItem',
          title: 'Stat Item',
          fields: [
            { name: 'num', title: 'Number / Metric (e.g. 5000+)', type: 'string' },
            { name: 'label', title: 'Label (e.g. Happy Customers)', type: 'string' },
          ],
        },
      ],
    }),
  ],
})
