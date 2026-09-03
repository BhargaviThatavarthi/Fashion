export const blogPostSchema = {
  name: 'blogPost',
  title: 'Blog Posts / Style Guides',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Article Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Saree Styling', value: 'Saree Styling' },
          { title: 'Fabric Care', value: 'Fabric Care' },
          { title: 'Festive Trends', value: 'Festive Trends' },
          { title: 'Bridal Guides', value: 'Bridal Guides' },
          { title: 'Handloom Heritage', value: 'Handloom Heritage' },
        ],
      },
    },
    {
      name: 'excerpt',
      title: 'Short Excerpt / Summary',
      type: 'text',
      rows: 3,
    },
    {
      name: 'featuredImage',
      title: 'Featured Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'content',
      title: 'Article Content',
      type: 'text',
    },
    {
      name: 'readTimeMinutes',
      title: 'Read Time (Minutes)',
      type: 'number',
      initialValue: 5,
    },
    {
      name: 'featured',
      title: 'Featured on Blog Homepage',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    },
  ],
}
