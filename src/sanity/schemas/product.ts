import { defineType, defineField } from 'sanity'

export const productSchema = defineType({
  name: 'product',
  title: 'Products',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'price',
      title: 'Original Price (₹)',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(0),
    }),
    defineField({
      name: 'offer_price',
      title: 'Offer / Discounted Price (₹)',
      type: 'number',
      validation: (Rule: any) => Rule.min(0),
    }),
    defineField({
      name: 'category',
      title: 'Primary Category',
      description: 'The main product category (e.g. Silk Saree, Cotton Saree, Tops, etc.)',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'collections',
      title: 'Collections / Sections',
      description: 'Select one or more collections this product belongs to (e.g. Featured Sarees, New Arrivals, Best Sellers, Festival Collections)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'collection' }] }],
    }),
    defineField({
      name: 'images',
      title: 'Product Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'fabric',
      title: 'Fabric Material',
      type: 'string',
      options: {
        list: [
          'Pure Silk',
          'Kanjivaram Silk',
          'Banarasi Silk',
          'Chiffon',
          'Georgette',
          'Cotton',
          'Handloom Cotton',
          'Crepe',
          'Net',
          'Linen',
          'Organza',
          'Tussar Silk',
          'Rayon',
        ],
      },
    }),
    defineField({
      name: 'color',
      title: 'Available Colors',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'sizes',
      title: 'Available Sizes',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'sku',
      title: 'SKU Code',
      type: 'string',
    }),
    defineField({
      name: 'wash_care',
      title: 'Wash Care Instructions',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'rating',
      title: 'Rating (1 to 5)',
      type: 'number',
      validation: (Rule: any) => Rule.min(1).max(5),
    }),
    defineField({
      name: 'review_count',
      title: 'Review Count',
      type: 'number',
    }),
    defineField({
      name: 'stock',
      title: 'Stock Quantity',
      type: 'number',
      initialValue: 10,
    }),
    defineField({
      name: 'in_stock',
      title: 'In Stock Availability',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'featured',
      title: 'Legacy Featured Flag',
      type: 'boolean',
      hidden: true,
      initialValue: false,
    }),
    defineField({
      name: 'best_seller',
      title: 'Legacy Best Seller Flag',
      type: 'boolean',
      hidden: true,
      initialValue: false,
    }),
    defineField({
      name: 'new_arrival',
      title: 'Legacy New Arrival Flag',
      type: 'boolean',
      hidden: true,
      initialValue: false,
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'price',
      category: 'category.name',
      media: 'images.0',
    },
    prepare({ title, subtitle, category, media }: any) {
      return {
        title,
        subtitle: `${category ? category + ' • ' : ''}₹${subtitle || 0}`,
        media,
      }
    },
  },
})
