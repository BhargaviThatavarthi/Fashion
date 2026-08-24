import { defineType, defineField } from 'sanity'

export const siteSettingsSchema = defineType({
  name: 'siteSettings',
  title: 'Site Settings & Contact Info',
  type: 'document',
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      initialValue: 'Sri Subhakari Fashions',
    }),
    defineField({
      name: 'siteTagline',
      title: 'Site Tagline',
      type: 'string',
      initialValue: 'Elegance in Every Thread',
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site Meta / Footer Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'phone',
      title: 'Contact Phone Number',
      type: 'string',
      initialValue: '+91 93463 97838',
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp Phone Number',
      type: 'string',
      initialValue: '+919346397838',
    }),
    defineField({
      name: 'email',
      title: 'Store Email Address',
      type: 'string',
      initialValue: 'thatavathibhargavi@gmail.com',
    }),
    defineField({
      name: 'address',
      title: 'Physical Address',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'googleMapUrl',
      title: 'Google Maps Link URL',
      type: 'url',
    }),
    defineField({
      name: 'businessHours',
      title: 'Business Hours',
      type: 'string',
      initialValue: 'Mon–Sun: 09:00 AM – 10:00 PM',
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram Profile URL',
      type: 'url',
    }),
    defineField({
      name: 'youtube',
      title: 'YouTube Channel URL',
      type: 'url',
    }),
    defineField({
      name: 'facebook',
      title: 'Facebook Page URL',
      type: 'url',
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn Profile URL',
      type: 'url',
    }),
  ],
})
